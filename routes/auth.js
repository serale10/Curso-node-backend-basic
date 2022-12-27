const { Router } = require('express');
const { body, check, query } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validations');

const router = Router();

router.post('/login',[
    body('mail', 'El correo es obligatorio').isEmail(),
    body('pass', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
] , login);

router.post('/google',[
    body('id_token', 'Token es necesario').not().isEmpty(),

    validarCampos
] , googleSignIn);


module.exports = router;