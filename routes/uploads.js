const { Router } = require('express');
const { check, body } = require('express-validator');
const { uploadFile, updateImage, showImage, updateImageCloudinary } = require('../controllers/uploads');
const { colectionsAllowed, mongoIDValid } = require('../helpers');
const { validarCampos, validateFile } = require('../middlewares');

const router = Router();

router.post('/', [
    validateFile,
    validarCampos
], uploadFile);

router.put('/:colection/:id', [
    validateFile,
    check('id').custom( mongoIDValid ),
    check('colection').custom( c => colectionsAllowed(c, ['usuarios', 'products'])  ),
    validarCampos
], //updateImage
updateImageCloudinary
);

router.get('/:colection/:id',[
    check('id').custom( mongoIDValid ),
    validarCampos
], showImage );

module.exports = router;