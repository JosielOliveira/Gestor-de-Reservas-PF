const express = require("express");
const Reserva = require("../models/reserva");
const verificarToken = require("../middleware/auth");

const router = express.Router();

// 📌 Obtener todas las reservas (Solo Admins)
router.get("/", verificarToken, async (req, res) => {
    try {
        if (req.usuario.rol !== "admin") {
            return res.status(403).json({ mensaje: "Acceso denegado. Solo administradores pueden ver todas las reservas." });
        }
        const reservas = await Reserva.find();
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
        const { espacio, fecha, hora } = req.body;

        if (!espacio || !fecha || !hora) {
            return res.status(400).json({ mensaje: "Todos los campos son requeridos" });
        }

        const nuevaReserva = new Reserva({ usuario: req.usuario.id, espacio, fecha, hora });
        await nuevaReserva.save();

        res.status(201).json({ mensaje: "Reserva creada", reserva: nuevaReserva });
    } catch (error) {
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

        // Solo el creador de la reserva o un admin puede modificarla
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

        // Solo el creador de la reserva o un admin puede eliminarla
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
