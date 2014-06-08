var CreateTestDB = function() {
    var
        collections_to_create = 2,
        mongo = require('mongodb').MongoClient,
        mongo_connection = process.env.MONGOHQ_URL ? process.env['MONGOHQ_URL'] : 'mongodb://localhost:27017/configs',
        random_hostnames = [
            'nessus-ntp.lab.com',
            'nessus-xml.lab.com',
            'nessus-qa.lab.com',
            'nessus-api.lab.com',
            'nessus-test.lab.com'
        ],
        random_ports = [
            8080,
            224,
            22,
            8000,
            80
        ];

    var _start = function() {
        _create_users(_finish);
        _create_configs(_finish);
    };

    var _finish = function() {
        if (--collections_to_create === 0) {
            process.exit(1);
        }
    };

    var _create_users = function(done) {
        mongo.connect(mongo_connection, function(err, db) {
            var users = db.collection('users');
            users.remove(function(err, result) {
                users.insert([{
                    'username': 'tester-1',
                    'password': 'password'
                }, {
                    'username': 'tester-2',
                    'password': 'password'
                }, {
                    'username': 'tester-3',
                    'password': 'password'
                }, {
                    'username': 'tester-4',
                    'password': 'password'
                }], function(err, docs) {
                    users.count(function(err, count) {
                        console.log('There are ' + count + ' users.');
                        return done();
                    });
                });
            });
        });
    };

    var _create_configs = function(done) {
        var configurations = [];
        for (var i = 0; i < 1000; i++) {
            configurations.push({
                'name': 'host' + i,
                'hostname' : random_hostnames[i % 5],
                'port' : random_ports[i % 5],
                'username' : 'tester-' + (i % 4 + 1)
            });
        }

        mongo.connect(mongo_connection, function(err, db) {
            var configs = db.collection('configs');
            configs.remove(function(err, result) {
                configs.insert(configurations, function(err, docs) {
                    configs.count(function(err, count) {
                        console.log('There are ' + count + ' configs.');
                        return done();
                    });
                });
            });
        });
    };

    return {
        start: _start
    }
}();

CreateTestDB.start();
