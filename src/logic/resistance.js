export const getResistorValue = (b1, b2, mult) => {
  // Convertimos a número por si los valores vienen como strings desde el <select>

  const baseValue = parseInt(b1) * 10 + parseInt(b2);

  const multiplier = Math.pow(10, parseInt(mult));

  return baseValue * multiplier;
};

// 2. Asegúrate de exportar también estas dos

export const calculateSeries = (values) => {
  if (!values || values.length === 0) return 0;

  return values.reduce((a, b) => a + b, 0);
};

export const calculateParallel = (values) => {
  if (!values || values.length === 0) return 0;

  // Filtrar ceros para evitar división por cero

  const validValues = values.filter((v) => v > 0);

  if (validValues.length === 0) return 0;

  const sum = validValues.reduce((a, b) => a + 1 / b, 0);

  return 1 / sum;
};
