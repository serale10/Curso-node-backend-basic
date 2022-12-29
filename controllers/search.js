const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const User = require('../models/user');
const Product = require('../models/product');
const Category = require("../models/category");



const colectionAllowed = [
    'usuarios',
    'categorys',
    'products',
    'productsbycategory',
    'roles'
];

const searchUsers = async( term = '', res = response ) =>{

    const mongooID = ObjectId.isValid( term );

    if ( mongooID ) {
        const user = await User.findById( term );

        return res.json({
            results: (user) ? [ user ] : []
        })
        
    }

    const regex = new RegExp( term, 'i' );

    const user = await User.find({ 
        
        $or: [{name: regex }, { mail: regex}],
        $and: [{ status: true}]
    });

    res.json({
        results: user
    })

}

const searchCategory = async( term = '', res = response ) =>{

    const mongooID = ObjectId.isValid( term );

    if ( mongooID ) {
        const category = await Product.findById( term );

        return res.json({
            results: (category) ? [ category ] : []
        })
        
    }

    const regex = new RegExp( term, 'i' );

    const category = await Product.find({ name: regex, status: true});

    res.json({
        results: category
    })

}

const searchProduct = async( term = '', res = response ) =>{

    const mongooID = ObjectId.isValid( term );

    if ( mongooID ) {
        const product = await Product.findById( term )
                        .populate('category', 'name');

        return res.json({
            results: (product) ? [ product ] : []
        })
        
    }

    const regex = new RegExp( term, 'i' );


    const product = await Product.find({ name: regex, status: true})
                                .populate('category', 'name');

    res.json({
        results: product
    })

}

productsByCategory = async (term = '', res = response) => {
 
    const isMongoId = ObjectId.isValid(term); // true or false
 
    if (isMongoId) {
        const category = await Category.findById(term);
        return res.json({
            results: (category) ? [category] : []
        })
    }
    const regex = RegExp(term, 'i'); //sera una busqueda insensible (no estricta)

    // ! validacion para que no este vacio
    if(term === ''){
        res.json({
            msg: 'Debe ingresar una búsqueda'
        })
    }
   
    const category = await Category.find({
        $or: [{ name: regex }, { mail: regex }],
        $and: [{ status: true }]
    })

    if(!category[0] ){
        return res.status(400).json({
            msg: 'Esta categoría no existe'
        })
    }

    const products =  await Product.find({category: category[0]._id}).populate('category','name').populate('user','name')
    if(!products[0] ){
        return res.status(400).json({
            msg: 'No se encontraron productos'
        })
    }

    res.json({
        results: products
    })
}




const search = ( req, res = response) =>{

    // ! aca ponemos los parametros que declaramos en el search routes
    // ! colection de 'categorys, products or user'; term, cualquier objeto que tenga adentro
    const { colection, term } = req.params;

    if (!colectionAllowed.includes(colection)) {
     
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ colectionAllowed }`
        });

    }

    switch (colection){

        case 'usuarios':
            searchUsers(term, res);
            break;
        case 'categorys':
            searchCategory(term, res);
            break;
        case 'products':
            searchProduct(term, res);
            break;
        case 'productsbycategory':
            productsByCategory(term, res);
            break;

        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })

    }

}

module.exports = {
    search
}