const express = require('express');
const morgan = require('morgan');
const path = require('path');
const viewRouter = require('./router/veiwRouter');
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
const app = express();
const cookieParser = require('cookie-parser');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, `views`));
app.set('view cache', false);

app.use(express.static(path.join(__dirname, 'public'))); // serve static files
// use cookie parser middleware
app.use(cookieParser());
//MIDDLEWARES
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//helmet for security
// app.use(helmet());  //uncomment for PRODUCTION.

//limiting

//limiting api requests to 100 requests per hour from same IP
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution using 'hpp'
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ], //whitelist fields that are allowed to be repeated
  })
);

//App level MIDDLE WARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(`${req.method} ${req.path} ${new Date().toISOString()}`);
  console.log(`Cookie::::: ${req.headers.cookie}`);
  next();
});

//ROUTES
//this route is for website(frontend)
app.use('/', viewRouter);

//following routes are for api endpoints
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);
app.use('/api/reviews', reviewRouter);

// Global Error Handler...
app.all('*', (req, res, next) => {
  console.log(`⚠️ Unhandled route: ${req.originalUrl}`);
  next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});

//Express error Handling middleware
app.use(errorController);

module.exports = app;
