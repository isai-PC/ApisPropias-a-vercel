import * as categoriaModel from "../models/categorias.model.js";
import { esTextoValido } from "../utils/validaciones.js"; // reutilizamos tu utils

// ====================== LISTADO (GET) ======================
export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await categoriaModel.obtenerCategorias();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ====================== OBTENER POR ID ======================
export const obtenerCategoriaPorId = async (req, res) => {
  try {
    const categoria = await categoriaModel.obtenerCategoriaPorId(req.params.id);
    if (!categoria) return res.status(404).json({ error: "Categoría no encontrada" });
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ====================== CREAR (POST) ======================
export const crearCategoria = async (req, res) => {
  const { nombre_categoria, texto_secundario, imagen_categoria } = req.body;

  if (!esTextoValido(nombre_categoria)) {
    return res.status(400).json({ error: "Nombre de categoría inválido" });
  }

  try {
    const id = await categoriaModel.crearCategoria(nombre_categoria, texto_secundario || null, imagen_categoria || null);
    res.status(201).json({ message: "Categoría creada", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ====================== ACTUALIZAR (PUT) ======================
export const actualizarCategoria = async (req, res) => {
  const { nombre_categoria, texto_secundario, imagen_categoria } = req.body;

  if (!nombre_categoria || !texto_secundario) {
    return res.status(400).json({ error: "Nombre y descripción son obligatorios" });
  }

  try {
    const affected = await categoriaModel.actualizarCategoria(
      req.params.id,
      nombre_categoria,
      texto_secundario || null,
      imagen_categoria || null
    );

    if (affected === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.status(200).json({ 
      message: "Categoría actualizada correctamente" 
    });

  } catch (error) {
    console.error("Error en actualizarCategoria:", error);
    res.status(500).json({ error: error.message });
  }
};

// ====================== ELIMINAR (DELETE) ======================
export const eliminarCategoria = async (req, res) => {
  try {
    const affected = await categoriaModel.eliminarCategoria(req.params.id);
    if (affected === 0) return res.status(404).json({ error: "Categoría no encontrada" });
    res.status(200).json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    // Capturamos el TRIGGER que impide borrar si hay productos
    if (error.code === '45000' || error.message.includes('No se puede eliminar')) {
      return res.status(400).json({ 
        error: "No se puede eliminar esta categoría porque tiene productos asociados." 
      });
    }
    res.status(500).json({ error: error.message });
  }
};