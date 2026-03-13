import * as terminosModel from '../models/terminos.model.js'
import * as validar from '../utils/validaciones.js'

/* PUBLICO( NO SE SI MME TODCA ESTO XD) */
/* export const obtenerTerminosActivos = async (req, res) => {
    try {
        const terminos = await terminosModel.obtenerTerminosActivos();
        if (!terminos) return res.status(404).json({ error: "Terminos no encontrados" });
        res.status(200).json(terminos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} */
/* ==================== SUBIR ACTUALIZACION DE TERMINOS =====================    */
export const ActualizarTerminos = async (req, res) => {
    const { titulo, contenido } = req.body;
    if (!validar.esTextoValido(titulo)) return res.status(400).json({ error: "Titulo no valido" });
    if (!validar.esTextoValido(contenido)) return res.status(400).json({ error: "Contenido de texto no valido" });
    try {
        const nuevaVersion = await terminosModel.ActualizarTerminos(titulo, contenido);
        res.status(200).json( {
        message: "Terminos actualizados correctamente"
        /* terminos: nuevaVersion */
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}