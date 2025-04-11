const AppError = require('../utils/appError');
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400); // ✅ Returns a proper AppError
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400); // ✅ Returns a proper AppError
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400); // ✅ Returns a proper AppError
}

const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401); // ✅ Returns a proper AppError
}

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', 401); // ✅ Returns a proper AppError
}
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //operational error..!!
  //console.log('🔎 Error Details:', err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //programing error.
    console.log('PROGRAMMING ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

//
const errorController = (err, req, res, next) => {

  console.log(`=======ERROR===> ${err} `);
  err.statusCode = err.statusCode || 500;
  
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  
  } else if (process.env.NODE_ENV === 'production') {
    console.log(` IN PROD ERROR : ${err}`);
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    if( err.name === 'TokenExpiredError') err = handleJWTExpiredError();
      sendErrorProd(err, res);
  }
};
module.exports = errorController;
