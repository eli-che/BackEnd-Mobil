const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

const cassandra_client = require('../config/keys');
const pg_client = require('../config/pgkeys')

// Dashboard
router.get('/dashboard', ensureAuthenticated, function (req, res) {

    return res.send({user: req.user.username});






   /* const query = 'select * from locationmedia where country = ? and state = ? LIMIT 2';
    cassandra_client.execute(query, ['SE', 'Götaland'], { prepare: true }, function(err, result) {
        console.log(result);
        return res.send(result.rows);
        //If less than like 6 results, step one back to country and retriveve more.
        //When the user keeps scrolling, let's say he's on id 12345, if it doesnt find anything after id 12345 it will also
        //Step back on step and try to find more after id 12345, this way the user wont get the same results even if
        // We step one back.
        // For example if the user gets 7 images back, while he should get 15, we return to him 8 more from next section.
        
    });*/
    });


    router.get('/bench', function (req, res) {
        return res.send('BenchTest');
        });

module.exports = router;
