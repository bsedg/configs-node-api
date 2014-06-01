
var configs = {
    "configurations" : [
     {
        "name" : "host1",
        "hostname" : "nessus-ntp.lab.com",
        "port" : 1241,
        "username" : "toto"
     },
     {
        "name" : "host2",
        "hostname" : "nessus-xml.lab.com",
        "port" : 3384,
        "username" : "admin"
     }
 ]
};

exports.getConfigs = function(req, res) {
    res.json(configs);
};

exports.getConfig = function(req, res) {
    if(configs.length <= req.params.id || req.params.id < 0) {
        res.statusCode = 404;
        return res.send('Error 404: No config found');
    }

    var q = configs[req.params.id];
    res.json(q);
};