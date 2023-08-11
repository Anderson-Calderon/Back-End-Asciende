import express from 'express';
import {registrar,obtenerUsuarios,autenticarUsuario,editarUsuario,eliminarUsuario} from '../controllers/UsuarioController.js';



const usuarioRouter = express.Router();


usuarioRouter.post("/", registrar);
usuarioRouter.get("/",obtenerUsuarios);
usuarioRouter.post("/login",autenticarUsuario);
usuarioRouter.put("/",editarUsuario);
usuarioRouter.delete("/:id",eliminarUsuario);


export default usuarioRouter;