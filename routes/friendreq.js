const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Dashboard
router.get('/friendreq', ensureAuthenticated, function (req, res) {
    return res.send(req.user.username);
    });

module.exports = router;
