var mongodb = require('mongodb').MongoClient;

// TODO: https://github.com/mongodb/node-mongodb-native
var users = {
    "users" : [
     {
        "_id": 0,
        "username" : "tester-1",
        "password" : "password"
     },
     {
        "_id": 1,
        "username" : "tester-2",
        "password" : "password"
     }
 ],
 "sessions": [
    {
        "_id": 0,
        "username": "tester-1",
        "expires": "05:30:00 06/05/2014"
    }
 ]
};

exports.signup = function(user, pwd, res) {
    var matched_users = users.users.filter(function(usr) {
        return usr.username == user;
    });
    if (matched_users.length >= 1) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end('{ "message": "User exists" }');
    }

    var total_users = users.users.length;
    users.users.push({
        "_id": total_users,
        "username": user,
        "password": pwd
    });

    res.writeHead(200, {"Content-Type": "application/json"});
    res.end('{ "message": "User created" }');
};

exports.login = function(user, pwd, res) {
    var matched_users = users.users.filter(function(usr) {
        return usr.username == user && usr.password == pwd;
    });
    if (matched_users.length == -1) {
        res.writeHead(400, {"Content-Type": "application/json"});
        res.end('{ "message": "Invalid credentials" }');
    }
    else {
        var session_id = users.sessions.length;
        users.sessions.push({
            "_id": session_id,
            "username": user,
            "expires": Date.now()
        });
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end('{ "message": "Session for user created", "session_id": ' + session_id + ' }');
    }
};

exports.logout = function(user, res) {
    // remove or mark as ended for session - or logout all sessions
};

exports.authenticate = function(user, token) {
    // if current user has an open session and valid token
};
