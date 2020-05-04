'use strict'

var controller = {
    datos :  (req, res) => {
        return res.status(200).send({
            curso: "backend",
            autor: "cesar enrique",
            web: "www.cesc.com"
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: ' Soy la accion test',
        });
    }
}


module.exports = controller;