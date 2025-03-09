import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Redirigir a Dashboard si el usuario está autenticado */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        
        {/* Ruta protegida: Si no hay usuario autenticado, redirige a Login */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />

        {/* Si la ruta no existe, redirigir según autenticación */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
      </Routes>
    </Router>
  );
}

export default App;
