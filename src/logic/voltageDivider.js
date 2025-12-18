export const calculateVoltageDivider = (vin, vout, r1, r2) => {
  // 1. Limpieza y conversión estricta
  const Vi = vin !== "" && vin !== null ? parseFloat(vin) : NaN;
  const Vo = vout !== "" && vout !== null ? parseFloat(vout) : NaN;
  const R1 = r1 !== "" && r1 !== null ? parseFloat(r1) : NaN;
  const R2 = r2 !== "" && r2 !== null ? parseFloat(r2) : NaN;

  // 2. Validación de caracteres no numéricos
  const inputs = [Vi, Vo, R1, R2].filter((val) => !isNaN(val));
  if (inputs.some((val) => !Number.isFinite(val))) {
    return { error: "ENTRADA INVÁLIDA (SOLO NÚMEROS)", isError: true };
  }

  // 3. Bloqueo de negativos
  if (inputs.some((val) => val < 0)) {
    return { error: "VALORES NEGATIVOS PROHIBIDOS", isError: true };
  }

  // 4. Validación lógica: Vout no puede ser mayor que Vin
  if (!isNaN(Vi) && !isNaN(Vo) && Vo >= Vi) {
    return { error: "VOUT NO PUEDE SER ≥ VIN", isError: true };
  }

  //

  // 5. Cálculos con protecciones de división por cero

  // Hallar VOUT
  if (!isNaN(Vi) && !isNaN(R1) && !isNaN(R2) && isNaN(Vo)) {
    if (R1 + R2 === 0)
      return { error: "R1 + R2 NO PUEDE SER 0", isError: true };
    const res = Vi * (R2 / (R1 + R2));
    return {
      result: res.toFixed(3),
      unit: "V",
      label: "Voltaje de Salida",
      target: "vout",
    };
  }

  // Hallar VIN
  if (!isNaN(Vo) && !isNaN(R1) && !isNaN(R2) && isNaN(Vi)) {
    if (R2 === 0) return { error: "R2 NO PUEDE SER 0", isError: true };
    const res = (Vo * (R1 + R2)) / R2;
    return {
      result: res.toFixed(3),
      unit: "V",
      label: "Voltaje de Entrada",
      target: "vin",
    };
  }

  // Hallar R1
  if (!isNaN(Vi) && !isNaN(Vo) && !isNaN(R2) && isNaN(R1)) {
    if (Vo === 0) return { error: "VOUT NO PUEDE SER 0", isError: true };
    const res = (R2 * (Vi - Vo)) / Vo;
    return {
      result: res.toFixed(2),
      unit: "Ω",
      label: "Resistencia R1",
      target: "r1",
    };
  }

  // Hallar R2
  if (!isNaN(Vi) && !isNaN(Vo) && !isNaN(R1) && isNaN(R2)) {
    if (Vi === Vo)
      return { error: "VIN Y VOUT NO PUEDEN SER IGUALES", isError: true };
    if (Vi - Vo === 0) return { error: "DIVISIÓN POR CERO", isError: true };
    const res = (Vo * R1) / (Vi - Vo);
    return {
      result: res.toFixed(2),
      unit: "Ω",
      label: "Resistencia R2",
      target: "r2",
    };
  }

  return null;
};
