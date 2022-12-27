const { response } = require("express");

const validateAdminRole = (req , res = response, next) =>{

    if (!req.user) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        })
    }
    
    const { role, name} = req.user;
    // console.log(role);
    
    if ( role !== 'ADMIN_ROLE') {
        
        return res.status(401).json({
            msg: `${name}: no es admin`
        })
    }

    next();

}

const haveRole = ( ...roles ) =>{

    return (req , res = response, next) =>{

        if (!req.user) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }

        if(!roles.includes( req.user.role)){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            })
        }
        console.log(roles);
        next();
    }

}

module.exports = {
    validateAdminRole,
    haveRole
}