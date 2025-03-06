import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel() {
    const [reservas, setReservas] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Función para cargar las reservas desde el backend
        const fetchReservas = async () => {
            try {
                const response = await axios.get('http://localhost:3009/admin/reservas', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setReservas(response.data); // Almacenar las reservas en el estado
            } catch (err) {
                if (err.response) {
                    // El servidor respondió con un estado fuera del rango 2xx
                    console.error("Error en la respuesta del servidor:", err.response.status);
                    setError(err.response.data.message);
                } else if (err.request) {
                    // La petición fue hecha pero no se recibió respuesta
                    console.error("No response from server");
                    setError("No se pudo conectar al servidor.");
                } else {
                    // Algo más causó un error
                    console.error("Error loading reservations:", err.message);
                    setError(err.message);
                }
            }
        };

        fetchReservas(); // Llamar a la función al montar el componente
    }, []);

    return (
        <div>
            <h1>Panel de Administración - Reservas</h1>
            {error && <p>Error: {error}</p>}
            <ul>
                {reservas.length > 0 ? (
                    reservas.map(reserva => (
                        <li key={reserva.id}>
                            {reserva.nombre} - {reserva.fecha}
                        </li>
                    ))
                ) : (
                    <p>No hay reservas disponibles.</p>
                )}
            </ul>
        </div>
    );
}

export default AdminPanel;
