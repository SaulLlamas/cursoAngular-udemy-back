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

//=======================================================
//Importación de los modelos utilizados
//=======================================================
//Importacion del modelo hospital
let Hospital = require('../models/hospital');

/**
 * Referencia a express en la variable app
 * @type {*}
 */
let  app = express();

//=====================================================================
//Listar todos los hospitales
//=====================================================================
//Peticion get
app.get("/",(request,response)=>{

    /**
     * start => Posicion del array de resultados desde la cual se empieza a listar
     * El valor start es dado como parametro opcional en la url en caso de no existir dicho valor start adquiere el valor 0
     * @type {Number}
     */
    let start = request.query.start || 0;
    start = Number(start);

    //para la obtencion de todos los hospitales se utiliza la funcion find sin argumentos
    Hospital.find({})
        //La funcion populate obtiene los datos de una colección referenciada
        .populate('hosp_user','user_name user_mail')
        //La funcion skip salta a la posicion del array de resultados enviada como parametro
        .skip(start)
        //La funcion limit limita el numero de resultados
        .limit(5)

        .exec(
            (error,hospitals)=>{
                if(error){
                    return response.status(500).json({
                        ok:false,
                        message:"Error al obtener datos ",
                        errors:error
                    })
                }else{
                    //La funcion count cuenta el numero de documentos obtenidos
                    Hospital.count({},(error,count)=>{
                        return response.status(200).json({
                            ok:true,
                            showed_results:hospitals.length,
                            total_results:count,
                            hospitals:hospitals
                        })
                    });
                }
            }
        );
});

//=====================================================================
//Actualizar hospital
//=====================================================================
//petición put
app.put("/:id",mdAuth.verifyToken,(request,response)=>{

    //Obtención del id del hospital que se va ha actualizar mandado como parametro en la URL
    let hospital_id = request.params.id;
    //Obtención de los nuevon valores para el usuario mandados en el cuerpo de la petición
    let body = request.body;


    //Se busca el hospital que se quiere actualizar con la funcion findById()
    Hospital.findById(hospital_id,(error,hospitalfound)=> {

        //Si hay un error sera error 500
        if(error){
            return response.status(500).json({
                ok:false,
                message:"Error al buscar el hospital ",
                errors:error
            });
        }

        //Si no ha habido ningun error y no se ha obtenido un objeto hospital entonces es que no existe
        if(!hospitalfound){
            return response.status(404).json({
                ok:false,
                message:"El hospital no se encontro en la base de datos",
            });
        }

        //En caso de que se halla encontrado el hospital con el id especificado
        if(hospitalfound){

            //Se comprueba que parametros se han mandado en el body para actualizarlos
            if(body.hosp_name){
                hospitalfound.hosp_name = body.hosp_name;
            }
            if(body.hosp_user){
                hospitalfound.hosp_user = body.hosp_user;
            }
            if(body.hosp_city){
                hospitalfound.hosp_city = body.hosp_city;
            }

            if(body.hosp_state){
                hospitalfound.hosp_state = body.hosp_state;
            }

            //Se aplica la funcion save para guardar los cambios en la base de datos
            hospitalfound.save((error , hospitalupdated)=>{

                if(error){
                    return response.status(403).json({
                        ok:false,
                        message:"No se pudo actualizar el hospital",
                        errors:error
                    });
                }else{


                    return response.status(200).json({
                        ok:true,
                        message:"hospital " +hospital_id+" actualizado correctamente",
                        hospital_updated:hospitalupdated,
                        updated_by:request.user_token
                    });
                }

            })

        }

    })

});


//=====================================================================
//Insertar hospital
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
     * Creación de un nuevo objeto hospital basandose en los parametros optenidos del body
     */
    let hospital = new Hospital({
        hosp_name:body.hosp_name,
        hosp_city:body.hosp_city,
        hosp_state:body.hosp_state,
        hosp_user:request.user_token._id
    });
    //Para guardar el hospital creado en la base de datos se utilizara la función save
    hospital.save((error, hospitalSaved) => {
        //Si ha habido algun error al guardar el hospital el estado sera error 400 y se devolvera el error en el json de salida
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
                message: "Hospital "+hospitalSaved.hosp_name+" creado correctamente",
                hospital_saved:hospitalSaved,
                created_by:request.user_token
            })
        }
    });
});

//============================================================
//Borrar Hospital
//============================================================
app.delete("/:id",mdAuth.verifyToken,(request , response)=>{

    //Obtención del id del hospital que se va ha borrar mandado como parametro en la URL
    let hospital_id = request.params.id;

    Hospital.findByIdAndRemove({_id:hospital_id},(error,hospitalDeleted)=>{
        if(error){
            return response.status(500).json({
                ok:false,
                message:"Error al borrar el hospital ",
                errors:error
            });
        }
        if(!hospitalDeleted){
            return response.status(404).json({
                ok:false,
                message:"No se pudo encontrar el hospital con el id " + hospital_id,
                errors:error
            });
        }
        if(hospitalDeleted){
            return response.status(200).json({
                ok:true,
                message:"El  hospital "+hospital_id+" se ha borrado correctamente",
                hospital_deleted:hospitalDeleted,
                deleted_by:request.user_token
            });
        }
    });


});

//Exportacion del  modulo
module.exports = app;