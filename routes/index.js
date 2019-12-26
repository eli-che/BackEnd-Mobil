const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Dashboard
router.get('/dashboard', ensureAuthenticated, function (req, res) {
    return res.send({user: req.user.username});
    });


    router.get('/bench', function (req, res) {
        return res.send('BenchTest');
        });

module.exports = router;
