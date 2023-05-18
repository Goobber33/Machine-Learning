# 🎬 Movie Rating Predictor 🚀

This project is designed to predict movie ratings based on user preferences using a machine learning model trained via Amazon SageMaker. The application utilizes a React front-end, Node.js backend, and leverages Amazon S3 buckets for data storage.

## 📚 Table of Contents

1. [Overview](#overview)
2. [Technologies](#technologies)
3. [Setup](#setup)
4. [Usage](#usage)
5. [Author](#author)
6. [License](#license)

## 🎯 Overview <a name="overview"></a>

The project is divided into several parts:

- A React/Typescript frontend that provides the user interface.
- A backend service developed in Node.js to serve as an API to interact with the AWS SageMaker machine learning model.
- A Machine Learning model hosted on AWS SageMaker that predicts movie ratings based on user data.
- Amazon S3 buckets used for data storage.

## 🚀 Technologies <a name="technologies"></a>

This project uses the following technologies:

- ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- ![Node.js](https://img.shields.io/static/v1?style=for-the-badge&message=Node.js&color=339933&logo=Node.js&logoColor=FFFFFF&label=)
- ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
- ![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white)
- ![AWS SageMaker](https://img.shields.io/badge/AWS%20SageMaker-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)

## ⚙️ Setup <a name="setup"></a>

### Prerequisites

- Node.js and npm installed
- An AWS account with access to S3 and SageMaker
- Python for running and managing the Machine Learning model
- Movie data, which can be downloaded from [MovieLens](https://grouplens.org/datasets/movielens/)

### Installation

1. Clone the repository and navigate to the directory
2. Install dependencies using `npm install`
3. Set up your AWS credentials and region for use by the SDKs
4. Update the endpoint in the controller to match your SageMaker endpoint
5. Start the server using `npm start`

## 🎮 Usage <a name="usage"></a>

Once the server is running, you can make a GET request to the `/predict/:userId/:movieId` endpoint to get a predicted rating for a given user and movie.

## 👤 Author <a name="author"></a>

This project was created by [Kyle Parks](https://github.com/Goobber33).

## 📝 License <a name="license"></a>

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
