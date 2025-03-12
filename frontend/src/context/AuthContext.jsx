import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("📌 Usuario recuperado de localStorage:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("❌ Error al parsear el usuario almacenado:", error);
        localStorage.removeItem("user"); // Evitar datos corruptos
      }
    }
  }, []);

  const login = (userData) => {
    if (userData && userData.token) {
      const userInfo = {
        id: userData.usuario.id,
        nombre: userData.usuario.nombre,
        email: userData.usuario.email,
        rol: userData.usuario.rol,
        token: userData.token,
      };

      setUser(userInfo);
      localStorage.setItem("user", JSON.stringify(userInfo)); // Guardar en localStorage
    } else {
      console.error("❌ Datos de usuario inválidos en login:", userData);
    }
  };

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
