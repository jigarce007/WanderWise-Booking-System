const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./router/toursRouter');
const userRouter = require('./router/usersRouter');
const reviewRouter = require('./router/reviewRouter');
const appError = require('./utils/appError');
const errorController = require('./controller/errorController');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

//MIDDLEWARES
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//helmet for security
app.use(helmet());

//limiting 

//limiting api requests to 100 requests per hour from same IP
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
})
app.use('/api', limiter);

//Data sanitization against NoSQL query injection
app.use(mongoSanitize()) 

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution using 'hpp'
app.use(hpp({
  whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'] //whitelist fields that are allowed to be repeated
}));

//App level MIDDLE WARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`${req.method} ${req.path} ${new Date().toISOString()}`);
  next();
});

//ROUTES
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);
app.use('/api/reviews', reviewRouter);

// Global Error Handler...
app.all('*', (req, res, next) => {
  console.log(`⚠️ Unhandled route: ${req.originalUrl}`);
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});


//Express error Handling middleware
app.use(errorController)



module.exports = app;
