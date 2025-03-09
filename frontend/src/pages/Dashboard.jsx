import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    if (user) {
      fetch("http://localhost:3009/reservas/mis-reservas", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => setReservas(data))
        .catch((error) => console.error("Error al obtener reservas:", error));
    }
  }, [user]);

  return (
    <div className="dashboard">
      <h1>Bienvenido, {user?.nombre || "Usuario"}!</h1>
      <button onClick={logout}>Cerrar sesión</button>

      <h2>Mis Reservas</h2>
      <ul>
        {reservas.length > 0 ? (
          reservas.map((reserva) => (
            <li key={reserva._id}>
              {reserva.espacio} - {reserva.fecha} a las {reserva.hora}
            </li>
          ))
        ) : (
          <p>No tienes reservas.</p>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;
