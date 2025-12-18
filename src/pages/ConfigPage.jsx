import React, { useState, useEffect } from "react";
import {
  themes,
  applyTheme,
  getCurrentThemeName,
  getSavedTheme,
} from "../utils/themeService";
import ThemeCreator from "../utils/themeCreator.jsx";

const ConfigPage = () => {
  const [currentThemeName, setCurrentThemeName] = useState(
    getCurrentThemeName()
  );
  const [currentTheme, setCurrentTheme] = useState(getSavedTheme());
  const [advancedMode, setAdvancedMode] = useState(false);
  const [appVersion] = useState("v2.1.0");
  const [developerMode, setDeveloperMode] = useState(false);
  const [language, setLanguage] = useState(
    localStorage.getItem("kawiil_language") || "es"
  );

  // Escuchar cambios en el tema
  useEffect(() => {
    const handleThemeChange = () => {
      setCurrentThemeName(getCurrentThemeName());
      setCurrentTheme(getSavedTheme());
    };

    window.addEventListener("themeChanged", handleThemeChange);
    return () => window.removeEventListener("themeChanged", handleThemeChange);
  }, []);

  // Función para calcular el contraste
  const getContrastColor = (hexColor) => {
    // Convertir hex a RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calcular luminosidad (fórmula estándar)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Retornar blanco o negro dependiendo del fondo
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  // Función para aplicar un tema predefinido
  const applyPredefinedTheme = (themeName) => {
    const theme = themes[themeName];
    if (theme) {
      applyTheme(theme, themeName);
      setCurrentThemeName(themeName);
      setCurrentTheme(theme);
    }
  };

  // Función para cambiar idioma
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("kawiil_language", lang);
    // Podrías añadir un evento para notificar el cambio a toda la app
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
  };

  // Idiomas disponibles
  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

  // Obtener estadísticas de uso
  const getUsageStats = () => {
    const history = JSON.parse(localStorage.getItem("kawiil_history") || "[]");
    const calculations = history.length;
    const calculators = {};

    history.forEach((item) => {
      calculators[item.calculator] = (calculators[item.calculator] || 0) + 1;
    });

    return { calculations, calculators };
  };

  const stats = getUsageStats();

  // Función para exportar configuración
  const exportConfig = () => {
    const config = {
      version: appVersion,
      timestamp: new Date().toISOString(),
      project: localStorage.getItem("kawiil_project") || "Proyecto_Kawiil",
      responsable: localStorage.getItem("kawiil_responsable") || "",
      extraData: localStorage.getItem("kawiil_extra") || "",
      theme: getSavedTheme(),
      themeName: getCurrentThemeName(),
      language: localStorage.getItem("kawiil_language") || "es",
      usageStats: stats,
      preferences: {
        animations: localStorage.getItem("kawiil_animations") !== "false",
        sounds: localStorage.getItem("kawiil_sounds") !== "false",
        autoSave: localStorage.getItem("kawiil_autosave") === "true",
      },
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Kawiil_Config_${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
  };

  // Función para importar configuración
  const importConfig = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const config = JSON.parse(event.target.result);

          if (config.project)
            localStorage.setItem("kawiil_project", config.project);
          if (config.responsable)
            localStorage.setItem("kawiil_responsable", config.responsable);
          if (config.extraData)
            localStorage.setItem("kawiil_extra", config.extraData);
          if (config.theme) {
            applyTheme(config.theme, config.themeName || "custom");
          }
          if (config.language) {
            changeLanguage(config.language);
          }

          alert("Configuración importada con éxito");
        } catch (error) {
          alert("Error al importar configuración: " + error.message);
        }
      };

      reader.readAsText(file);
    };

    input.click();
  };

  // Función para resetear configuración (pero NO el tema actual)
  const resetConfig = () => {
    if (
      window.confirm(
        "¿Estás seguro de querer resetear la configuración?\nEsto NO afectará el historial de cálculos ni el tema actual."
      )
    ) {
      localStorage.removeItem("kawiil_project");
      localStorage.removeItem("kawiil_responsable");
      localStorage.removeItem("kawiil_extra");

      alert("Configuración restablecida (el tema se mantiene)");
    }
  };

  // Toggle modo desarrollador
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setDeveloperMode(!developerMode);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [developerMode]);

  return (
    <div className="container animate__animated animate__fadeIn">
      <div
        className="premium-card p-4 mb-4 shadow-sm border-warning"
        style={{
          backgroundColor: "var(--kawiil-card)",
          color: "var(--kawiil-text)",
        }}
      >
        <h2 className="text-gold fw-bold mb-4">⚙️ Configuración Avanzada</h2>

        {/* Estado actual del tema - MEJORADO */}
        <div
          className="alert mb-4"
          style={{
            backgroundColor: "rgba(77, 171, 247, 0.1)",
            borderColor: "var(--kawiil-gold)",
            borderLeft: "4px solid var(--kawiil-gold)",
          }}
        >
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="mb-2 mb-md-0">
              <div className="d-flex align-items-center mb-2">
                <strong className="me-2">Tema actual:</strong>
                <span className="badge bg-warning text-dark px-3 py-2">
                  {currentThemeName === "custom"
                    ? "🎨 Personalizado"
                    : currentThemeName === "hacker"
                    ? "💻 Hacker"
                    : currentThemeName === "engineering"
                    ? "🔧 Ingeniería"
                    : currentThemeName === "light"
                    ? "☀️ Claro"
                    : "🌙 Oscuro"}
                </span>
              </div>

              <div className="d-flex align-items-center flex-wrap gap-3">
                {Object.entries(currentTheme).map(([key, value]) => (
                  <div key={key} className="d-flex align-items-center">
                    <span className="me-2 small">{key}:</span>
                    <div
                      className="color-preview d-flex align-items-center justify-content-center rounded"
                      style={{
                        width: "24px",
                        height: "24px",
                        backgroundColor: value,
                        border: "1px solid #ccc",
                        marginRight: "5px",
                      }}
                      title={`${key}: ${value}`}
                    >
                      <span
                        className="small fw-bold"
                        style={{
                          color: getContrastColor(value),
                          fontSize: "10px",
                          lineHeight: "1",
                        }}
                      >
                        █
                      </span>
                    </div>
                    <span
                      className="color-code small px-2 py-1 rounded"
                      style={{
                        backgroundColor: getContrastColor(value),
                        color: value,
                        fontFamily: "monospace",
                        minWidth: "80px",
                        textAlign: "center",
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="btn btn-sm btn-outline-warning"
              onClick={() => window.location.reload()}
            >
              🔄 Actualizar
            </button>
          </div>
        </div>

        {/* Sección de Idiomas */}
        <div
          className="card mb-4 border-secondary"
          style={{
            backgroundColor: "var(--kawiil-card)",
          }}
        >
          <div
            className="card-header d-flex justify-content-between align-items-center"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              color: "var(--kawiil-gold)",
              borderBottom: "2px solid var(--kawiil-gold)",
            }}
          >
            <h5 className="mb-0">🌐 Idioma / Language</h5>
            <span className="badge bg-gold text-dark">
              {languages.find((l) => l.code === language)?.flag}{" "}
              {languages.find((l) => l.code === language)?.name}
            </span>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {languages.map((lang) => (
                <div className="col-md-3 col-6" key={lang.code}>
                  <button
                    className={`btn w-100 py-3 ${
                      language === lang.code
                        ? "btn-gold"
                        : "btn-outline-warning"
                    }`}
                    onClick={() => changeLanguage(lang.code)}
                    style={{
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div className="fs-4 mb-1">{lang.flag}</div>
                    <div className="fw-bold">{lang.name}</div>
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center">
              <small className="text-muted">
                El cambio de idioma afectará los textos de la interfaz. Algunas
                partes pueden requerir recarga.
              </small>
            </div>
          </div>
        </div>

        {/* Sección de Temas */}
        <div
          className="card mb-4 border-secondary"
          style={{
            backgroundColor: "var(--kawiil-card)",
          }}
        >
          <div
            className="card-header"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              color: "var(--kawiil-gold)",
              borderBottom: "2px solid var(--kawiil-gold)",
            }}
          >
            <h5 className="mb-0">🎨 Temas Predefinidos</h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <div
                  className="theme-card p-3 rounded cursor-pointer border h-100"
                  style={{
                    backgroundColor: "#121212",
                    color: "#f8f9fa",
                    borderColor:
                      currentThemeName === "dark"
                        ? "var(--kawiil-gold)"
                        : "#444",
                  }}
                  onClick={() => applyPredefinedTheme("dark")}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="mb-0">🌙 Oscuro</h6>
                    {currentThemeName === "dark" && (
                      <span className="badge bg-warning text-dark">Activo</span>
                    )}
                  </div>
                  <small>Modo noche profesional</small>
                  <div className="mt-3 d-flex gap-1">
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#121212",
                        border: "1px solid #444",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#1e1e1e",
                        border: "1px solid #444",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#ffcc33",
                        border: "1px solid #444",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  className="theme-card p-3 rounded cursor-pointer border h-100"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#212529",
                    borderColor:
                      currentThemeName === "light"
                        ? "var(--kawiil-gold)"
                        : "#ddd",
                  }}
                  onClick={() => applyPredefinedTheme("light")}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="mb-0">☀️ Claro</h6>
                    {currentThemeName === "light" && (
                      <span className="badge bg-warning text-dark">Activo</span>
                    )}
                  </div>
                  <small>Modo día clásico</small>
                  <div className="mt-3 d-flex gap-1">
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#ffffff",
                        border: "1px solid #ddd",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #ddd",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#d4af37",
                        border: "1px solid #ddd",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  className="theme-card p-3 rounded cursor-pointer border h-100"
                  style={{
                    backgroundColor: "#000000",
                    color: "#00ff41",
                    borderColor:
                      currentThemeName === "hacker"
                        ? "var(--kawiil-gold)"
                        : "#008f11",
                  }}
                  onClick={() => applyPredefinedTheme("hacker")}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="mb-0">💻 Hacker</h6>
                    {currentThemeName === "hacker" && (
                      <span className="badge bg-warning text-dark">Activo</span>
                    )}
                  </div>
                  <small>Estilo terminal matrix</small>
                  <div className="mt-3 d-flex gap-1">
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#000000",
                        border: "1px solid #008f11",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#0d0d0d",
                        border: "1px solid #008f11",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#00ff41",
                        border: "1px solid #008f11",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  className="theme-card p-3 rounded cursor-pointer border h-100"
                  style={{
                    backgroundColor: "#0c2233",
                    color: "#e0f7ff",
                    borderColor:
                      currentThemeName === "engineering"
                        ? "var(--kawiil-gold)"
                        : "#1a3a5f",
                  }}
                  onClick={() => applyPredefinedTheme("engineering")}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="mb-0">🔧 Ingeniería</h6>
                    {currentThemeName === "engineering" && (
                      <span className="badge bg-warning text-dark">Activo</span>
                    )}
                  </div>
                  <small>Azul profesional técnico</small>
                  <div className="mt-3 d-flex gap-1">
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#0c2233",
                        border: "1px solid #1a3a5f",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#1a3a5f",
                        border: "1px solid #1a3a5f",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "#4dabf7",
                        border: "1px solid #1a3a5f",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Creador de Temas Personalizados */}
        <div
          className="card mb-4 border-secondary"
          style={{
            backgroundColor: "var(--kawiil-card)",
          }}
        >
          <div
            className="card-header d-flex justify-content-between align-items-center"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              color: "var(--kawiil-gold)",
              borderBottom: "2px solid var(--kawiil-gold)",
            }}
          >
            <h5 className="mb-0">🎨 Creador de Temas Personalizados</h5>
            <button
              className="btn btn-sm btn-outline-warning"
              onClick={() => setAdvancedMode(!advancedMode)}
            >
              {advancedMode ? "Modo Simple" : "Modo Avanzado"}
            </button>
          </div>
          <div className="card-body">
            <ThemeCreator
              advancedMode={advancedMode}
              onThemeChange={() => {
                setCurrentThemeName("custom");
                setCurrentTheme(getSavedTheme());
              }}
            />
          </div>
        </div>

        {/* Resto del código permanece igual... */}
        {/* ... [El resto del código de ConfigPage permanece igual] ... */}
      </div>
    </div>
  );
};

export default ConfigPage;
