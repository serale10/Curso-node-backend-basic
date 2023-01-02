
const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { uploadFiles } = require('../helpers/uploadfile');
const Product = require('../models/product');
const User = require('../models/user')
const cloudinary = require('cloudinary').v2;

cloudinary.config( process.env.CLOUDINARY_URL );


const uploadFile = async(req, res = response) =>{
  
  try {
 
  //const extensiones = ['txt', 'md'];
  const name = await uploadFiles( req.files, undefined, 'imgs' );

  res.json({ name });
    
  } catch (msg) {
    
    res.status(400).json({msg});
  }

}

const updateImage = async(req, res = response) =>{

  const { id, colection } = req.params;

  let model;

  switch (colection) {
    case 'usuarios':
      model = await User.findById(id);
        if (!model) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${ id }`
          });
        }

      break;

    case 'products':
      model = await Product.findById(id);
        if (!model) {
          return res.status(400).json({
            msg: `No existe un producto con el id ${ id }`
          });
        }

      break;
  
    default:
        return res.status(500).json({ msg: 'Se me olvidó validar esto'});
  }

  // Limpiar imagenes previas

  if ( model.img ) {
    // Hay que borrar la imagen del servidor

    const pathImage = path.join( __dirname, '../uploads', colection, model.img );

    if (fs.existsSync( pathImage )) {
        fs.unlinkSync( pathImage );
    }
  }

  const name = await uploadFiles( req.files, undefined, colection );
  model.img = name;

  await model.save();

  res.json( model );

}

const showImage = async(req, res = response) =>{

  const { id, colection } = req.params;

  let model;

  switch (colection) {
    case 'usuarios':
      model = await User.findById(id);
        if (!model) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${ id }`
          });
        }

      break;

    case 'products':
      model = await Product.findById(id);
        if (!model) {
          return res.status(400).json({
            msg: `No existe un producto con el id ${ id }`
          });
        }

      break;
  
    default:
        return res.status(500).json({ msg: 'Se me olvidó validar esto'});
  }

  // Limpiar imagenes previas

  if ( model.img ) {
    // Hay que borrar la imagen del servidor

    const pathImage = path.join( __dirname, '../uploads', colection, model.img );

    if (fs.existsSync( pathImage )) {
        return res.sendFile( pathImage );
    }
  }

  const notImage = path.join( __dirname, '../assets/no-image.jpg' );

  res.sendFile( notImage );


}

const updateImageCloudinary = async(req, res = response) =>{

  const { id, colection } = req.params;

  let model;

  switch (colection) {
    case 'usuarios':
      model = await User.findById(id);
        if (!model) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${ id }`
          });
        }

      break;

    case 'products':
      model = await Product.findById(id);
        if (!model) {
          return res.status(400).json({
            msg: `No existe un producto con el id ${ id }`
          });
        }

      break;
  
    default:
        return res.status(500).json({ msg: 'Se me olvidó validar esto'});
  }

  // Limpiar imagenes previas

  if ( model.img ) {

    const nameArr = model.img.split('/');

    const name = nameArr[ nameArr.length -1 ];

    const [ public_id ] = name.split('.');

    await cloudinary.uploader.destroy(public_id);
  }

  // console.log(req.files.archivo);

  const { tempFilePath } = req.files.archivo;

  const { secure_url } = await cloudinary.uploader.upload( tempFilePath);


  model.img = secure_url;

  await model.save();

  res.json( model );

}
  

module.exports = {
    uploadFile,
    updateImage,
    showImage,
    updateImageCloudinary
}