'use strict'

var validator = require('validator');

var Article = require('../models/article');

var controller = {
    datos :  (req, res) => {
        return res.status(200).send({
            curso: 'backend',
            autor: 'cesar enrique',
            web: 'www.cesc.com'
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test',
        });
    },

    save: (req, res) => {
        //recive post
        var params = req.body;
        //validate data
        try {

            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                message: 'Hubo un error, faltan datos',
            });
        }

        if (validate_title && validate_content){
           
            //create object to save
            var article = new Article();
            //assign values
            article.title = params.title;
            article.content = params.content;
            article.image = null;
            //save article in bd
            article.save((err, articleStored) => {
                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'el articulo no se ah guardado',
                    });
                }

                //response to request
                return res.status(200).send({
                    status: 'success',
                    article
                });
            });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'los datos no son validos',
            }); 
        }
    },
    getArticles: (req, res) => {

        var query = Article.find({})
        var last = req.params.last;
        if(last || last != undefined){
            query.limit(5);
        }

        //find
        query.sort('-_id').exec((err,articles) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'error al devolver los articulos'
                });    
            }

            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar'
                });    
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        })
    },
    getArticle: (req, res) => {

        //pick up id
        var idArticle = req.params.id;
        // console.log(idArticle);

        //validate id
        if (!idArticle || idArticle == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            }); 
        }
        //find article
        Article.findById(idArticle, (err, article) => {
            if(err || !article){
                return res.status(500).send({
                    status: 'error',
                    message: 'Articulo no encontrado'
                }); 
            }

            //response

            return res.status(200).send({
                status: 'success',
                article
            }); 
        });

    }

};


module.exports = controller;