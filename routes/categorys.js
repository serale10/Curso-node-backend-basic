const { Router } = require('express');
const { body, check, query } = require('express-validator');

// ! Controllers for crud
const { createCategory, getCategorys, getCategoryID, updateCategory, deleteCategory } = require('../controllers/categorys');
const { existCategoryID, validateNameCategory } = require('../helpers/db-validators');
const { validateJWT, validarCampos, validateAdminRole } = require('../middlewares');

const router = Router();



// * Obtener todas las categorias - publico
router.get('/', [
        query("limite", "El valor de 'limite' debe ser numérico")
            .isNumeric()
            .optional(),
        query("desde", "El valor de 'desde' debe ser numérico")
        .isNumeric()
        .optional(),
    validarCampos
], getCategorys );

// ! Obtener una categoria en particular
router.get('/:id', [
    check('id').custom( existCategoryID ), // ! Debe ser check no body, para verificar si es valido el id
    validarCampos
] , getCategoryID);


// ! crear categoria - privado- culquier persona con un token válido
router.post('/',[
    validateJWT,
    body('name', 'El nombre es obligatorio').not().isEmpty(),
    check('name').custom( validateNameCategory ),
    validarCampos
] , 
createCategory );

// ! actualizar - privado - cualquiera con token válido
// ! actualizar categoria por id 
router.put('/:id',[
    validateJWT,
    check('id').custom( existCategoryID ),
    body('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], updateCategory);

// ! borrar categoria - privado - solo admin
router.delete('/:id',[
    validateJWT,
    check('id').custom( existCategoryID ),
    validateAdminRole,
    validarCampos
], deleteCategory);

// router.patch('/');

module.exports = router;