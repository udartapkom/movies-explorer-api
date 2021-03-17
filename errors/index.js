const BadRequestErr = require('./bad-request-err');
const ConflictErr = require('./conflict-err');
const ForbiddenErr = require('./forbidden-err');
const NotFoundErr = require('./not-found-err');
const UnautorizedErr = require('./unauthorized-err');

module.exports = {
  BadRequestErr,
  ConflictErr,
  ForbiddenErr,
  NotFoundErr,
  UnautorizedErr,
};
