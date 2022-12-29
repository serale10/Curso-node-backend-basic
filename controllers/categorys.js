const { response } = require('express');
const Category = require('../models/category');



//!obtenerCategorias - paginado - total - populate

const getCategorys = async( req, res ) =>{

    // ! aca le vamos a poner un limite a mostrar y desde donde
    const { limite = 5, desde = 0 } = req.query;
    
    // !obtenemos el estado de la categoria
    // ! En esta variable se almacena cuantos registros estan en true
    const status = { status: true }

    const [total, categorys] = await Promise.all([// ? promise.all hace las 2 promesas al mismo tiempo, el conteo y la busqueda; el await se agrega porque no queremos que se ejecute el response antes de tiempo.

        // ! Aqui cuenta cuantas categorias estan en true
        // todo arriba se hace la variable para contarla

        Category.countDocuments(status),

        // ! Aca el find busca todas las categorias que estan en true y las despliega
        Category.find( status )
        .populate('user', 'name')
        .skip(Number(desde)) // ? skip significa que mandara apartir del numero que uno quiera, arriba esta la query
        .limit(Number(limite))

    ])

    // ! con este codigo encuentra todos los que hay
    // todo: el problema seria cuando hay miles de registros.

    //const allCategorys = await Category.find();

    res.json({
        total,
        categorys
    })
}

const getCategoryID = async(req, res) =>{

    const { id } = req.params;

    const category = await Category.findById( id )
                            .populate({
                                path: 'user',
                                select: 'name role'
                            });


    res.json({
        category,
        msg: 'Get Category id since controller'
    })
}

// ! This function works to create a new Category
const createCategory = async(req, res = response) =>{

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if ( categoryDB ) {
      
        return res.status(400).json({
            msg: `La categoria ${ categoryDB.name }, ya existe`
        });
    }

    let userName = req.user.name;

    //! generar la data para guardar 

    const data ={
        name,
        user: req.user._id,
    }

    const category = new Category( data );
    
    // const orderPost = Object.assign(userName, category )
    // ! guardar db

    await category.save();

    res.status(201).json( {category, userName} );
    
}

// ! This function works to update a category

const updateCategory = async(req, res = response) =>{

    const id = req.params.id;

    const {status, user, ... data} = req.body;

    data.name = data.name.toUpperCase();

    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate(id, data, {new: true});

    res.status(201).json({
        category
    })
}

// ! This function works to delete a category

const deleteCategory = async(req, res) =>{

    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(id, {status: false});

    res.json({
        category,
    })
}

module.exports = {
    createCategory,
    getCategorys,
    getCategoryID,
    updateCategory,
    deleteCategory
}