const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  
  console.log("Middleware de autenticación ejecutado."); // 👈 Agregamos esto
  
  if (!token) {
    console.log("❌ No se proporcionó un token."); // 👈 Para ver si entra aquí
    return res.status(401).json({ mensaje: "Acceso denegado, token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Agregar los datos del usuario al request
    console.log("✅ Token válido. Usuario autenticado:", req.usuario); // 👈 Para ver si el token es válido
    next();
  } catch (error) {
    console.log("❌ Token inválido."); // 👈 Para ver si el token es incorrecto
    res.status(400).json({ mensaje: "Token inválido" });
  }
};

module.exports = verificarToken;
