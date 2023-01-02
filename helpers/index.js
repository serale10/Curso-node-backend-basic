const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const gogoleVerify = require('./google-verify');
const uploadFiles = require('./uploadfile');

module.exports = {

    ...dbValidators,
    ...generarJWT,
    ...gogoleVerify,
    ...uploadFiles
}