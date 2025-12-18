export const calculateOhm = (v, i, r) => {
  const V = v !== "" ? parseFloat(v) : null;

  const I = i !== "" ? parseFloat(i) : null;

  const R = r !== "" ? parseFloat(r) : null;

  // Bloqueo de negativos

  if ((V !== null && V < 0) || (I !== null && I < 0) || (R !== null && R < 0)) {
    return { isError: true, error: "VALORES NEGATIVOS PROHIBIDOS" };
  }

  // Cálculos con validación de división por cero

  if (V !== null && I !== null) {
    if (I === 0) return { isError: true, error: "CORRIENTE NO PUEDE SER 0" };

    return {
      result: (V / I).toFixed(2),

      unit: "Ω",

      label: "Resistencia",

      target: "r",
    };
  }

  if (V !== null && R !== null) {
    if (R === 0) return { isError: true, error: "RESISTENCIA NO PUEDE SER 0" };

    return {
      result: (V / R).toFixed(3),

      unit: "A",

      label: "Corriente",

      target: "i",
    };
  }

  if (I !== null && R !== null) {
    return {
      result: (I * R).toFixed(2),

      unit: "V",

      label: "Voltaje",

      target: "v",
    };
  }

  return null;
};
