const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const randomInt = require('random-int');

// DB Config
const pg_client = require('../config/pgkeys')


// Register Handle
router.post('/register', (req, res) => {
    const { username, email, number, password, password2 } = req.body;

    // Check Required Fields
    if (!username || !email || !number || !password || !password2){
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
    const query = {
        name: 'check-username',
        text: 'SELECT username FROM credentials WHERE username = $1',
        values: [username],
      }
    pg_client.query(query, function(err, result) {
        if (result.rowCount > 0) {
            return res.send({status: false, msg: 'Username is already registered'});
        } else {
            const query = {
                name: 'check-email',
                text: 'SELECT email FROM credentials WHERE email = $1',
                values: [email],
              }
              pg_client.query(query, function(err, result) {
                if (result.rowCount > 0) {
                    return res.send({status: false, msg: 'Email is already registered '});
                        } else { 
                            const query = {
                                name: 'check-number',
                                text: 'SELECT number FROM credentials WHERE number = $1',
                                values: [number],
                              }
                            pg_client.query(query, function(err, result) {
                            if (result.rowCount > 0) {
                                    return res.send({status: false, msg: 'Number is already registered '});
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
                                const query = {
                                    name: 'create-user',
                                    text: 'INSERT INTO credentials (username, email, number, password, validate_code, active, date) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                                    values: [username, email, number, hash, validate_code.toString(), false, Date.now()], 
                                  }
                                  pg_client.query(query)
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



        }

    });

});

module.exports = router;
