import * as misvis from "../models/misvis.model.js";

export const obtenerMision_Vision = async (req, res) => {
  try {
    const grupos = await misvis.obtenerMision_Vision();
    res.status(200).json(grupos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};