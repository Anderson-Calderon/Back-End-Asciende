import express from 'express';
import {agregarAsistencia,obtenerAsistencias,editarAsistencia} from '../controllers/AsistenciaController.js';
import multer from 'multer';

const upload = multer();

const asistenciaRouter = express.Router();

asistenciaRouter.post("/",agregarAsistencia);
asistenciaRouter.get("/",obtenerAsistencias);
asistenciaRouter.put("/",upload.single("captura"),editarAsistencia);


export default asistenciaRouter;