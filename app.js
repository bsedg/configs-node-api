var
    http = require('http'),
    mongo = require('mongodb').MongoClient,
    users = require('./controllers/users'),
    configs = require('./controllers/configs'),
    mongo_connection = process.env.MONGOHQ_URL ? process.env['MONGOHQ_URL'] : 'mongodb://localhost:27017/configs';

var api = http.createServer(function (req, res) {
    var
        url = req.url,
        resource_id,
        resource = url.substring(1, (url.indexOf('?') > 1 ? url.indexOf('?') : url.length)),
        query_string = url.indexOf('?') > 1 ? url.substring(url.indexOf('?')) : null,
        method = req.method;

    if (resource.indexOf('/', 1) >= 0) {
        var parts = resource.split('/');
        resource = parts[0];
        resource_id = parts[1];
    }

    if(resource == 'users') {
        // signup
        if (method == 'POST' || method == 'GET') {
            if (query_string && query_string.indexOf('login') >= 0) {
                req.on('data', function(data) {
                    var json_data = JSON.parse(data);
                    if (!json_data || typeof json_data.username === undefined || typeof json_data.password === undefined) {
                        res.writeHead(400, {"Content-Type": "application/json"});
                        res.end('{ "message": "Bad Request, expecting: POST /users?action=login {username: <usr>, password: <pwd>}" }');
                    }
                    return users.login(json_data.username, json_data.password, res);
                });
            }
            else if (query_string && query_string.indexOf('logout') >= 0) {
                req.on('data', function(data) {
                    var json_data = JSON.parse(data);
                    if (!json_data || typeof json_data.username === undefined || typeof json_data.password === undefined) {
                        res.writeHead(400, {"Content-Type": "application/json"});
                        res.end('{ "message": "Bad Request, expecting: POST /users?action=logout {username: <usr>}" }');
                    }
                    return users.logout(json_data.username, res);
                });
            }
            else {
                req.on('data', function(data) {
                    var json_data = JSON.parse(data);
                    if (!json_data || typeof json_data.username === undefined || typeof json_data.password === undefined) {
                        res.writeHead(400, {"Content-Type": "application/json"});
                        res.end('{ "message": "Bad Request, expecting: POST /users {username: <usr>, password: <pwd>}" }');
                    }
                    return users.signup(json_data.username, json_data.password, res);
                });
            }
        }
        // login, logout
        else if (method == 'PUT') {
        }
        else {
            res.writeHead(405, {"Content-Type": "application/json"});
            res.end('{ "message": "Method not allowed - ' + method + '" }');
        }
    }
    else if(resource == 'configs') {
        if (method == 'GET') {
            configs.getConfigs(query_string, res);
        }
        else if (method == 'POST') {
            req.on('data', function(data) {
                var json_data = JSON.parse(data);
                if (!json_data || typeof json_data.username === undefined || typeof json_data.token === undefined) {
                    res.writeHead(400, {"Content-Type": "application/json"});
                    res.end('{ "message": "Bad Request, expecting: POST /configs {username: <usr>, token: <tkn>}" }');
                }

                // auth json_data.username, json_data.token
                if (users.authenticate(json_data.username, json_data.token)) {
                    return configs.createConfig(json_data, res);
                }
                else {
                    res.writeHead(401, {"Content-Type": "application/json"});
                    res.end('{ "message": "Unauthorized username and token." }');
                }
            });
        }
        else if (method == 'PUT') {
            req.on('data', function(data) {
                var json_data = JSON.parse(data);
                if (!json_data || typeof json_data.username === undefined || typeof json_data.token === undefined) {
                    res.writeHead(400, {"Content-Type": "application/json"});
                    res.end('{ "message": "Bad Request, expecting: POST /configs {username: <usr>, token: <tkn>}" }');
                }

                // auth json_data.username, json_data.token

                return configs.editConfig(resource_id, json_data, res);
            });
        }
        else if (method == 'DELETE') {
            req.on('data', function(data) {
                var json_data = JSON.parse(data);
                if (!json_data || typeof json_data.username === undefined || typeof json_data.token === undefined) {
                    res.writeHead(400, {"Content-Type": "application/json"});
                    res.end('{ "message": "Bad Request, expecting: POST /configs {username: <usr>, token: <tkn>}" }');
                }

                // auth json_data.username, json_data.token

                return configs.deleteConfig(resource_id, res);
            });
        }
        else {
            res.writeHead(405, {
                'message': 'Method not implemented - ' + method,
                'readme': 'https://github.com/bsedg/configs-node-api#configs-node-api'
            });
            res.end();
        }
    }
    else {
        res.writeHead(200, {
          'readme': 'https://github.com/bsedg/configs-node-api#configs-node-api'
        });
        res.end();
    }
});

api.listen(process.env.PORT || 8000);

