import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { obtenerReservas, obtenerEspacios, crearReserva } from "../services/api"; // ✅ Importamos las funciones

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [reservas, setReservas] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [nuevoEspacio, setNuevoEspacio] = useState("");
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    document.title = "Dashboard - Gestor de Reservas";

    const fetchData = async () => {
      if (!user || !user.token) return;

      const reservasData = await obtenerReservas(user.token);
      const espaciosData = await obtenerEspacios();

      setReservas(reservasData);
      setEspacios(espaciosData);
    };

    fetchData();
  }, [user]);

  const handleReserva = async (e) => {
    e.preventDefault();
    setMensaje(""); // Limpia el mensaje anterior

    if (!nuevoEspacio || !nuevaFecha || !nuevaHora) {
      setMensaje("⚠️ Todos los campos son obligatorios.");
      return;
    }

    console.log("🔹 Token antes de hacer la reserva:", user?.token);

    const reservaData = {
      espacio: nuevoEspacio,
      fecha: nuevaFecha, // Mantiene el formato correcto
      hora: nuevaHora,
    };

    const respuesta = await crearReserva(user.token, reservaData);
    
    if (respuesta.ok) {
      setMensaje("✅ Reserva creada con éxito.");
      setReservas((prevReservas) => [...prevReservas, respuesta.nuevaReserva]); // Actualiza sin F5
      setNuevoEspacio("");
      setNuevaFecha("");
      setNuevaHora("");
    } else {
      setMensaje(`❌ Error: ${respuesta.mensaje || "No se pudo crear la reserva."}`);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Hola, {user?.nombre}!</h1>
      <button className="logout-button" onClick={logout}>
        Cerrar sesión
      </button>

      <h2>Mis Reservas</h2>
      {reservas.length === 0 ? (
        <p>No tienes reservas.</p>
      ) : (
        <ul>
          {reservas.map((reserva, index) => (
            <li key={reserva._id || reserva.id || index}>
              <strong>Espacio:</strong> {reserva.espacio} - 
              <strong> Fecha:</strong> {reserva.fecha || "Fecha no válida"}
              <strong> Hora:</strong> {reserva.hora}
            </li>
          ))}
        </ul>
      )}

      <h2>Hacer una nueva reserva</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}
      <form onSubmit={handleReserva}>
        <div>
          <label>Espacio:</label>
          <select value={nuevoEspacio} onChange={(e) => setNuevoEspacio(e.target.value)} required>
            <option value="">Selecciona un espacio</option>
            {espacios.map((espacio) => (
              <option key={espacio.id} value={espacio.id}>
                {espacio.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Fecha:</label>
          <input type="date" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} required />
        </div>
        <div>
          <label>Hora:</label>
          <input type="time" value={nuevaHora} onChange={(e) => setNuevaHora(e.target.value)} required />
        </div>
        <button type="submit">Reservar</button>
      </form>
    </div>
  );
}

export default Dashboard;
