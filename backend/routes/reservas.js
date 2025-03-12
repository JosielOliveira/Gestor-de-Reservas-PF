const express = require("express");
const Reserva = require("../models/reserva");
const Usuario = require("../models/usuario"); // Asegurar que tenemos acceso al modelo de usuario
const verificarToken = require("../middleware/auth");
const enviarCorreo = require("../utils/emailService"); // 📧 Importar función para enviar correos

const router = express.Router();

// 📌 Obtener todas las reservas con filtros (Solo Admins)
router.get("/", verificarToken, async (req, res) => {
    try {
        if (req.usuario.rol !== "admin") {
            return res.status(403).json({ mensaje: "Acceso denegado. Solo administradores pueden ver todas las reservas." });
        }

        const { usuario, espacio, fecha } = req.query;
        let filtro = {};

        if (usuario) filtro.usuario = usuario;
        if (espacio) filtro.espacio = espacio;
        if (fecha) filtro.fecha = new Date(fecha);

        const reservas = await Reserva.find(filtro);
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener reservas", error });
    }
});

// 📌 Obtener reservas del usuario autenticado
router.get("/mis-reservas", verificarToken, async (req, res) => {
    try {
        const reservas = await Reserva.find({ usuario: req.usuario.id });
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener reservas", error });
    }
});

// 📌 Crear una reserva (Usuarios autenticados)
router.post("/", verificarToken, async (req, res) => {
    try {
        console.log("🚀 Se ejecutó POST /reservas");

        const { espacio, fecha, hora } = req.body;

        if (!espacio || !fecha || !hora) {
            return res.status(400).json({ mensaje: "Todos los campos son requeridos" });
        }

        const nuevaReserva = new Reserva({
            usuario: req.user.id,
            espacio: req.body.espacio,
            fecha: new Date(req.body.fecha).toISOString().split("T")[0], // ✅ Guarda solo la fecha en formato YYYY-MM-DD
            hora: req.body.hora,
        });          
        await nuevaReserva.save();

        // 📧 Verificar el email del usuario
        let emailUsuario = req.usuario.email;

        if (!emailUsuario) {
            console.log("⚠️ Email no encontrado en el token, buscando en la base de datos...");
            const usuarioDB = await Usuario.findById(req.usuario.id);
            if (usuarioDB) {
                emailUsuario = usuarioDB.email;
                console.log("✅ Email obtenido de la base de datos:", emailUsuario);
            } else {
                console.error("❌ No se encontró el usuario en la base de datos.");
                return res.status(500).json({ mensaje: "Error interno: Usuario no encontrado." });
            }
        }

        const emailAdmin = "admin@example.com"; // Email del administrador

        const asuntoUsuario = "Confirmación de Reserva";
        const mensajeUsuario = `Hola ${req.usuario.nombre},\n\nTu reserva en "${espacio}" para el día ${fecha} a las ${hora} ha sido confirmada.\n\nGracias por usar nuestro servicio.`;

        const asuntoAdmin = `Nueva Reserva - ${req.usuario.nombre}`;
        const mensajeAdmin = `🔔 Nueva reserva creada:\n\nUsuario: ${req.usuario.nombre}\nEmail: ${emailUsuario}\nEspacio: ${espacio}\nFecha: ${fecha}\nHora: ${hora}`;

        console.log("📧 Enviando correo a usuario:", emailUsuario);
        await enviarCorreo(emailUsuario, asuntoUsuario, mensajeUsuario);

        console.log("📧 Enviando copia al administrador:", emailAdmin);
        await enviarCorreo(emailAdmin, asuntoAdmin, mensajeAdmin);

        res.status(201).json({ mensaje: "Reserva creada y correos enviados", reserva: nuevaReserva });
    } catch (error) {
        console.error("❌ Error al crear la reserva:", error);
        res.status(500).json({ mensaje: "Error al crear la reserva", error });
    }
});

// 📌 Eliminar una reserva (Solo si es del usuario o Admin)
router.delete("/:id", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑 Intentando eliminar la reserva con ID: ${id}`);

        const reserva = await Reserva.findById(id);
        if (!reserva) {
            console.log("❌ Reserva no encontrada");
            return res.status(404).json({ mensaje: "Reserva no encontrada" });
        }

        // Solo el creador de la reserva o un admin puede eliminarla
        if (reserva.usuario.toString() !== req.usuario.id && req.usuario.rol !== "admin") {
            console.log("⛔ Acceso denegado. No puedes eliminar esta reserva.");
            return res.status(403).json({ mensaje: "Acceso denegado. No puedes eliminar esta reserva." });
        }

        await reserva.deleteOne();
        console.log("✅ Reserva eliminada correctamente");
        res.status(200).json({ mensaje: "Reserva eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar la reserva:", error);
        res.status(500).json({ mensaje: "Error al eliminar reserva", error });
    }
});

module.exports = router;
