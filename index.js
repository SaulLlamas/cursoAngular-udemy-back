/**
 * @summary Punto de entrada
 * @description Punto de entrada a la aplicación
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 31-01-18
 */

//=======================================================
//Importación de dependencias de node
//=======================================================

//Importación de express
let express = require('express');

//Importación de mongoose
let mongoose = require('mongoose');

//Importacion de body-parser
let bodyParser = require('body-parser');

//=======================================================
//Importación de ficheros de configuración
//=======================================================

//Configuración de express
let express_conf = require('./config/appConfig');

//Configuración de mongoose
let mongoose_conf = require('./config/mongooseConfig');

//=======================================================
//Importación de archivos de rutas
//=======================================================
//Archivo de rutas principal
let app_router = require('./router/app.router');
//Archivo de rutas para el usuario
let user_router = require('./router/user.router');
//Archivo de rutas para el login
let login_router = require('./router/login.router');
//Archivo de rutas para los hospitales
let hospital_router  = require('./router/hospital.router');
//Archivo de rutas para los doctores
let doctor_router = require('./router/doctor.router');
//Archivo de rutas para todas las colecciones de la base de datos
let search_router = require('./router/search.router');


//=======================================================
//Inicializacion de constantes
//=======================================================
/**
 * @description La constante app carga express
 * @type {*}
 */
const app = express();

//=======================================================
//Middleware de body-parser => Permite parsear la informacion de la peticiones a formato json
//=========================================================
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//=======================================================
//Rutas
//=========================================================
app.use('/login',login_router);
app.use('/user',user_router);
app.use('/hospital',hospital_router);
app.use('/doctor',doctor_router);
app.use('/search',search_router);
app.use('/',app_router);


app.listen(express_conf.express_port,()=>{
    //El texto entre \x1b[32m y \x1b[0m saldra por consola de color verde
    console.log("\x1b[32m Aplicacion corriendo en el puerto "+express_conf.express_port+" \x1b[0m");
});


//Conexion a la base de datos utilizando los parametros del archivo de mongoose
mongoose.connection.openUri(mongoose_conf.URI,(error,response)=>{

    if(error){
        //En caso de que halla un error muestra el error por consola
        console.log("\x1b[31m ERROR: \x1b[0m",error);
    }else{
        //En caso de que no halla ningun error muestra un mensage satisfactorio por consola
        console.log(`\x1b[32m Se ha podido conectar correctamente a ${mongoose_conf.URI} \x1b[0m`);
    }

});
