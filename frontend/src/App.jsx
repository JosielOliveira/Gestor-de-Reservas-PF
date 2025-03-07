import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <div>
        <h1>Gestor de Reservas</h1>

        {user ? (
          <>
            <p>Bienvenido, {user.nombre}!</p>
            <button onClick={logout}>Cerrar sesión</button>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
