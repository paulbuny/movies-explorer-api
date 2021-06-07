const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundErr = require('../errors/NotFoundErr');
const ConflictErr = require('../errors/ConflictErr');
const ValidationErr = require('../errors/ValidationErr');

// Получение данных пользователя
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundErr('Пользователь с указаным id не найден'));
      } else {
        res.send(user);
      }
    })
    .catch(next);
};

// Обновление данных пользователя
module.exports.updateUserInfo = (req, res, next) => {
  const id = req.user._id;
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    id,
    { email, name },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundErr('Пользователь с указанным id не найден'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationErr('Переданы некорректные данные при обновлении пользователя');
      }
    })
    .catch(next);
};

// Регистрация пользователя
module.exports.signUp = (req, res, next) => {
  const { email, name, password } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    })
      .then((user) => res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
      }))
      .catch((err) => {
        if (err.code === 1100 || err.name === 'MongoError') {
          throw new ConflictErr('Пользователь с указанным email уже существует');
        } else if (err.name === 'ValidationError') {
          throw new ValidationErr('Переданы некорректные данные при регистрации');
        }
      })
      .catch(next));
};

// Авторизация пользователя
module.exports.signIn = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};
