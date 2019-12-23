const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
// DB Config
const client = require('../config/keys');


router.get('/friendlistview', ensureAuthenticated, function (req, res) {
    // Select friends from the user requesting his friend list
    const query = 'select friend from user.friendlist where username = ?';
    client.execute(query, [req.user.username], { prepare: true }, function(err, result) {
        if (result.rowLength == 0){
            return res.send({status: false, msg: 'No Friends'});
        } else {
        return res.send(result.rows);
        }
    });
});

router.get('/friendrequestview', ensureAuthenticated, function (req, res) {
    // Select friend requests from a user requesting his receieved friend requests.
    const query = 'select usernamesender from user.friendrequest where usernamereceiver = ?';
    client.execute(query, [req.user.username], { prepare: true }, function(err, result) {
        if (result.rowLength == 0){
            return res.send({status: false, msg: 'No pending friend-requests'});
        } else {
        return res.send(result.rows);
        }
    });
});

router.post('/friendrequestaccept', ensureAuthenticated, function (req, res) { 
    // Accept a friend request
    const {friend} = req.body;
    let errors = [];
    // Check Required Fields
    if (!friend){
        return res.send({status: false, msg: 'Friend Field Missing'});
    }

    // Check if a friend request actually exists before accepting.
    const query = 'select * from user.friendrequest where usernamereceiver = ? and usernamesender = ?';
    client.execute(query, [req.user.username, friend], { prepare: true }, function(err, result) {
        if (result.rowLength == 0) {
            // The friend request doesn't actually exist.
            return res.send({status: false, msg: 'Something went wrong adding friend'});
        } else {
            // The friend request exists
            const query1 = 'INSERT INTO user.friendlist (username, friend) VALUES (?, ?)';
            const query2 = 'INSERT INTO user.friendlist (username, friend) VALUES (?, ?)';
            const query3 = 'DELETE FROM user.friendrequest where usernamereceiver = ? and usernamesender = ?'
            const query4 = 'DELETE FROM user.friendrequest where usernamereceiver = ? and usernamesender = ?'
            const queries = [
            { query: query1, params: [req.user.username, friend] },
            { query: query2, params: [friend, req.user.username] },
            { query: query3, params: [req.user.username, friend] },
            { query: query4, params: [friend, req.user.username] }   
            ];
            client.batch(queries, { prepare: true })
            .then(function() {
            return res.send({status: true, msg: 'Friend Successfully Added'});
            })
            .catch(function(err) {
            return res.send({status: false, msg: 'Something went wrong adding friend in batch'});
            });

        }

    });

});

router.post('/friendrequestsend', ensureAuthenticated, function (req, res) {
    const {friend} = req.body;
    let errors = [];

    // Check Required Fields
    if (!friend){
        return res.send({status: false, msg: 'Friend Field Missing'});
    }

    // Don't add yourself
    if (req.user.username == friend){
        return res.send({status: false, msg: 'You cannot add yourself'});
    }

    //Check if they are already friends
    const query = 'select * from user.friendlist where username = ? and friend = ?';
    client.execute(query, [req.user.username, friend], { prepare: true }, function(err, result) {
    if (result.rowLength > 0) {
        return res.send({status: false, msg: 'You are already friends'});
    } else { 
    //Check if the friend Request already exists
    const query = 'select * from user.friendrequest where usernamereceiver = ? and usernamesender = ?';
    client.execute(query, [friend, req.user.username], { prepare: true }, function(err, result) {
        if (result.rowLength > 0) {
            return res.send({status: false, msg: 'A Friend Request Is Already Pending'});
        } else {
           
           //Check if the user actually exists
           const query = 'select username from user.credentials where username = ?';
           client.execute(query, [friend], { prepare: true }, function(err, result) {
           if (result.rowLength == 0){
            return res.send({status: false, msg: 'Something went wrong sending friend request'});
           } else { 
            const query = 'insert into user.friendrequest (usernamereceiver, usernamesender) values (?, ?)';
            client.execute(query, [friend, req.user.username], { prepare: true }, function(err, result) { 
                return res.send({status: true, msg: 'Friend Request Sent'});
            });
        }
    });


        }
    
    });
        }
});

});
    
module.exports = router;
