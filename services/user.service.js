/**
 * @summary Servicio User
 * @description Se encarga de realizar las operaciones relacionadas con los usuarios en la base de datos
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 17-02-18
 */

//=======================================================
//Importación de dependencias de node
//=======================================================
//Importacion de bcryptjs para encriptacion de contraseñas
let bcryptjs = require('bcryptjs');


//=======================================================
//Importación de los modelos utilizados
//=======================================================
//Importacion del modelo user
let User = require('../models/user');

module.exports.getAllUsers =(request,response) =>{

    User.find({},'user_name user_mail user_img user_role user_google_auth')
        .exec(
            (error,users)=>{
                if(error){
                    return response.status(500).json({
                        ok:false,
                        message:"Error al obtener datos ",
                        errors:error
                    })
                }else{
                    //La funcion count cuenta el numero de documentos obtenidos
                    User.count({},(error,count)=>{
                        return response.status(200).json({
                            ok:true,
                            showed_results:users.length,
                            total_results:count,
                            users:users
                        })
                    });
                }
            });
};




/**
 * @description Debuelve todos los usuarios paginados
 * @param request
 * @param response
 */
module.exports.paginateUsers = (request ,response)=> {

    /**
     * start => Posicion del array de resultados desde la cual se empieza a listar
     * El valor start es dado como parametro opcional en la url en caso de no existir dicho valor start adquiere el valor 0
     * @type {Number}
     */
    let start = request.query.start || 0;
    start = Number(start);



    User.find({},'user_name user_mail user_img user_role user_google_auth')
    //La funcion skip salta a la posicion del array de resultados enviada como parametro
        .skip(start)
        //La funcion limit limita el numero de resultados
        .limit(5)
        .exec(
            (error,users)=>{
                if(error){
                    return response.status(500).json({
                        ok:false,
                        message:"Error al obtener datos ",
                        errors:error
                    })
                }else{
                    //La funcion count cuenta el numero de documentos obtenidos
                    User.count({},(error,count)=>{
                        return response.status(200).json({
                            ok:true,
                            showed_results:users.length,
                            total_results:count,
                            users:users
                        })
                    });
                }
            });

};

/**
 * Actualiza un usuario de la base de datos
 * @param request
 * @param response
 */
module.exports.updateUser = (request,response)=>{
    //Obtención del id del usuario que se va ha actualizar mandado como parametro en la URL
    let user_id = request.params.id;
    //Obtención de los nuevon valores para el usuario mandados en el cuerpo de la petición
    let body = request.body;

    //Se busca el usuario que se quiere actualizar con la funcion findById()
    User.findById(user_id,(error,userfound)=> {

        //Si hay un error sera error 500
        if(error){
            return response.status(500).json({
                ok:false,
                message:"Error al buscar usuario ",
                errors:error
            });
        }

        //Si no ha habido ningun error y no se ha obtenido un objeto usuario entonces es que no existe
        if(!userfound){
            return response.status(404).json({
                ok:false,
                message:"El usuario con el id "+id+" no se encontro en la base de datos",
            });
        }

        //En caso de que se halla encontrado el usuario con el id especificado
        if(userfound){

            //Se comprueba que parametros se han mandado en el body para actualizarlos
            if(body.user_name){
                userfound.user_name = body.user_name
            }
            if(body.user_mail){
                userfound.user_mail = body.user_mail
            }
            if(body.user_role){
                userfound.user_role = body.user_role
            }

            //Se aplica la funcion save para guardar los cambios en la base de datos
            userfound.save((error , userupdated)=>{

                if(error){
                    return response.status(403).json({
                        ok:false,
                        message:"No se pudo actualizar el usuario "+id+" ",
                        errors:error
                    });
                }else{

                    //La contraseña del usuario nunca se envia al front tal como esta en la base de datos
                    userupdated.user_password = "****";


                    return response.status(200).json({
                        ok:true,
                        message:"usuario " +user_id+" actualizado correctamente",
                        user_updated:userupdated,
                        updated_by:request.user_token
                    });
                }

            })

        }

    })
};


/**
 * @description Guarda un usuario en la base de datos
 * @param request
 * @param response
 */
module.exports.insertUser = (request , response)=>{
    /**
     * La variable body contiene los parametros enviados en  el duerpo de la petición post
     * Para aceder a los parametros se utiliza request.body
     * @type {*}
     */
    let body = request.body;

    /**
     * Creación de un nuevo objeto usuario basandose en los parametros optenidos del body
     */
    let user = new User({
        user_name: body.user_name,
        //Para encriptar la contraseña del usuario se utiliza la funcion hashSync de bcriptjs
        user_password: bcryptjs.hashSync(body.user_password, 10),
        user_mail: body.user_mail,
        user_img: body.user_img,
        user_role: body.user_role
    });
    //Para guardar el usuario creado en la base de datos se utilizara la función save
    user.save((error, userSaved) => {
        //Si ha habido algun error al guardar el usuario el estado sera error 400 y se devolvera el error en el json de salida
        if (error) {
            return response.status(400).json({
                ok: false,
                message: "Error al guardar el usuario",
                errors: error
            })
            //En caso de que no halla habido ningun error el estado sera 200 y se  devolvera el objeto usuario salvado
        } else {

            userSaved.user_password = "****";

            return response.status(201).json({
                ok: true,
                message: "Usuario guardado correctamente",
                user_saved: userSaved,
                created_by:request.user_token
            })
        }
    });
};

/**
 * @description Borrar usuario
 * @param request
 * @param response
 */
module.exports.deleteUser = (request,response)=>{
    //Obtención del id del usuario que se va ha borrar mandado como parametro en la URL
    let user_id = request.params.id;

    User.findByIdAndRemove({_id:user_id},(error,userDeleted)=>{
        if(error){
            return response.status(500).json({
                ok:false,
                message:"Error al borrar usuario ",
                errors:error
            });
        }
        if(!userDeleted){
            return response.status(404).json({
                ok:false,
                message:"No se pudo encontrar en usuario con el id "+user_id,
                errors:error
            });
        }
        if(userDeleted){
            return response.status(200).json({
                ok:true,
                message:"El  usuario "+user_id+" se ha borrado correctamente",
                user_deleted:userDeleted,
                deleted_by:request.user_token
            });
        }
    });
};
