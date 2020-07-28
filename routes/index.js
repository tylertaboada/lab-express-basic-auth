const { Router } = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const User = require('./../models/user');
const routeAuthenticationGuard = require('./../middleware/route-authentication-guard');

router.get('/', (request, response, next) => {
  response.render('index');
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - > SIGN UP ROUTES
router.get('/sign-up', (request, response, next) => {
  response.render('authentication/sign-up');
});

router.post('/sign-up', (request, response, next) => {
  const { name, email, username, password } = request.body;

  bcrypt
    .hash(password, 10)
    .then(hash => {
      return User.create({
        name,
        email,
        username,
        passwordHash: hash
      });
    })

    .then(user => {
      console.log(user);
      request.session.userId = user._id;
      response.redirect('/private');
    })
    .catch(error => {
      next(error);
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - > SIGN IN ROUTES

router.get('/sign-in', (request, response, next) => {
  response.render('authentication/sign-in');
});

router.post('/sign-in', (request, response, next) => {
  const { username, password } = request.body;

  let user;

  User.findOne({ username })
    .then(document => {
      user = document;
      if (!user) {
        return Promise.reject(new Error('No user with that username.'));
      }
      const passwordHash = user.passwordHash;
      return bcrypt.compare(password, passwordHash);
    })
    .then(comparison => {
      if (comparison) {
        request.session.userId = user._id;

        response.redirect('/private');
      } else {
        const error = new Error('Password did not match.');
        return Promise.reject(error);
      }
    })
    .catch(error => {
      response.render('authentication/sign-in', { error: error });
    });
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - > MAIN ROUTE

router.get('/main', (request, response, next) => {
  response.render('main');
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - > PRIVATE ROUTE

router.get('/private', routeAuthenticationGuard, (request, response, next) => {
  response.render('private');
});

module.exports = router;
