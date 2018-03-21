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

//============================================================
//Importacion de servicios
//============================================================
//Importación del servicio de login
let login_service = require('../services/login.service')

/**
 * Referencia a express en la variable app
 * @type {*}
 */
let  app = express();



//Autentificación normal
app.post("/",login_service.authUser);

//Autentificación con cuenta de google
app.post('/google',login_service.authGoogleUser);


module.exports = app;


