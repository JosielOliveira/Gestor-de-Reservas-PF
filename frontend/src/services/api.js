const API_URL = "http://localhost:3009";

// ✅ Obtener reservas del usuario
export const obtenerReservas = async (token) => {
  try {
    const response = await fetch(`${API_URL}/reservas/mis-reservas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok ? await response.json() : [];
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
    const response = await fetch(`${API_URL}/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservaData),
    });

    return response.ok ? await response.json() : { ok: false };
  } catch (error) {
    console.error("❌ Error al crear reserva:", error);
    return { ok: false };
  }
};
