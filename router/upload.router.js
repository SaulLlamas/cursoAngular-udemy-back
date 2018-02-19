/**
 * @summary Fichero de rutas para subir archivos
 * @description Fichero que tratara las rutas que se utilizaran para la subida de archivos al servidor
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 11-02-18
 */

//=======================================================
//Importación de dependencias de node
//=======================================================
//Importación de express
let express = require('express');
//Importacion de la libreria de express que permitira subir archivos
let fileupload = require('express-fileupload');
// Importación de las depaendencias para tratar con el sistema de archivos
//let file_system  = require('file-system')
let fs = require('fs');

//============================================================
//Importación de middlewares
//============================================================
//Middleware de autentificación
let mdAuth = require('../middlewares/auth');


//============================================================
//Importación de servicios
//============================================================
let uploadImgService = require('../services/uploadImg.service')

/**
 * Referencia a express en la variable app
 * @type {*}
 */
let  app = express();

app.use(fileupload());


//Peticion put para subir el archivo
app.put("/:element/:id",mdAuth.verifyToken,uploadImgService.uploadImage);





module.exports = app;


