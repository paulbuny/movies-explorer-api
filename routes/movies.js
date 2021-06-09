const express = require('express');

const routes = express.Router();

const {
  getMovies,
  addMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  addMovieValidation,
  paramsIdValidation,
} = require('../middlewares/requestValidation');

routes.get('/movies', getMovies);
routes.post('/movies', addMovieValidation, addMovie);
routes.delete('/movies/:id', paramsIdValidation, deleteMovie);

module.exports = routes;
