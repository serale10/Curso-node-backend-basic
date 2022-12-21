const Role = require('../models/role');
const User = require('../models/user');

const validateRole = async( role = '') =>{
    const rolExist = await Role.findOne({ role });
    if( !rolExist ){
        throw new Error(`El rol: ${ role } no esta registrado en la base de datos.`);
    }
}

const validateEmail = async( mail = '' ) =>{

    const mailExist = await User.findOne({ mail });

    if( mailExist ){
        throw new Error(`El mail: ${ mail } ya esta registrado.`);
    }
}

const existUserId = async( id ) => {

    const userExist = await User.findOne( { _id: id} );
    

    if( !userExist ){
        throw new Error(`El id: ${ id } no existe.`);
    }
}

const userExistById = async( id ) => {
 
    if (!mongoose.Types.ObjectId.isValid(id)) {

        const userExist = await User.findById(id);
        if (!userExist) {


            throw new Error(`El id: ${ id } no existe en la BD`);
        } else {
            throw new Error(`El id: '${ id }' no es válido`);
            
        }
        
    }
    
};

const existeUsuarioPorId = async( id ) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const existeUsuario = await User.findById( id ).exec();
        if ( !existeUsuario ) {
            throw new Error(`El id ${ id } no existe`);
        }
    } else {
        throw new Error(`${ id } no es un ID válido`);
    }
};

module.exports = {
    validateRole,
    validateEmail,
    existUserId,
    userExistById,
    existeUsuarioPorId
}