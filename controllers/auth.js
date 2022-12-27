const { response, json } = require("express");
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async(req, res = response) =>{

    const { mail, pass } = req.body;

    try {

        //VERIFICAR SI EL EMAIL EXISTE
        const user = await User.findOne({ mail });

        if (!user) {
            return res.status(401).json({
                msg: 'User / Pass no son correctos - user'
            })
        }

        //SI EL USUARIO ESTA ACTIVO

        if (!user.status) {
            return res.status(400).json({
                msg: 'User / Pass no son correctos - Estado false'
            })
        }


        //VERIFICAR LA CONTRASEÑA

        const validPass = bcryptjs.compareSync(pass, user.pass);

        if (!validPass) {
            return res.status(400).json({
                msg: 'User / Pass no son correctos - Password aja'
            })
        }


        //GENERAR EL JWT
        const token = await generarJWT( user.id );
        
        res.json({
            user,
            token
            
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Algo salio mal'
        })
    }
    
}

const googleSignIn = async(req, res = response ) =>{
    
    const { id_token } = req.body;
    
    
    try {
        
        const { name, img, mail } = await googleVerify(id_token);

        // ! Verificar si el correo existe
        
        let user = await User.findOne({ mail });
        
        if (!user) {
            
            const data = {
                name,
                mail,
                pass: '456',
                img,
                role: 'ADMIN_ROLE',
                google: true
            };
            
            user = new User( data );
            await user.save();
        }
        
        // ! Si existe en DB
        
        if (!user.status) {
          return res.status(401).json({
              msg: 'Hable con el administrador, usuario bloqueado'
            });
        }
        
        // ! Generar jason web token
        
        const token = await generarJWT( user.id );
        
        res.json({
            user,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}