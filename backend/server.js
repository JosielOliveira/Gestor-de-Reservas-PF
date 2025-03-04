require("dotenv").config(); // Cargar variables de entorno

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

// 📌 Importar rutas
const authRoutes = require("./routes/auth");
const usuarioRoutes = require("./routes/usuarios");
const reservasRoutes = require("./routes/reservas");
const espaciosRoutes = require("./routes/espacios");

// 📌 Conexión a MongoDB Atlas usando variable de entorno
const MONGO_URI = process.env.MONGO_URI;

const conectarDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error al conectar MongoDB Atlas:", err);
    process.exit(1); // Finaliza la ejecución si hay un error crítico en la conexión
  }
};
conectarDB();

const app = express();
const PORT = process.env.PORT || 3009;

// 📌 Middlewares
app.use(express.json());
app.use(cors());

// 📌 Rutas protegidas
app.use("/reservas", reservasRoutes);

// 📌 Otras rutas
app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/espacios", espaciosRoutes); // ✅ AHORA ESTÁ CORRECTO

// 📌 Iniciar servidor (SOLO UNA VEZ)
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// 📌 Manejo de errores inesperados para evitar que el servidor se caiga
process.on("uncaughtException", (err) => {
  console.error("❌ Error no controlado:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Promesa rechazada sin manejar:", promise, "Razón:", reason);
});
