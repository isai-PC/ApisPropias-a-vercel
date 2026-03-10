import db from '../config/db.js'

export const obtenerProductos = async (limit = 10, start = 0) => {
  const [rows] = await db.query(
    `SELECT p.id_producto, 
            p.nombre_producto, 
            p.ImagenesProducto, 
            c.nombre_categoria
     FROM productos p
     LEFT JOIN categoria c 
       ON p.id_categoria = c.id_categoria
     LIMIT ? OFFSET ?`,
    [Number(limit), Number(start)]
  );

  return rows;
};
//
export const crearProducto = async ({ id_categoria, nombre_producto, precio, unidad_medida, calibre, metros, kg, color, ced, ton, cm, ImagenesProducto }) => {
  const [result] = await db.query(
    `  INSERT INTO productos (id_categoria, nombre_producto, precio, unidad_medida, calibre, metros, kg, color, ced, ton, cm, ImagenesProducto)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_categoria, nombre_producto, precio, unidad_medida, calibre, metros, kg, color, ced, ton, cm, ImagenesProducto]
  );
  return { id: result.insertId, id_categoria, nombre_producto, precio, unidad_medida, calibre, metros, kg, color, ced, ton, cm, ImagenesProducto };
}


export const actualizarProducto = async ({  id_producto,  id_categoria,  nombre_producto,  precio,  unidad_medida,  calibre, metros,  kg,  color,  ced,  ton,  cm,  ImagenesProducto
}) => {

  const [result] = await db.query(
    `UPDATE productos 
     SET id_categoria = ?, nombre_producto = ?, precio = ?, unidad_medida = ?, 
         calibre = ?, metros = ?, kg = ?, color = ?, ced = ?, ton = ?, cm = ?, ImagenesProducto = ?
     WHERE id_producto = ?`,
    [id_categoria, nombre_producto, precio, unidad_medida, calibre, metros, kg, color, ced, ton, cm, ImagenesProducto, id_producto]
  );

  //return {
   // id: id_producto,
   // affectedRows: result.affectedRows
  //};

   return {
    id_producto,
    id_categoria,
    nombre_producto,
    precio,
    unidad_medida,
    calibre,
    metros,
    kg,
    color,
    ced,
    ton,
    cm,
    ImagenesProducto,
    affectedRows: result.affectedRows
  };
}

export const eliminarProducto = async (id_producto) => {
  const [result] = await db.query(
    `DELETE FROM productos WHERE id_producto = ?`,
    [id_producto]
  );
  return {
    id: id_producto,
    affectedRows: result.affectedRows
  };
}