/**
 * @summary Fichero de rutas
 * @description Fichero principal de rutas
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 02-02-18
 */
//=======================================================
//Importación de dependencias de node
//=======================================================
//Importación de express
let express = require('express');


let  app = express();

//Peticion get
app.get("/",(request,response)=>{
    response.status(200).json({
        ok:true,
        message:"Petición GET realizada correctamente"
    })
});


module.exports = app;