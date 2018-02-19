/**
 * @summary Fichero de configuración para la rutas de busqueda
 * @description Configura las rutas de busquedas en la base de datos
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 10-02-18
 */

//=======================================================
//Importación de dependencias de node
//=======================================================
//Importación de express
let express = require('express');

/**
 * Referencia a express en la variable app
 * @type {*}
 */
let  app = express();

//=======================================================
//Importación de los servicios
//=======================================================
let searchService = require('../services/search.service')



//Pedición get para la busqueda en una coleción concreta
app.get("/collection/:collection/:criteria",searchService.searchByCollection);

//Pedición get para la busqueda en toda la base de datos
app.get("/all/:criteria",searchService.searchInAll);


module.exports = app;