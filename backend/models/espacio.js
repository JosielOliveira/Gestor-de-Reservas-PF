const mongoose = require("mongoose");

const espacioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  capacidad: { type: Number, required: true },
  ubicacion: { type: String, required: true }
});

const Espacio = mongoose.model("Espacio", espacioSchema);

module.exports = Espacio;
