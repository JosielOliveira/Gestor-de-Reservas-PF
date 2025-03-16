const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario"); // Asegurar que tenemos el modelo de usuario
require("dotenv").config();

const verificarToken = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1] || req.header("x-auth-token");

    if (!token) {
        return res.status(401).json({ mensaje: "Acceso denegado. Token no proporcionado." });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔓 Token decodificado:", decoded);

        // Buscar el usuario en la base de datos
        const usuario = await Usuario.findById(decoded.id).select("-password");
        if (!usuario) {
            return res.status(401).json({ mensaje: "Token inválido. Usuario no encontrado." });
        }

        req.user = usuario; // Guardar usuario autenticado en req.user
        next();
    } catch (error) {
        console.error("❌ Error en la autenticación:", error);
        res.status(401).json({ mensaje: "Token inválido o expirado." });
    }
};

module.exports = verificarToken;
