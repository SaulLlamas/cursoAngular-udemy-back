/**
 * @summary Fichero de configuración de rutas relacionadas con el doctor
 * @description Fichero de configuracion de rutas a las que se va a hacer peticiones relacionanas con el objeto doctor
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

//=======================================================
//Importación de los modelos utilizados
//=======================================================
//Importacion del modelo hospital
let Doctor = require('../models/doctor');



/**
 * Referencia a express en la variable app
 * @type {*}
 */
let  app = express();

//=====================================================================
//Listar todos los doctores
//=====================================================================
//Peticion get
app.get("/",(request,response)=>{

    //para la obtencion de todos los hospitales se utiliza la funcion find sin argumentos
    Doctor.find({})
        .exec(
            (error,doctors)=>{
                if(error){
                    return response.status(500).json({
                        ok:false,
                        message:"Error al obtener datos ",
                        errors:error
                    })
                }else{
                    return response.status(200).json({
                        ok:true,
                        doctors:doctors
                    })
                }
            }
        );
});


//=====================================================================
//Actualizar doctor
//=====================================================================
//petición put
app.put("/:id",mdAuth.verifyToken,(request,response)=>{

    //Obtención del id del doctor que se va ha actualizar mandado como parametro en la URL
    let doctor_id = request.params.id;
    //Obtención de los nuevos valores para el doctor mandados en el cuerpo de la petición
    let body = request.body;

    //Se busca el usuario que se quiere actualizar con la funcion findById()
    Doctor.findById(doctor_id,(error,doctorfound)=> {

        //Si hay un error sera error 500
        if(error){
            return response.status(500).json({
                ok:false,
                message:"Error al buscar el doctor ",
                errors:error
            });
        }

        //Si no ha habido ningun error y no se ha obtenido un doctor  entonces es que no existe
        if(!doctorfound){
            return response.status(404).json({
                ok:false,
                message:"El doctor no se encontro en la base de datos",
            });
        }

        //En caso de que se halla encontrado el doctor con el id especificado
        if(doctorfound){

            //Se comprueba que parametros se han mandado en el body para actualizarlos
            if(body.dctr_dni){
                doctorfound._id = body.dctr_dni;
            }
            if(body.dctr_name){
                doctorfound.dctr_name = body.dctr_name
            }
            if(body.dctr_img){
                doctorfound.dctr_img = body.dctr_img
            }
            if(body.dctr_user){
                doctorfound.dctr_user = body.dctr_user
            }
            if(body.dctr_hospital){
                doctorfound.dctr_hospital = body.dctr_hospital
            }

            //Se aplica la funcion save para guardar los cambios en la base de datos
            doctorfound.save((error , doctorupdated)=>{

                if(error){
                    return response.status(403).json({
                        ok:false,
                        message:"No se pudo actualizar el doctor",
                        errors:error
                    });
                }else{


                    return response.status(200).json({
                        ok:true,
                        message:"doctor con dni  " +doctor_id+" actualizado correctamente",
                        hospital_updated:doctorupdated,
                        updated_by:doctorupdated.user_token
                    });
                }

            })

        }

    })

});



//=====================================================================
//Insertar doctor
//=====================================================================
//petición post
app.post("/",mdAuth.verifyToken,(request,response)=> {
    /**
     * La variable body contiene los parametros enviados en  el duerpo de la petición post
     * Para aceder a los parametros se utiliza request.body
     * @type {*}
     */
    let body = request.body;

    /**
     * Creación de un nuevo objeto doctor basandose en los parametros optenidos del body
     */
    let doctor = new Doctor({
        _id:body.dctr_dni,
        dctr_name:body.dctr_name,
        dctr_img:body.dctr_img,
        dctr_hospital:body.dctr_hospital,
        dctr_user:request.user_token._id
    });
    //Para guardar el hospital creado en la base de datos se utilizara la función save
    doctor.save((error,doctorSaved) => {
        //Si ha habido algun error al guardar el doctor el estado sera error 400 y se devolvera el error en el json de salida
        if (error) {
            return response.status(400).json({
                ok: false,
                message: "Error al guardar el hospital",
                errors: error
            })
            //En caso de que no halla habido ningun error el estado sera 201 y se  devolvera el objeto creado
        } else {

            return response.status(201).json({
                ok: true,
                message: "Doctor "+doctorSaved.dctr_name+" creado correctamente",
                doctor_saved:doctorSaved,
                created_by:request.user_token
            })
        }
    });
});

//============================================================
//Borrar Doctor
//============================================================
app.delete("/:id",mdAuth.verifyToken,(request , response)=>{

    //Obtención del id del doctor que se va ha borrar mandado como parametro en la URL
    let doctor_id = request.params.id;

    Doctor.findByIdAndRemove({_id:doctor_id},(error,doctorDeleted)=>{
        if(error){
            return response.status(500).json({
                ok:false,
                message:"Error al borrar el doctor ",
                errors:error
            });
        }
        if(!doctorDeleted){
            return response.status(404).json({
                ok:false,
                message:"No se pudo encontrar el doctor con el dni " +doctor_id,
                errors:error
            });
        }
        if(doctorDeleted){
            return response.status(200).json({
                ok:true,
                message:"El  doctor con dni "+doctor_id+" se ha borrado correctamente",
                hospital_deleted:doctorDeleted,
                deleted_by:request.user_token
            });
        }
    });

});

//Exportacion del  modulo
module.exports = app;