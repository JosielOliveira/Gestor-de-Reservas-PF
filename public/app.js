document.addEventListener('DOMContentLoaded', () => {
    const reservaForm = document.getElementById('reservaForm');
    const listaReservas = document.getElementById('listaReservas');
  
    // Función para renderizar las reservas en la lista
    async function renderReservas() {
      try {
        const res = await fetch('http://localhost:3009/reservas');
        const reservas = await res.json();
        listaReservas.innerHTML = '';
        reservas.forEach(reserva => {
          const li = document.createElement('li');
          li.textContent = `ID: ${reserva.id}, Usuario: ${reserva.usuario}, Espacio: ${reserva.espacio}, Fecha: ${new Date(reserva.fecha).toLocaleDateString()}`;
          listaReservas.appendChild(li);
        });
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
      }
    }
  
    // Evento para el envío del formulario (creación de reserva)
    reservaForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('id').value;
      const usuario = document.getElementById('usuario').value;
      const espacio = document.getElementById('espacio').value;
      const fecha = document.getElementById('fecha').value;
  
      try {
        const res = await fetch('http://localhost:3009/reservas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id, usuario, espacio, fecha })
        });
        const data = await res.json();
        console.log('Reserva creada:', data);
        reservaForm.reset();
        renderReservas();
      } catch (error) {
        console.error('Error al crear la reserva:', error);
      }
    });
  
    // Cargar la lista de reservas al iniciar
    renderReservas();
  });
  