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
        li.textContent = `ID: ${reserva.id}, Usuario: ${reserva.usuario}, Espacio: ${reserva.espacio}, Fecha y Hora: ${reserva.fecha}`;

        // Botón para cancelar la reserva
        const btnCancelar = document.createElement('button');
        btnCancelar.textContent = 'Cancelar';
        btnCancelar.addEventListener('click', async () => {
          try {
            const resDelete = await fetch(`http://localhost:3009/reservas/${reserva.id}`, {
              method: 'DELETE'
            });
            if (resDelete.ok) {
              renderReservas();
            } else {
              console.error('Error al cancelar la reserva');
            }
          } catch (error) {
            console.error('Error al cancelar la reserva:', error);
          }
        });
        li.appendChild(btnCancelar);

        // Botón para editar la reserva
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', async () => {
          // Usamos prompt() para pedir nuevos valores (puedes mejorar esto en el futuro)
          const nuevoUsuario = prompt("Nuevo usuario:", reserva.usuario);
          const nuevoEspacio = prompt("Nuevo espacio:", reserva.espacio);
          // Se espera que la fecha se introduzca en formato "yyyy-mm-dd"
          const nuevaFecha = prompt("Nueva fecha (yyyy-mm-dd):", reserva.fecha.split(',')[0]);
          // Se espera que la hora se introduzca en formato "HH:mm"
          const nuevaHora = prompt("Nueva hora (HH:mm):", "15:00");

          if (!nuevoUsuario || !nuevoEspacio || !nuevaFecha || !nuevaHora) {
            alert("Todos los campos son requeridos");
            return;
          }

          try {
            const resUpdate = await fetch(`http://localhost:3009/reservas/${reserva.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                usuario: nuevoUsuario,
                espacio: nuevoEspacio,
                fecha: nuevaFecha,
                hora: nuevaHora
              })
            });
            if (resUpdate.ok) {
              renderReservas();
            } else {
              console.error('Error al actualizar la reserva');
            }
          } catch (error) {
            console.error('Error al actualizar la reserva:', error);
          }
        });
        li.appendChild(btnEditar);

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
