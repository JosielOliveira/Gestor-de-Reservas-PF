export class Reserva {
    constructor(id, usuario, espacio, fecha, hora) {
      this.id = id;
      this.usuario = usuario;
      this.espacio = espacio;
      // Combina la fecha y la hora en un solo objeto Date.
      // Agregamos ":00" para los segundos.
      this.fecha = new Date(`${fecha}T${hora}:00`);
    }
  
    mostrarDetalle() {
      return `Reserva ${this.id}: ${this.usuario} ha reservado ${this.espacio} para el ${this.fecha.toLocaleString()}`;
    }
  }
  