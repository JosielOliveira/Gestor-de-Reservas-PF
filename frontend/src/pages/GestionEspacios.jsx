import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { obtenerEspacios, crearEspacio, actualizarEspacio, eliminarEspacio } from "../services/api";

function GestionEspacios() {
    const { user } = useContext(AuthContext);
    const [espacios, setEspacios] = useState([]);
    const [nombre, setNombre] = useState("");
    const [capacidad, setCapacidad] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        cargarEspacios();
    }, []);

    const cargarEspacios = async () => {
        try {
            const data = await obtenerEspacios();
            setEspacios(data);
        } catch (error) {
            console.error("Error al obtener espacios:", error);
        }
    };

    const handleCrearEspacio = async (e) => {
        e.preventDefault();
        if (!nombre || !capacidad || !ubicacion) {
            setMensaje("⚠️ Todos los campos son obligatorios.");
            return;
        }

        try {
            const nuevoEspacio = await crearEspacio(user.token, { nombre, capacidad, ubicacion });
            setEspacios([...espacios, nuevoEspacio.espacio]);
            setMensaje("✅ Espacio creado correctamente.");
            setNombre("");
            setCapacidad("");
            setUbicacion("");
        } catch (error) {
            console.error("Error al crear espacio:", error);
            setMensaje("❌ No se pudo crear el espacio.");
        }
    };

    const handleEliminarEspacio = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este espacio?")) return;

        try {
            await eliminarEspacio(user.token, id);
            setEspacios(espacios.filter((espacio) => espacio._id !== id));
            setMensaje("🗑️ Espacio eliminado correctamente.");
        } catch (error) {
            console.error("Error al eliminar espacio:", error);
            setMensaje("❌ No se pudo eliminar el espacio.");
        }
    };

    return (
        <div className="container">
            <h2>Gestión de Espacios</h2>
            {mensaje && <p className="mensaje">{mensaje}</p>}

            <h3>Crear Nuevo Espacio</h3>
            <form onSubmit={handleCrearEspacio}>
                <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                <input type="number" placeholder="Capacidad" value={capacidad} onChange={(e) => setCapacidad(e.target.value)} required />
                <input type="text" placeholder="Ubicación" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} required />
                <button type="submit">Crear Espacio</button>
            </form>

            <h3>Lista de Espacios</h3>
            <ul>
                {espacios.length === 0 ? (
                    <p>No hay espacios registrados.</p>
                ) : (
                    espacios.map((espacio) => (
                        <li key={espacio._id}>
                            <strong>{espacio.nombre}</strong> - Capacidad: {espacio.capacidad} - Ubicación: {espacio.ubicacion}
                            <button onClick={() => handleEliminarEspacio(espacio._id)}>Eliminar</button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default GestionEspacios;
