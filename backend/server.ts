import express from 'express';
import movieRoutes from './routes/movieRoute';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/movies', movieRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
