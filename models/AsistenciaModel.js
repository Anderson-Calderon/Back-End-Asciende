import mongoose from 'mongoose';

const AsistenciaSchema = mongoose.Schema({


	nombre:{

				type:String,
				required:true,
				trim:true

		   },

	apellido:{

				type:String,
				required:true,
				trim:true

		   },
	fecha:{

				type:String,
				required:true,
				trim:true

		   },
	horaIngreso:{

				type:String,
				required:true,
				trim:true

		   },

	horaSalidaAlmuerzo:{

				type:String,
				required:true,
				trim:true

		   },
   horaIngresoAlmuerzo:{

				type:String,
				required:true,
				trim:true

   			},
   horaSalida:{

				type:String,
				required:true,
				trim:true

		   },

	captura:{

				type:String,
				required:true,
				trim:true

			},
	area:{

				type:String,
				required:true,
				trim:true

		   },
	dni:{

			type:String,
			required:true,
			trim:true

		}		   


},{

	timestamps:true

});

const Asistencia = mongoose.model("Asistencia",AsistenciaSchema);

export default Asistencia;