import * as contactoView from '../models/contactoView.model.js'

export const contactroView = async () => {
    try {
        const contacto = await contactoView.obtenerContactoView()
        if (!contacto) {
            return res.status(404).json({ error: "No hay informacion de contacto" });
        }
        res.status(200).json(contacto);/*  */
    } catch (error) {
        cres.status(500).json({ error: error.message });
    }

}