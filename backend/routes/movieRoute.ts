import express from 'express';
import axios from 'axios';
import AWS from 'aws-sdk';

const router = express.Router();

// Configure AWS with your access and secret key.
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env; // Ensure these are set in your .env file
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

// Create a SageMaker runtime object
const sagemakerRuntime = new AWS.SageMakerRuntime({
  region: 'us-west-1', // Update this if your SageMaker endpoint is in another region
});

router.get('/predict/:userId/:movieId', async (req, res) => {
  // Get user ID and movie ID from the request parameters
  const { userId, movieId } = req.params;

  // You might want to do some preprocessing of the features here, 
  // depending on what your SageMaker model expects as input.

  // Here's an example payload with two features:
  const payload = `${userId},${movieId}`;

  const params = {
    EndpointName: 'factorization-machines-2023-05-12-17-54-45-582', // Replace with your endpoint name
    Body: payload,
    ContentType: 'text/csv',
  };

  try {
    const response = await sagemakerRuntime.invokeEndpoint(params).promise();

    // Convert the Body to string and then parse it as JSON
    const resultString = response.Body.toString();
    const result = JSON.parse(resultString);

    // Assuming the model returns a single prediction value (adjust this based on what your model returns)
    const predictedRating = result.predictions[0].score;

    res.json({
      predictedRating,
    });
  } catch (error) {
    console.error('Error invoking SageMaker endpoint:', error);
    res.status(500).json({ error: 'Error invoking SageMaker endpoint' });
  }

});

export default router;
