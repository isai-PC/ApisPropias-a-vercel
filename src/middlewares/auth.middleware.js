import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();
export const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Token requerido.' });
    }

    const token = authHeader.split(' ')[1];
    console.log("Token recibido:", token);/* Muestra el token */
    console.log("JWT_SECRET usado:", process.env.JWT_SECRET ? "existe" : "NO existe");/* Muestra el JWT_SECRET */

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token no válido o expirado' });
    }
};