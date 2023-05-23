import os
import pandas as pd
import sagemaker
from sagemaker import get_execution_role
from sagemaker.amazon.amazon_estimator import get_image_uri
from sklearn.model_selection import train_test_split
import s3fs
from dotenv import load_dotenv
import io
import boto3
import sagemaker.amazon.common as smac

load_dotenv()  # take environment variables from .env.

# Create a connection to your s3 bucket
fs = s3fs.S3FileSystem(anon=False, key=os.getenv("AWS_ACCESS_KEY_ID"), secret=os.getenv("AWS_SECRET_ACCESS_KEY"))

# Load movie ratings data
with fs.open('s3://kylemachine/movies.csv', 'rb') as f:
    movies = pd.read_csv(f)

with fs.open('s3://kylemachine/ratings.csv', 'rb') as f:
    ratings = pd.read_csv(f) 

# Merge movies and ratings data
data = pd.merge(movies, ratings)

# One-hot encode the 'genres' column
data = data.join(data.pop('genres').str.get_dummies('|'))

# Drop the original 'genres' column (and any other non-numeric columns)
data = data.drop(['title'], axis=1)

# Assume that you want to predict the 'rating' column and that all other columns are features
X = data.drop('rating', axis=1)
y = data['rating']

# Split data into training and validation sets
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2)

# Get SageMaker session and role
sagemaker_session = sagemaker.Session()
role = "arn:aws:iam::557284392936:role/service-role/AmazonSageMaker-ExecutionRole-20230510T095521"

# Get the image URI for the factorization machines algorithm
image_uri = sagemaker.image_uris.retrieve('factorization-machines', sagemaker_session.boto_region_name)

# Define the estimator
fm = sagemaker.estimator.Estimator(
    image_uri,
    role, 
    instance_count=1, 
    instance_type='ml.c4.xlarge',
    output_path='s3://kylemachine/output',
    sagemaker_session=sagemaker_session)

# Set hyperparameters
fm.set_hyperparameters(feature_dim=X_train.shape[1], predictor_type='regressor', num_factors=64)

# Convert the training and validation data to RecordIO-protobuf format
buf_train = io.BytesIO()
buf_val = io.BytesIO()
smac.write_numpy_to_dense_tensor(buf_train, X_train.astype('float32').values, y_train.astype('float32').values)
smac.write_numpy_to_dense_tensor(buf_val, X_val.astype('float32').values, y_val.astype('float32').values)
buf_train.seek(0)
buf_val.seek(0)

# Upload the files to S3
s3_train_key = "data/recordio/train"
s3_val_key = "data/recordio/validation"
s3_bucket = 'kylemachine'

boto3.resource('s3').Bucket(s3_bucket).Object(s3_train_key).upload_fileobj(buf_train)
boto3.resource('s3').Bucket(s3_bucket).Object(s3_val_key).upload_fileobj(buf_val)

# Create pointers to the S3 locations
train_data = sagemaker.inputs.TrainingInput(f"s3://{s3_bucket}/{s3_train_key}", content_type='application/x-recordio-protobuf')
val_data = sagemaker.inputs.TrainingInput(f"s3://{s3_bucket}/{s3_val_key}", content_type='application/x-recordio-protobuf')

# Train the model
fm.fit({'train': train_data, 'validation': val_data}, wait=True)
