'use strict'

var express = require('express');
var ArticleController = require('../controllers/articleController');

var router = express.Router();

var multiparty = require('connect-multiparty');
var md_upload = multiparty({ uploadDir: './upload/articles'});

//rutas para articulos
//de prueba
router.post('/datos', ArticleController.datos);
router.get('/test', ArticleController.test);

//rutas utiles
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/articleUpdate/:id', ArticleController.update);
router.delete('/articleDelete/:id', ArticleController.delete);
router.post('/imageUpload/:id', md_upload,  ArticleController.upload);
router.get('/getImage/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

module.exports = router;