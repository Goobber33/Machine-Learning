import os
import pandas as pd
import sagemaker
from sagemaker import get_execution_role
from sagemaker.amazon.amazon_estimator import get_image_uri
from sklearn.model_selection import train_test_split
import s3fs
from dotenv import load_dotenv

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
# You need to set the feature_dim to the number of features in your data

fm.set_hyperparameters(feature_dim=X_train.shape[1], predictor_type='regressor', num_factors=64)

# Save the data locally
X_train.to_csv('train.csv', header=False, index=False)
X_val.to_csv('validation.csv', header=False, index=False)

# Upload the files to S3
train_uri = sagemaker_session.upload_data('train.csv', bucket='kylemachine', key_prefix='data')
val_uri = sagemaker_session.upload_data('validation.csv', bucket='kylemachine', key_prefix='data')

# Delete the local files
os.remove('train.csv')
os.remove('validation.csv')

# Create pointers to the S3 locations
train_data = sagemaker.inputs.TrainingInput(train_uri, content_type='text/csv')
validation_data = sagemaker.inputs.TrainingInput(val_uri, content_type='text/csv')

# Train the model
fm.fit({'train': train_data, 'validation': validation_data})
