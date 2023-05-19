// const express = require('express');

// function errorHandler(err, req, res, next) {
//   console.log(err);
//   if (err === 11000) {
//     return res.status(409).send({ message: 'пользователь с таким email - существует' });
//   }
//   const statusCode = 500 || err.message;
//   res
//     .status(statusCode)
//     .send({
//       message: statusCode === 500
//         ? 'На сервере произошла ошибка'
//         : err.message,
//     });
//   return next();
// }

// module.exports = errorHandler;

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
};

module.exports = errorHandler;
