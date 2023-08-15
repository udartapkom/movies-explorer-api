const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({

  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator(url) {
        return /(http|https):\/\/(w{3}\.)?(\w*)(\S+)(-._~:\/?#\[\]@!$&'()*\+,;=)?\.(\w*)/gi.test(url);
        // (http|https): - или http или https
        // (w{3}\.)? - www может быть, а может не быть
        // (\w*) любые ЛАТ символы, цифры и _ бесконечно
        // (\S+) все НЕ пробелы
        // (-._~:\/?#\[\]@!$&'()*\+,;=)? - набор символов, которые могут быть в URL,
        // а могут и не быть (некоторые пришлось экранировать)
      },
      message: 'Ошибка! Некорректный URL',
    },
  },
  tariler: {
    type: String,
    validate: {
      validator(url) {
        return /(http|https):\/\/(w{3}\.)?(\w*)(\S+)(-._~:\/?#\[\]@!$&'()*\+,;=)?\.(\w*)/gi.test(url);
      },
      message: 'Ошибка! Некорректный URL',
    },
  },
  thumbnail: {
    type: String,
    validate: {
      validator(url) {
        return /(http|https):\/\/(w{3}\.)?(\w*)(\S+)(-._~:\/?#\[\]@!$&'()*\+,;=)?\.(\w*)/gi.test(url);
      },
      message: 'Ошибка! Некорректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', MovieSchema);
