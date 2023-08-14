

import express from 'express';
import conectarDB from './config/db.js';
import dotenv from "dotenv";
import cors from 'cors';
import usuarioRouter from './routes/UsuarioRoutes.js';
import areaRouter from './routes/AreaRoutes.js';
import asistenciaRouter from './routes/AsistenciaRoutes.js';



const app = express();
app.use(express.json());//PERMITIMOS QUE NUESTRA APP RECIBA INFO DE TIPO JSON


dotenv.config();

const whitelist = [process.env.FRONT_URL,"http://localhost:5173"];//DOMINIOS PERMITIDOS



const corsOptions = {


							origin:function(origin,callback){

															
								//ORIGIN ES LA URL DE LA PÁGINA QUE ESTÁ INTENTANDO HACER UNA PETICIÓN A TU BACKEND
								console.log(whitelist.includes(origin));
								if(whitelist.includes(origin)){
								

									//null PORQUE NO HAY MENSAJE DE ERROR
									//true , LE DAMOS ACCESO 
									callback(null,true)


								}else{

									//PARA UN MENSAJE DE ERROR
									callback(new Error("Error de Cors"))


								}


							}


					 	}


app.use(cors(corsOptions));



conectarDB();

const PORT  = process.env.PORT || 4000;

app.use("/api/usuarios",usuarioRouter);
app.use("/api/areas",areaRouter);
app.use("/api/asistencias",asistenciaRouter)


app.listen(PORT,()=>{

	console.log("CORRIENDO APP",PORT);


})