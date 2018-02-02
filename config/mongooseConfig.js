/**
 * @summary Fichero de configuración de Mongoose
 * @description Fichero que contiene los parametros de configuracion para realizar la conexión a la base de datos con Mongoose
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 01-02-18
 */

/**
 * @description Dns del host de la base de datos
 * @type {string}
 */
let dns = 'localhost';


/**
 * @description puerto por el que trabaja la base de datos
 * @type {number}
 */
let port = 27017;

/**
 * @description nombre de la base de datos
 * @type {string}
 */
let db = 'slp-HospitalesCurso';

module.exports.URI  = `mongodb://${dns}:${port}/${db}`;

// module.exports.URI  = "mongodb://"+dns+":"+port+"/"+db;