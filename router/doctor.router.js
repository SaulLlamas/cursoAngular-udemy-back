/**
 * @summary Fichero de rutas relacionadas con los doctores
 * @description Fichero que tratara las peticiones GET , POST , PUT y DELETE relacionadas con los doctores
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 09-02-18
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
//Importacion de servicios
//============================================================
let  doctorService = require('../services/doctor.service');



/**
 * Referencia a express en la variable app
 * @type {*}
 */
let  app = express();

//Peticion get para obtener los doctores
app.get("/all",doctorService.getAllDoctors);

//Peticion get para obtener los doctores paginados
app.get("/",doctorService.paginateDoctors);

//Peticion put para actualizar un doctor existente
app.put("/:id",mdAuth.verifyToken,doctorService.updateDoctors);

//petición post para agregar un nuevo doctor
app.post("/",mdAuth.verifyToken,doctorService.insertDoctors);

//petición delete para borrar el doctor
app.delete("/:id",mdAuth.verifyToken,doctorService.deleteDoctors);

//Exportacion del  modulo
module.exports = app;