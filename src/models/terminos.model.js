import db from '../config/db.js'

export const obtenerTerminosActivos = async () => {
  const [rows] = await db.query(`
    SELECT id, titulo, contenido, activo, fecha 
    FROM terminos_condiciones 
    WHERE activo = 1 
    ORDER BY fecha DESC 
    LIMIT 1
  `);
  return rows[0] || null;   // devuelve un solo objeto o null
};

export const crearNuevoTermino = async (titulo, contenido) => {
  // Llamar al procedimiento almacenado
  await db.query('CALL CrearNuevoTermino(?, ?)', [titulo, contenido]);

  // Devolver la nueva version activa
  const [rows] = await db.query(`
    SELECT id, titulo, contenido, activo, fecha 
    FROM terminos_condiciones 
    WHERE activo = 1 
    ORDER BY fecha DESC 
    LIMIT 1
  `);
  return rows[0];
};