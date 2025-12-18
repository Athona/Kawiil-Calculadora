// src/constants/ledData.js
export const LED_PRESETS = [
  { id: "red", name: "Rojo", vout: 1.8, defaultCurrent: 20 },
  { id: "green", name: "Verde", vout: 2.1, defaultCurrent: 20 },
  { id: "yellow", name: "Amarillo", vout: 2.0, defaultCurrent: 20 },
  { id: "blue", name: "Azul", vout: 3.2, defaultCurrent: 20 },
  { id: "white", name: "Blanco", vout: 3.2, defaultCurrent: 20 },
  { id: "ir", name: "Infrarrojo", vout: 1.2, defaultCurrent: 50 },
];

export const LED_ERRORS = {
  VIN_LOW: "VIN DEBE SER MAYOR A VLED",
  NEGATIVE: "LOS VALORES NO PUEDEN SER NEGATIVOS",
  ZERO: "LA CORRIENTE NO PUEDE SER CERO",
};
