const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/movieRoute');
const userRoutes = require('./routes/userRoutes');
const verifyToken = require('./middlewares/verifyToken');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['https://goobber33.github.io', 'http://localhost:3000'], // include both local and deployed frontend URLs
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Public routes
app.use('/api/users', userRoutes);

// Protected routes
app.use(verifyToken);
app.use('/api/movies', movieRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
