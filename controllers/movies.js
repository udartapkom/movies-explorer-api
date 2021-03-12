const Movie = require('../models/movie');

const {
  BadRequestErr,
  ForbiddenErr,
  NotFoundErr,
} = require('../errors/index');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((data) => res.status(200).send(data))
    .catch(next);
};

const createMovie = (req, res, next) => {
  // console.log(req.user._id);
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
  // const owner = '604a5846130d8d0a5531480e'; // хардкод нужно убрать
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
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr('Переданы некорректные данные');
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
      if (!movie) {
        throw new NotFoundErr('Данные не найдены');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenErr('Недостаточно прав');
      }
      Movie.findByIdAndRemove(movieId)
        .then((data) => res.status(200).send(data));
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.kind === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createMovie,
  deleteMovieById,
  getMovies,
};
