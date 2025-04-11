const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: './prod-config.env' });
} else {
  dotenv.config({ path: './dev-config.env' });
}
const app = require('./app');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
); // Atlas Database
// const DB = process.env.DATABASE_LOCAL; // Local Database

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log('Database URL:', DB);
    // console.log(con.connections);
  });

const toursRouter = require('./router/toursRouter');
const usersRouter = require('./router/usersRouter');

app.use('/api/tours', toursRouter);
app.use('/api/users', usersRouter);

const server = app.listen(PORT, () =>
  console.log(
    `Server is running on port ${PORT} on ${process.env.NODE_ENV} mode`
  )
);

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(`UNHANDELED REJECTION 💥`);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log(`UNCAUGHT EXCEPTION 💥`);
  server.close(() => process.exit(1));
});
