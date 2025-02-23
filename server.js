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

// Endpoint para crear una reserva con validación
app.post('/reservas', (req, res) => {
    const { id, usuario, espacio, fecha, hora } = req.body;
    
    // Validación: asegúrate de que todos los campos estén presentes
    if (!id || !usuario || !espacio || !fecha || !hora) {
      return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
    }
    
    const nuevaReserva = new Reserva(id, usuario, espacio, fecha, hora);
    reservas.push(nuevaReserva);
    res.status(201).json({ mensaje: 'Reserva creada', reserva: nuevaReserva });
  });
  

// Endpoint para listar reservas
app.get('/reservas', (req, res) => {
  res.json(reservas);
});

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
