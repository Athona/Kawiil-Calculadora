import React, { useState } from "react";
import { saveToHistory } from "../utils/historyService";
import { calculateTransformer } from "../logic/transformer";
import { validateNumber } from "../logic/validation";

const TransformerCalculator = () => {
  const [values, setValues] = useState({
    primaryVoltage: "",
    secondaryVoltage: "",
    power: "",
    efficiency: "0.95",
    frequency: "60",
    coreMaterial: "silicon",
  });

  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const handleCalculate = () => {
    // Validación
    const newErrors = {};

    if (!validateNumber(values.primaryVoltage) || values.primaryVoltage <= 0) {
      newErrors.primaryVoltage = "Voltaje primario inválido";
    }
    if (
      !validateNumber(values.secondaryVoltage) ||
      values.secondaryVoltage <= 0
    ) {
      newErrors.secondaryVoltage = "Voltaje secundario inválido";
    }
    if (!validateNumber(values.power) || values.power <= 0) {
      newErrors.power = "Potencia inválida";
    }
    if (
      !validateNumber(values.efficiency) ||
      values.efficiency <= 0 ||
      values.efficiency > 1
    ) {
      newErrors.efficiency = "Eficiencia debe ser entre 0 y 1";
    }
    if (!validateNumber(values.frequency) || values.frequency <= 0) {
      newErrors.frequency = "Frecuencia inválida";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const result = calculateTransformer(
      parseFloat(values.primaryVoltage),
      parseFloat(values.secondaryVoltage),
      parseFloat(values.power),
      parseFloat(values.efficiency),
      parseFloat(values.frequency),
      values.coreMaterial
    );

    setResult(result);

    saveToHistory({
      calculator: "Transformador",
      inputs: `Vp=${values.primaryVoltage}V, Vs=${values.secondaryVoltage}V, P=${values.power}W, η=${values.efficiency}, f=${values.frequency}Hz, Núcleo=${values.coreMaterial}`,
      result: `Relación: ${result.turnsRatio.toFixed(
        2
      )}:1, Ip=${result.primaryCurrent.toFixed(
        3
      )}A, Is=${result.secondaryCurrent.toFixed(
        3
      )}A, Sección=${result.coreArea.toFixed(2)}cm²`,
      steps: [
        `Fórmula: Np/Ns = Vp/Vs`,
        `Relación: ${values.primaryVoltage}V / ${
          values.secondaryVoltage
        }V = ${result.turnsRatio.toFixed(2)}:1`,
        `Corriente primaria: Ip = P / (Vp × η) = ${values.power}W / (${
          values.primaryVoltage
        }V × ${values.efficiency}) = ${result.primaryCurrent.toFixed(3)}A`,
        `Corriente secundaria: Is = P / (Vs × η) = ${values.power}W / (${
          values.secondaryVoltage
        }V × ${values.efficiency}) = ${result.secondaryCurrent.toFixed(3)}A`,
        `Potencia aparente: S = P / η = ${values.power}W / ${
          values.efficiency
        } = ${result.apparentPower.toFixed(2)}VA`,
        `Sección núcleo: A ≈ √S × k = √${result.apparentPower.toFixed(2)}VA × ${
          result.coreConstant
        } = ${result.coreArea.toFixed(2)}cm²`,
        `Número espiras/V: N/V = 10⁸ / (4.44 × f × B × A) ≈ ${result.turnsPerVolt.toFixed(
          2
        )} espiras/voltio`,
        `Espiras primarias: Np = Vp × N/V = ${
          values.primaryVoltage
        }V × ${result.turnsPerVolt.toFixed(2)} = ${result.primaryTurns.toFixed(
          0
        )} espiras`,
        `Espiras secundarias: Ns = Vs × N/V = ${
          values.secondaryVoltage
        }V × ${result.turnsPerVolt.toFixed(
          2
        )} = ${result.secondaryTurns.toFixed(0)} espiras`,
      ],
    });
  };

  const handleReset = () => {
    setValues({
      primaryVoltage: "",
      secondaryVoltage: "",
      power: "",
      efficiency: "0.95",
      frequency: "60",
      coreMaterial: "silicon",
    });
    setResult(null);
    setErrors({});
  };

  const coreMaterials = [
    { value: "silicon", label: "Silicio (1.2T)", constant: 0.7 },
    { value: "grain", label: "Granos orientados (1.6T)", constant: 0.6 },
    { value: "ferrite", label: "Ferrita (0.3T)", constant: 1.2 },
    { value: "iron", label: "Hierro dulce (1.0T)", constant: 0.8 },
  ];

  return (
    <div className="card premium-card animate__animated animate__fadeIn">
      <div className="card-body p-4">
        <h4 className="fw-bolder text-gold mb-4">
          🔁 Calculadora de Transformadores
        </h4>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label fw-bold text-light">
              <i className="bi bi-lightning-charge me-1"></i> Voltaje Primario
              (Vp)
            </label>
            <input
              type="number"
              className={`form-control ${
                errors.primaryVoltage ? "is-invalid" : ""
              }`}
              placeholder="Ej: 120 V"
              value={values.primaryVoltage}
              onChange={(e) =>
                setValues({ ...values, primaryVoltage: e.target.value })
              }
            />
            {errors.primaryVoltage && (
              <div className="invalid-feedback">{errors.primaryVoltage}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold text-light">
              <i className="bi bi-lightning me-1"></i> Voltaje Secundario (Vs)
            </label>
            <input
              type="number"
              className={`form-control ${
                errors.secondaryVoltage ? "is-invalid" : ""
              }`}
              placeholder="Ej: 12 V"
              value={values.secondaryVoltage}
              onChange={(e) =>
                setValues({ ...values, secondaryVoltage: e.target.value })
              }
            />
            {errors.secondaryVoltage && (
              <div className="invalid-feedback">{errors.secondaryVoltage}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold text-light">
              <i className="bi bi-power me-1"></i> Potencia (P)
            </label>
            <input
              type="number"
              className={`form-control ${errors.power ? "is-invalid" : ""}`}
              placeholder="En vatios (W)"
              value={values.power}
              onChange={(e) => setValues({ ...values, power: e.target.value })}
            />
            {errors.power && (
              <div className="invalid-feedback">{errors.power}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold text-light">
              <i className="bi bi-percent me-1"></i> Eficiencia (η)
            </label>
            <div className="input-group">
              <input
                type="number"
                step="0.01"
                min="0.5"
                max="0.99"
                className={`form-control ${
                  errors.efficiency ? "is-invalid" : ""
                }`}
                value={values.efficiency}
                onChange={(e) =>
                  setValues({ ...values, efficiency: e.target.value })
                }
              />
              <span className="input-group-text">%</span>
            </div>
            <small className="text-muted">Valor típico: 0.95 (95%)</small>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold text-light">
              <i className="bi bi-soundwave me-1"></i> Frecuencia (f)
            </label>
            <select
              className="form-select"
              value={values.frequency}
              onChange={(e) =>
                setValues({ ...values, frequency: e.target.value })
              }
            >
              <option value="50">50 Hz (Europa)</option>
              <option value="60">60 Hz (América)</option>
              <option value="400">400 Hz (Aeronáutica)</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold text-light">
              <i className="bi bi-magnet me-1"></i> Material del Núcleo
            </label>
            <select
              className="form-select"
              value={values.coreMaterial}
              onChange={(e) =>
                setValues({ ...values, coreMaterial: e.target.value })
              }
            >
              {coreMaterials.map((material) => (
                <option key={material.value} value={material.value}>
                  {material.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex gap-2 mb-4">
          <button
            className="btn btn-gold fw-bold px-4"
            onClick={handleCalculate}
          >
            <i className="bi bi-calculator me-2"></i> Calcular
          </button>
          <button
            className="btn btn-outline-warning fw-bold"
            onClick={handleReset}
          >
            <i className="bi bi-arrow-clockwise me-2"></i> Limpiar
          </button>
        </div>

        {result && (
          <div
            className="result-card p-4 border rounded mb-4"
            style={{ backgroundColor: "var(--kawiil-card)" }}
          >
            <h5 className="fw-bold text-gold mb-3">
              <i className="bi bi-graph-up me-2"></i> Resultados del
              Transformador
            </h5>

            <div className="row">
              <div className="col-md-6">
                <div className="result-item mb-3">
                  <h6 className="text-light">⚡ Relación de Transformación</h6>
                  <div className="display-6 fw-bold text-warning">
                    {result.turnsRatio.toFixed(2)}:1
                  </div>
                  <small className="text-muted">Np/Ns = Vp/Vs</small>
                </div>

                <div className="result-item mb-3">
                  <h6 className="text-light">🔌 Corrientes</h6>
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="fw-bold text-info">Primaria (Ip)</div>
                      <div className="fs-5">
                        {result.primaryCurrent.toFixed(3)} A
                      </div>
                    </div>
                    <div>
                      <div className="fw-bold text-success">
                        Secundaria (Is)
                      </div>
                      <div className="fs-5">
                        {result.secondaryCurrent.toFixed(3)} A
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="result-item mb-3">
                  <h6 className="text-light">📏 Parámetros del Núcleo</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Sección:</span>
                    <span className="fw-bold">
                      {result.coreArea.toFixed(2)} cm²
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Espiras/Voltio:</span>
                    <span className="fw-bold">
                      {result.turnsPerVolt.toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Potencia Aparente:</span>
                    <span className="fw-bold">
                      {result.apparentPower.toFixed(2)} VA
                    </span>
                  </div>
                </div>

                <div className="result-item">
                  <h6 className="text-light">🔢 Número de Espiras</h6>
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="small">Primario (Np)</div>
                      <div className="fw-bold text-info">
                        {result.primaryTurns.toFixed(0)}
                      </div>
                    </div>
                    <div>
                      <div className="small">Secundario (Ns)</div>
                      <div className="fw-bold text-success">
                        {result.secondaryTurns.toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="mt-4 p-3 border rounded"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            >
              <h6 className="text-gold mb-2">
                <i className="bi bi-info-circle me-1"></i> Especificaciones
                Técnicas
              </h6>
              <div className="row small">
                <div className="col-md-4">
                  <div className="d-flex justify-content-between">
                    <span>Material:</span>
                    <span className="fw-bold">
                      {
                        coreMaterials
                          .find((m) => m.value === values.coreMaterial)
                          ?.label.split(" ")[0]
                      }
                    </span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex justify-content-between">
                    <span>Frecuencia:</span>
                    <span className="fw-bold">{values.frequency} Hz</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex justify-content-between">
                    <span>Eficiencia:</span>
                    <span className="fw-bold">
                      {(values.efficiency * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className="mt-4 p-3 border rounded"
          style={{ backgroundColor: "var(--kawiil-card)" }}
        >
          <h6 className="text-gold mb-3">
            <i className="bi bi-journal-text me-1"></i> Fórmulas Utilizadas
          </h6>
          <div className="row small">
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Relación:</strong> Np/Ns = Vp/Vs
                </li>
                <li className="mb-2">
                  <strong>Corriente primaria:</strong> Ip = P / (Vp × η)
                </li>
                <li className="mb-2">
                  <strong>Corriente secundaria:</strong> Is = P / (Vs × η)
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Sección núcleo:</strong> A ≈ √S × k (cm²)
                </li>
                <li className="mb-2">
                  <strong>Espiras/Voltio:</strong> N/V = 10⁸ / (4.44 × f × B ×
                  A)
                </li>
                <li className="mb-2">
                  <strong>Potencia aparente:</strong> S = P / η
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransformerCalculator;
