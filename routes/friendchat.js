const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
// Snow-flake generation, time sortable.
const { simpleflake } = require('simpleflakes');
// DB Config
const cassandra_client = require('../config/keys');

router.get('/friendchatgetlist', ensureAuthenticated, function (req, res) {
    return res.send({user: req.user.username});
    });

router.post('/friendchatpostget', ensureAuthenticated, function (req, res) {
    const {chatid} = req.body;
    // Check if user is part of the chat
    const query = 'select * from friendchatlist where username = ? and chatid = ?';
    cassandra_client.execute(query, [req.user.username, chatid], { prepare: true }, function(err, result) {
        if (result.rowLength == 0) {
            // The user is not part of the chat
            return res.send({status: false, msg: 'You are not a part of this chat'});
        } else {
            const query = 'select sender, content from friendchat where chatid = ?';
            cassandra_client.execute(query, [chatid], { prepare: true }, function(err, result) {
                if (result.rowLength == 0){
                    return res.send({status: false, msg: 'Chat Empty'});
                } else {
                return res.send(result.rows);
                }
            });
        }

    });
});

router.post('/friendchatsend', ensureAuthenticated, function (req, res) {  
    const {chatid, content} = req.body;

    // Check if user is part of the chat
    const query = 'select * from friendchatlist where username = ? and chatid = ?';
    cassandra_client.execute(query, [req.user.username, chatid], { prepare: true }, function(err, result) {
        if (result.rowLength == 0) {
            // The user is not part of the chat
            return res.send({status: false, msg: 'You are not a part of this chat'});
        } else {
            // The user was port of the chat, let's insert the message.
            const query = 'INSERT INTO friendchat (chatid, message_id, sender, content, created_at) VALUES (?, ?, ?, ?, ?) IF NOT EXISTS';
            cassandra_client.execute(query, [chatid, simpleflake().toString(), req.user.username, content, Date.now()], { prepare: true }, function(err, result) {
                if (err){
                    return res.send({status: false, msg: 'Something went wrong sending message'});
                } else {
                    return res.send({status: true, msg: 'Message sent!'});
                }
            });

         }

    });

});

module.exports = router;