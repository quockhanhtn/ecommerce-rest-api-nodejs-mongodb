const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const indexRoutes = require('./api/routes/index');
const userRoutes = require('./api/routes/user');
const countryRoutes = require('./api/routes/countries');
const categoryRoutes = require('./api/routes/categories');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');


//#region mongoose database config
const connectStr =
  'mongodb+srv://' + process.env.MONGO_ATLAS_USERNAME +
  ':' + process.env.MONGO_ATLAS_PASSWORD +
  '@' + process.env.MONGO_ATLAS_HOST +
  '/' + process.env.MONGO_ATLAS_DB_NAME;

mongoose.connect(connectStr, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected successfully to MongoDB !')
  ).catch(err => {
    console.log('Connect to MongoDB failed');
    console.log(err);
  });

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//#endregion


// share uploads resource
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

//#region User middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//#endregion


//#region Set default headers
app.use((req, res, next) => {
  // No cache for IE
  // https://support.microsoft.com/en-us/kb/234067
  res.header('Pragma', 'no-cache');

  //Allow call in any domain
  res.header('Access-Control-Allow-Origin', '*');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.header('Access-Control-Allow-Credentials', true);

  // Request headers you wish to allow
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }

  // Pass to next layer of middleware
  next();
});
//#endregion


//#region Routes which should handle requests
app.use('/', indexRoutes);
app.use('/api/user', userRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
//#endregion


//#region Handle error
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    success: false,
    error: error.message
  });
});
//#endregion


module.exports = app;