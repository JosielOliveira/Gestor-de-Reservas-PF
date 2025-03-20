const express = require("express");
const Espacio = require("../models/espacio"); // Asegurar que el modelo existe
const verificarToken = require("../middleware/auth");

const router = express.Router();

// 📌 Obtener todos los espacios (Disponible para cualquier usuario)
router.get("/", async (req, res) => {
    try {
        const espacios = await Espacio.find();
        res.json(espacios);
    } catch (error) {
        console.error("❌ Error al obtener espacios:", error);
        res.status(500).json({ mensaje: "Error al obtener espacios", error });
    }
});

// 📌 Crear un nuevo espacio (Solo Admin)
router.post("/", verificarToken, async (req, res) => {
    try {
        if (req.usuario.rol !== "admin") {
            return res.status(403).json({ mensaje: "Acceso denegado. Solo administradores pueden crear espacios." });
        }

        const { nombre, capacidad, ubicacion } = req.body;
        if (!nombre || !capacidad || !ubicacion) {
            return res.status(400).json({ mensaje: "Todos los campos son requeridos." });
        }

        const nuevoEspacio = new Espacio({ nombre, capacidad, ubicacion });
        await nuevoEspacio.save();

        console.log("✅ Espacio creado:", nuevoEspacio);
        res.status(201).json({ mensaje: "Espacio creado exitosamente", espacio: nuevoEspacio });
    } catch (error) {
        console.error("❌ Error al crear espacio:", error);
        res.status(500).json({ mensaje: "Error interno del servidor", error });
    }
});

// 📌 Actualizar un espacio (Solo Admin)
router.put("/:id", verificarToken, async (req, res) => {
    try {
        if (req.usuario.rol !== "admin") {
            return res.status(403).json({ mensaje: "Acceso denegado. Solo administradores pueden actualizar espacios." });
        }

        const { nombre, capacidad, ubicacion } = req.body;
        const espacioActualizado = await Espacio.findByIdAndUpdate(
            req.params.id,
            { nombre, capacidad, ubicacion },
            { new: true }
        );

        if (!espacioActualizado) {
            return res.status(404).json({ mensaje: "Espacio no encontrado." });
        }

        console.log("✅ Espacio actualizado:", espacioActualizado);
        res.json({ mensaje: "Espacio actualizado correctamente", espacio: espacioActualizado });
    } catch (error) {
        console.error("❌ Error al actualizar espacio:", error);
        res.status(500).json({ mensaje: "Error al actualizar espacio", error });
    }
});

// 📌 Eliminar un espacio (Solo Admin)
router.delete("/:id", verificarToken, async (req, res) => {
    try {
        if (req.usuario.rol !== "admin") {
            return res.status(403).json({ mensaje: "Acceso denegado. Solo administradores pueden eliminar espacios." });
        }

        const espacioEliminado = await Espacio.findByIdAndDelete(req.params.id);
        if (!espacioEliminado) {
            return res.status(404).json({ mensaje: "Espacio no encontrado." });
        }

        console.log("✅ Espacio eliminado:", espacioEliminado);
        res.json({ mensaje: "Espacio eliminado correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar espacio:", error);
        res.status(500).json({ mensaje: "Error al eliminar espacio", error });
    }
});

module.exports = router;
