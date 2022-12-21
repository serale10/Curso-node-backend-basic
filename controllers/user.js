const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');


const userGet = async(req = request, res = response) => {

    // const { q, numero, apikey } = req.query;
    
    const { limite = 5, desde = 0 } = req.query;
    // const users = await User.find( {status: true})
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await User.countDocuments();

    const status = { status: true};

    const [total, users] = await Promise.all([
        User.countDocuments(status),
        User.find( status )
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
        total,
        users
    });
}

const userPut = async(req, res = response) => {

    const id = req.params.id;
    const { _id, pass, google, mail, ...resto } = req.body;

    if ( pass ) {
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.pass = bcryptjs.hashSync( pass, salt );
    }

    const usuario = await User.findByIdAndUpdate( id, resto, {new: true} );

    res.json(usuario);
}

const userPost = async(req, res = response) => {


    const { name, mail, pass, role } = req.body;
    const user = new User( { name, mail, pass, role } );

    //Verificar si el correo existe

    
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10);

    user.pass = bcryptjs.hashSync(pass, salt);

    //Guardar base de datos
    user.save();

    res.json({
        user
    });
}

const userDelete = async(req, res = response) => {

    const { id } = req.params;

    //BORRAR FISICAMENTE
    // no se recomienda porque puede borrar cosas que no debe el usuario
    // const user = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate( id, {status: false}, {new: true})

    res.json(user);
}

const userPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controller'
    });
}

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete,
    userPatch
}