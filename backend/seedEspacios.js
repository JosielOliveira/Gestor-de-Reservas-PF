const mongoose = require("mongoose");
const Espacio = require("./models/espacio"); // Asegúrate de que el nombre es correcto
require("dotenv").config();

// Conectar a MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
    console.log("✅ Conectado a MongoDB. Insertando espacios...");

    // Datos de espacios
    const espacios = [
    { nombre: "Sala de Danza", capacidad: 50, ubicacion: "Edificio A" },
    { nombre: "Sala de Juegos", capacidad: 30, ubicacion: "Edificio B" },
    { nombre: "Cama Elástica", capacidad: 10, ubicacion: "Área Recreativa" },
    { nombre: "Escalada", capacidad: 15, ubicacion: "Zona Exterior" },
    { nombre: "Sala Musical", capacidad: 20, ubicacion: "Edificio C" },
];

    // Limpiar la colección antes de insertar nuevos datos
    await Espacio.deleteMany({});
    console.log("🗑️ Espacios previos eliminados.");

    // Insertar los nuevos espacios
    await Espacio.insertMany(espacios);
    console.log("✅ Espacios insertados correctamente.");

    // Cerrar conexión
    mongoose.connection.close();
})
.catch((error) => console.error("❌ Error al conectar con MongoDB:", error));
