import db from '../config/db.js'
export const obtenerMision_Vision = async ()=> {
    const [rows] = await db.query(`SELECT * FROM mision_vision;`)
    return rows
}