document.addEventListener('DOMContentLoaded', () => {
  const reservaForm = document.getElementById('reservaForm');
  const listaReservas = document.getElementById('listaReservas');
  const espacioSelect = document.getElementById('espacioSelect');

  // Función para cargar los espacios deportivos en el select
  async function loadEspacios() {
    try {
      const res = await fetch('http://localhost:3009/espacios');
      const espacios = await res.json();
      espacioSelect.innerHTML = '';
      espacios.forEach(espacio => {
        const option = document.createElement('option');
        option.value = espacio.nombre;
        option.textContent = espacio.nombre;
        espacioSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar espacios:', error);
    }
  }

  // Función para renderizar la lista de reservas
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
          // Usamos los valores rawFecha y rawHora para obtener datos en formato ISO
          const nuevoUsuario = prompt("Nuevo usuario:", reserva.usuario);
          const nuevoEspacio = prompt("Nuevo espacio:", reserva.espacio);
          const nuevaFecha = prompt("Nueva fecha (yyyy-mm-dd):", reserva.rawFecha);
          const nuevaHora = prompt("Nueva hora (HH:mm):", reserva.rawHora);

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

  // Evento submit para crear una reserva
  reservaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('id').value;
    const usuario = document.getElementById('usuario').value;
    // Obtenemos el valor seleccionado del select de espacios
    const espacio = espacioSelect.value;
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

  // Cargar espacios y reservas al inicio
  loadEspacios();
  renderReservas();
});
