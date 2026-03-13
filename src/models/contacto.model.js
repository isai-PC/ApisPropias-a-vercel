import db from '../config/db.js';

export const obtenerContacto = async () => {
  const [rows] = await db.query(`
    SELECT id, dias, horario, telefono, whatsapp, correo, direccion,
           red_social_1, red_social_2, red_social_3
    FROM contacto_info
    LIMIT 1
  `);
    // Devolver
  return rows[0] || null;
};