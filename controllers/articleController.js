'use strict'

var validator = require('validator');
var Article = require('../models/article');
var fs = require('fs');
var path = require('path');

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

            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                message: 'Hubo un error, faltan datos',
            });
        }

        if (validateTitle && validateContent){
           
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
    },

    update: (req, res) => {
        //pick up article id
        var idArticle = req.params.id;

        //recibe data
        var params = req.body;

        //validate data
        try {
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(404).send({
                status: 'error',
                message: 'hubo un error'
            });
        }
        if (validateTitle && validateContent){
            //find and update
            Article.findByIdAndUpdate({_id: idArticle}, params, {new: true}, (err, articleUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'error al actualizar'
                    });     
                }
                if (!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'hubo un error'
                    });
                }
                //response
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                }); 
            })

        } else {
            return res.status(404).send({
                status: 'error',
                message: 'error al intentar la actualización'
            }); 
        }
    },

    delete: (req, res) => {
        var idArticle = req.params.id;

        Article.findOneAndDelete({_id: idArticle}, (err, articleRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'error al borrar'
                }); 
            }

            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'no existe el articulo'
                }); 
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            }); 
        });
    },

    upload: (req, res) => {
        //cconnect multiparty router/article.js
        console.log(req.files);
        //pick up the file to upload
       
        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: 'imagen no subida'
            })
        }

        //get file name and extension 
        var filePath = req.files.file0.path;
        var fileSplit = filePath.split('\\');

        //CAUTION, if server runs on liinux or ios
        //var fileSplit = filePath.split('/');

        var fileName = fileSplit[2];

        var extension_split = fileName.split('\.');
        var file_ext = extension_split[1];
        
        //validate file extension
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'gif' && file_ext != 'jpeg'){
            fs.unlink(filePath, (err) => {
                return res.status(404).send({
                    status: 'error',
                    message: 'la extension de la img no es valida' 
                });
            });
        } else {
            var article_id = req.params.id;

            Article.findOneAndUpdate({_id: article_id}, {image: fileName}, {new:true}, (err, articleUpdated) => {
                if (err || !articleUpdated){
                    return res.status(500).send({
                        status: 'error',
                        message: 'error al actualizar articulo'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }
    },

    getImage: (req, res) => {

        var file = req.params.image;
        var path_file = `./upload/articles/${file}`;

        fs.exists(path_file, (exists) => {
            if(exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'la imagen no existe'
                });
            }
        })
    },

    search: (req, res) => {
        //String a buscar
        var searchString = req.params.search;
        //find or
        Article.find({ "$or":[
            {"title": {"$regex" : searchString, "$options": "i" }},
            {"content": {"$regex" : searchString, "$options": "i" }}
        ]})
        .sort([['date, descending']])
        .exec((err, articles) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'error en la petición'
                });
            }

            if(!articles){
                return res.status(500).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con la busqueda'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });

    }

};


module.exports = controller;