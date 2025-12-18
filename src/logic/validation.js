export const validateNumber = (
  value,
  min = 0,
  max = null,
  allowZero = true
) => {
  if (value === "" || value === null || value === undefined) {
    return { valid: false, message: "Campo requerido" };
  }

  const num = parseFloat(value);

  if (isNaN(num)) {
    return { valid: false, message: "Solo números permitidos" };
  }

  if (!allowZero && num === 0) {
    return { valid: false, message: "El valor no puede ser cero" };
  }

  if (num < min) {
    return { valid: false, message: `Mínimo: ${min}` };
  }

  if (max !== null && num > max) {
    return { valid: false, message: `Máximo: ${max}` };
  }

  return { valid: true, value: num };
};

export const preventInvalidChars = (e) => {
  const invalidKeys = ["e", "E", "-", "+", "Dead"];
  if (invalidKeys.includes(e.key)) {
    e.preventDefault();
  }
};

export const validateLED = (vin, vled, iled) => {
  const errors = [];

  if (vin <= vled) errors.push("Vin debe ser mayor que Vled");
  if (iled <= 0) errors.push("Iled debe ser mayor a 0");
  if (vin <= 0 || vled <= 0) errors.push("Voltajes deben ser positivos");

  return errors;
};

export const validateVoltage = (voltage) => {
  if (voltage > 1000) {
    return { valid: false, message: "¡PELIGRO! Voltaje muy alto (>1000V)" };
  }
  if (voltage > 600) {
    return {
      valid: true,
      message: "Alta tensión - Precauciones necesarias",
      warning: true,
    };
  }
  return { valid: true };
};

export const validateCurrent = (current) => {
  if (current > 100) {
    return { valid: false, message: "¡PELIGRO! Corriente muy alta (>100A)" };
  }
  if (current > 30) {
    return {
      valid: true,
      message: "Alta corriente - Usar protección adecuada",
      warning: true,
    };
  }
  return { valid: true };
};
