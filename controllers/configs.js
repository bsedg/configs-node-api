var configs =
    [
        {
            "_id": 0,
            "name" : "host1",
            "hostname" : "nessus-ntp.lab.com",
            "port" : 1241,
            "username" : "toto"
        },
        {
            "_id": 1,
            "name" : "host2",
            "hostname" : "nessus-xml.lab.com",
            "port" : 3384,
            "username" : "admin"
        }
    ];

var sort_by_columns = [
    '_id',
    'name',
    'hostname',
    'port',
    'username'
];

exports.getConfigs = function(query, res) {
    if (query.indexOf('sortby') >= 0) {
        var query_map = {};

        query = query.toLowerCase();
        query = query.replace('?', '');
        query = query.replace('&', ' ');

        var query_parameters = query.split(' ');

        // create map of query string [ {parameter: value] }
        for (var i = 0; i < query_parameters.length; i++) {
            var temp_param = query_parameters[i].split('=');
            query_map[temp_param[0]] = temp_param[1];
        }

        if ('sortby' in query_map) {
            var order_by = 'asc';

            if (sort_by_columns.indexOf(query_map.sortby) < 0) {
                res.writeHead(400, {"Content-Type": "text/javascript"});
                res.end('{"error": "Invalid parameter, orderby must be in ' + sort_by_columns + ' not ' + query_map.sortby + '"}');
            }

            if ('orderby' in query_map) {
                order_by = query_map.orderby == 'asc' || query_map.orderby == 'desc' ? query_map.orderby : order_by;
            }

            configs.sort(function(a, b) {
                    switch(query_map.sortby) {
                        case '_id':
                            return order_by == 'asc' ? a._id - b._id : b._id - a._id;
                        case 'name':
                            return order_by == 'asc' ? a.name.localeCompare(b.name): b.name.localeCompare(a.name);
                        case 'hostname':
                            return order_by == 'asc' ? a.hostname.localeCompare(b.hostname): b.hostname.localeCompare(a.hostname);
                        case 'port':
                            return order_by == 'asc' ? a.port - b.port : b.port - a.port;
                        case 'username':
                            return order_by == 'asc' ? a.username.localeCompare(b.username): b.username.localeCompare(a.username);
                        default:
                            return a._id - b._id;
                    }
            });

            res.writeHead(200, {"Content-Type": "text/javascript"});
            res.end(JSON.stringify(configs));
        }
        else {
            res.writeHead(200, {"Content-Type": "text/javascript"});
            res.end(JSON.stringify(configs));
        }
    }
    else {
        res.writeHead(200, {"Content-Type": "text/javascript"});
        res.end(JSON.stringify(configs));
    }
};

exports.createConfig = function(data, res) {
    var has_error = false;

    if (typeof data.name === 'undefined') has_error = true;
    if (typeof data.hostname === 'undefined') has_error = true;
    if (typeof data.port === 'undefined') has_error = true;
    if (typeof data.username === 'undefined') has_error = true;

    if (has_error) {
        res.writeHead(400, {"Content-Type": "text/javascript"});
        res.end('{"message": "Could not create config: missing field (name, hostname, port, or username)"}');
    }

    config = {
        '_id': configs.length,
        'name': data.name,
        'hostname': data.hostname,
        'port': data.port,
        'username': data.username
    };

    configs.push(config);

    res.writeHead(200, {"Content-Type": "text/javascript"});
    res.end('{"message": "created config", "config": ' + JSON.stringify(config) + '}');
};

exports.editConfig = function(id, data, res) {
    var found_config = configs.filter(function(config){ return config._id == id; });

    if (found_config.length === 0) {
        res.writeHead(404, {"Content-Type": "text/javascript"});
        res.end('{"message": "Configuration to edit was not found."}');
        return;
    }

    found_config.name = 'name' in data ? data.name : found_config.name;
    found_config.hostname = 'hostname' in data ? data.hostname : found_config.hostname;
    found_config.port = 'port' in data ? data.port : found_config.port;
    found_config.username = data.username;

    // update config in list
    configs = configs.filter(function(config){ return config._id != id; });
    configs.push(found_config);

    res.writeHead(200, {"Content-Type": "text/javascript"});
    res.end('{"message": "Edited configuration.", "configuration": ' + JSON.stringify(found_config) + '}');
};

exports.deleteConfig = function(id, res) {
    var prev_length = configs.length;

    configs = configs.filter(function(config){ return config._id != id; });

    if (prev_length > configs.length) {
        res.writeHead(200, {"Content-Type": "text/javascript"});
        res.end('{"message": "Removed config."}');
    }
    else {
        res.writeHead(404, {"Content-Type": "text/javascript"});
        res.end('{"message": "Config not found, could not delete."}');
    }
};
