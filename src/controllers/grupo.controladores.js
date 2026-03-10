import * as grupoModelo from "../models/grupo.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as validar from '../utils/validaciones.js';

//export const obtenerEmpleados = async (req, res) => {
  //try {
    //const grupos = await grupoModelo.obtenerEmpleados();
    //res.status(200).json(grupos);
  //} catch (error) {
    //res.status(500).json({ error: error.message });
  //}
//};

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

    const {  nombre,  apaterno,  amaterno,  correo,  telefono,  contrasena,  tipo_usuario,  departamento,  puesto,} = req.body;

    // Validar ID
    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "El id del empleado es obligatorio",
      });
    }

    // Validación básica
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
        message: "Todos los campos exepto la contraseña son obligatorios y deben ser válidos",
      });
    }
    if (contrasena && !validar.esContrasenaValida(contrasena)) {
  return res.status(400).json({ message: "Contraseña inválida" });
}

    const empleadoActualizado = await grupoModelo.actualizarEmpleado({
      id,
      nombre,
      apaterno,
      amaterno,
      correo,
      telefono,
      contrasena,
      tipo_usuario,
      departamento,
      puesto,
    });

    // Verificar si existe
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
    res.status(500).json({ error: error.message });
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
        if (!usuario) return res.status(401).json({ message: 'Credenciales inválidas' });

        const esValida = await bcrypt.compare(contrasena, usuario.Contrasena);
        if (!esValida) return res.status(401).json({ message: 'Credenciales inválidas' });

        const token = jwt.sign(
            { id: usuario.Id_Empleado, email: usuario.Correo, rol: usuario.Id_Tipo_Usuario },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token, usuario: { id: usuario.Id_Empleado, nombre: `${usuario.Nombre} ${usuario.Apellido_Paterno} ${usuario.Apellido_Materno}`, rol: usuario.Id_Tipo_Usuario } });
    } catch (error) {
        res.status(500).json({ error: 'Error en el proceso de login' });
    }
};