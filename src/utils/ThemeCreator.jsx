// themeCreator.jsx
import React, { useState, useEffect } from "react";
import { applyTheme, getSavedTheme } from "../utils/themeService";

const ThemeCreator = ({ advancedMode = false, onThemeChange }) => {
  const [customTheme, setCustomTheme] = useState(getSavedTheme());

  // Cargar tema personalizado guardado al inicio
  useEffect(() => {
    const saved = getSavedTheme();
    setCustomTheme(saved);
  }, []);

  const handleColorChange = (property, value) => {
    const updatedTheme = { ...customTheme, [property]: value };
    setCustomTheme(updatedTheme);
    applyTheme(updatedTheme, "custom");

    if (onThemeChange) {
      onThemeChange();
    }
  };

  const resetToDefault = (themeName = "dark") => {
    const themes = {
      dark: {
        bg: "#121212",
        card: "#1e1e1e",
        text: "#f8f9fa",
        gold: "#ffcc33",
        primary: "#0d6efd",
        secondary: "#6c757d",
      },
      light: {
        bg: "#ffffff",
        card: "#ffffff",
        text: "#212529",
        gold: "#d4af37",
        primary: "#007bff",
        secondary: "#6c757d",
      },
    };

    const defaultTheme = themes[themeName] || themes.dark;
    setCustomTheme(defaultTheme);
    applyTheme(defaultTheme, themeName);

    if (onThemeChange) {
      onThemeChange();
    }
  };

  const saveCustomTheme = () => {
    localStorage.setItem("kawiil_custom_theme", JSON.stringify(customTheme));
    localStorage.setItem("kawiil_theme_name", "custom");
    alert("Tema personalizado guardado correctamente");

    if (onThemeChange) {
      onThemeChange();
    }
  };

  // Previsualización del tema
  const PreviewBox = () => (
    <div
      className="mb-4 p-3 border rounded"
      style={{
        backgroundColor: customTheme.card,
        color: customTheme.text,
        borderColor: customTheme.gold,
      }}
    >
      <h6 className="mb-2" style={{ color: customTheme.gold }}>
        Vista Previa
      </h6>
      <div className="d-flex gap-2 mb-2">
        <button
          className="btn btn-sm"
          style={{
            backgroundColor: customTheme.gold,
            color: "#000",
          }}
        >
          Botón
        </button>
        <button
          className="btn btn-sm border"
          style={{
            backgroundColor: "transparent",
            color: customTheme.text,
            borderColor: customTheme.gold,
          }}
        >
          Borde
        </button>
      </div>
      <small>Texto: {customTheme.text}</small>
      <div className="d-flex gap-1 mt-2">
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: customTheme.bg,
          }}
          title="Fondo"
        ></div>
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: customTheme.card,
          }}
          title="Tarjeta"
        ></div>
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: customTheme.gold,
          }}
          title="Acento"
        ></div>
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: customTheme.text,
          }}
          title="Texto"
        ></div>
      </div>
    </div>
  );

  return (
    <div className="theme-creator">
      <PreviewBox />

      <div className="mb-3">
        <label
          className="form-label small mb-1"
          style={{ color: customTheme.text }}
        >
          Fondo Principal
        </label>
        <div className="d-flex align-items-center gap-2">
          <input
            type="color"
            className="form-control form-control-color"
            value={customTheme.bg}
            onChange={(e) => handleColorChange("bg", e.target.value)}
            title="Color de fondo"
          />
          <input
            type="text"
            className="form-control form-control-sm"
            value={customTheme.bg}
            onChange={(e) => handleColorChange("bg", e.target.value)}
            placeholder="#121212"
          />
        </div>
      </div>

      <div className="mb-3">
        <label
          className="form-label small mb-1"
          style={{ color: customTheme.text }}
        >
          Fondo de Tarjetas
        </label>
        <div className="d-flex align-items-center gap-2">
          <input
            type="color"
            className="form-control form-control-color"
            value={customTheme.card}
            onChange={(e) => handleColorChange("card", e.target.value)}
            title="Color de tarjetas"
          />
          <input
            type="text"
            className="form-control form-control-sm"
            value={customTheme.card}
            onChange={(e) => handleColorChange("card", e.target.value)}
            placeholder="#1e1e1e"
          />
        </div>
      </div>

      <div className="mb-3">
        <label
          className="form-label small mb-1"
          style={{ color: customTheme.text }}
        >
          Color de Texto
        </label>
        <div className="d-flex align-items-center gap-2">
          <input
            type="color"
            className="form-control form-control-color"
            value={customTheme.text}
            onChange={(e) => handleColorChange("text", e.target.value)}
            title="Color del texto"
          />
          <input
            type="text"
            className="form-control form-control-sm"
            value={customTheme.text}
            onChange={(e) => handleColorChange("text", e.target.value)}
            placeholder="#f8f9fa"
          />
        </div>
      </div>

      <div className="mb-3">
        <label
          className="form-label small mb-1"
          style={{ color: customTheme.text }}
        >
          Color Dorado/Acento
        </label>
        <div className="d-flex align-items-center gap-2">
          <input
            type="color"
            className="form-control form-control-color"
            value={customTheme.gold}
            onChange={(e) => handleColorChange("gold", e.target.value)}
            title="Color acento/dorado"
          />
          <input
            type="text"
            className="form-control form-control-sm"
            value={customTheme.gold}
            onChange={(e) => handleColorChange("gold", e.target.value)}
            placeholder="#ffcc33"
          />
        </div>
      </div>

      {advancedMode && (
        <>
          <div className="mb-3">
            <label
              className="form-label small mb-1"
              style={{ color: customTheme.text }}
            >
              Color Primario
            </label>
            <div className="d-flex align-items-center gap-2">
              <input
                type="color"
                className="form-control form-control-color"
                value={customTheme.primary}
                onChange={(e) => handleColorChange("primary", e.target.value)}
                title="Color primario"
              />
              <input
                type="text"
                className="form-control form-control-sm"
                value={customTheme.primary}
                onChange={(e) => handleColorChange("primary", e.target.value)}
                placeholder="#0d6efd"
              />
            </div>
          </div>

          <div className="mb-3">
            <label
              className="form-label small mb-1"
              style={{ color: customTheme.text }}
            >
              Color Secundario
            </label>
            <div className="d-flex align-items-center gap-2">
              <input
                type="color"
                className="form-control form-control-color"
                value={customTheme.secondary}
                onChange={(e) => handleColorChange("secondary", e.target.value)}
                title="Color secundario"
              />
              <input
                type="text"
                className="form-control form-control-sm"
                value={customTheme.secondary}
                onChange={(e) => handleColorChange("secondary", e.target.value)}
                placeholder="#6c757d"
              />
            </div>
          </div>
        </>
      )}

      <div className="d-grid gap-2 mt-4">
        <button
          className="btn btn-sm"
          onClick={saveCustomTheme}
          style={{
            backgroundColor: customTheme.gold,
            color: "#000",
          }}
        >
          <i className="bi bi-save me-1"></i> Guardar Tema Personalizado
        </button>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm flex-fill"
            onClick={() => resetToDefault("dark")}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              color: customTheme.text,
              borderColor: customTheme.gold,
            }}
          >
            Restaurar Oscuro
          </button>
          <button
            className="btn btn-sm flex-fill"
            onClick={() => resetToDefault("light")}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: customTheme.text,
              borderColor: customTheme.gold,
            }}
          >
            Restaurar Claro
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeCreator;
