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


//============================================================
//Importación de middlewares
//============================================================
//Middleware de autentificación
let mdAuth = require('../middlewares/auth');


/**
 * Referencia a express en la variable app
 * @type {*}
 */
let  app = express();

app.use(fileupload());


//Peticion put para subir el archivo
app.put("/:element/:id",(request,response)=>{

    /**
     * elemento => Elemento al cual se quiere subir la imagen que puede ser un medico , un hospital y un usuario
     * @type {string}
     */
    let element = request.params.element;

    /**
     * valid_extensions => Es una array que guarda los elementos validos que se pueden introducir como parametro en la url
     * @type {[string]}
     */
    let valid_elements = ['doctors','hospitals','users'];

    //La función indexOf busca el valor del elemento en el array valid_elements si no esta dicho valor se manda un error 400
    if(valid_elements.indexOf(element) < 0){
       return response.status(400).json({
            ok: false,
            message:'elemento no valido',
            errors:{message:'Los elementos a los que se pueden asignar una imagen son '+ valid_elements.join(' , ')}
        })
    }



    /**
     * Identificacion del elemento al que se le va a asignar la imagen
     * @type {string}
     */
    let id = request.params.id;

    //Si no se ha encontrado ningun archivo se manda un error 404
    if(!request.files){
        return response.status(404).json({
            ok:false,
            message:"No se encuentraron archivos para subir",
            error: {
                message:"Debes selecionar una imagen"
            }
        })
    }else {

        /**
         * file_upload => Guarda el archivo subido en la peticion put
         * @type {File}
         */
        let file_upload= request.files.image;

        /**
         * file_name_cut => array obtenido de partir el nombre del archivo en varias partes con la funcion split
         * @type {Array}
         */
        let file_name_cut = file_upload.name.split('.');

        /**
         * extension => extension del archivo
         * @type {string}
         */
        let extension = file_name_cut[file_name_cut.length - 1];

        /**
         * valid_extensions => Es una array que guarda las extensiones validas para las imagenes
         * @type {[string]}
         */
        let valid_extensions = ['png','jpg','gif','jpeg'];


        //La función indexOf busca el valor de la extensión en el array valid_extensions si no esta dicho valor se manda un error 400
        if(valid_extensions.indexOf(extension) < 0){
             return response.status(400).json({
                ok: false,
                message:'Formato de imagen no válido',
                errors:{message:'Los formatos de imagen validos son '+ valid_extensions.join(' , ')}
            })
        }

        /**
         * file_upload_name => nombre del archivo en el que se guardara la imagen subida obtenido de concatenar el id del elemnto con los milisegundos
         * de las fechas
         * @type {string}
         */
        let  file_upload_name = `${id}-${new Date().getMilliseconds()}.${extension}`;

        /**
         * path => path donde se guardara la imagen en el back-end
         * @type {string}
         */
        let path = `./upload_files/${element}/${file_upload_name}`;



        file_upload.mv(path,error =>{
            return response.status(500).json({
                ok: false,
                message:'error al mover el archivo',
                errors: error
            })
        });

        return response.status(200).json({
            ok: false,
            message:'Archivo subido correctamente',
        })


    }

});


module.exports = app;


