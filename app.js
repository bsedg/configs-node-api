var
    http = require('http'),
    users = require('./controllers/users'),
    configs = require('./controllers/configs');

var api = http.createServer(function (req, res) {
    var
        url = req.url,
        resource = url.substring(1, (url.indexOf('?') > 1 ? url.indexOf('?') : url.length)),
        query_string = url.indexOf('?') > 1 ? url.substring(url.indexOf('?')) : null,
        method = req.method;

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
            configs.createConfig(query_string, res);
        }
        else if (method == 'PUT') {
            configs.editConfig(query_string, res);
        }
        else if (method == 'DELETE') {
            configs.deleteConfig(query_string, res);
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

api.listen(8000);
console.log("Server running at http://127.0.0.1:8000/");
