const express = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");
const verificarToken = require("../middleware/auth");

const router = express.Router();

// 📌 Obtener perfil del usuario autenticado
router.get("/perfil", verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select("-contraseña");
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener perfil", error });
  }
});

// 📌 Actualizar perfil del usuario autenticado
router.put("/perfil", verificarToken, async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (contraseña) {
      const salt = await bcrypt.genSalt(10);
      usuario.contraseña = await bcrypt.hash(contraseña, salt);
    }

    await usuario.save();
    res.json({ mensaje: "Perfil actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar perfil", error });
  }
});

// 📌 Eliminar cuenta de usuario autenticado
router.delete("/perfil", verificarToken, async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.usuario.id);
    res.json({ mensaje: "Cuenta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar cuenta", error });
  }
});

module.exports = router;
