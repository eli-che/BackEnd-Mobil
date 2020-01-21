const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const randomInt = require('random-int');

// DB Config
const client = require('../config/keys');


// Register Handle
router.post('/register', (req, res) => {
    const { username, email, password, password2 } = req.body;
    console.log(req.body);

    // Check Required Fields
    if (!username || !email || !password || !password2){
        return res.send({status: false, msg: 'Please fill in all fields'});
    }

    // Check passwords match
    if(password !== password2) {
        return res.send({status: false, msg: 'Passwords do not match'});
        
    }

    // Check pass length
    if(password.length < 6) {
        return res.send({status: false, msg: 'Password should be at least 6 characters'});
    
    }
    const query = 'select username from credentials where username = ?';
    client.execute(query, [username], { prepare: true }, function(err, result) {
        if (result.rowLength > 0) {
            return res.send({status: false, msg: 'Username is already registerd'});
        } else {
            const query = 'select email from email where email = ?';
            client.execute(query, [email], { prepare: true }, function(err, result) {
                if (result.rowLength > 0) {
                    return res.send({status: false, msg: 'Email is already registerd '});
                        } else { 
                            // create user
                            //Generate validation token
                            const validate_code = randomInt(111111, 999999);
                            //Hash password
                            bcrypt.genSalt(10, (err, salt) => 
                            bcrypt.hash(password, salt, (err, hash) => {
                            if(err) throw err;
                                // Set password to hashed
                                // INSERT USER
                                    const query1 = 'INSERT INTO credentials (username, email, password, validate_code, active, date) VALUES (?, ?, ?, ?, ?, ?)';
                                    const query2 = 'INSERT INTO email (email, username) VALUES (?, ?)';
                                    const queries = [
                                    { query: query1, params: [username, email, hash, validate_code.toString(), false, Date.now()] },
                                    { query: query2, params: [email, username] } 
                                    ];
                                    client.batch(queries, { prepare: true })
                                    .then(function() {
                                        return res.send({status: true, msg: 'User Created'});
                                    })
                                    .catch(function(err) {
                                        console.log(err);
                                        return res.send({status: false, msg: 'User Creation Failed'});
                                    });
                            }));
                        }

            });



        }

    });

});

module.exports = router;
