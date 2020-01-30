const cassandra = require('cassandra-driver');
const cassandra_client = new cassandra.Client({contactPoints: ['127.0.0.1', '127.0.0.2', '127.0.0.3', '127.0.0.4'], localDataCenter: 'datacenter1', keyspace: 'app'});

cassandra_client.connect(function(err, result){
    if (err) {
        console.log('Cassandra Failed Connecting');
    }
    else { 
        console.log('Cassandra Connected'); 
    }
})
module.exports = cassandra_client;