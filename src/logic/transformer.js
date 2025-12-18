// src/logic/transformer.js

export const calculateTransformer = (
  Vp,
  Vs,
  P,
  η = 0.95,
  f = 60,
  coreMaterial = "silicon"
) => {
  // Constantes para diferentes materiales
  const coreConstants = {
    silicon: { B: 1.2, k: 0.7 }, // Silicio (1.2 Tesla)
    grain: { B: 1.6, k: 0.6 }, // Granos orientados
    ferrite: { B: 0.3, k: 1.2 }, // Ferrita
    iron: { B: 1.0, k: 0.8 }, // Hierro dulce
  };

  const material = coreConstants[coreMaterial] || coreConstants.silicon;

  // 1. Relación de transformación
  const turnsRatio = Vp / Vs;

  // 2. Corrientes
  const primaryCurrent = P / (Vp * η);
  const secondaryCurrent = P / (Vs * η);

  // 3. Potencia aparente
  const apparentPower = P / η;

  // 4. Sección del núcleo (fórmula práctica)
  const coreArea = Math.sqrt(apparentPower) * material.k; // en cm²

  // 5. Número de espiras por voltio (fórmula general)
  // N/V = 10⁸ / (4.44 * f * B * A)
  // Donde A debe estar en cm² convertido a m² (÷10⁴)
  const areaM2 = coreArea / 10000;
  const turnsPerVolt = 100000000 / (4.44 * f * material.B * areaM2);

  // 6. Número total de espiras
  const primaryTurns = Vp * turnsPerVolt;
  const secondaryTurns = Vs * turnsPerVolt;

  // 7. Pérdidas estimadas
  const powerLoss = P * (1 - η);

  return {
    turnsRatio,
    primaryCurrent,
    secondaryCurrent,
    apparentPower,
    coreArea,
    turnsPerVolt,
    primaryTurns,
    secondaryTurns,
    powerLoss,
    coreConstant: material.k,
    fluxDensity: material.B,
    efficiency: η * 100,
  };
};
