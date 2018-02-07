/**
 * @summary Fichero de configuración de ruta del login
 * @description Fichero en el que se configuran las rutas del login
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 05-02-18
 */

//=======================================================
//Importación de dependencias de node
//=======================================================
//Importación de express
let express = require('express');
//Importacion de bcryptjs para encriptacion de contraseñas
let bcryptjs = require('bcryptjs');
//Importación de la libreria de json web token
let jwt = require('jsonwebtoken');


//============================================================
//Importación de los ficheros de configuración necesarios
//============================================================
//Fichero de configuración del token
let token_config = require('../config/tokenConfig');

//=======================================================
//Importación de los modelos utilizados
//=======================================================
//Importacion del modelo user
let User = require('../models/user');

/**
 * Referencia a express en la variable app
 * @type {*}
 */
let  app = express();

app.post("/",(request,response)=>{

   let body = request.body;

   User.findOne({user_mail:body.user_mail},(error,user_found)=>{

       //Si hay algunerror al ejecutar la funcion de mongoose sera error 500
       if(error){
           return response.status(500).json({
               ok: false,
               message: "Error al buscar el usuario ",
               errors: error
           })
       }

       //En caso de que no se encuentre el usuario con el mail recibido sera un error 400
       if(!user_found){
           return response.status(400).json({
               ok: false,
               message: "No existe ningun usuario con el correo electronico "+body.user_mail,
               errors: error
           })
       }

       //Si se encuentra un usuario con el mail recibido se comprueba la contraseña
       if(user_found){

           //Utilizando la función compareSync() de bcrypts se compara la contraseña enviada en el body con la del usuario encontrado
           if(!bcryptjs.compareSync(body.user_password , user_found.user_password)){
               return response.status(400).json({
                   ok: false,
                   message: "Password incorrecto ",
                   errors: error
               })
           }else{

               //Por motivos de seguridad no se debe de enviar la contraseña del usuario al front. En su lugar se enviara un string con valor "****"
               user_found.user_password = "****";
               //Definicion del token para la sesión del usuario
               let token = jwt.sign({user:user_found},token_config.SEED,{expiresIn:14400});

               return response.status(200).json({
                   ok: true,
                   message: "Correcto ",
                   user: user_found,
                   token:token
               })
           }

       }

   })

});

module.exports = app;


