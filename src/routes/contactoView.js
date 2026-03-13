import { Router } from "express";
import * as ctrl from "../controllers/contactoView.controladores.js";

const router = Router();

router.get("/", ctrl.obtenerContactoView);

export default router;