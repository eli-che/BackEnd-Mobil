const {Client} = require('pg')

const pg_client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'password',
    port: 5432,
})

pg_client.connect(function(err, result){
    if (err) {
        console.log('Postgres Failed Connecting');
    }
    else { 
        console.log('Postgres Connected'); 
    }
})


module.exports = pg_client;