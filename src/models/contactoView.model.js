import db from '../config/db.js'

export const obtenerContactoView = async () => {
    const [rows] = await db.query(`SELECT * FROM contacto_info;`);
    return rows
}