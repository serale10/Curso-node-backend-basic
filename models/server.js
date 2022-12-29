const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {

    constructor(){

        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            categorys: '/api/categorys',
            products: '/api/products',
            search: '/api/search'
        }


        //conectar a base de datos
        this.connectionDB();

        //middlewares 
        this.middlewares();

        //rutas aplicacion

        this.routes();
    }

    async connectionDB(){

       await dbConnection();
    }

    middlewares(){

        //cors
        this.app.use(cors());

        // parseo y lectura del body
        this.app.use( express.json() );

        //directorio publico
        this.app.use(express.static('public'));

        //
    }

    routes(){

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/user'));
        this.app.use(this.paths.categorys, require('../routes/categorys'));
        this.app.use(this.paths.products, require('../routes/product'));
        this.app.use(this.paths.search, require('../routes/search'));
    }

    listen(){
        this.app.listen(this.port, () =>{
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;