/**
 * @summary Fichero de rutas relacionadas con los hospitales
 * @description Fichero que tratara las peticiones GET , POST , PUT y DELETE relacionadas con los hospitales
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 02-02-18
 */

//=======================================================
//Importación de dependencias de node
//=======================================================
//Importación de express
let express = require('express');


//============================================================
//Importación de middlewares
//============================================================
//Middleware de autentificación
let mdAuth = require('../middlewares/auth');

//============================================================
//Importación de middlewares
//============================================================
let hospital_service = require('../services/hospital.service');

 /**
 * Referencia a express en la variable app
 * @type {*}
 */
let  app = express();

//Peticion get para obtener los hospitales
app.get("/all",hospital_service.getAllHospitals);

//Peticion get para obtener los hospitales paginados
app.get("/",hospital_service.paginateHospitals);

//peticion para obtener un hospital
app.get("/:id",hospital_service.getHospital);

//Peticion put para actualizar un hospital existente
app.put("/:id",mdAuth.verifyToken,hospital_service.updateHospital);

//petición post para agregar un nuevo hospital
app.post("/",mdAuth.verifyToken,hospital_service.insertHospital);

//petición delete para borrar el hospital
app.delete("/:id",mdAuth.verifyToken,hospital_service.deleteHospital);

//Exportacion del  modulo
module.exports = app;