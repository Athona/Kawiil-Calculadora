import { LED_ERRORS } from "../constants/ledData";

export const calculateLedResistor = (vin, vled, iled) => {
  // 1. Limpieza y Conversión Estricta
  // Usamos parseFloat y trim para asegurar que no entren espacios ni strings vacíos
  const Vi = typeof vin === "string" ? parseFloat(vin.trim()) : vin;
  const Vf = typeof vled === "string" ? parseFloat(vled.trim()) : vled;
  const If_raw = typeof iled === "string" ? parseFloat(iled.trim()) : iled;

  // 2. Bloqueo de No-Números y Campos Vacíos
  // Verificamos si son números finitos para evitar Infinity o NaN
  if (
    !Number.isFinite(Vi) ||
    !Number.isFinite(Vf) ||
    !Number.isFinite(If_raw)
  ) {
    return { error: "ENTRADA INVÁLIDA (SOLO NÚMEROS)", isError: true };
  }

  // 3. Bloqueo de Negativos y Cero (Validación de sentido físico)
  if (Vi < 0 || Vf < 0 || If_raw < 0) {
    return { error: LED_ERRORS.NEGATIVE, isError: true };
  }

  if (If_raw === 0) {
    return { error: LED_ERRORS.ZERO, isError: true };
  }

  // 4. Validación Lógica de Voltajes
  // La fuente debe ser mayor al voltaje del LED para que circule corriente
  if (Vf >= Vi) {
    return { error: LED_ERRORS.VIN_LOW, isError: true };
  }

  // 5. Cálculos (Ley de Ohm)
  // R = (Vi - Vf) / I
  const resValue = (Vi - Vf) / (If_raw / 1000);
  const power = (Vi - Vf) * (If_raw / 1000);

  return {
    result: resValue.toFixed(2),
    power: power.toFixed(3),
    unit: "Ω",
    target: "resistor",
  };
};
