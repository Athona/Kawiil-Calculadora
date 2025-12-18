import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Importación de Bootstrap (Asegúrate de haber instalado: npm install bootstrap)
import "bootstrap/dist/css/bootstrap.min.css";

// Estilos personalizados mínimos para el toque "formal/agresivo"
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
