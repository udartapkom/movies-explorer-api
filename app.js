const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const routers = require('./routes/index');
const { requestLogger, errortLogger } = require('./middleware/logger');

const { PORT = 3000 } = process.env;

const allowedCors = [
  'http://project-mesto.students.nomoreparties.space/',
  'https://project-mesto.students.nomoreparties.space/',
  'https://www.project-mesto.students.nomoreparties.space/',
];

const app = express();

mongoose.connect('mongodb://localhost:27017/moviedb',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true, // DeprecationWarning: это рекомендация из консоли
  });

mongoose.connection.on('open', () => console.log('connected to mongoDB'));

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
});
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(requestLogger);

app.use('/', routers);

app.use(errortLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
