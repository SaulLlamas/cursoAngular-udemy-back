/**
 * @summary Fichero de rutas relacionadas con los usuarios
 * @description Fichero que tratara las peticiones GET , POST , PUT y DELETE relacionadas con los usuarios
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
//Importacion de servicios
//============================================================
let  userService = require('../services/user.service');

//============================================================
//Importación de middlewares
//============================================================
let mdAuth = require('../middlewares/auth');


/**
 * Referencia a express en la variable app
 * @type {*}
 */
let  app = express();

//Peticion get para obtener los usuarios
app.get("/all",userService.getAllUsers);

//Peticion get para obtener los usuarios paginados
app.get("/",userService.paginateUsers);

//Peticion put para actualizar un usuario existente
app.put("/:id",[mdAuth.verifyToken,mdAuth.verifyPermission],userService.updateUser);

//petición post para agregar un nuevo usuario
app.post("/",userService.insertUser);

//petición delete para borrar el usuario
app.delete("/:id",[mdAuth.verifyToken,mdAuth.verifyPermission],userService.deleteUser);

//Exportacion del  modulo
module.exports = app;