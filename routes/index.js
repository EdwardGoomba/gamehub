const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
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
