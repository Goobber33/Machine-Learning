import pandas as pd
import sagemaker
from sagemaker import get_execution_role
from sagemaker.amazon.amazon_estimator import get_image_uri

# Load movie ratings data
data = pd.read_csv('path/to/your/data.csv')

# Split data into training and validation sets
train_data, validation_data = ...

# Get SageMaker session and role
sagemaker_session = sagemaker.Session()
role = get_execution_role()

# Get the image URI for the factorization machines algorithm
image_uri = get_image_uri(sagemaker_session.boto_region_name, 'factorization-machines')

# Define the estimator
fm = sagemaker.estimator.Estimator(
    image_uri,
    role, 
    train_instance_count=1, 
    train_instance_type='ml.c4.xlarge',
    output_path='s3://your_bucket_name_here/output',
    sagemaker_session=sagemaker_session)

# Set hyperparameters
fm.set_hyperparameters(feature_dim=..., predictor_type='regressor', ...)

# Convert data to RecordSet format
train_data = fm.record_set(train_data.to_numpy().astype('float32'), ...)
validation_data = fm.record_set(validation_data.to_numpy().astype('float32'), ...)

# Train the model
fm.fit([train_data, validation_data])
