const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /profile
router.get('/profile', function(req, res, next) {
  if (! req.session.userId) {
    let err = new Error('You are not authorized to view this page.');
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.render('profile', { title: 'Profile', name: user.name, favorite: user.favoriteGame });
        }
      });
})

// GET /login
router.get('/login', function(req, res, next) {
  return res.render('login', {title: 'Log In'});
});

// POST /login
router.post('/login', function(req, res, next) {
  if (req.body.email && req.body. password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user) {
        let err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    let err = new Error('Email and password are required.');
    err.status = 400;
    return next(err);
  }
});


// GET /register
router.get('/register', function(req, res, next) {
  return res.render('register', {title: 'Sign Up'});
});

// POST /register
router.post('/register', function(req, res, next) {
  if (req.body.email &&
      req.body.name &&
      req.body.favoriteGame &&
      req.body.password &&
      req.body.confirmPassword) {
        // confirm that user typed same password
        if (req.body.password !== req.body.confirmPassword) {
          let err = new Error('Passwords do not match.');
          err.status = 400;
          return next(err);
        }

        // create object with form input
        const userData = {
          email: req.body.email,
          name: req.body.name,
          favoriteGame: req.body.favoriteGame,
          password: req.body.password
        };

        // use schema's create method to insert doc into mongodb
        User.create(userData, function (error, user) {
          if (error) {
            return next(error);
          } else {
            req.session.userId = user._id;
            return res.redirect('/profile');
          }
        });

      } else {
        let err = new Error('All fields have not been filled out');
        err.status = 400;
        return next(err);
      }
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
