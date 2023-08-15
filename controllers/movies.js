const Movie = require('../models/movie');
const { ERR_MSG } = require('../utils/constants');

const {
  BadRequestErr,
  ForbiddenErr,
  NotFoundErr,
} = require('../errors/index');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .orFail(() => {
      throw new NotFoundErr(ERR_MSG.NOT_FOUND);
    })
    .then((data) => res.send(data))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr(ERR_MSG.BAD_REQUEST);
      } else {
        next(err);
      }
    })
    .catch(next);
};

const deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        movie.remove()
          .then(() => res.send(movie))
          .catch(next);
      } else {
        throw new ForbiddenErr(ERR_MSG.FORBIDDEN);
      }
    })
    .catch(() => {
      throw new NotFoundErr(ERR_MSG.NOT_FOUND);
    })
    .catch(next);
};
module.exports = {
  createMovie,
  deleteMovieById,
  getMovies,
};
