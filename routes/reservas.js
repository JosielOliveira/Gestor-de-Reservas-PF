const express = require("express");
const Reserva = require("../models/reserva");
const verificarToken = require("../middleware/auth");

const router = express.Router();

// 📌 Obtener todas las reservas (Solo usuarios autenticados)
router.get("/", verificarToken, async (req, res) => {
  try {
    const reservas = await Reserva.find();
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener reservas", error });
  }
});

// 📌 Crear una reserva (Solo usuarios autenticados)
router.post("/", verificarToken, async (req, res) => {
  try {
    const { usuario, espacio, fecha, hora } = req.body;

    if (!usuario || !espacio || !fecha || !hora) {
      return res.status(400).json({ mensaje: "Todos los campos son requeridos" });
    }

    const nuevaReserva = new Reserva({ usuario, espacio, fecha, hora });
    await nuevaReserva.save();

    res.status(201).json({ mensaje: "Reserva creada", reserva: nuevaReserva });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear la reserva", error });
  }
});

// 📌 Actualizar una reserva por ID (Solo usuarios autenticados)
router.put("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, espacio, fecha, hora } = req.body;

    const reservaActualizada = await Reserva.findByIdAndUpdate(
      id,
      { usuario, espacio, fecha, hora },
      { new: true }
    );

    if (!reservaActualizada) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }

    res.status(200).json({ mensaje: "Reserva actualizada", reserva: reservaActualizada });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar reserva", error });
  }
});

// 📌 Eliminar una reserva por ID (Solo usuarios autenticados)
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const reservaEliminada = await Reserva.findByIdAndDelete(id);

    if (!reservaEliminada) {
      return res.status(404).json({ mensaje: "Reserva no encontrada" });
    }

    res.status(200).json({ mensaje: "Reserva cancelada" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar reserva", error });
  }
});

module.exports = router;
