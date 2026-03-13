import { Router } from 'express';
import * as ctrl from '../controllers/contacto.controladores.js';

const router = Router();

// Ruta pública - cualquiera puede ver los datos de contacto
router.get('/', ctrl.contactoView);

export default router;