import express from 'express';
import cors from 'cors';
import { Reserva } from './reserva.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

let reservas = []; // Almacenamiento en memoria para el MVP

// Endpoint para crear una reserva
app.post('/reservas', (req, res) => {
  const { id, usuario, espacio, fecha } = req.body;
  const nuevaReserva = new Reserva(id, usuario, espacio, fecha);
  reservas.push(nuevaReserva);
  res.status(201).json({ mensaje: 'Reserva creada', reserva: nuevaReserva });
});

// Endpoint para listar reservas
app.get('/reservas', (req, res) => {
  res.json(reservas);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
