export class Reserva {
  constructor(id, usuario, espacio, fecha, hora) {
    this.id = id;
    this.usuario = usuario;
    this.espacio = espacio;
    // Se espera que 'fecha' venga en formato "yyyy-mm-dd" y 'hora' en "HH:mm".
    this.fecha = new Date(`${fecha}T${hora}:00`);
  }

  mostrarDetalle() {
    return `Reserva ${this.id}: ${this.usuario} ha reservado ${this.espacio} para el ${this.fecha.toLocaleString('es-ES', { hour12: false })}`;
  }

  // Sobreescribe la salida JSON para incluir la fecha local formateada y también la fecha y hora en formato ISO
  toJSON() {
    return {
      id: this.id,
      usuario: this.usuario,
      espacio: this.espacio,
      // Muestra la fecha en formato local (por ejemplo, "25/2/2025, 11:00:00")
      fecha: this.fecha.toLocaleString('es-ES', { hour12: false }),
      // Incluye la fecha en formato ISO (yyyy-mm-dd) para facilitar la edición
      rawFecha: this.fecha.toISOString().split('T')[0],
      // Incluye la hora en formato "HH:mm"
      rawHora: this.fecha.toISOString().split('T')[1].substring(0, 5)
    };
  }
}
