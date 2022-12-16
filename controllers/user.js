const { response, request } = require('express');

const userGet = (req = request, res = response) => {

    const { q, numero, apikey } = req.query;
    
    res.json({
        msg: 'get API - controller',
        q,
        numero,
        apikey
    });
}

const userPut = (req, res = response) => {

    const { id } = req.params;
    
    res.status(400).json({
        msg: 'put API - controller',
        id
    });
}

const userPost = (req, res = response) => {

    const {nombre, edad} = req.body;

    res.status(201).json({
        msg: 'post API - controller',
        nombre,
        edad
    });
}

const userDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - controller'
    });
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