const router = require('express').Router();
const { checkCreateMovie, checkMoviedId } = require('../middleware/validators/validateMovies');

const {
  createMovie,
  deleteMovieById,
  getMovies,
} = require('../controllers/movies');

router.post('/', checkCreateMovie, createMovie);
router.delete('/:movieId', checkMoviedId, deleteMovieById);
router.get('/', getMovies);

module.exports = router;
