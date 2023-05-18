import boto3
import sagemaker
from sagemaker.amazon.amazon_estimator import get_image_uri
from sagemaker.inputs import TrainingInput
from sagemaker.serializers import CSVSerializer
from sagemaker.deserializers import JSONDeserializer

# Specify the ARN of your role in SageMaker
role = 'arn:aws:iam::557284392936:role/service-role/AmazonSageMaker-ExecutionRole-20230510T095521'

# Specify your bucket name
bucket_name = 'kylemachine'

# Specify the locations of the train and test data
train_data = TrainingInput('s3://kylemachine/data/recordio/train', content_type='application/x-recordio-protobuf')
test_data = TrainingInput('s3://kylemachine/data/recordio/validation', content_type='application/x-recordio-protobuf')

# Specify the location to store the output
output_location = 's3://kylemachine/output'

# Get the URI for the Factorization Machines algorithm
container = get_image_uri(boto3.Session().region_name, 'factorization-machines', 'us-east-1')

# Initialize an Estimator for the Factorization Machines algorithm
estimator = sagemaker.estimator.Estimator(container,
                                          role, 
                                          train_instance_count=1, 
                                          train_instance_type='ml.c4.xlarge',
                                          output_path=output_location,
                                          sagemaker_session=sagemaker.Session())

# Set hyperparameters (replace 'num_factors' and 'epochs' with your desired values)
estimator.set_hyperparameters(feature_dim=23,  # You might need to adjust this based on your actual feature dimension
                              predictor_type='binary_classifier',  # Adjust this based on your problem type (regressor or binary_classifier)
                              num_factors=64,
                              epochs=10)

# Train the model
estimator.fit({'train': train_data, 'test': test_data})

# Deploy the model to create a predictor
predictor = estimator.deploy(initial_instance_count=1, instance_type='ml.m4.xlarge')

# Specify the serializer and deserializer
predictor.serializer = CSVSerializer()
predictor.deserializer = JSONDeserializer()

# Print out the endpoint name
print("SageMaker Endpoint Name: ", predictor.endpoint_name)

# Delete the endpoint (uncomment this when you want to delete the endpoint)
# predictor.delete_endpoint()
