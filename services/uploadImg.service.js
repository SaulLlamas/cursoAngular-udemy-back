/**
 * @summary Servicio uploadImg
 * @description Servico utilizado para el cambio de la imagen de un elemento
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 18-02-18
 */

//=======================================================
//Importación de dependencias de node
//=======================================================
let fileupload = require('express-fileupload');
// Importación de las depaendencias para tratar con el sistema de archivos
//let file_system  = require('file-system')
let fs = require('fs');

//=======================================================
//Importación de los modelos utilizados
//=======================================================
//Importación del modelo Hospital
let Hospital = require('../models/hospital');
//Importación del modelo Doctor
let Doctor = require('../models/doctor');
//Importación del modelo User
let User = require('../models/user');


/**
 * @summary uploadImage
 * @description se encarga de comprobar que el formato de la imagen es correcto y subirla al servidor
 * @param request
 * @param response
 * @return {*}
 */
module.exports.uploadImage = (request,response)=>{
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
         * @summary file_upload_name
         * @description nombre del archivo en el que se guardara la imagen subida obtenido de concatenar el id del elemnto con los milisegundos
         * de las fechas
         * @type {string}
         */
        let  file_upload_name = `${id}-${new Date().getMilliseconds()}.${extension}`;

        /**
         * @summary path
         * @description path donde se guardara la imagen en el back-end
         * @type {string}
         */
        let path = `./upload_files/${element}/${file_upload_name}`;



        file_upload.mv(path,error =>{

            if(error) {
                return response.status(500).json({
                    ok: false,
                    message: 'error al mover el archivo',
                    errors: error
                })
            }else{

                updateImageIndb(element,id,file_upload_name,response);

            }

        });

    }
};


/**
 * @summary updateImageIndb
 * @description Se ejecuta despues de subir la imagen al servidor y se encarga de actualizar la imagen en la base de datos
 * @param collection => colecion de la base de datos que se va a actualizar
 * @param document_id => identificación del documento donde se va a actualizar la imagen
 * @param file_name => nuevo valor para el nombre del archivo de la imagen
 * @param response
 */
function updateImageIndb(collection , document_id , file_name , response ) {

    /**
     * oldpath => guarda el path de la imagen que se va a cambiar
     * @type {string}
     */
    let oldpath = "" ;


    switch(collection){

        case 'doctors':

            //Se busca en la colecion dostors el doctor con el id espeficicado en los parametros de la función
            Doctor.findById(document_id,(error , doctor_found)=> {

                //Si ha habido un error al realizar la conexion sera error 500
                if (error) {
                    return response.status(500).json({
                        ok: false,
                        message: "Error al buscar el doctor",
                        errors: error
                    });
                }

                //Si no se ha encontrado el doctor para actualizar sera error 400
                if (!doctor_found) {
                    return response.status(400).json({
                        ok: false,
                        message: "No ha podido cambiar la imagen porque no se encontro el doctor",
                        errors: error
                    });
                }

                //Si se encontro el doctor se procede a la actualizacion de la imagen
                if(doctor_found){

                    oldpath = "./upload_files/doctors/"+doctor_found.dctr_img;

                    //Ufilizando el sistema de archivos se combrueba si existe algun archivo con el path guardado en oldpath
                    if(fs.existsSync(oldpath)){
                        ///Si existe el archivo se borra
                        fs.unlink(oldpath,error =>{
                            //Si huho un error al borrar la imagen antigua se manda el error
                            if(error){
                                return response.status(500).json({
                                    ok: false,
                                    message: "Error al actualizar la imagen en el sistema de archivos del servidor",
                                    errors: error
                                });
                            }
                        });
                    }


                    doctor_found.dctr_img = file_name;

                    doctor_found.save((error,doctor_updated) =>{

                        if(error){
                            return response.status(500).json({
                                ok: false,
                                message: "Error al guardar imagen en la dase de datos",
                                errors: error
                            });
                        }else {

                            return response.status(200).json({
                                ok: true,
                                message: "Imagen actualizada correctamente",
                                doctor_updated: doctor_updated
                            });

                        }

                    })

                }

            });

            break;

        case 'hospitals':

            //Se busca en la colecion hospitals el hospital con el id espeficicado en los parametros de la función
            Hospital.findById(document_id,(error , hospital_found)=> {

                //Si ha habido un error al realizar la conexion sera error 500
                if (error) {
                    return response.status(500).json({
                        ok: false,
                        message: "Error al buscar el hospital",
                        errors: error
                    });
                }

                //Si no se ha encontrado el doctor para actualizar sera error 400
                if (!hospital_found) {
                    return response.status(400).json({
                        ok: false,
                        message: "No ha podido cambiar la imagen porque no se encontro el hospital",
                        errors: error
                    });
                }

                //Si se encontro el hospital se procede al cambio de la imagen
                if(hospital_found){

                    oldpath = "./upload_files/hospitals/"+hospital_found.hosp_img;

                    //Ufilizando el sistema de archivos se combrueba si existe algun archivo con el path guardado en oldpath
                    if(fs.existsSync(oldpath)){
                        ///Si existe el archivo se borra
                        fs.unlink(oldpath,error =>{
                            //Si huho un error al borrar la imagen antigua se manda el error
                            if(error){
                                return response.status(500).json({
                                    ok: false,
                                    message: "Error al actualizar la imagen en el sistema de archivos del servidor",
                                    errors: error
                                });
                            }
                        });
                    }


                    hospital_found.hosp_img = file_name;

                    hospital_found.save((error,hospital_updated) =>{

                        if(error){
                            return response.status(500).json({
                                ok: false,
                                message: "Error al guardar imagen en la dase de datos",
                                errors: error
                            });
                        }else {

                            return response.status(200).json({
                                ok: true,
                                message: "Imagen actualizada correctamente",
                                hospital_updated:hospital_updated
                            });

                        }

                    })

                }

            });

            break;

        case 'users':


            //Se busca en la colecion users el usuario con el id espeficicado en los parametros de la función
            User.findById(document_id,(error , user_found)=> {

                //Si ha habido un error al realizar la conexion sera error 500
                if (error) {
                    return response.status(500).json({
                        ok: false,
                        message: "Error al buscar el usuario",
                        errors: error
                    });
                }

                //Si no se ha encontrado el doctor para actualizar sera error 400
                if (!user_found) {
                    return response.status(400).json({
                        ok: false,
                        message: "No ha podido cambiar la imagen porque no se encontro el usuario",
                        errors: error
                    });
                }

                //Si se encontro el usuario se procede al cambio de la imagen
                if(user_found){

                    oldpath = "./upload_files/users/"+user_found.user_img;

                    //Ufilizando el sistema de archivos se combrueba si existe algun archivo con el path guardado en oldpath
                    if(fs.existsSync(oldpath)){
                        ///Si existe el archivo se borra
                        fs.unlink(oldpath,error =>{
                            //Si huho un error al borrar la imagen antigua se manda el error
                            if(error){
                                return response.status(500).json({
                                    ok: false,
                                    message: "Error al actualizar la imagen en el sistema de archivos del servidor",
                                    errors: error
                                });
                            }
                        });
                    }

                    user_found.user_img = file_name;

                    user_found.save((error,user_updated) =>{

                        if(error){
                            return response.status(500).json({
                                ok: false,
                                message: "Error al guardar imagen en la dase de datos",
                                errors: error
                            });
                        }else {

                            user_updated.user_password="****";

                            return response.status(200).json({
                                ok: true,
                                message: "Imagen actualizada correctamente",
                                user_updated:user_updated
                            });

                        }

                    })

                }

            });

            break;

    }

}