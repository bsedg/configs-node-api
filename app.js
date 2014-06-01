var
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    configsController = require('./controllers/configs');

app.use(bodyParser());

// API routes
app.get('/', function(req, res) {
    res.json({
        'api': 'configs',
        'endpoints': ['/configs']
    });
});

app.get('/configs', configsController.getConfigs);
app.get('/configs/:id', configsController.getConfig);

app.listen(process.env.PORT || 3412);
