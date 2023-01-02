const Category = require('../models/category');
const Product = require('../models/product');
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

    // Verificar si el correo existe
    const userExist = await Usuario.findById(id);
    if ( !userExist ) {
        throw new Error(`El id no existe ${ id }`);
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

// ! Esta validacion es para la id usuario, para ver si es valido y si existe

const existeUsuarioPorId = async( id ) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        const existeUsuario = await User.findById( id );

        if ( !existeUsuario ) {
            throw new Error(`El id ${ id } no existe`);
        }
    } else {
        throw new Error(`${ id } no es un ID válido`);
    }
}

// ! Esta validacion es para la categoria 

const existCategoryID = async( id ) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) { // !esta validando si es un id valido de mongo
        const existCategory = await Category.findById( id ); // ! busca si existe el id

        if ( !existCategory ) { // !se le pone el signo de admiracion para negar que existe
            throw new Error(`El id ${ id } no existe`);
        }
    } else {
        throw new Error(`${ id } no es un ID válido`);
    }
}

const validateNameCategory = async( name = '') =>{

    const existName = await Category.findOne({ name });

    if (existName) {
        throw new Error(`La categoría ${existName}, ya existe.`);
    }
}

// ! Esta validacion es para los productos 

const existProductID = async( id ) => {
    if (id.match(/^[0-9a-fA-F]{24}$/)) { // !esta validando si es un id valido de mongo
        const existProduct = await Product.findById( id ); // ! busca si existe el id

        if ( !existProduct ) { // !se le pone el signo de admiracion para negar que existe
            throw new Error(`El id ${ id } no existe`);
        }
    } else {
        throw new Error(`${ id } no es un ID válido`);
    }
}

const colectionsAllowed = ( colection = '', colections = []) =>{
    
    const include = colections.includes( colection );

    if( !include ){
        
        throw new Error(`La colección ${ colection } no es permitida, ${ colections}`);
    }

    return true;
}

const mongoIDValid = async( id ) =>{

    if (id.match(/^[0-9a-fA-F]{24}$/)) {        
        return true;
    }else{
        throw new Error(`${ id } no es un ID válido`);
    }
}



module.exports = {
    validateRole,
    validateEmail,
    existUserId,
    userExistById,
    existeUsuarioPorId,
    existCategoryID,
    validateNameCategory,
    existProductID,
    colectionsAllowed,
    mongoIDValid
}