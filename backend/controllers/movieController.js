const express = require('express');
const AWS = require('aws-sdk');

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

const predictMovieRating = async (req, res) => {
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

    // Convert the BodyBlob to Buffer
    const buffer = Buffer.from(response.Body, 'binary');

    // Then convert Buffer to Uint8Array
    const uint8array = new Uint8Array(buffer);

    // Now decode the Uint8Array
    const resultString = new TextDecoder("utf-8").decode(uint8array);
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
};

module.exports = {
  predictMovieRating,
};
