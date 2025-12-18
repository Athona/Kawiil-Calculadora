export const calculatePower = (v, i, r, p) => {
  // Si buscamos POTENCIA (P)

  if (v && i) return { result: v * i, unit: "W", label: "Potencia" };

  if (i && r)
    return { result: r * Math.pow(i, 2), unit: "W", label: "Potencia" };

  if (v && r)
    return { result: Math.pow(v, 2) / r, unit: "W", label: "Potencia" };

  // Si buscamos VOLTAJE (V)

  if (p && i) return { result: p / i, unit: "V", label: "Voltaje" };

  if (p && r) return { result: Math.sqrt(p * r), unit: "V", label: "Voltaje" };

  // Si buscamos CORRIENTE (I)

  if (p && v) return { result: p / v, unit: "A", label: "Corriente" };

  if (p && r)
    return { result: Math.sqrt(p / r), unit: "A", label: "Corriente" };

  // Si buscamos RESISTENCIA (R)

  if (p && i)
    return { result: p / Math.pow(i, 2), unit: "Ω", label: "Resistencia" };

  if (v && p)
    return { result: Math.pow(v, 2) / p, unit: "Ω", label: "Resistencia" };

  return null;
};
