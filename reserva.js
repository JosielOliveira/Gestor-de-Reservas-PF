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
      return `Reserva ${this.id}: ${this.usuario} ha reservado ${this.espacio} para el ${this.fecha.toLocaleString('es-ES', { hour12: false })}`;
    }
  
    // Sobreescribe la serialización a JSON para mostrar la fecha en formato local consistente
    toJSON() {
      return {
        id: this.id,
        usuario: this.usuario,
        espacio: this.espacio,
        fecha: this.fecha.toLocaleString('es-ES', { hour12: false })
      };
    }
  }
  