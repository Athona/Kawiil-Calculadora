export const calculatePowerFactor = (
  realPower,
  apparentPower,
  reactivePower
) => {
  // Si tenemos potencia real y aparente
  if (realPower && apparentPower) {
    const P = parseFloat(realPower);
    const S = parseFloat(apparentPower);
    const pf = P / S;
    const Q = Math.sqrt(S * S - P * P);

    return {
      powerFactor: pf.toFixed(3),
      reactivePower: Q.toFixed(2),
      angle: ((Math.acos(pf) * 180) / Math.PI).toFixed(1),
    };
  }

  // Si tenemos potencia real y reactiva
  if (realPower && reactivePower) {
    const P = parseFloat(realPower);
    const Q = parseFloat(reactivePower);
    const S = Math.sqrt(P * P + Q * Q);
    const pf = P / S;

    return {
      powerFactor: pf.toFixed(3),
      apparentPower: S.toFixed(2),
      angle: ((Math.acos(pf) * 180) / Math.PI).toFixed(1),
    };
  }

  return null;
};

export const calculateCapacitorBank = (
  power,
  currentPF,
  desiredPF,
  voltage,
  frequency = 60
) => {
  const P = parseFloat(power);
  const V = parseFloat(voltage);
  const f = parseFloat(frequency);

  const φ1 = Math.acos(parseFloat(currentPF));
  const φ2 = Math.acos(parseFloat(desiredPF));

  // Qc = P * (tan(φ1) - tan(φ2))
  const Qc = P * (Math.tan(φ1) - Math.tan(φ2));

  // Capacitancia necesaria: C = Qc / (2πfV²)
  const capacitance = Qc / (2 * Math.PI * f * V * V);

  return {
    reactivePowerNeeded: Qc.toFixed(2),
    capacitance: (capacitance * 1000000).toFixed(2), // Convertir a µF
    unit: "µF",
    kVAR: (Qc / 1000).toFixed(2),
  };
};
