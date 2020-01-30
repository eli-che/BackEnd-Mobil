const LocalStrategy = require('passport-local').Strategy;
const cassandra = require('cassandra-driver');
const bcrypt = require('bcryptjs');

// DB Config
const pg_client = require('../config/pgkeys')

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'username'}, (username, password, done) => {
            // Find the "user" by username
            const query = {
                name: 'login',
                text: 'select username, password from credentials where username = $1',
                values: [username],
              }
            pg_client.query(query, function(err, result) {
                if (result.rowCount == 0) {
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
          const query = {
            name: 'login-deserialize',
            text: 'select username from credentials where username = $1',
            values: [username],
          }
        pg_client.query(query, function(err, result) 
        {
            done(err, result.rows[0]);
        });

      });
}

