import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import movieRoutes from './routes/movieRoute';
import userRoutes from './routes/userRoutes';
import verifyToken from './middlewares/verifyToken';

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Public routes
app.use('/api/users', userRoutes);

// Protected routes
app.use(verifyToken);
app.use('/api/movies', movieRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
