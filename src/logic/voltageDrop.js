export const calculateVoltageDrop = (current, distance, voltage, material, wireSize, phase = "single") => {
  // Resistividades (Ω·mm²/m)
  const resistivity = {
    copper: 0.0172,
    aluminum: 0.0282
  };

  const I = parseFloat(current);
  const L = parseFloat(distance);
  const V = parseFloat(voltage);
  const A = parseFloat(wireSize);
  const ρ = resistivity[material] || resistivity.copper;
  
  // Longitud total (ida y vuelta)
  const totalLength = phase === "three" ? L * Math.sqrt(3) : L * 2;
  
  // Cálculo de caída de voltaje
  const voltageDrop = (totalLength * ρ * I) / A;
  const percentageDrop = (voltageDrop / V) * 100;
  
  // Recomendación técnica
  let status = "error";
  let recommendation = "";
  
  if (percentageDrop < 3) {
    status = "success";
    recommendation = "✅ Cumple con normativa eléctrica (NOM-001)";
  } else if (percentageDrop < 5) {
    status = "warning";
    recommendation = "⚠️ Límite aceptable, considerar aumentar sección";
  } else {
    status = "error";
    recommendation = "❌ Inaceptable, aumentar sección de conductor";
  }
  
  // Corriente máxima permitida
  const maxCurrent = (A * V * 0.03) / (ρ * totalLength); // 3% de caída
  
  return {
    voltageDrop: voltageDrop.toFixed(3),
    percentage: percentageDrop.toFixed(2),
    maxCurrent: maxCurrent.toFixed(2),
    status,
    recommendation,
    totalLength: totalLength.toFixed(2)
  };
};