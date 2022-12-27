
const { Router } = require('express');
const { body, check, query } = require('express-validator');
const { userGet, userPut, userPost, userDelete, userPatch } = require('../controllers/user');
const { validateRole, validateEmail, existUserId, userExistById, existeUsuarioPorId } = require('../helpers/db-validators');

// const { validateJWT } = require('../middlewares/validate-jwt');
// const { validateAdminRole, haveRole } = require('../middlewares/validate-roles');
// const { validarCampos } = require('../middlewares/validations');

const { validateJWT, haveRole, validarCampos } = require('../middlewares');

const router = Router();

    router.get('/',[
        query("limite", "El valor de 'limite' debe ser numérico")
            .isNumeric()
            .optional(),
        query("desde", "El valor de 'desde' debe ser numérico")
        .isNumeric()
        .optional(),
        validarCampos
    ] , userGet);
    
    router.post('/',[
        body('name', 'El nombre de usuario es obligatorio.').not().isEmpty(),
        body('pass', 'El password debe ser más de 6 letras.').isLength({ min: 6 }),
        body('mail', 'El correo no es válido').isEmail(),
        body('mail').custom( validateEmail ),
        // body('role', 'No es un role válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        body('role').custom( validateRole ),
        validarCampos
    ], userPost);
    
    router.put('/:id',[
        // body('id', 'No es un ID válido').isMongoId().bail(),
        check('id').custom( existeUsuarioPorId ),
        body('role').custom( validateRole ), 
        validarCampos
    ],userPut );
    
    router.delete('/:id',[
        validateJWT,
        // validateAdminRole,
        haveRole('ADMIN_ROLE', 'VENTAS_ROLE'),
        check('id').custom( existeUsuarioPorId ),
        validarCampos
    ], userDelete);
    
    router.patch('/', userPatch);

    


module.exports = router;