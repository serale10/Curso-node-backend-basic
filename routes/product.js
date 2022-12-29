const { Router, response } = require ('express');
const { body, check, query } = require('express-validator');
const { createProduct, getProducts, getProductsID, updateProducts, deleteProduct } = require('../controllers/product');
const { validateJWT, validarCampos, validateAdminRole } = require('../middlewares');
const { existCategoryID, existProductID } = require('../helpers/db-validators');

const router = Router();

router.get('/',[
        query("limite", "El valor de 'limite' debe ser numérico")
            .isNumeric()
            .optional(),
        query("desde", "El valor de 'desde' debe ser numérico")
        .isNumeric()
        .optional(),
        validarCampos
] , getProducts);

router.post('/', [
    validateJWT,
    body('name', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('category').custom( existCategoryID ),
    body('category', 'Es obligatoria la categoría').not().isEmpty(),
    validarCampos
], createProduct);

router.get('/:id',[
    validateJWT,
    check('id').custom( existProductID ),
    validarCampos
] , getProductsID);


router.put('/:id', [
    validateJWT,
    check('id').custom( existProductID ),
    validarCampos
], updateProducts)

// ! se valida un Jason web token
// ! se valida que el id de mongo sea valido
// ! se valida que solo un admin pueda borrar los archivos

router.delete('/:id', [
    validateJWT,
    check('id').custom( existProductID ),
    validateAdminRole,
    validarCampos
], deleteProduct)

module.exports = router;