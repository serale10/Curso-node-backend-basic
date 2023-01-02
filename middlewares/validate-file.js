const { response } = require("express");

const validateFile = (req, res = response, next ) =>{
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({
            msg: 'No hay archivos para subir.'
        });
      }
    
    next();
}

module.exports = {
    validateFile
}