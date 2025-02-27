const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ mensaje: "Acceso denegado, token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Agrega los datos del usuario al request
    next();
  } catch (error) {
    res.status(400).json({ mensaje: "Token inválido" });
  }
};

module.exports = verificarToken;
