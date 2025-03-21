export const API_URL = "http://localhost:3009";

// ✅ Obtener reservas del usuario con autenticación
export const obtenerReservas = async (token) => {
  try {
    console.log("🔍 Enviando solicitud de reservas con token:", token); // Depuración

    const response = await fetch(`${API_URL}/reservas/mis-reservas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Opción 1
        "x-auth-token": token, // Opción 2 (algunas APIs lo requieren)
      },
    });

    const data = await response.json();
    console.log("📩 Respuesta del servidor:", data);

    return response.ok ? data : [];
  } catch (error) {
    console.error("❌ Error al obtener reservas:", error);
    return [];
  }
};

// ✅ Obtener lista de espacios disponibles
export const obtenerEspacios = async () => {
  try {
    const response = await fetch(`${API_URL}/espacios`);
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error("❌ Error al obtener espacios:", error);
    return [];
  }
};

// ✅ Crear una nueva reserva
export const crearReserva = async (token, reservaData) => {
  try {
    console.log("🔹 Enviando solicitud con token:", token);

    // ✅ Asegurar que la fecha se convierte en ISO antes de enviarla al backend
    const reservaDataFormatted = {
      ...reservaData,
      fecha: new Date(reservaData.fecha).toISOString(), // Convierte la fecha a formato ISO
    };

    const response = await fetch(`${API_URL}/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Mantén Authorization
        "x-auth-token": token, // Agrega x-auth-token
      },
      body: JSON.stringify(reservaDataFormatted),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.mensaje || "Error al crear la reserva");

    return { ok: true, nuevaReserva: data.nuevaReserva || data };
  } catch (error) {
    console.error("❌ Error al crear reserva:", error);
    return { ok: false, mensaje: error.message };
  }
};

// ✅ Crear un nuevo espacio (Solo Admin)
export const crearEspacio = async (token, espacioData) => {
  try {
    const response = await fetch(`${API_URL}/espacios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(espacioData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || "Error al crear el espacio");

    return { ok: true, espacio: data.espacio };
  } catch (error) {
    console.error("❌ Error al crear espacio:", error);
    return { ok: false, mensaje: error.message };
  }
};

// ✅ Actualizar un espacio (Solo Admin)
export const actualizarEspacio = async (token, espacioId, datosActualizados) => {
  try {
    const response = await fetch(`${API_URL}/espacios/${espacioId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(datosActualizados),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || "Error al actualizar el espacio");

    return { ok: true, espacio: data.espacio };
  } catch (error) {
    console.error("❌ Error al actualizar el espacio:", error);
    return { ok: false, mensaje: error.message };
  }
};

// ✅ Eliminar un espacio (Solo Admin)
export const eliminarEspacio = async (token, espacioId) => {
  try {
    const response = await fetch(`${API_URL}/espacios/${espacioId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.mensaje || "Error al eliminar el espacio");

    return { ok: true, mensaje: "Espacio eliminado correctamente" };
  } catch (error) {
    console.error("❌ Error al eliminar el espacio:", error);
    return { ok: false, mensaje: error.message };
  }
};
