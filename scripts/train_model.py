import pandas as pd
import sagemaker
from sagemaker import get_execution_role
from sagemaker.amazon.amazon_estimator import get_image_uri
from sklearn.model_selection import train_test_split
import s3fs

# Create a connection to your s3 bucket

fs = s3fs.S3FileSystem(anon=False)

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
role = get_execution_role()

# Get the image URI for the factorization machines algorithm

image_uri = sagemaker.image_uris.retrieve('factorization-machines', sagemaker_session.boto_region_name)

# Define the estimator

fm = sagemaker.estimator.Estimator(
    image_uri,
    role, 
    train_instance_count=1, 
    train_instance_type='ml.c4.xlarge',
    output_path='s3://kylemachine/output',
    sagemaker_session=sagemaker_session)

# Set hyperparameters
# You need to set the feature_dim to the number of features in your data

fm.set_hyperparameters(feature_dim=X_train.shape[1], predictor_type='regressor')

# Convert data to RecordSet format

train_data = fm.record_set(X_train.to_numpy().astype('float32'), y_train.to_numpy().astype('float32'))
validation_data = fm.record_set(X_val.to_numpy().astype('float32'), y_val.to_numpy().astype('float32'))

# Train the model

fm.fit([train_data, validation_data])
