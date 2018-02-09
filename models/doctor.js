/**
 * @summary Modelo de datos doctor
 * @description Fichero que contiene el modelo de datos de mongoose para los doctores
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 08-02-18
 */
//=======================================================
//Importación de dependencias de node
//=======================================================
//Importacion de mongoose
let mongoose = require('mongoose');
//Importación de unique validator de mongoose que permitira validar campos unicos  en mongo
let uniqueValidator = require('mongoose-unique-validator');

/**
 * Schema => Guarda una referencia al modelo Schema de mongoose
 */
const Schema = mongoose.Schema;

//============================================================
//Importacion de modelos de datos que se van a utilizar
//============================================================
/**
 * Importacion del modelo de datos del usuario
 * @type {Model}
 */
const User = mongoose.model("User");
const Hospital  = mongoose.model("Hospital");


const DoctorSchema = Schema({
    //Identificación del doctor
    _id:{
        type:String,
        required:true
    },
    //Nombre completo del doctor
    dctr_name:{
        type:String,
        required:true
    },
    //Imagen
    dctr_img:{
        type:String
    },
    //Hospital al que pertenece el doctor
    dctr_hospital:{
        type:Schema.Types.ObjectId,
        ref:'Hospital',
        required:true
    },
    //Usuario que creo el doctor
    dctr_user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
});

//El Schema utilizara unique validator para la validación
DoctorSchema.plugin(uniqueValidator,{message:"el campo {PATH} debe ser unico"});

//Declaracion del modelo
/*
 La funcion model de mongoose declarara una colecion de Mongodb , para ello recibira 2 parametros
 1.   Nombre de la colección
 2.   Estructura
 */

let  DoctorModel = mongoose.model('Doctor',DoctorSchema);

//Con module export se exporta el modelo del usuario para que se pueda acceder desde fuera
module.exports = DoctorModel;