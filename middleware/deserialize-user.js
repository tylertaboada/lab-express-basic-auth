const User = require('../models/user');

const deserializeUser = (request, response, next) => {
  const id = request.session.userId;

  User.findById(id)
    .then(user => {
      request.user = user;
      next();
    })
    .catch(error => {
      next(error);
    });
};

module.exports = deserializeUser;
