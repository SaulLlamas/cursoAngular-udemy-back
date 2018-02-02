/**
 * @summary Modelo de datos User
 * @description Fichero que contiene el modelo de datos de mongoose para el usuario
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 02-02-18
 */

//Importacion de mongoose
const mongoose = require('mongoose');

/**
 * Schema => Guarda una referencia al modelo Schema de mongoose
 */
const Schema = mongoose.Schema;

//Estructura de la tabla User
const UserSchema = Schema({
    //Nombre del usuatio
    user_name:{
        type:String,
        required:true
    },
    //Mail del usuario
    user_email:{
        type:String,
        unique:true,
        required:true
    },
    //Contraseña del usuario
    user_passwosd:{
        type:String,
        unique:true,
        required:true
    },
    //Imagen del usuario
    user_img:{
        type:String,
        required:false
    },
    //Role del usuario
    user_role:{
        type:String,
        required:true,
        default:'USER_ROLE'
    }
});

//Declaracion del modelo
/*
La funcion model de mongoose declarara una colecion de Mongodb , para ello recibira 2 parametros
   1.   Nombre de la colección
   2.   Estructura
 */

let  UserModel = mongoose.model('User',UserSchema);

//Con module export se exporta el modelo del usuario para que se pueda acceder desde fuera
module.exports = UserModel;


