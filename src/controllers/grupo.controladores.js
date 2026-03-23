import * as grupoModelo from "../models/grupo.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as validar from '../utils/validaciones.js';
import e from "express";

export const obtenerEmpleados = async (req, res) => {
  try {
    let { limit, start } = req.query;

  if (limit === undefined || limit === "") limit = "10"; //si es indefinido o vacio se asigna un valor por defecto
    if (start === undefined || start === "") start = "0"; 
    
   
    const limitNumber = parseInt(limit); //convertir a numero entero
    const startNumber = parseInt(start);

    if (isNaN(limitNumber) || isNaN(startNumber) || //validacion si es numero
      limitNumber < 0 || startNumber < 0) { //si es nmayor a 0
      return res.status(400).json({
        message: "limit y start deben ser números válidos mayores o iguales a 0",
      });
    }
    const resultado= await grupoModelo.obtenerEmpleados(limitNumber, startNumber);
    
    
    res.status(200).json({
      message: "Empleados obtenidos correctamente",
      limit: limitNumber,
      start: startNumber,
      total: resultado.length,
      data: resultado,
    });
 

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const empleado = await grupoModelo.obtenerEmpleadoPorId(id);

    if (!validar.esEnteroPositivo(id)) {
      return res.status(404).json({
        message: "Empleado no encontrado o id inválido",
      });
    }

    res.status(200).json(empleado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearEmpleado = async (req, res) => {
  try {
    const {  nombre,  apaterno,  amaterno,  correo,  telefono,  contrasena,  tipo_usuario,  departamento,  puesto, } = req.body;

    // Validación básica
    if (
      !validar.esTextoValido(nombre) ||
      !validar.esTextoValido(apaterno) ||
      !validar.esTextoValido(amaterno) ||
      !validar.esCorreoValido(correo) ||
      !validar.esTelefonoValido(telefono) ||
      !validar.esContrasenaValida(contrasena) ||
      !validar.esEnteroPositivo(tipo_usuario) ||
      !validar.esEnteroPositivo(departamento) ||
      !validar.esEnteroPositivo(puesto)
    ) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios y deben ser válidos",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(contrasena, salt);

    const nuevoEmpleado = await grupoModelo.crearEmpleado({
      nombre,
      apaterno,
      amaterno,
      correo,
      telefono,
      contrasena: passwordHash,
      tipo_usuario,
      departamento,
      puesto,
    });

    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const actualizarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      apaterno,
      amaterno,
      correo,
      telefono,
      contrasena,
      tipo_usuario,
      departamento,
      puesto,
    } = req.body;

    // Validar ID
    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "El id del empleado es obligatorio",
      });
    }

    // Validación de campos obligatorios
    if (
      !validar.esTextoValido(nombre) ||
      !validar.esTextoValido(apaterno) ||
      !validar.esTextoValido(amaterno) ||
      !validar.esCorreoValido(correo) ||
      !validar.esTelefonoValido(telefono) ||
      !validar.esEnteroPositivo(tipo_usuario) ||
      !validar.esEnteroPositivo(departamento) ||
      !validar.esEnteroPositivo(puesto)
    ) {
      return res.status(400).json({
        message: "Todos los campos excepto la contraseña son obligatorios y deben ser válidos",
      });
    }

    let passwordHash = null;

    // Si el usuario manda contraseña nueva
    if (contrasena) {
      if (!validar.esContrasenaValida(contrasena)) {
        return res.status(400).json({
          message: "Contraseña inválida",
        });
      }

      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(contrasena, salt);
    }

    const empleadoActualizado = await grupoModelo.actualizarEmpleado({
      id,
      nombre,
      apaterno,
      amaterno,
      correo,
      telefono,
      contrasena: passwordHash,
      tipo_usuario,
      departamento,
      puesto,
    });

    // Verificar si existe el empleado
    if (empleadoActualizado.affectedRows === 0) {
      return res.status(404).json({
        message: "Empleado no encontrado",
      });
    }

    res.status(200).json({
      message: "Empleado actualizado correctamente",
      data: empleadoActualizado,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const borrarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;

    //  Validar ID
    if (!id) {
      return res.status(400).json({
        message: "El id del empleado es obligatorio",
      });
    }
    const resultado = await grupoModelo.borrarEmpleado({ id });
    // Verificar si existía
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: "Empleado no encontrado",
      });
    }
    res.status(200).json({
      message: "Empleado eliminado correctamente",
      id: resultado.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const usuario = await grupoModelo.findUsuarioByEmail(correo);

        console.log("Usuario encontrado:", usuario);           // ← ver en logs de Vercel
        console.log("Contraseña recibida:", contrasena);
        console.log("Hash guardado en BD:", usuario?.Contrasena);

        if (!usuario) return res.status(401).json({ message: 'Credenciales inválidas' });

        const esValida = await bcrypt.compare(contrasena, usuario.Contrasena);
        console.log("✅ bcrypt.compare resultado:", esValida);

        if (!esValida) return res.status(401).json({ message: 'Credenciales inválidas' });
    } catch (error) {
        res.status(500).json({ error: 'Error en el proceso de login' });
    }
};




export const obtenerDepartamentos = async (req, res) => {

  try {

    const resultado = await grupoModelo.obtenerDepartamentos();

    res.status(200).json({
      message: "Departamentos obtenidos correctamente",
      total: resultado.length,
      data: resultado
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};


// ===============================
// OBTENER PUESTOS
// ===============================
export const obtenerPuestos = async (req, res) => {

  try {

    const resultado = await grupoModelo.obtenerPuestos();

    res.status(200).json({
      message: "Puestos obtenidos correctamente",
      total: resultado.length,
      data: resultado
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};


export const obtenerTiposUsuario = async (req, res) => {

  try {

    const resultado = await grupoModelo.obtenerTiposUsuario();

    res.status(200).json({
      message: "Tipos de usuario obtenidos correctamente",
      total: resultado.length,
      data: resultado
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};


// ===============================
// OBTENER PUESTO Y DEPARTAMENTO
// DE UN EMPLEADO
// ===============================
export const obtenerEmpleadoValue = async (req, res) => {

  try {

    const { id } = req.params;

    if (!validar.esEnteroPositivo(id)) {
      return res.status(400).json({
        message: "El id debe ser un número entero positivo"
      });
    }

    const resultado = await grupoModelo.obtenerEmpleadoValue(id);

    if (resultado.length === 0) {
      return res.status(404).json({
        message: "Empleado no encontrado"
      });
    }

    res.status(200).json({
      message: "Empleado obtenido correctamente",
      data: resultado[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

export const reporteEmpleado = async (req, res) => {

  try {
    const { id, inicio, fin } = req.query;

    if (!validar.esEnteroPositivo(id)) {
      return res.status(400).json({
        message: "El id debe ser un número entero positivo"
      });
    };
    const reporte = await grupoModelo.reporteEmpleado(id, inicio, fin);

    res.status(200).json({
      id, 
      inicio,
      fin,
      reporte
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export const reporteDepartamento = async (req, res) => {

  try {
    const { id, inicio, fin } = req.query;

    if (!validar.esEnteroPositivo(id)) {
      return res.status(400).json({
        message: "El id debe ser un número entero positivo"
      });
    };
    const reporte = await grupoModelo.reporteDepartamento(id, inicio, fin);

    res.status(200).json({
      id, 
      inicio,
      fin,
      reporte
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
/* ===============================
   GOOGLE LOGIN
   =============================== */

import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    try {
        const { id_token } = req.body;
        if (!id_token) {
            return res.status(400).json({ message: 'Token de Google requerido' });
        }

        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.email_verified) {
            return res.status(401).json({ message: 'Token de Google inválido o email no verificado' });
        }

        const email = payload.email;

        const usuario = await grupoModelo.findUsuarioByEmail(email);
        if (!usuario) {
            return res.status(401).json({ 
                message: 'Correo no registrado en nuestro sistema. Usa tu usuario y contraseña primero.' 
            });
        }

        const token = jwt.sign(
            { 
                id: usuario.Id_Empleado, 
                email: usuario.Correo, 
                rol: usuario.Id_Tipo_Usuario 
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        const nombre = `${usuario.Nombre} ${usuario.Apellido_Paterno} ${usuario.Apellido_Materno}`;

        res.json({ 
            token, 
            usuario: { 
                id: usuario.Id_Empleado, 
                nombre, 
                rol: usuario.Id_Tipo_Usuario 
            } 
        });
    } catch (error) {
        console.error('Error en googleLogin:', error);
        if (error.message?.includes('Invalid')) {
            return res.status(401).json({ message: 'Token de Google no válido' });
        }
        res.status(500).json({ message: 'Error interno en login con Google' });
    }
};