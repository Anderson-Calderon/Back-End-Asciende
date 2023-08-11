
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

		console.log("LA HORA : ",hora);

		// crea un nuevo objeto `Date`
		var today = new Date();
		 
		// obtener la fecha y la hora
		var now = today.toLocaleString();
		console.log("FECHA HOY : " , now);
		 
		/*
		    Resultado: 1/27/2020, 9:30:00 PM
*/

		console.log(hora);
		

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

	
		
		console.log("ERROR : ");

	}
}

const obtenerAsistencias  = async (req,res)=>{

	try{

		const asistencias = await Asistencia.find();

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

		const error = new Error("Para Marca tu salida  , primero tienes que marcar tu ingreso a trabajar");

		return res.status(400).json({msg:error.message});
	}

	let hora = new Date();
		hora = hora.toLocaleTimeString('es-ES');

	if(  tipoAsistencia=="almuerzo" && hora<"13:00:00"){


		const error = new Error("Aún no puedes marcar tu salida a almorzar. La salida es a las 14:00 pm");

		return res.status(400).json({msg:error.message});

	}	

	if(  tipoAsistencia=="salida del trabajo" && hora<"18:00:00"){


		const error = new Error("Aún no puedes marcar tu salida . La salida es a las 18:00 pm");

		return res.status(400).json({msg:error.message});

	}

	if(existeAsistencia.horaSalida.includes(":")){

		const error = new Error("Ya marcaste tu hora de salida del trabajo , mañana vuelve a ingresar para marcar tu asistencia del íngreso.");

		return res.status(400).json({msg:error.message});

	}

	if(  tipoAsistencia=="almuerzo" && existeAsistencia.horaIngresoAlmuerzo.includes(":")){

		const error = new Error("Ya marcaste tu hora de ingreso y salida de almuerzo .");

		return res.status(400).json({msg:error.message});

	}

	try{

		
		if(tipoAsistencia=="almuerzo"){

			if(!existeAsistencia.horaSalidaAlmuerzo.includes(":")){

			existeAsistencia.horaSalidaAlmuerzo=hora;

			

			res.json({"msg":"Hora de salida al almuerzo correto!"})


			}else if(!existeAsistencia.horaIngresoAlmuerzo.includes(":")){

				existeAsistencia.horaIngresoAlmuerzo=hora;
				res.json({"msg":"Hora de ingreso al trabajo desúes de almuerzo correto!"})

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