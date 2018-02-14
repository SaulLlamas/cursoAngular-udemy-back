/**
 * @summary Fichero de rutas
 * @description Fichero de rutas para obtención de un avatar desde el cliente
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
let fs = require('fs');


let  app = express();

//Peticion get
app.get("/:element/:img",(request,response)=>{

    /**
     * element => elemento al que pertenece la imagen
     * @type {string}
     */
    let elemnet = request.params.element;
    /**
     * img => Imagen del avatar del elemento
     * @type {string}
     */
    let img = request.params.img;

    /**
     * path => path de la imagen
     * @type {string}
     */
    let path = `./upload_files/${elemnet}/${img}`;

    //Si el arvhivo de la imagen no se encuentra se le asignara la imagen por defecto
    if(!fs.existsSync(path)){
        path = './assets/images/no-img.jpg'
    }


    response.sendFile(path,{root:'.'});

});


module.exports = app;

