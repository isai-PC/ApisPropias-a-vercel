// ===============================
// VALIDAR ENTERO POSITIVO (>0)
// ===============================
export const esEnteroPositivo = (valor) => {

    const numero = Number(valor);

    if (!Number.isInteger(numero)) {
        return false;
    }

    if (numero <= 0) {
        return false;
    }

    return true;
};

//KAMINARI
// ===============================
// VALIDAR CORREO
// ===============================
export const esCorreoValido = (correo) => {

    if (!correo) return false;

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(String(correo).trim());

};


// ===============================
// VALIDAR TELEFONO
// (10 a 15 digitos)
// ===============================
export const esTelefonoValido = (telefono) => {

    if (!telefono) return false;

    const regex = /^[0-9]{10,15}$/;

    return regex.test(String(telefono).trim());

};


// ===============================
// VALIDAR TEXTO (NO VACIO)
// ===============================
export const esTextoValido = (texto) => {

    if (typeof texto !== "string") return false;

    if (texto.trim().length === 0) return false;

    return true;
};

// ===============================
// VALIDAR CONTRASEÑA
// minimo 6 caracteres
// ===============================
export const esContrasenaValida = (password) => {

    if (!password) return false;

    if (typeof password !== "string") return false;

    if (password.trim().length < 6) return false;

    return true;
};