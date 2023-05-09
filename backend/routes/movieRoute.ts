import { Router } from 'express';
import { getMovies, getMovieById, addMovie, updateMovie, deleteMovie } from '../controllers/movieController';

const router = Router();

router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/', addMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

export default router;
