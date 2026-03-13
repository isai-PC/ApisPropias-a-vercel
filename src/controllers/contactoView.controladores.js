import * as contactoView from '../models/contactoView.model.js'

export const obtenerContactoView = async () => {
    try {
        const contacto = await contactoView.obtenerContactoView()
        if (!contacto) {
            return res.status(404).json({ error: "Lista de contacto no encontrada" });
        }
        res.status(200).json(contacto);/*  */
    } catch (error) {
        cres.status(500).json({ error: error.message });
    }

}