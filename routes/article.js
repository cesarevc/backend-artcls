'use strict'

var express = require('express');
var ArticleController = require('../controllers/articleController');

var router = express.Router();


//rutas para articulos
//de prueba
router.post('/datos', ArticleController.datos);
router.get('/test', ArticleController.test);

//rutas utiles
router.post('/save', ArticleController.save);



module.exports = router;