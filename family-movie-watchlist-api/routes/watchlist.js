import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeModification } from '../middleware/authorize.js';
import { getWatchlist, addMovie, updateMovie, deleteMovie } from '../utils/db.js';

const router = express.Router();

router.use(authenticate);

router.get('/:userId', (req, res) => {
  const watchlist = getWatchlist(req.params.userId);
  if (watchlist === null) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(watchlist);
});

router.post('/:userId/movies', authorizeModification, (req, res) => {
  const { title, genre } = req.body;
  const movie = addMovie(req.params.userId, { title, genre });
  if (movie === null) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(201).json(movie);
});

router.put('/:userId/movies/:movieId', authorizeModification, (req, res) => {
  const { title, genre, watched } = req.body;
  const movieId = parseInt(req.params.movieId);
  const movie = updateMovie(req.params.userId, movieId, { title, genre, watched });
  if (movie === null) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  res.json(movie);
});

router.delete('/:userId/movies/:movieId', authorizeModification, (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const result = deleteMovie(req.params.userId, movieId);
  if (result === null) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  res.json({ message: 'Movie removed successfully' });
});

export default router;