/**
 * @summary Servicio Doctors
 * @description Se encarga de realizar las operaciones relacionadas con los doctores en la base de datos
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 18-02-18
 */

//=======================================================
//Importación de los modelos utilizados
//=======================================================
//Importacion del modelo hospital
let Doctor = require('../models/doctor');


module.exports.getAllDoctors = (request, response)=>{
    //para la obtencion de todos los doctores se utiliza la funcion find sin argumentos
    Doctor.find({})
    //La funcion populate obtiene los datos de una colección referenciada
        .populate('dctr_user','user_name user_mail')
        .populate('dctr_hospital')
        .exec(
            (error,doctors)=>{
                if(error){
                    return response.status(500).json({
                        ok:false,
                        message:"Error al obtener datos ",
                        errors:error
                    })
                }else{
                    //La funcion count cuenta el numero de documentos obtenidos
                    Doctor.count({},(error,count)=>{
                        return response.status(200).json({
                            ok:true,
                            showed_results:doctors.length,
                            total_results:count,
                            doctors:doctors
                        })
                    });
                }

            }
        );
};

module.exports.paginateDoctors = (request, response)=>{
    /**
     * start => Posicion del array de resultados desde la cual se empieza a listar
     * El valor start es dado como parametro opcional en la url en caso de no existir dicho valor start adquiere el valor 0
     * @type {Number}
     */
    let start = request.query.start || 0;
    start = Number(start);

    //para la obtencion de todos los hospitales se utiliza la funcion find sin argumentos
    Doctor.find({})
    //La funcion populate obtiene los datos de una colección referenciada
        .populate('dctr_user','user_name user_mail')
        .populate('dctr_hospital')
        //La funcion skip salta a la posicion del array de resultados enviada como parametro
        .skip(start)
        //La funcion limit limita el numero de resultados
        .limit(5)
        .exec(
            (error,doctors)=>{
                if(error){
                    return response.status(500).json({
                        ok:false,
                        message:"Error al obtener datos ",
                        errors:error
                    })
                }else{
                    //La funcion count cuenta el numero de documentos obtenidos
                    Doctor.count({},(error,count)=>{
                        return response.status(200).json({
                            ok:true,
                            showed_results:doctors.length,
                            total_results:count,
                            doctors:doctors
                        })
                    });
                }

            }
        );
};

module.exports.getDoctor = (request ,response)=>{

    let id = request.params.id;

    Doctor.findById(id)
    //La funcion populate obtiene los datos de una colección referenciada
        .populate('dctr_user','user_name user_img user_mail')
        .populate('dctr_hospital')
        .exec((error,doctor)=>{

            //Si ha habido un error se manda un estado 500 con el error
            if (error) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar médico',
                    errors: error
                });
            }
            //Si no se encontro el medico el estado es 404
            if (!doctor) {
                return response.status(404).json({
                    ok: false,
                    message: 'El medico no existe'
                })
            }

            if(doctor){
                return response.status(200).json({
                    ok: true,
                    doctor: doctor
                })
            }

        });
};

module.exports.updateDoctors = (request, response)=>{
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
            if(body.dctr_name){
                doctorfound.dctr_name = body.dctr_name
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
                        message:"doctor " +doctor_id+" actualizado correctamente",
                        doctor_updated:doctorupdated,
                        updated_by:doctorupdated.user_token
                    });
                }

            })

        }

    })
};

module.exports.insertDoctors = (request, response)=>{
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
        dctr_name:body.dctr_name,
        dctr_hospital:body.dctr_hospital,
        dctr_user:request.user_token._id
    });
    //Para guardar el hospital creado en la base de datos se utilizara la función save
    doctor.save((error,doctorSaved) => {
        //Si ha habido algun error al guardar el doctor el estado sera error 400 y se devolvera el error en el json de salida
        if (error) {
            return response.status(400).json({
                ok: false,
                message: "Error al guardar el doctor",
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
};


module.exports.deleteDoctors = (request, response)=>{
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
                message:"No se pudo encontrar el doctor ",
                errors:error
            });
        }
        if(doctorDeleted){
            return response.status(200).json({
                ok:true,
                message:"El  doctor  "+doctor_id+" se ha borrado correctamente",
                doctor_deleted:doctorDeleted,
                deleted_by:request.user_token
            });
        }
    });
};
