
import Asistencia from '../models/AsistenciaModel.js';
import Usuario from '../models/UsuarioModel.js';
import {darFechaHoyFormateada} from '../helpers/Usuario.js';
import { v2 as cloudinary } from 'cloudinary';
// import multer from 'multer';

// const upload = multer();


          
cloudinary.config({ 
  cloud_name: 'dpkhxh4dm', 
  api_key: '348797472418725', 
  api_secret: 'yBABNSKlachlaIgvlOE1s687TN8' 
});

const agregarAsistencia = async (req,res)=>{

	console.log("HOLA , SOY AGREGAR ASISTENCIA");

	const {dni} = req.body;	

	const usuarioExiste = await Usuario.findOne({dni});

	console.log(usuarioExiste);

	if(!usuarioExiste){

		const error = new Error("Error al ingresar identificador");

		return res.status(400).json({msg:error.message});


	}

	const fecha = darFechaHoyFormateada();
	const asistenciaExiste = await Asistencia.findOne({fecha,dni});
	console.log(asistenciaExiste);

	if(asistenciaExiste){

		const error = new Error("Tu Asistencia de ingreso ya fue registrada");

		return res.status(400).json({msg:error.message});

	}



	try{

		console.log(dni);

		req.body.nombre = usuarioExiste.nombre;
		req.body.apellido = usuarioExiste.apellido;
		req.body.fecha = fecha;
		req.body.dni = dni;

		let hora = new Date();
		hora = hora.toLocaleTimeString('es-ES');

		//CÓDIGO PARA ACTUALIZAR LA HORA , A LA HORA PERUANA Y NO LA DEL SERVIDOR .
		//PARA ELLO RESTAMOS 5 HORAS A LA HORA DEL SERVIDOR
		let nuevaHoraEstatico = hora.split(":")[0];

		let nuevaHoraVariable=parseInt(nuevaHoraEstatico);

		if(nuevaHoraVariable>=5){

			nuevaHoraVariable = nuevaHoraVariable - 5; 

		}else{

			nuevaHoraVariable = nuevaHoraVariable + 24 - 5;

		}

		if(nuevaHoraVariable<10){

			nuevaHoraVariable = "0"+nuevaHoraVariable;

		}
		
		hora=hora.replace(nuevaHoraEstatico,""+nuevaHoraVariable);


		

		req.body.horaIngreso=hora;
		req.body.horaSalidaAlmuerzo="Aún no marcada";
		req.body.horaIngresoAlmuerzo="Aún no marcada";
		req.body.horaSalida="Aún no marcada";
		req.body.captura = "https://res.cloudinary.com/dlitkjqr0/image/upload/v1690588979/agr7uput4at4avep3q6q.jpg";

		req.body.area = usuarioExiste.area;


		const asistencia = new Asistencia(req.body);
		await asistencia.save();

		res.json({


						msg:"MENSAJE"

					})


	}catch(error){

	
		
		console.log("ERROR : ",error);

	}
}

const obtenerAsistencias  = async (req,res)=>{

	try{

		const asistencias = await Asistencia.find({}).sort({createdAt:-1});
		console.log(asistencias);

		res.json(asistencias);

	}catch(error){


		console.log("ESTE ES UN ERROR : ",error);

	}


}


const editarAsistencia = async (req,res)=>{

	
	const {dni,tipoAsistencia} = req.body;

	

	let fileBuffer,
		uploadToCloudinary;


		if(req.file){

			 fileBuffer = req.file.buffer;



		 uploadToCloudinary = (fileBuffer) => {
		  return new Promise((resolve, reject) => {
		    cloudinary.uploader.upload_stream({ resource_type: 'auto', crop: 'limit' }, (error, result) => {
		      if (error) {
		        reject(error);
		      } else {
		        resolve(result);
		      }
		    }).end(fileBuffer);
		  });
		};


		}

	


	let result;




	const existeAsistencia = await Asistencia.findOne({dni , fecha : darFechaHoyFormateada()});

	if(!existeAsistencia){

		const error = new Error("Para marcar  , primero tienes que registrar tu ingreso al trabajo");

		return res.status(400).json({msg:error.message});
	}

	if(existeAsistencia.horaSalida.includes(":")){

		const error = new Error("Ya marcaste tu hora de salida del trabajo , mañana vuelve a ingresar para marcar tu asistencia del íngreso.");

		return res.status(400).json({msg:error.message});

	}

	let hora = new Date();
		hora = hora.toLocaleTimeString('es-ES');


		//CÓDIGO PARA ACTUALIZAR LA HORA , A LA HORA PERUANA Y NO LA DEL SERVIDOR .
		//PARA ELLO RESTAMOS 5 HORAS A LA HORA DEL SERVIDOR
		let nuevaHoraEstatico = hora.split(":")[0];

		let nuevaHoraVariable=parseInt(nuevaHoraEstatico);

		if(nuevaHoraVariable>=5){

			nuevaHoraVariable = nuevaHoraVariable - 5; 

		}else{

			nuevaHoraVariable = nuevaHoraVariable + 24 - 5;

		}

		if(nuevaHoraVariable<10){

			nuevaHoraVariable = "0"+nuevaHoraVariable;

		}
		
		hora=hora.replace(nuevaHoraEstatico,""+nuevaHoraVariable);

		if(tipoAsistencia=="idda" && !existeAsistencia.horaSalidaAlmuerzo.includes(":")){


			const error = new Error("Para marcar tu hora de ingreso despúes de almuerzo , primero tienes que marcar tu hora de salida a almorzar.");

			return res.status(400).json({msg:error.message});


		}

	if(  tipoAsistencia=="saa" && hora<"13:00:00"){


		const error = new Error("Aún no puedes marcar tu salida a almorzar. La salida es a partir de la 13:00 pm");

		return res.status(400).json({msg:error.message});

	}	

	/*if(  tipoAsistencia=="salida del trabajo" && hora<"18:00:00"){


		const error = new Error("Aún no puedes marcar tu salida . La salida es a las 18:00 pm");

		return res.status(400).json({msg:error.message});

	}*/

	

	if(  tipoAsistencia=="idda" && existeAsistencia.horaIngresoAlmuerzo.includes(":")){

		const error = new Error("Ya marcaste tu hora de ingreso y salida de almuerzo .");

		return res.status(400).json({msg:error.message});

	}

	try{

		
		if(tipoAsistencia=="idda" || tipoAsistencia=="saa"){

			if(!existeAsistencia.horaSalidaAlmuerzo.includes(":")){

			existeAsistencia.horaSalidaAlmuerzo=hora;

			

			res.json({"msg":"Hora de salida al almuerzo correcto!"})


			}else if(!existeAsistencia.horaIngresoAlmuerzo.includes(":")){

				existeAsistencia.horaIngresoAlmuerzo=hora;
				res.json({"msg":"Hora de ingreso al trabajo despúes de almuerzo correcto!"})

			}

			

		}else if(tipoAsistencia=="salida del trabajo"){


				if(!existeAsistencia.horaSalida.includes(":")){

					existeAsistencia.horaSalida=hora;
					res.json({"msg":"Salida del trabajo marcada correctamente"})


				}

				if(req.file){


							 result = await uploadToCloudinary(fileBuffer);

							 existeAsistencia.captura=result.url;
		

							}			


				

		}

		existeAsistencia.save();

		 

		

	}catch(error){

		console.log(error);

	}

}

export {

			agregarAsistencia,
			obtenerAsistencias,
			editarAsistencia


		}