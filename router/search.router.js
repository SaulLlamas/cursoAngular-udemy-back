/**
 * @summary Fichero de configuración para la rutas de busqueda
 * @description Configura las rutas de busquedas en la base de datos basandose en criterios de busqueda recibidos como parametro en las peticiones
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 10-02-18
 */

//=======================================================
//Importación de dependencias de node
//=======================================================
//Importación de express
let express = require('express');

/**
 * Referencia a express en la variable app
 * @type {*}
 */
let  app = express();

//=======================================================
//Importación de los modelos utilizados
//=======================================================
//Importación del modelo Hospital
let Hospital = require('../models/hospital');
//Importación del modelo Doctor
let Doctor = require('../models/doctor');
//Importación del modelo User
let User = require('../models/user');



//============================================================
//Busqueda por coleción
//============================================================
app.get("/collection/:collection/:criteria",(request,response)=>{

    /**
     * collection => Contiene la coleción donde se va ha realizar la busqueda (Obtenida de los parametros de la ruta)
     * @type {*}
     */
    let collection = request.params.collection;

    /**
     * search_criteria => Contiene el criterio de busqueda (Obtenido de los parametros de la ruta)
     * @type {*}
     */
    let search_criteria = request.params.criteria;

    /**
     * regexp => Contiene la expresion regular para el criterio de busqueda
     * @type {RegExp}
     */
    let regexp = new RegExp(search_criteria,'i');

    //Declaracion de la variable promise que contendra la promesa inicialiciandola a un valor nulo
    let promise

    //La promesa utilizada en la busqueda depende del valor de collection
    switch(collection){
        //Si el valor es hospitals se utilizara la promesa para la busqueda de  hospitales
        case 'hospitals':

            promise = searchHospitals(search_criteria,regexp);

            break;

        //Si el valor es doctors se utilizara la promesa para la busqueda de medicos
        case 'doctors':

            promise = searchDoctors(search_criteria,regexp);

            break;

        //Si el valor es users se utilizara la promesa para la busqueda de usuarios
        case  'users':

            promise = searchUsers(search_criteria,regexp);

            break;

        default:

            return  response.status(400).json({
                ok:false,
                message:"Coleción no valida para la busqueda"
            })

    }


    promise.then(data =>{

        return  response.status(200).json({
            ok:true,
            resulrs:data.length,
            [collection]:data
        })

    })







});

//============================================================
//Buscar en toda la base de datos
//============================================================
//Peticion get
//La siguiente ruta recibe como parametro un criterio de busqueda que compara con algunos valores de la base de datos
app.get("/all/:criteria",(request,response)=>{

    //Obtencion el criterio de busqueda
    let search_criteria = request.params.criteria;

    //Creacion de la expresion regular por la que se va a hacer la busqueda
    let regexp = new RegExp(search_criteria,"i");


    //Promise.all ejecuta un conjunto de promesas
    Promise.all([
            SearchHospitals(search_criteria,regexp),
            SearchDoctors(search_criteria,regexp),
            searchUsers(search_criteria,regexp)
        ]).then(results=>{

            response.status(200).json({
                ok:true,
                hospitals:results[0],
                doctors:results[1],
                users:results[2]
            })

        });

});

/**
 * searhHospitals() => Devuelve una promesa con los hospitales cuyo nombre tienen alguna cuencidencia un criterio de busquda
 * @param search_criteria => Criterio de busqueda
 * @param regexp => Criterio de busqueta en forma de expresión regular
 * @return {Promise}
 */
function searchHospitals(search_criteria , regexp){

    return new  Promise((resolve, reject)=>{

        Hospital.find({hosp_name:regexp})
            //La funcion populate obtiene los datos de una colección referenciada
            .populate('hosp_user','user_name user_mail')
            .exec((error,hospitalsFound)=>{

                if(error){
                    reject('Error al cargar los hospitales: '+ error)
                }else{

                    resolve(hospitalsFound)

                }

            });

    });

}

/**
 * searhDoctors() => Devuelve una promesa con los doctores cuyo nombre tienen alguna cuencidencia un criterio de busquda
 * @param search_criteria => Criterio de busqueda
 * @param regexp => Criterio de busqueta en forma de expresión regular
 * @return {Promise}
 */
function searchDoctors(search_criteria , regexp){

    return new  Promise((resolve, reject)=>{

        Doctor.find({dctr_name:regexp})
            //La funcion populate obtiene los datos de una colección referenciada
            .populate('dctr_user','user_name user_mail')
            .populate('dctr_hospital')
            .exec((error,doctorsFound)=>{

                if(error){
                    reject('Error al cargar los doctores: '+ error);
                }else{
                    resolve(doctorsFound);
                }

            });

    });

}

/**
 * SearchUsers() => Devuelve una promesa con los usuarios cuyo nombre o correo electronico tienen alguna cuencidencia un criterio de busquda
 * @param search_criteria => Criterio de busqueda
 * @param regexp => Criterio de busqueta en forma de expresión regular
 * @return {Promise}
 */
function searchUsers(search_criteria , regexp){

    return new  Promise((resolve, reject)=>{

        User.find({},'user_name user_mail user_role')
            .or([{user_name:regexp} , {user_mail:regexp}])
            .exec((error,usersFound)=>{

                if(error){
                    reject('Error al cargar los doctores: '+ error);
                }else{
                    resolve(usersFound);
                }

            });

    });

}

module.exports = app;