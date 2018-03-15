/**
 * @summary Modelo de datos hospital
 * @description Fichero que contiene el modelo de datos de mongoose para los hospitales
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 07-02-18
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

const HospitalSchema = Schema({
   //Nombre del hospital
   hosp_name:{
       type:String,
       required:true,
       unique:true
   },
   //Ciudad en la que se encuentra el hospital
   hosp_city:{
       type:String,
       required:true
   },
   //Provincia en la que se encuentra el hospital
    hosp_state:{
        type:String,
        required:true
    },
   //Imagen del hospital
   hosp_img:{
       type:String,
       required:false
   },
   //Referencia al usuario que creo al hospital
   hosp_user:{
       type:Schema.Types.ObjectId,
       ref:'User',
       required:true
   }

});

//El Schema utilizara unique validator para la validación
HospitalSchema.plugin(uniqueValidator,{message:"el campo {PATH} debe ser unico"});

//Declaracion del modelo
/*
 La funcion model de mongoose declarara una colecion de Mongodb , para ello recibira 2 parametros
 1.   Nombre de la colección
 2.   Estructura
 */

let  HospitalModel = mongoose.model('Hospital',HospitalSchema);

//Con module export se exporta el modelo del usuario para que se pueda acceder desde fuera
module.exports = HospitalModel;



