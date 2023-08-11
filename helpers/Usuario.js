const darFechaHoyFormateada = ()=>{
	
	let opciones = { year: 'numeric', month: 'short', day: 'numeric' };
			let fecha = new Date()
			  .toLocaleDateString('es',opciones)
			  .replace(/ /g,'-');

			 

			return fecha;


}


export {
	
			darFechaHoyFormateada

		}