/**
 * @summary middleware de autentificación
 * @description Se encagara de comprobar mediante un token si un usuario esta autorizado a realizar ciertar peticiones
 * @author Saúl Llamas Parra
 * @version 1.0
 * @since 07-02-18
 */
//=======================================================
//Importación de dependencias de node
//=======================================================
//Importación de la libreria de json web token
let jwt = require('jsonwebtoken');

//============================================================
//Importación de los ficheros de configuración necesarios
//============================================================
//Fichero de configuración del token
let token_config = require('../config/tokenConfig');

/**
 * verifyToken()=> Se encarga de verificar si el token enviado en la cabecera de la petición es valido
 * @param request => Petición
 * @param response => Respuesta
 * @param next
 * @return {*}
 */
exports.verifyToken = function (request, response , next) {

    //El token es enviado en el campo authorization de la cabecera
    //Si el campo authorization no tiene valor significa que el usuario no esta autorizado
    if(!request.headers.authorization){
        return response.status(403).json({
            ok:false,
            message:"Aceso denegado",
        });
    }

    //Si el campo authorization  tiene token se guarda el valor en la constante token
    const token = request.headers.authorization;


    jwt.verify(token,token_config.SEED,(error , decoded)=>{
        if(error){
            return response.status(401).json({
                ok: false,
                message: "El token es incorrecto",
                errors: error
            })
        }

        request.user_token = decoded.user;

        next();

    });


};