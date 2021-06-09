const express = require('express');

const routes = express.Router();

const { getUserInfo, updateUserInfo } = require('../controllers/users');

const { updateUserDataValidation } = require('../middlewares/requestValidation');

routes.get('/users/me', getUserInfo);
routes.patch('/users/me', updateUserDataValidation, updateUserInfo);

module.exports = routes;
