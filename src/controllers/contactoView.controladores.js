import * as contactoModel from '../models/contacto.model.js';

// GET público - Muestra la información de contacto actual
export const contactoView = async (req, res) => {
  try {
    const contacto = await contactoModel.obtenerContacto();
    
    if (!contacto) {
      return res.status(404).json({ 
        error: "No hay información de contacto registrada" 
      });
    }

    res.status(200).json(contacto);
  } catch (error) {
    console.error('Error en contactoView:', error);
    res.status(500).json({ error: error.message });
  }
};