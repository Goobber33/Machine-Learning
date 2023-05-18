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

// Public routes
app.use('/api/users', userRoutes);

// Protected routes
app.use(verifyToken);
app.use('/api/movies', movieRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
