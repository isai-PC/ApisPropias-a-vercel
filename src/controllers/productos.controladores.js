import * as productoModelo from "../models/productos.model.js";

export const obtenerProductos = async (req, res) => {
  try {
    let { limit, start } = req.query;


    if (limit === undefined || limit === "") limit = "10"; //si es indefinido o vacio se asigna un valor por defecto
    if (start === undefined || start === "") start = "0"; //esto mas que nada por si el cliente no envia estos parametros, asi evitamos errores en la consulta a la base de datos
    //nms la ia me autompletablos mns que pedo

    const limitNumber = parseInt(limit); //convertir a numero entero
    const startNumber = parseInt(start);

    if (isNaN(limitNumber) || isNaN(startNumber) || //validacion si es numero
      limitNumber < 0 || startNumber < 0) { //si es nmayor a 0
      return res.status(400).json({
        message: "limit y start deben ser números válidos mayores o iguales a 0",
      });
    }

    const resultado = await productoModelo.obtenerProductos(limitNumber, startNumber);

    res.status(200).json({
      message: "Productos obtenidos correctamente",
      limit: limitNumber,
      start: startNumber,
      total: resultado.length,
      data: resultado,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const crearProducto = async (req, res) => {
  try {
    const { id_categoria, nombre_producto, precio, unidad_medida, calibre, metros, kg, color, ced, ton, cm, ImagenesProducto
    } = req.body;

    //Validar campos obligatorios ()
    if (
      id_categoria === undefined ||
      nombre_producto === undefined ||
      precio === undefined ||
      unidad_medida === undefined ||
      calibre === undefined ||
      metros === undefined ||
      kg === undefined ||
      color === undefined ||
      ced === undefined ||
      ton === undefined ||
      cm === undefined ||
      ImagenesProducto === undefined
    ) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }


    // Validar que precio sea número
    if (isNaN(parseFloat(precio))) {
      return res.status(400).json({
        message: "El precio debe ser un número válido",
      });
    }

    const resultado = await productoModelo.crearProducto({
      id_categoria, nombre_producto, precio, unidad_medida, calibre, metros, kg, color, ced, ton, cm, ImagenesProducto
    });

    res.status(201).json({
      message: "Producto creado correctamente",
      data: resultado,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const actualizarProducto = async (req, res) => {
  try {

    const { id } = req.params;

    const { id_categoria, nombre_producto, precio, unidad_medida, calibre, metros, kg, color, ced, ton, cm, ImagenesProducto
    } = req.body;

    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return res.status(400).json({
        message: "El id del producto debe ser un número válido"
      });
    }
    if (
      id_categoria === undefined ||
      nombre_producto === undefined ||
      precio === undefined ||
      unidad_medida === undefined ||
      calibre === undefined ||
      metros === undefined ||
      kg === undefined ||
      color === undefined ||
      ced === undefined ||
      ton === undefined ||
      cm === undefined ||
      ImagenesProducto === undefined
    ) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    // Validar que precio sea número
    if (isNaN(parseFloat(precio))) {
      return res.status(400).json({
        message: "El precio debe ser un número válido"
      });
    }

    const resultado = await productoModelo.actualizarProducto({
      id_producto: idNum, id_categoria, nombre_producto, precio, unidad_medida, calibre, metros, kg, color, ced, ton, cm, ImagenesProducto
    });

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }

    res.json({
      message: "Producto actualizado correctamente",
      data: resultado
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};
export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await productoModelo.obtenerProductoPorId(id); // Debes tener esto en tu modelo

    if (!resultado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({
      message: "Producto obtenido",
      data: resultado // Aquí debe venir solo el objeto del producto
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const borrarProducto = async (req, res) => {
  try {

    const { id } = req.params;

    const idNum = Number(id);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      return res.status(400).json({
        message: "El id del producto debe ser un número válido"
      });
    }


    const resultado = await productoModelo.eliminarProducto(idNum);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }

    res.json({
      message: "Producto eliminado correctamente",
      data: resultado
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};