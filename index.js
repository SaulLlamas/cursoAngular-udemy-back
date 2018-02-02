/**
 * @summary Punto de entrada
 * @description Punto de entrada a la aplicación
 * @author Saul Llamas Parra
 * @version 1.0
 * @since 31-01-18
 */

//=======================================================
//Importación utilizando require()
//=======================================================

//Importación de express
let express = require('express');

//Importación de mongoose
let mongoose = require('mongoose');


//=======================================================
//Importación de ficheros de configuración
//=======================================================

//Configuración de express
let express_conf = require('./config/appConfig');

//Configuración de mongoose
let mongoose_conf = require('./config/mongooseConfig');



//=======================================================
//Inicializacion de constantes
//=======================================================
/**
 * @description La constante app carga express
 * @type {*}
 */
const app = express();





//Peticion get
app.get("/",(request,response)=>{
   response.status(200).json({
       ok:true,
       message:"Petición GET realizada correctamente"
   })
});

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
