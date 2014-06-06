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
        var
            query_map = {},
            query = query.toLowerCase(),
            query = query.replace('?', ''),
            query = query.replace('&', ' '),
            query_parameters = query.split(' ');

        // create map of query string [ {parameter: value] }
        for (var i = 0; i < query_parameters.length; i++) {
            var temp_param = query_parameters[i].split('=');
            query_map[temp_param[0]] = temp_param[1];
        }

        if ('sortby' in query_map) {
            var order_by = 'asc';

            if (sort_by_columns.indexOf(query_map['sortby']) < 0) {
                res.writeHead(400, {"Content-Type": "text/javascript"});
                res.end('{"error": "Invalid parameter, orderby must be in ' + sort_by_columns + ' not ' + query_map['sortby'] + '"}');
            }

            if ('orderby' in query_map) {
                order_by = query_map['orderby'] == 'asc' || query_map['orderby'] == 'desc' ? query_map['orderby'] : order_by;
            }

            configs.sort(function(a, b) {
                    switch(query_map['sortby']) {
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
    res.writeHead(200, {"Content-Type": "text/javascript"});
    res.end('{"message": "create config"}');
};

exports.editConfig = function(data, res) {
    res.writeHead(200, {"Content-Type": "text/javascript"});
    res.end('{"message": "edit config"}');
};

exports.deleteConfig = function(query, res) {
    console.log("DELETE: " + query);
    res.writeHead(200, {"Content-Type": "text/javascript"});
    res.end('{"message": "delete config"}');
};
