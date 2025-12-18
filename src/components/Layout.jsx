// Layout.jsx
import React, { useState, useEffect } from "react";
import { themes, applyTheme } from "../utils/themeService";
import ThemeCreator from "../utils/themeCreator.jsx";
import Logo from "../components/Logo";

const Layout = ({ children, activeTab, setActiveTab }) => {
  const [currentTheme, setCurrentTheme] = useState("dark");

  // Inicializar tema al cargar
  useEffect(() => {
    const savedThemeName = localStorage.getItem("kawiil_theme_name") || "dark";
    setCurrentTheme(savedThemeName);
  }, []);

  // Función para aplicar tema predefinido
  const applyPredefinedTheme = (themeName) => {
    const theme = themes[themeName];
    if (theme) {
      applyTheme(theme);
      setCurrentTheme(themeName);
      localStorage.setItem("kawiil_theme_name", themeName);
    }
  };

  // Función segura para cerrar el Offcanvas
  const handleCloseSidebar = () => {
    const element = document.getElementById("kawiilSidebar");
    if (element && window.bootstrap) {
      const instance = window.bootstrap.Offcanvas.getInstance(element);
      instance?.hide();
    }
  };

  const mainLinks = [
    { id: "home", label: "Inicio", icon: "🏠" },

    { id: "history", label: "Reporte Técnico", icon: "📜" },
  ];

  return (
    <>
      {/* 1. NAVBAR SUPERIOR */}
      <nav
        className="navbar navbar-dark bg-dark sticky-top shadow-sm"
        style={{
          zIndex: 1050,
          backgroundColor: "var(--kawiil-bg, #121212)",
          borderBottom: "2px solid var(--kawiil-gold, #d4af37)",
        }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#kawiilSidebar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <span className="navbar-brand fw-bold text-gold mx-auto">
            K'AWIIL ELECT
          </span>

          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm fw-bold ${
                activeTab === "config" ? "btn-gold" : "btn-outline-warning"
              }`}
              onClick={() => {
                setActiveTab("config");
                handleCloseSidebar();
              }}
              title="Configuración"
            >
              ⚙️ CONFIG
            </button>
            <button
              className={`btn btn-sm fw-bold ${
                activeTab === "history" ? "btn-gold" : "btn-outline-warning"
              }`}
              onClick={() => {
                setActiveTab("history");
                handleCloseSidebar();
              }}
              title="Reporte Técnico"
            >
              📜 REPORTE
            </button>
          </div>
        </div>
      </nav>

      {/* 2. SIDEBAR (OFFCANVAS) */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="kawiilSidebar"
        style={{
          backgroundColor: "var(--kawiil-bg, #121212)",
          color: "var(--kawiil-text, #f8f9fa)",
          borderRight: "3px solid var(--kawiil-gold, #d4af37)",
          width: "300px",
        }}
      >
        <div className="offcanvas-header border-bottom border-secondary">
          <h5 className="offcanvas-title text-gold fw-bold">
            <i className="bi bi-menu-button-wide me-2"></i>
            MENÚ DE NAVEGACIÓN
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body p-0 d-flex flex-column">
          {/* LOGO Y TÍTULO */}
          <div className="text-center py-4 border-bottom border-secondary">
            <Logo
              variant="light"
              width={80}
              height={80}
              className="logo-glow mb-2"
            />
            <h6 className="text-gold fw-bold mb-1">K'AWIIL ELECT</h6>
            <small className="text-muted">Engineering Suite v2.1</small>
          </div>

          {/* SECCIÓN DE LINKS PRINCIPALES */}
          <div className="list-group list-group-flush mt-3">
            {mainLinks.map((link) => (
              <button
                key={link.id}
                className={`list-group-item list-group-item-action border-0 py-3 ps-4 ${
                  activeTab === link.id ? "active-premium-link" : ""
                }`}
                style={{
                  backgroundColor: "transparent",
                  color: "var(--kawiil-text, #f8f9fa)",
                }}
                onClick={() => {
                  setActiveTab(link.id);
                  handleCloseSidebar();
                }}
              >
                <span className="me-3 fs-5">{link.icon}</span>
                <span className="fw-bold">{link.label}</span>
              </button>
            ))}
          </div>

          {/* SECCIÓN DE TEMAS RÁPIDOS */}
          <div className="mt-auto p-3 border-top border-secondary">
            <label className="small fw-bold text-gold mb-3 d-block">
              <i className="bi bi-palette me-1"></i> TEMAS RÁPIDOS
            </label>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <button
                  className={`btn btn-sm w-100 ${
                    currentTheme === "dark"
                      ? "btn-warning text-dark"
                      : "btn-outline-warning"
                  }`}
                  onClick={() => applyPredefinedTheme("dark")}
                  title="Tema Oscuro"
                >
                  🌙 Oscuro
                </button>
              </div>
              <div className="col-6">
                <button
                  className={`btn btn-sm w-100 ${
                    currentTheme === "light"
                      ? "btn-warning text-dark"
                      : "btn-outline-warning"
                  }`}
                  onClick={() => applyPredefinedTheme("light")}
                  title="Tema Claro"
                >
                  ☀️ Claro
                </button>
              </div>
              <div className="col-6">
                <button
                  className={`btn btn-sm w-100 ${
                    currentTheme === "hacker"
                      ? "btn-warning text-dark"
                      : "btn-outline-warning"
                  }`}
                  onClick={() => applyPredefinedTheme("hacker")}
                  title="Modo Hacker"
                >
                  💻 Hacker
                </button>
              </div>
              <div className="col-6">
                <button
                  className={`btn btn-sm w-100 ${
                    currentTheme === "engineering"
                      ? "btn-warning text-dark"
                      : "btn-outline-warning"
                  }`}
                  onClick={() => applyPredefinedTheme("engineering")}
                  title="Tema Ingeniería"
                >
                  🔧 Ingeniería
                </button>
              </div>
            </div>

            {/* ENLACE A CONFIGURACIÓN COMPLETA */}
            <button
              className="btn btn-outline-info btn-sm w-100 mb-3"
              onClick={() => {
                setActiveTab("config");
                handleCloseSidebar();
              }}
            >
              <i className="bi bi-sliders me-1"></i>
              Configuración Completa
            </button>

            {/* BOTÓN DE RESET */}
            <button
              className="btn btn-outline-danger btn-sm w-100 border-0"
              onClick={() => {
                if (
                  window.confirm(
                    "¿Deseas resetear toda la configuración?\nEl historial de cálculos se mantendrá."
                  )
                ) {
                  localStorage.removeItem("kawiil_custom_theme");
                  localStorage.removeItem("kawiil_theme_name");
                  localStorage.removeItem("kawiil_project");
                  localStorage.removeItem("kawiil_responsable");
                  localStorage.removeItem("kawiil_extra");
                  applyPredefinedTheme("dark");
                  window.location.reload();
                }
              }}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Resetear Configuración
            </button>
          </div>
        </div>
      </div>

      {/* 3. CONTENIDO PRINCIPAL */}
      <main
        className="container py-4"
        style={{
          minHeight: "calc(100vh - 76px)",
          backgroundColor: "var(--kawiil-bg, #121212)",
          color: "var(--kawiil-text, #f8f9fa)",
        }}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;
