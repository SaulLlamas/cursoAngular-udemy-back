/**
 * @summary Modelo de datos User
 * @description Fichero que contiene el modelo de datos de mongoose para el usuario
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 02-02-18
 */
//=======================================================
//Importación de dependencias de node
//=======================================================
//Importacion de mongoose
let mongoose = require('mongoose');
//Importación de unique validator de mongoose que permitira validar campos unicos  en mongo
let uniqueValidator = require('mongoose-unique-validator');

/**
 * validRoles => variable que guarda un objeto que valida el valor del campo user_role del Schema del usuario
 * @type {{values: [*], message: string}}
 */
let validRoles = {
  values:['normal','admin'],
  message:'El valor {VALUE} no es valido para {PATH}'
};

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
    //Sexo del usuario
    user_sex:{
        type:String
    },
    //Mail del usuario
    user_mail:{
        type:String,
        unique:true,
        required:true
    },
    //Contraseña del usuario
    user_password:{
        type:String,
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
        default:'normal',
        enum:validRoles
    },
    user_google_auth:{
        type:Boolean,
        required:true,
        default:false
    }
});

//El Schema utilizara unique validator para la validación
UserSchema.plugin(uniqueValidator,{message:"el campo {PATH} debe ser unico"});

//Declaracion del modelo
/*
La funcion model de mongoose declarara una colecion de Mongodb , para ello recibira 2 parametros
   1.   Nombre de la colección
   2.   Estructura
 */

let  UserModel = mongoose.model('User',UserSchema);

//Con module export se exporta el modelo del usuario para que se pueda acceder desde fuera
module.exports = UserModel;


