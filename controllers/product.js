const { response } = require('express');
const Product = require('../models/product');

// ! controller post product
const createProduct = async(req, res = response) =>{

    const { status, ...data } = req.body;

    // ! aca para mandar el nombre en uppercase se saca del objeto de arriba
    // ! ya no se puede mandar en el objeto de datas
    const name = data.name.toUpperCase();

    const existName = await Product.findOne({ name });                            

    if (existName) {
        
        return res.status(409).json({
            msg: `El producto ${existName}, ya existe.`
        })
    }

    const datas = {
        ...data,
        name,
        user: req.user._id,
    }

    const product = new Product( datas );

    await product.save();


    res.status(201).json(product);
}

// ! controller get products
const getProducts = async(req, res = response) =>{

    // ! aca le vamos a poner un limite a mostrar y desde donde
    const { limite = 5, desde = 0 } = req.query;
    
    // !obtenemos el estado de la categoria
    // ! En esta variable se almacena cuantos registros estan en true
    const status = { status: true }

    // todo Este sirve para traer todos los productos, pero no lo utilizaremos
    // todo, porque vamos a traer solo los de estado true
    // const product = await Product.find();

    const [total, product] = await Promise.all([// ? promise.all hace las 2 promesas al mismo tiempo, el conteo y la busqueda; el await se agrega porque no queremos que se ejecute el response antes de tiempo.

        // ! Aqui cuenta cuantas categorias estan en true
        // todo arriba se hace la variable para contarla

        Product.countDocuments(status),

        // ! Aca el find busca todas las categorias que estan en true y las despliega
        Product.find( status )
        .populate({
            path: "user category",
            select: 'name',  
        })
        .skip(Number(desde)) // ? skip significa que mandara apartir del numero que uno quiera, arriba esta la query
        .limit(Number(limite))

    ])

    res.status(202).json({
        total,
        product
    })
}

// ! controller get products by id

const getProductsID = async( req, res = response ) =>{

    const { id } = req.params;
    

    const product = await Product.findById( id )
                            .populate({
                                path: 'user category',
                                select: 'name'
                            });


    res.json(product)
}

// ! controller update products

const updateProducts = async( req, res = response ) =>{
    
    const { id } = req.params;

    const {status, user, ...data} = req.body;

    if (data.name) {
        // ! se pone adentro de un if para que lo capitalice solo si existe
        data.name = data.name.toUpperCase();
    }

    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, {new: true});
    // ! mandamos la respuesta de lo que se actualizo
    res.status(201).json(product);
}

// ! controller delete products
const deleteProduct = async( req, res = response) =>{

    // ! hacemos una constante id y pequidmos el request 'req' y sus parametros 'params'
    // ! al ingresar el id con llaves { id } estamos desestructurando
    // ! tambien se puede hacer asi const id = req.params.id;
    
    const { id } = req.params;

    console.log(id);

    const product = await Product.findByIdAndUpdate(id, { status: false } , { new: true });

    res.status(200).json({
        product
    })
}

module.exports = {
    createProduct,
    getProducts,
    getProductsID,
    updateProducts,
    deleteProduct
}