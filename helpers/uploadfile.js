
const path = require('path'); // ! sirve para decirle donde queremos guardar el archivo
const { v4: uuidv4 } = require('uuid');

const uploadFiles = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '' ) =>{

  return new Promise( (resolve, reject ) => {

      const { archivo } = files;
      const nombreCortado = archivo.name.split('.');
      const extension = nombreCortado[nombreCortado.length -1 ];

      //validar la extension
      if (!extensionesValidas.includes( extension )) {
        return reject(`La extensión ${ extension } no es permitida. Solo puede subir ${ extensionesValidas}`);

      }

      const nombreTemp = uuidv4() + '.' + extension;
      const uploadPath = path.join(__dirname , '../uploads/', carpeta, nombreTemp); //! con el path join dictamo en donde guardar el archivo.

      archivo.mv(uploadPath, (err) => {
        if (err) {
          return reject(err);
        }

        resolve( nombreTemp );
      });

    

  });
    
  
}

module.exports = {
    uploadFiles
}