import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:3009/reservas", { headers: { Authorization: `Bearer ${token}` } })
      .then(response => setReservas(response.data))
      .catch(error => console.error("Error obteniendo reservas:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Reservas</h1>
      <ul className="space-y-2">
        {reservas.map((reserva) => (
          <li key={reserva._id} className="p-4 bg-gray-100 rounded">
            {reserva.nombre} - {reserva.fecha}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
