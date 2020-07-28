const bindUserToResponseLocals = (request, response, next) => {
  response.locals.user = request.user;
  next();
};

module.exports = bindUserToResponseLocals;
