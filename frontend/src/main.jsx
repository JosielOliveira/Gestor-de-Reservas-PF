import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // ✅ Importamos el contexto

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ Ahora toda la app tiene acceso a la autenticación */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
