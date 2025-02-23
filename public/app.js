document.addEventListener('DOMContentLoaded', () => {
    const reservaForm = document.getElementById('reservaForm');
    const listaReservas = document.getElementById('listaReservas');
  
    async function renderReservas() {
      try {
        const res = await fetch('http://localhost:3009/reservas');
        const reservas = await res.json();
        listaReservas.innerHTML = '';
        reservas.forEach(reserva => {
          const li = document.createElement('li');
          li.textContent = `ID: ${reserva.id}, Usuario: ${reserva.usuario}, Espacio: ${reserva.espacio}, Fecha y Hora: ${new Date(reserva.fecha).toLocaleString()}`;
          listaReservas.appendChild(li);
        });
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
      }
    }
  
    reservaForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('id').value;
      const usuario = document.getElementById('usuario').value;
      const espacio = document.getElementById('espacio').value;
      const fecha = document.getElementById('fecha').value;
      const hora = document.getElementById('hora').value;
  
      try {
        const res = await fetch('http://localhost:3009/reservas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id, usuario, espacio, fecha, hora })
        });
        const data = await res.json();
        console.log('Reserva creada:', data);
        reservaForm.reset();
        renderReservas();
      } catch (error) {
        console.error('Error al crear la reserva:', error);
      }
    });
  
    renderReservas();
  });
  