const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// DB Config
const cassandra_client = require('../config/keys');

// Validate Email
router.post('/validate', ensureAuthenticated, (req, res) => {
    const {validate_code} = req.body;
    // Check Required Fields
    if (!validate_code){
        return res.send({status: false, msg: 'Please Enter Code'});
    }
    // Check the validate_code
    const query = 'select validate_code from credentials where username = ?';
    cassandra_client.execute(query, [req.user.username], { prepare: true })
    .then(function(result) {
        if (result.rowLength > 0) {
            // Check's that we actually get something returned 
        if (result.rows[0].validate_code != validate_code) {
            // The validate_code doesn't match the one in the database.
            return res.send({status: false, msg: 'Wrong token'});
        }
            else {
                // Set the user/email to active when the user has validated.
                        const query = 'UPDATE credentials SET active=? WHERE username=?';
                        cassandra_client.execute(query, [true, req.user.username], { prepare: true })
                        .then(function(result) {
                            return res.send({status: true, msg: 'User Email Validated'});
                        })
                        .catch(function(err) {
                            return res.send({status: false, msg: 'User Email Validation Went Wrong'});
                        });
            }

        }   else {
            return res.send({status: false, msg: 'User Email Validation, Nothing Matches!'});
        }
    })
    .catch(function(err) {
        console.log(err);
        return res.send({status: false, msg: 'User Email Validation, Nothing Matches!! '});
    });

});

module.exports = router;