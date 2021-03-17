const ERR_MSG = {
  BAD_REQUEST: 'Данные некорректны',
  NOT_FOUND: 'Данные не найдены',
  CONFLICT: 'Пользователь с указанным email уже существует',
  FORBIDDEN: 'Недостаточно прав',
  UNAUTORIZED: 'Необходима авторизация',
  SERVER_ERROR: 'На сервере произошла ошибка',
  VALIDATION_ERR: 'Ошибка валидации, проверьте данные',
};

module.exports = { ERR_MSG };
