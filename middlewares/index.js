

const validatesJWT = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-roles');
const validateFiles = require('../middlewares/validate-file');
const validations = require('../middlewares/validations');


module.exports = {
    
    ...validatesJWT,
    ...validateRoles,
    ...validateFiles,
    ...validations
}