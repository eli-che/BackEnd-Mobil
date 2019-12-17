const express = require('express');
const router = express.Router();
const passport = require('passport');

// Login Page
router.get('/login', (req, res) => res.render('Login'));

// Login Handle (Post) 
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
}); 



// Logout Handle
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'You have logged out');
    res.redirect('/login');
});

module.exports = router;