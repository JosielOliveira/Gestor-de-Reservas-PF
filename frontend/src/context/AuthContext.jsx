import { createContext, useState, useEffect } from "react";

// Crear el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado del usuario

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("👀 Usuario en localStorage al cargar:", storedUser);
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("❌ Error al parsear el usuario almacenado:", error);
        localStorage.removeItem("user"); // Evitar datos corruptos
      }
    } else {
      // Si no hay usuario guardado, forzamos uno de prueba
      const testUser = { nombre: "Juan Pérez", email: "juan@example.com" };
      localStorage.setItem("user", JSON.stringify(testUser));
      setUser(testUser);
    }
  }, []);
  

  // Función para iniciar sesión
  const login = (userData) => {
    if (userData && userData.nombre) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData)); // Guardar en localStorage
    } else {
      console.error("❌ Datos de usuario inválidos en login:", userData);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
