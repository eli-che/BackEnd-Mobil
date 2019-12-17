const express = require('express');
const router = express.Router();

//User model
const User = require('../models/User');


// Validate Page
router.get('/validate', (req, res) => res.render('validate'));


router.post('/validate', (req, res) => {
    const {email, validate_code} = req.body;
    let errors = [];

    // Check Required Fields
    if (!email || !validate_code){
        errors.push({ msg: 'Please fill in all fields' });
    }

    if(errors.length > 0) {
        res.render('validate', {
            errors,
            email,
        });
    }
    else { 
        
        User.findOne({ email: email})
            .then(user => {
                if(user){
                    if(validate_code == user.val_token){
                        user.active = true;
                        user.save()
                        .then(user => {
                            req.flash('success_msg', 'Email confirmed');
                            res.redirect('/login');
                        })
                        .catch(err => console.log(err));
                        console.log("Test:", user.active);
                    }
                    else {
                        errors.push({ msg: 'Wrong Code' });
                        res.render('validate', {
                            errors,
                            email,
                        });
                    }
                }
            })
    } 

});

module.exports = router;