const express = require("express");
const Reserva = require("../models/reserva");
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
        console.log("🚀 Se ejecutó POST /reservas"); // 👈 Agregado para ver si el código se ejecuta

        const { espacio, fecha, hora } = req.body;

        if (!espacio || !fecha || !hora) {
            return res.status(400).json({ mensaje: "Todos los campos son requeridos" });
        }

        const nuevaReserva = new Reserva({ usuario: req.usuario.id, espacio, fecha, hora });
        await nuevaReserva.save();

        // 📧 Enviar notificación por email
        const emailUsuario = req.usuario.email;
        const asunto = "Confirmación de Reserva";
        const mensaje = `Hola ${req.usuario.nombre},\n\nTu reserva en "${espacio}" para el día ${fecha} a las ${hora} ha sido confirmada.\n\nGracias por usar nuestro servicio.`;

        console.log("📧 Enviando correo a:", emailUsuario);
        await enviarCorreo(emailUsuario, asunto, mensaje);

        res.status(201).json({ mensaje: "Reserva creada y correo enviado", reserva: nuevaReserva });
    } catch (error) {
        console.error("❌ Error al crear la reserva:", error);
        res.status(500).json({ mensaje: "Error al crear la reserva", error });
    }
});

// 📌 Actualizar una reserva (Solo si es del usuario o Admin)
router.put("/:id", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { espacio, fecha, hora } = req.body;

        const reserva = await Reserva.findById(id);
        if (!reserva) {
            return res.status(404).json({ mensaje: "Reserva no encontrada" });
        }

        if (reserva.usuario.toString() !== req.usuario.id && req.usuario.rol !== "admin") {
            return res.status(403).json({ mensaje: "Acceso denegado. No puedes modificar esta reserva." });
        }

        reserva.espacio = espacio || reserva.espacio;
        reserva.fecha = fecha || reserva.fecha;
        reserva.hora = hora || reserva.hora;

        await reserva.save();
        res.status(200).json({ mensaje: "Reserva actualizada", reserva });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar reserva", error });
    }
});

// 📌 Eliminar una reserva (Solo si es del usuario o Admin)
router.delete("/:id", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const reserva = await Reserva.findById(id);

        if (!reserva) {
            return res.status(404).json({ mensaje: "Reserva no encontrada" });
        }

        if (reserva.usuario.toString() !== req.usuario.id && req.usuario.rol !== "admin") {
            return res.status(403).json({ mensaje: "Acceso denegado. No puedes eliminar esta reserva." });
        }

        await reserva.deleteOne();
        res.status(200).json({ mensaje: "Reserva eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar reserva", error });
    }
});

module.exports = router;
