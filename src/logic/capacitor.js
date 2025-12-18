export const calculateCapacitor = (values, connection = "parallel") => {
  // Filtrar valores válidos
  const validValues = values.filter(
    (v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0
  );

  if (validValues.length === 0) return null;

  if (connection === "parallel") {
    // Paralelo: Ct = C1 + C2 + C3 + ...
    const total = validValues.reduce((sum, val) => sum + parseFloat(val), 0);
    return {
      total: total.toFixed(3),
      unit: "F",
      formula: "Ct = C₁ + C₂ + C₃ + ...",
    };
  } else {
    // Serie: 1/Ct = 1/C1 + 1/C2 + 1/C3 + ...
    const reciprocalSum = validValues.reduce(
      (sum, val) => sum + 1 / parseFloat(val),
      0
    );
    const total = reciprocalSum > 0 ? 1 / reciprocalSum : 0;
    return {
      total: total.toFixed(3),
      unit: "F",
      formula: "1/Ct = 1/C₁ + 1/C₂ + 1/C₃ + ...",
    };
  }
};

export const calculateCapacitorReactance = (capacitance, frequency) => {
  const C = parseFloat(capacitance);
  const f = parseFloat(frequency);

  if (C <= 0 || f <= 0) return null;

  // Xc = 1 / (2πfC)
  const reactance = 1 / (2 * Math.PI * f * C * 0.000001); // Capacitor en µF

  return {
    reactance: reactance.toFixed(2),
    unit: "Ω",
    formula: "Xc = 1 / (2πfC)",
  };
};
