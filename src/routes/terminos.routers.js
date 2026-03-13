import{Router} from 'express'
import * as ctrl from '../controllers/terminos.controladores.js'
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();
/*  */
router.get('/', verificarToken, ctrl.obtenerTerminosActivos); /* Visualizar */
router.put('/', verificarToken, ctrl.ActualizarTerminos);/* PARTE PRIVADA */

export default router;