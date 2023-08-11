import mongoose from 'mongoose';


const AreaSchema = mongoose.Schema({

	nombre:{

				type:String,
				required:true,
				trim:true


			}	


},{

	timestamps:true

});

const Area = mongoose.model("Area",AreaSchema);

export default Area;