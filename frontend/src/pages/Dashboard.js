import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
    const [reservas, setReservas] = useState([]);  // Estado para almacenar las reservas

    useEffect(() => {
        // Función para cargar las reservas desde el backend
        const fetchReservas = async () => {
            try {
                const response = await axios.get('http://localhost:3009/reservas');  // Ajusta la URL según tu configuración
                setReservas(response.data);  // Almacenar las reservas en el estado
            } catch (error) {
                console.error('Error al cargar las reservas:', error);
            }
        };

        fetchReservas();  // Llamar a la función al montar el componente
    }, []);  // El array vacío asegura que el efecto solo se ejecute una vez al montar

    return (
        <div>
            <h1>Dashboard - Lista de Reservas</h1>
            {reservas.length > 0 ? (
                <ul>
                    {reservas.map(reserva => (
                        <li key={reserva.id}>
                            {reserva.nombre} - {reserva.fecha}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay reservas disponibles.</p>
            )}
        </div>
    );
}

export default Dashboard;
