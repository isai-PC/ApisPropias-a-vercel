
import { Router } from 'express';
import * as ctrl from '../controllers/misvis.controladores.js';

const router = Router();

router.get('/', ctrl.obtenerMision_Vision)


export default router;