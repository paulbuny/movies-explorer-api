const winston = require('winston');
const experessWinston = require('express-winston');

const reqLogger = experessWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'logs/request.log' }),
  ],
  format: winston.format.json(),
});

const errLogger = experessWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'logs/errors.log' }),
  ],
  format: winston.format.json(),
});

module.exports = {
  reqLogger,
  errLogger,
};
