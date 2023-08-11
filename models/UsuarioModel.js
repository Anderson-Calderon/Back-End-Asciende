import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UsuarioSchema = mongoose.Schema({

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
	area:{


				type:String,
				required:true,
				trim:true

			}	,
	dni:{


				type:String,
				required:true,
				trim:true,
				unique:true


			}	,


	
	

	fecha:  {


				type:String,
				required:true,
				trim:true

			},
	password:{

		type:String,
		required:true,
		trim:true

	}
	


},{

	timestamps:true

});

//Hacemos uso de function(){} porque dentro de esta funcion haremos uso de this , 
//el cual hará referencia en este caso al usuario que se está tratando de guardar.
UsuarioSchema.pre("save",async function (next){

	if(!this.isModified("password")){
		console.log("EL PASSWORD NO SE MODIFICA");
		//Te manda al siguiente middelware, node.js ejecuta de middelware en middelware.
		return next();

	}

	const salt = await bcrypt.genSalt(10);

	this.password = await bcrypt.hash(this.password,salt);

	console.log("HEY ... EL PASSWORD SE MODIFICÓ");

});


UsuarioSchema.methods.comprobarPassword = async function(passwordFormulario){

	return await bcrypt.compare(passwordFormulario,this.password);

}


const Usuario = mongoose.model("Usuario",UsuarioSchema);

export default Usuario;