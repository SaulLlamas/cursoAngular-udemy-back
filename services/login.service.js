/**
 * @summary Servicio Login
 * @description Se encarga de realizar las operaciones relacionadas con el login del usuario y el JWT
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 17-02-18
 */

//=======================================================
//Importación de dependencias de node
//=======================================================
//Importacion de bcryptjs para encriptacion de contraseñas
let bcryptjs = require('bcryptjs');
//Importación de la libreria de json web token
let jwt = require('jsonwebtoken');
//libreria para la autentifición de google
let GoogleAuth =  require('google-auth-library');

//========================================================
//Importación de los ficheros de configuración necesarios
//========================================================
//Fichero de configuración del token
let token_config = require('../config/tokenConfig');

//=======================================================
//Importación de los modelos utilizados
//=======================================================
//Importacion del modelo user
let User = require('../models/user');


/**
 * @summary authUser
 * @description Se encarga de generar el JWT si los parámetros de identificación del usuario enviados en la peticion son correctos
 * @param request
 * @param response
 */
module.exports.authUser = (request,response)=>{

    let body = request.body;

    User.findOne({user_mail:body.user_mail},(error,user_found)=>{

        //Si hay algunerror al ejecutar la funcion de mongoose sera error 500
        if(error){
            return response.status(500).json({
                ok: false,
                message: "Error al buscar el usuario ",
                errors: error
            })
        }

        //En caso de que no se encuentre el usuario con el mail recibido sera un error 400
        if(!user_found){
            return response.status(400).json({
                ok: false,
                message: "No existe ningun usuario con el correo electronico "+body.user_mail,
                errors: error
            })
        }

        //Si se encuentra un usuario con el mail recibido se comprueba la contraseña
        if(user_found){

            //Utilizando la función compareSync() de bcrypts se compara la contraseña enviada en el body con la del usuario encontrado
            if(!bcryptjs.compareSync(body.user_password , user_found.user_password)){
                return response.status(400).json({
                    ok: false,
                    message: "Password incorrecto ",
                    errors: error
                })
            }else{

                //Por motivos de seguridad no se debe de enviar la contraseña del usuario al front. En su lugar se enviara un string con valor "****"
                user_found.user_password = "****";
                //Definicion del token para la sesión del usuario
                let token = jwt.sign({user:user_found},token_config.SEED,{expiresIn:'2 days'});

                return response.status(200).json({
                    ok: true,
                    message: "Correcto ",
                    user: user_found,
                    token:token
                })
            }

        }

    })

};

/**
 * @summary authGoogleUser
 * @description se encarga de la autentificacion de los tokens de los usuarios de google y si el usuario de google no existe lo crea
 * @param request
 * @param response
 */
module.exports.authGoogleUser = (request,response)=>{

    let token = request.body.token;

    let auth = new  GoogleAuth;

    let client = new auth.OAuth2(token_config.GA_IDCLIENT,token_config.GA_SECRETCLIENT, '');

    if(token) {

        client.verifyIdToken(token, token_config.GA_IDCLIENT,
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
            function (error, login) {

                if (error) {
                    return response.status(400).json({
                        ok: false,
                        message: "Token no valido",
                        errors: error
                    })
                }

                let payload = login.getPayload();
                let userid = payload['sub'];
                // If request specified a G Suite domain:
                //var domain = payload['hd'];

                User.findOne({user_mail:payload.email},(error, user_found)=>{
                    //Si hubo un error al hacer la busqueda muestro el mensaje de error
                    if(error){
                        return response.status(400).json({
                            ok:false,
                            message: "error al buscar el usuario ",
                            errors: error
                        })
                    }
                    //En caso de que se halla encontrado el usuario se comprueba si la autentificacion es de google
                    if(user_found){
                        //Si el usuario no es de google se lanza un mansage de error 400
                        if(!user_found.user_google_auth) {
                            return response.status(400).json({
                                ok: false,
                                message: "El usuario no esta inscrito como usuario de google en esta aplicación",
                            })
                        }else{

                            //Por motivos de seguridad no se debe de enviar la contraseña del usuario al front. En su lugar se enviara un string con valor "****"
                            user_found.user_password = "****";
                            //Definicion del token para la sesión del usuario
                            let token = jwt.sign({user:user_found},token_config.SEED,{expiresIn:'2 days'});

                            return response.status(200).json({
                                ok: true,
                                message: "Correcto ",
                                user: user_found,
                                token:token
                            })

                        }
                        //Si no hay ningun usuario se crea
                    }else{

                        //Se crea un nuevo usuario con los datos de google
                        let new_user = new  User;

                        new_user.user_name = payload.name;
                        new_user.user_password = "****"
                        new_user.user_mail = payload.email;
                        new_user.user_img = payload.picture;
                        new_user.user_google_auth = true;

                        //Para guardar el usuario creado en la base de datos se utilizara la función save
                        new_user.save((error, userSaved) => {
                            //Si ha habido algun error al guardar el usuario el estado sera error 400 y se devolvera el error en el json de salida
                            if (error) {
                                return response.status(400).json({
                                    ok: false,
                                    message: "Error al guardar el usuario",
                                    errors: error
                                })
                                //En caso de que no halla habido ningun error el estado sera 200 y se  devolvera el objeto usuario guardado
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

                    }

                });




            });
    }
};


