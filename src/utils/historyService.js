const STORAGE_KEY = "kawiil_history";

export const getHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error al obtener historial:", e);
    return [];
  }
};

// Función principal para guardar en el historial
export const saveToHistory = (calc) => {
  try {
    const history = getHistory();
    const newCalc = {
      id: calc.id || crypto.randomUUID(), // ID único nativo
      date: calc.date || new Date().toLocaleString(), // Fecha si no viene una
      ...calc,
    };
    const updated = [newCalc, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("historyUpdated"));
    return true;
  } catch (e) {
    console.error("Error al guardar historial:", e);
    return false;
  }
};

// EXPORTACIONES COMPATIBLES (alias para compatibilidad)
export const saveCalculation = saveToHistory; // ← ESTA ES LA QUE FALTA
export const addEntry = saveToHistory;

export const clearHistory = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent("historyUpdated"));
};
