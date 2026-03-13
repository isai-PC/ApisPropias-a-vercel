import { Router } from 'express';
import * as ctrl from '../controllers/categorias.controladores.js';
import { verificarToken } from '../middlewares/auth.middleware.js'; // ← PROTECCIÓN

const router = Router();

// Todas las rutas privadas (requieren JWT)
router.get('/', ctrl.obtenerCategorias);
router.get('/:id', verificarToken, ctrl.obtenerCategoriaPorId);
router.post('/', verificarToken, ctrl.crearCategoria);
router.put('/:id', verificarToken, ctrl.actualizarCategoria);
router.delete('/:id', verificarToken, ctrl.eliminarCategoria);

export default router;