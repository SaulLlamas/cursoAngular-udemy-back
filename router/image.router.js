/**
 * @summary Fichero de rutas de imagen
 * @description Fichero de rutas al que se haran llamadas desde el cliente para obtener imagenes
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 14-02-18
 */
//=======================================================
//Importación de dependencias de node
//=======================================================
//Importación de express
let express = require('express');
//let file_system  = require('file-system')
//let fs = require('fs');

//============================================================
//Importación de servicios
//============================================================
let image_service = require('../services/image.service');

let  app = express();

//Peticion get
app.get("/:element/:img",image_service.getImage);


module.exports = app;

