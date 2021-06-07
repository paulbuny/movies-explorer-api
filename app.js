/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const auth = require('./middlewares/auth');
const { reqLogger, errLogger } = require('./middlewares/logger');

const {
  signIn,
  signUp,
} = require('./controllers/users');

const {
  loginValidation,
  userDataValidation,
} = require('./middlewares/requestValidation');

const NotFoundErr = require('./errors/NotFoundErr');

// Установка порта сервера по умолчанию
const { PORT = 3000 } = process.env;
const app = express();

// Параметры ограничения запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// Подключение к БД
mongoose.connect('mongodb://localhost:27017/bitfilmdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(reqLogger);
app.use(limiter);

app.post('/signin', loginValidation, signIn);
app.post('/signup', userDataValidation, signUp);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/movies'));

app.use(errLogger);

app.use(errors());

app.use('*', () => {
  throw new NotFoundErr('Запрашиваемый ресурс не найден');
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(err.statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });

  next();
});

app.listen(PORT, () => {
  console.log(`server listen on ${PORT}`);
});
