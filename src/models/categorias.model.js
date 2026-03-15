import db from '../config/db.js';

export const obtenerCategorias = async () => {
  const [rows] = await db.query(`
    SELECT id_categoria, nombre_categoria, texto_secundario, imagen_categoria 
    FROM categoria 
    ORDER BY nombre_categoria ASC
  `);
  return rows;
};

export const obtenerCategoriaPorId = async (id) => {
  const [rows] = await db.query(`
    SELECT id_categoria, nombre_categoria, texto_secundario, imagen_categoria 
    FROM categoria 
    WHERE id_categoria = ?
  `, [id]);
  return rows[0];
};

export const crearCategoria = async (nombre, textoSecundario, imagen) => {
  const [result] = await db.query(`
    INSERT INTO categoria (nombre_categoria, texto_secundario, imagen_categoria) 
    VALUES (?, ?, ?)
  `, [nombre, textoSecundario, imagen]);
  return result.insertId;
};

export const actualizarCategoria = async (id, nombre, textoSecundario, imagen) => {
  const [result] = await db.query(`
    UPDATE categoria 
    SET nombre_categoria = ?, 
        texto_secundario = ?, 
        imagen_categoria = ? 
    WHERE id_categoria = ?
  `, [nombre, textoSecundario || null, imagen || null, id]);

  return result.affectedRows;
};

export const eliminarCategoria = async (id) => {
  const [result] = await db.query('DELETE FROM categoria WHERE id_categoria = ?', [id]);
  return result.affectedRows;
};