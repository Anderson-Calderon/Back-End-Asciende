import express from 'express';
import {crearArea , obtenerAreas , eliminarArea ,editarArea} from '../controllers/AreaControllers.js';
const areaRouter = express.Router();

areaRouter.post("/",crearArea);
areaRouter.get("/",obtenerAreas);
areaRouter.delete("/:id",eliminarArea);
areaRouter.put("/:id",editarArea);

export default areaRouter;