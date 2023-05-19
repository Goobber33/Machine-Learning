const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const movieRoutes = require('./routes/movieRoute');
const userRoutes = require('./routes/userRoutes');
const verifyToken = require('./middlewares/verifyToken');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

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

// Enable preflight requests for signup endpoint
app.options('/api/users/signup', cors());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
