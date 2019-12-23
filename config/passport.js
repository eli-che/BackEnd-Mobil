const LocalStrategy = require('passport-local').Strategy;
const cassandra = require('cassandra-driver');
const bcrypt = require('bcryptjs');

// DB Config
const client = require('../config/keys');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'username'}, (username, password, done) => {
            // Find the "user" by username
            const query = 'select * from user.credentials where username = ?';
            client.execute(query, [username], { prepare: true }, function(err, result) {
                if (result.rowLength == 0) {
                    return done(null, false, {status: false, msg: 'Det angivna kontonamnet eller lösenordet är felaktigt.'});
                } else {
                
                // Check if account active later, currently ignoring.
                
                // Match password
                    
                bcrypt.compare(password, result.rows[0].password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch){
                        return done(null, result.rows[0]);
                    } else {
                        return done(null, false, {status: false, msg: 'Det angivna kontonamnet eller lösenordet är felaktigt.'});
                    }
                }); 
                
                }

            });

        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.username);
      });
      
      passport.deserializeUser(function(username, done) {
        const query = 'select * from user.credentials where username = ?';
        client.execute(query, [username], { prepare: true }, function(err, result) 
        {
            done(err, result.rows[0]);
        });

      });
}

