// themeService.js
const THEME_KEY = "kawiil_custom_theme";
const THEME_NAME_KEY = "kawiil_theme_name";

// Definición de temas
export const themes = {
  light: {
    bg: "#ffffff",
    card: "#ffffff",
    text: "#212529",
    gold: "#d4af37",
    primary: "#007bff",
    secondary: "#6c757d",
  },
  dark: {
    bg: "#121212",
    card: "#1e1e1e",
    text: "#f8f9fa",
    gold: "#ffcc33",
    primary: "#0d6efd",
    secondary: "#6c757d",
  },
  hacker: {
    bg: "#000000",
    card: "#0d0d0d",
    text: "#00ff41",
    gold: "#008f11",
    primary: "#00ff41",
    secondary: "#008f11",
  },
  engineering: {
    bg: "#0c2233",
    card: "#1a3a5f",
    text: "#e0f7ff",
    gold: "#4dabf7",
    primary: "#1976d2",
    secondary: "#64b5f6",
    accent: "#82b1ff",
  },
};

// Obtener tema guardado
export const getSavedTheme = () => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing saved theme:", e);
      return themes.dark;
    }
  }
  return themes.dark;
};

// Obtener nombre del tema actual
export const getCurrentThemeName = () => {
  return localStorage.getItem(THEME_NAME_KEY) || "dark";
};

// Aplicar tema
export const applyTheme = (config, themeName = "custom") => {
  // Asegurarnos de que config es un objeto válido
  if (!config || typeof config !== "object") {
    console.error("Configuración de tema inválida:", config);
    config = themes.dark;
  }

  // Aplicar las variables CSS
  Object.keys(config).forEach((key) => {
    document.documentElement.style.setProperty(`--kawiil-${key}`, config[key]);
  });

  // Guardar en localStorage
  localStorage.setItem(THEME_KEY, JSON.stringify(config));

  // Si se proporciona un nombre de tema, guardarlo también
  if (themeName !== "custom") {
    localStorage.setItem(THEME_NAME_KEY, themeName);
  }

  // Disparar evento personalizado para notificar cambios
  window.dispatchEvent(
    new CustomEvent("themeChanged", {
      detail: { theme: config, name: themeName },
    })
  );
};

// Aplicar tema predefinido por nombre
export const applyPredefinedTheme = (themeName) => {
  const theme = themes[themeName];
  if (theme) {
    applyTheme(theme, themeName);
  }
};

// Inicializar tema
export const initTheme = () => {
  const savedTheme = getSavedTheme();
  const themeName = getCurrentThemeName();
  applyTheme(savedTheme, themeName);
};

// Verificar si el tema actual es personalizado
export const isCustomTheme = () => {
  return getCurrentThemeName() === "custom";
};

// Exportación por defecto
const themeService = {
  themes,
  getSavedTheme,
  getCurrentThemeName,
  applyTheme,
  applyPredefinedTheme,
  initTheme,
  isCustomTheme,
};

export default themeService;
