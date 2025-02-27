require("dotenv").config(); // Cargar variables de entorno

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

// 📌 Conexión a MongoDB Atlas usando variable de entorno
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al conectar MongoDB Atlas:", err));

const app = express();
const PORT = process.env.PORT || 3009;

// 📌 Middlewares
app.use(express.json());
app.use(cors());

// 📌 Importar modelos
const Reserva = require("./models/reserva");
const Espacio = require("./models/espacios"); // Asegúrate de que este archivo existe

// 📌 Endpoint para obtener los espacios deportivos
app.get("/espacios", (req, res) => {
  res.json(Espacio);
});

// 📌 Endpoint para crear una reserva con validación y guardarla en MongoDB
app.post("/reservas", async (req, res) => {
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

// 📌 Endpoint para listar todas las reservas desde MongoDB
app.get("/reservas", async (req, res) => {
  try {
    const reservas = await Reserva.find();
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener reservas", error });
  }
});

// 📌 Endpoint para cancelar (eliminar) una reserva por ID en MongoDB
app.delete("/reservas/:id", async (req, res) => {
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

// 📌 Endpoint para actualizar una reserva por ID en MongoDB
app.put("/reservas/:id", async (req, res) => {
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

const authRoutes = require("./routes/auth");
const usuarioRoutes = require("./routes/usuarios");

app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);

// 📌 Iniciar servidor (SOLO UNA VEZ)
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
}); 

