import React from "react";
import { themes, applyTheme } from "../utils/themeService";
// IMPORTANTE: Asegúrate de que el nombre del archivo coincida exactamente
import ThemeCreator from "../utils/themeCreator.jsx";

const Layout = ({ children, activeTab, setActiveTab }) => {
  const links = [
    { id: "home", label: "Inicio", icon: "🏠" },
    { id: "history", label: "Reporte Técnico", icon: "📜" },
  ];

  // Función segura para cerrar el Offcanvas
  const handleCloseSidebar = () => {
    const element = document.getElementById("kawiilSidebar");
    if (element && window.bootstrap) {
      const instance = window.bootstrap.Offcanvas.getInstance(element);
      instance?.hide();
    }
  };

  return (
    <>
      {/* 1. NAVBAR SUPERIOR (Agregué z-index para que no lo tape nada) */}
      <nav
        className="navbar navbar-dark bg-dark sticky-top shadow-sm"
        style={{ zIndex: 1050 }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#kawiilSidebar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <span className="navbar-brand fw-bold text-gold mx-auto">
            K'AWIIL ELECT
          </span>

          <button
            className={`btn btn-sm fw-bold ${
              activeTab === "history" ? "btn-gold" : "btn-outline-warning"
            }`}
            onClick={() => {
              setActiveTab("history");
              handleCloseSidebar();
            }}
          >
            📜 REPORTE
          </button>
        </div>
      </nav>

      {/* 2. SIDEBAR (OFFCANVAS) */}
      <div
        className="offcanvas offcanvas-start bg-dark text-white"
        tabIndex="-1"
        id="kawiilSidebar"
        style={{ borderRight: "3px solid var(--kawiil-gold)", width: "300px" }}
      >
        <div className="offcanvas-header border-bottom border-secondary">
          <h5 className="offcanvas-title text-gold fw-bold">
            MENÚ DE NAVEGACIÓN
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>

        <div className="offcanvas-body p-0 d-flex flex-column">
          {/* SECCIÓN DE LINKS */}
          <div className="list-group list-group-flush mt-3">
            {links.map((link) => (
              <button
                key={link.id}
                className={`list-group-item list-group-item-action bg-transparent text-white border-0 py-3 ps-4 ${
                  activeTab === link.id ? "active-premium-link" : ""
                }`}
                onClick={() => {
                  setActiveTab(link.id);
                  handleCloseSidebar();
                }}
              >
                <span className="me-3">{link.icon}</span> {link.label}
              </button>
            ))}
          </div>

          <hr className="border-secondary mx-3" />

          {/* PANEL DE PERSONALIZACIÓN - Aquí forzamos que se vea */}
          <div className="px-3 pb-5 mt-auto">
            <label className="small fw-bold text-gold mb-3 d-block text-uppercase opacity-75">
              Personalización
            </label>

            <select
              className="form-select bg-dark text-white border-secondary mb-4 shadow-none"
              onChange={(e) => applyTheme(themes[e.target.value])}
            >
              <option value="dark">Tema Oscuro</option>
              <option value="light">Tema Claro</option>
              <option value="hacker">Modo Hacker</option>
            </select>

            {/* CONTENEDOR DEL CREADOR */}
            <div
              className="border border-secondary rounded p-2"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              <ThemeCreator />
            </div>

            <div className="mt-4 pt-3 border-top border-secondary">
              <button
                className="btn btn-outline-danger btn-sm w-100 border-0"
                onClick={() => {
                  if (
                    window.confirm(
                      "¿Deseas resetear la configuración y el historial?"
                    )
                  ) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                Resetear Aplicación
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CONTENIDO PRINCIPAL */}
      <main className="container py-4">{children}</main>
    </>
  );
};

export default Layout;
