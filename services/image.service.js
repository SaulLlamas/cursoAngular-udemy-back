/**
 * Created by Saul on 19/02/2018.
 */

//============================================================
//Importacion de dependencias
//============================================================
//Sistema de archivos
let fs = require('fs');

/**
 * @summary getImage
 * @description devuelve una imagen de un elemento y si no la encuentra le asigna una imagen por defacto
 * @param request
 * @param response
 */
module.exports.getImage = (request,response)=>{
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

};