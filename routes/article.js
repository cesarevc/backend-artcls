'use strict'

var express = require('express');
var ArticleController = require('../controllers/articleController');

var router = express.Router();


router.post('/datos', ArticleController.datos);
router.get('/test', ArticleController.test);


module.exports = router;