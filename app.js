'use strict'

//modules to create server
var express = require('express');
var bodyParser = require('body-parser');

//execute express (http)
var app = express();

//charge files routes 
var article_routes = require('./routes/article');

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//cors activate 

// routes prefix
app.use('/api', article_routes)



//export modules (actual file)
module.exports = app;