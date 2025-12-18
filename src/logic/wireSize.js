export const calculateWireSize = (
  current,
  material = "copper",
  insulation = "PVC",
  installation = "conduit",
  length = 10
) => {
  // Tablas AWG (simplificadas)
  const awgTable = [
    { awg: "18", diameter: 1.02, area: 0.823, ampacity: 14, maxCurrent: 3 },
    { awg: "16", diameter: 1.29, area: 1.31, ampacity: 18, maxCurrent: 5 },
    { awg: "14", diameter: 1.63, area: 2.08, ampacity: 25, maxCurrent: 15 },
    { awg: "12", diameter: 2.05, area: 3.31, ampacity: 30, maxCurrent: 20 },
    { awg: "10", diameter: 2.59, area: 5.26, ampacity: 40, maxCurrent: 30 },
    { awg: "8", diameter: 3.26, area: 8.37, ampacity: 55, maxCurrent: 40 },
    { awg: "6", diameter: 4.11, area: 13.3, ampacity: 75, maxCurrent: 55 },
    { awg: "4", diameter: 5.19, area: 21.2, ampacity: 95, maxCurrent: 70 },
    { awg: "2", diameter: 6.54, area: 33.6, ampacity: 130, maxCurrent: 95 },
    { awg: "1/0", diameter: 8.25, area: 53.5, ampacity: 150, maxCurrent: 120 },
  ];

  const I = parseFloat(current);

  // Factor de corrección por material
  const materialFactor = material === "aluminum" ? 0.61 : 1.0; // Aluminio conduce ~61% del cobre

  // Encontrar el calibre apropiado
  const suitableAWG =
    awgTable.find((wire) => wire.ampacity * materialFactor >= I) ||
    awgTable[awgTable.length - 1];

  // Calcular caída de voltaje aproximada
  const resistivity = material === "copper" ? 0.0172 : 0.0282;
  const voltageDrop = (2 * resistivity * length * I) / suitableAWG.area;

  return {
    awg: suitableAWG.awg,
    diameter: suitableAWG.diameter,
    area: suitableAWG.area,
    ampacity: suitableAWG.ampacity * materialFactor,
    maxCurrent: suitableAWG.maxCurrent * materialFactor,
    voltageDrop: voltageDrop.toFixed(3),
    material,
    recommendation: `Calibre ${suitableAWG.awg} AWG ${
      material === "copper" ? "Cobre" : "Aluminio"
    }`,
  };
};

export const awgToMM = (awg) => {
  // Conversión AWG a mm²
  const conversions = {
    18: 0.823,
    16: 1.31,
    14: 2.08,
    12: 3.31,
    10: 5.26,
    8: 8.37,
    6: 13.3,
    4: 21.2,
    2: 33.6,
    "1/0": 53.5,
    "2/0": 67.4,
    "3/0": 85.0,
    "4/0": 107.2,
  };

  return conversions[awg] || 0;
};
