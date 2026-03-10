import db from '../config/db.js'

// pormesas es cuando o

//SELECT
export const obtenerEmpleados = async (limit, start) => {
    const [rows] = await db.query(`SELECT e.Id_Empleado, e.Nombre, e.Apellido_Paterno, e.Apellido_Materno, 
                   e.Correo, e.Telefono, d.Departamento, p.Puesto, t.Usuario
            FROM empleados e
            INNER JOIN departamentos d ON e.Id_Departamento = d.Id_Departamento
            INNER JOIN puestos p ON e.Id_Puesto = p.Id_Puesto
            INNER JOIN tipo_usuario t ON e.Id_Tipo_Usuario = t.Id_Tipo_Usuario
            ORDER BY e.Id_Empleado ASC  LIMIT ? OFFSET ?`, [Number(limit), Number(start)]);
    return rows
}

//Insert
export const crearEmpleado = async ({ nombre, apaterno, amaterno, correo, telefono, contrasena, tipo_usuario, departamento, puesto }) => {
  const [result] = await db.query(
    `INSERT INTO empleados 
            (Nombre, Apellido_Paterno, Apellido_Materno, Correo, Telefono, Contrasena, 
            Id_Tipo_Usuario, Id_Departamento, Id_Puesto)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [nombre,
            apaterno,
            amaterno,
            correo,
            telefono,
            contrasena,
            tipo_usuario,
            departamento,
            puesto]
  );
  return {  id: result.insertId, nombre, apaterno, amaterno, correo, telefono, tipo_usuario,  departamento, puesto};
}

// Update
export const actualizarEmpleado = async ({
  id, nombre, apaterno, amaterno, correo, telefono,
  contrasena, tipo_usuario, departamento, puesto
}) => {

  if (contrasena && contrasena.trim() !== "") {

    const [result] = await db.query(
      `UPDATE empleados SET 
        Nombre=?, Apellido_Paterno=?, Apellido_Materno=?, Correo=?, Telefono=?,
        Contrasena=(?),
        Id_Tipo_Usuario=?, Id_Departamento=?, Id_Puesto=?
       WHERE Id_Empleado=?`,
      [nombre, apaterno, amaterno, correo, telefono, contrasena, tipo_usuario, departamento, puesto, id]
    );

    return { affectedRows: result.affectedRows };

  } else {

    const [result] = await db.query(
      `UPDATE empleados SET 
        Nombre=?, Apellido_Paterno=?, Apellido_Materno=?, Correo=?, Telefono=?,
        Id_Tipo_Usuario=?, Id_Departamento=?, Id_Puesto=?
       WHERE Id_Empleado=?`,
      [nombre, apaterno, amaterno, correo, telefono, tipo_usuario, departamento, puesto, id]
    );

    return { affectedRows: result.affectedRows };

  }
};


// el echo de que una funcion sea asicnrona qqieme
export const borrarEmpleado = async ({ id }) => {
  const [result] = await db.query(
    `DELETE FROM empleados WHERE Id_Empleado=?`,
          [id]
  );
  return { id, affectedRows: result.affectedRows  };
}


export const findUsuarioByEmail = async (email) => {
    const [rows] = await db.query(
        'SELECT Id_Empleado, Correo, Contrasena, Nombre, Apellido_Paterno, Apellido_Materno, Id_Tipo_Usuario FROM empleados WHERE Correo = ?',
        [email]
    );
    return rows[0];
};