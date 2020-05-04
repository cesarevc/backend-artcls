'use strict'

//modules to create server
var express = require('express');
var bodyParser = require('body-parser');

//execute express (http)
var app = express();

//charge files routes 

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//cors activate 

// routes prefix
// app.get('/probando', (req, res) => {
//     return res.status(200).send({
//         curso: "backend",
//         autor: "cesar enrique",
//         web: "www.cesc.com"
//     });
// })


//export modules (actual file)
module.exports = app;