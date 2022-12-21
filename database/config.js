const mongoose = require('mongoose');
require('colors');

const dbConnection = async() =>{

    try {
        mongoose.set("strictQuery", false);
        
        await mongoose.connect( process.env.MONGODB_ATLAS,
            { useNewUrlParser: true, useUnifiedTopology: true},
            (err, res) => {
             if(err){
                 console.log("ERROR AL CONECTAR".red);
                 throw err;
             } 
             console.log('Base de datos online'.green);
            });

        // console.log('Base de datos online'.green);
        

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }


}

module.exports = {
    dbConnection
}