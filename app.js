const express = require('express');
const mongoose = require('mongoose');
const { isCelebrateError } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const routers = require('./routes/index');
const { requestLogger, errortLogger } = require('./middleware/logger');
const limiter = require('./utils/rateLimiter');
const CFG = require('./utils/config');
const { ERR_MSG } = require('./utils/constants');

const { PORT = CFG.PORT, MONGO_URL = CFG.MONGO_URL } = process.env;

const allowedCors = [
  'http://www.myportfolios.ru/',
  'http://myportfolios.ru/',
  'https://www.myportfolios.ru/',
  'https://myportfolios.ru/',
];

const app = express();

mongoose.connect(MONGO_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

mongoose.connection.on('open', () => console.log('connected to mongoDB'));

app.use(requestLogger);
app.use(errortLogger);
app.use(limiter);
app.use(helmet());
app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
});
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', routers);

app.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    res.status(400).send({ message: ERR_MSG.VALIDATION_ERR });
  }
  const { statusCode = 500, message } = err;
  res.status(statusCode)
    .send({ message: statusCode === 500 ? ERR_MSG.SERVER_ERROR : message });
  next();
});

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
