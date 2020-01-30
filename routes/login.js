const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');

// Login Handle (Post) 
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user)
       { return res.send({status: false, msg: 'Login Failed'}); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.send({status: true, msg: 'Login Successful'});
      });
    })(req, res, next);
  });

// Logout Handle
router.get('/logout', ensureAuthenticated, (req,res) => {
    req.logout();
    return res.send({status: true, msg: 'Logout Successful'});
});

module.exports = router;