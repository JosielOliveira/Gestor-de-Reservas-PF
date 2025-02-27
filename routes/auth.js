const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const router = express.Router();

// 📌 Registro de Usuario
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // Encriptar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      contraseña: contraseñaEncriptada
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el registro", error });
  }
});

// 📌 Inicio de Sesión
router.post("/login", async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    // Generar Token JWT
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ mensaje: "Inicio de sesión exitoso", token });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el login", error });
  }
});

module.exports = router;
