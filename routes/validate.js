const express = require('express');
const router = express.Router();

// DB Config
const client = require('../config/keys');

// Validate Email

router.post('/validate', (req, res) => {
    const {username, validate_code} = req.body;
    let errors = [];
    // Check Required Fields
    if (!validate_code){
        return res.send({status: false, msg: 'Please Enter Code'});
    }

    const query = 'select validate_code from user.credentials where username = ?';
    client.execute(query, [username])
    .then(function(result) {
        if (result.rowLength > 0) {
        if (result.rows[0].validate_code != validate_code) {
            return res.send({status: false, msg: 'Wrong token'});
        }
            else {
                        const query = 'UPDATE user.credentials SET active=? WHERE username=?';
                        client.execute(query, [true, username])
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
        return res.send({status: false, msg: 'User Email Validation, cannot find username!'});
    });

});

module.exports = router;