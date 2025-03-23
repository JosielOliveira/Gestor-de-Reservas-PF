import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  obtenerEspacios,
  crearEspacio,
  eliminarEspacio,
  actualizarEspacio,
} from "../services/api";

function GestionEspacios() {
  const { user } = useContext(AuthContext);
  const [espacios, setEspacios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [editando, setEditando] = useState(null); // id del espacio que se edita

  const cargarEspacios = async () => {
    try {
      const data = await obtenerEspacios();
      setEspacios(data);
    } catch (error) {
      console.error("Error al obtener espacios:", error);
    }
  };

  useEffect(() => {
    cargarEspacios();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!nombre || !capacidad || !ubicacion) return;

    const nuevo = await crearEspacio(user.token, {
      nombre,
      capacidad,
      ubicacion,
    });

    if (nuevo.ok) {
      setMensaje("✅ Espacio creado correctamente.");
      setNombre("");
      setCapacidad("");
      setUbicacion("");
      cargarEspacios();
    } else {
      setMensaje("❌ " + nuevo.mensaje);
    }
  };

  const handleEliminar = async (id) => {
    const confirmacion = confirm("¿Eliminar este espacio?");
    if (!confirmacion) return;

    const resultado = await eliminarEspacio(user.token, id);
    if (resultado.ok) {
      setMensaje("✅ Espacio eliminado.");
      cargarEspacios();
    } else {
      setMensaje("❌ " + resultado.mensaje);
    }
  };

  const handleEditar = (espacio) => {
    setEditando(espacio._id);
    setNombre(espacio.nombre);
    setCapacidad(espacio.capacidad);
    setUbicacion(espacio.ubicacion);
  };

  const handleActualizar = async (e) => {
    e.preventDefault();

    const resultado = await actualizarEspacio(user.token, editando, {
      nombre,
      capacidad,
      ubicacion,
    });

    if (resultado.ok) {
      setMensaje("✅ Espacio actualizado.");
      setEditando(null);
      setNombre("");
      setCapacidad("");
      setUbicacion("");
      cargarEspacios();
    } else {
      setMensaje("❌ " + resultado.mensaje);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center">Gestión de Espacios</h2>
      <h3 className="text-lg text-center mb-4">
        {editando ? "Editar Espacio" : "Crear Nuevo Espacio"}
      </h3>

      <form onSubmit={editando ? handleActualizar : handleCrear} className="space-y-2">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Capacidad"
          value={capacidad}
          onChange={(e) => setCapacidad(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">
          {editando ? "Actualizar" : "Crear Espacio"}
        </button>
        {mensaje && <p className="text-center text-sm mt-2">{mensaje}</p>}
      </form>

      <h3 className="text-xl mt-6 font-semibold text-center">Lista de Espacios</h3>
      <ul className="mt-4 space-y-2">
        {espacios.map((espacio) => (
          <li key={espacio._id} className="bg-gray-100 p-3 rounded shadow">
            <p>
              <strong>{espacio.nombre}</strong> - Capacidad: {espacio.capacidad} - Ubicación: {espacio.ubicacion}
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEditar(espacio)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminar(espacio._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GestionEspacios;
