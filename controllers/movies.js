const Movies = require('../models/movies');
const NotFoundErr = require('../errors/NotFoundErr');
const ForbiddenErr = require('../errors/ForbiddenErr');
const ValidationErr = require('../errors/ValidationErr');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movies.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.addMovie = (req, res, next) => {
  const owner = req.user._id;

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

  Movies.create({
    owner,
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
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationErr('Переданны некорректные данные при добавлении нового фильма'));
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { id } = req.params;

  Movies.findById(id)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundErr('Фильм с указанным id не найден'));
      } else if (movie.owner.toString() !== req.user._id) {
        next(new ForbiddenErr('Вы не можете удалять фильмы других пользователей'));
      }

      Movies.findByIdAndRemove(id)
        .then((item) => res.send(item))
        .catch(next);
    })
    .catch(next);
};
