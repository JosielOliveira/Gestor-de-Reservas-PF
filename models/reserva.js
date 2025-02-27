const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  espacio: { type: String, required: true },
  fecha: { type: Date, required: true },
  hora: { type: String, required: true }
});

const Reserva = mongoose.model("Reserva", reservaSchema);

module.exports = Reserva;
