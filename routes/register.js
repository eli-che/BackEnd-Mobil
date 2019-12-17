const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const randomInt = require('random-int');

// User model
const User = require('../models/User');


// Register Handle
router.post('/register', (req, res) => {
    const { username, email, password, password2 } = req.body;
    let errors = [];
    

    // Check Required Fields
    if (!username || !email || !password || !password2){
        res.send({status: false, msg: 'Please fill in all fields'});
        return;
    }

    // Check passwords match
    if(password !== password2) {
        res.send({status: false, msg: 'Passwords do not match'});
        return;
    }

    // Check pass length
    if(password.length < 6) {
        res.send({status: false, msg: 'Password should be at least 6 characters'});
        return;
    }

  /*  if(errors.length > 0) {
        console.log("fail4");
        res.render('register', {
            errors,
            username,
            email,
        });
    } */
    // else { 
        
        User.findOne({ username: username })
        .then(user => {
            if(user) {
            // Username exists
            res.send({status: false, msg: 'Username is already registerd'});
            return;
        } else { 
            User.findOne({ email: email })
            .then(user => {
                if(user) {
                // Email exists
                res.send({status: false, msg: 'Email is already registerd '});
                return;
            } else {
                const newUser = new User({
                    username,
                    email,
                    password
                });
    
                //Generate validation token
                const val_token = randomInt(111111, 999999);
                newUser.val_token = val_token;
                
                // Flag Account as inactive
                newUser.active = false;


                //Hash password
                bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    // Set password to hashed
                    newUser.password = hash;
                    // Save user
                    newUser.save()
                        .then(user => {
                            console.log("Redirect Here to logged in page.");
                        //    req.flash('success_msg', 'You are now registered');
                        //    res.redirect('/login');
                        })
                        .catch(err => console.log(err));
                }))
                console.log(newUser)
                }
            }); 
            } 
        }); 

 //    } 

});

module.exports = router;