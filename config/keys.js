const cassandra = require('cassandra-driver');
const client = new cassandra.Client({contactPoints: ['127.0.0.1', '127.0.0.2', '127.0.0.3', '127.0.0.4'], localDataCenter: 'datacenter1'});

client.connect(function(err, result){
    console.log('Cassandra Connected');
})
module.exports = client;