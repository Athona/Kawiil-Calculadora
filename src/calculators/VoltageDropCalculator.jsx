import React, { useState } from "react";
import { saveToHistory } from "../utils/historyService";
import { calculateVoltageDrop } from "../logic/voltageDrop";
import { validateNumber, preventInvalidChars } from "../utils/validation";

const VoltageDropCalculator = () => {
  const [values, setValues] = useState({
    current: "",
    distance: "",
    voltage: "",
    material: "copper",
    wireSize: "2.5",
    phase: "single",
  });

  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    const validation = validateNumber(value, 0);
    setErrors({
      ...errors,
      [field]: validation.valid ? "" : validation.message,
    });

    if (validation.valid || value === "") {
      setValues({ ...values, [field]: value });
    }
  };

  const handleCalculate = () => {
    const newErrors = {};

    // Validar campos requeridos
    if (!values.current) newErrors.current = "Corriente requerida";
    if (!values.distance) newErrors.distance = "Distancia requerida";
    if (!values.voltage) newErrors.voltage = "Voltaje requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const calcResult = calculateVoltageDrop(
      values.current,
      values.distance,
      values.voltage,
      values.material,
      values.wireSize,
      values.phase
    );

    setResult(calcResult);

    // Guardar en historial
    saveToHistory({
      calculator: "Caída de Voltaje",
      inputs: `I=${values.current}A, L=${values.distance}m, V=${values.voltage}V, ${values.material}, ${values.wireSize}mm², ${values.phase}`,
      result: `${calcResult.voltageDrop}V (${calcResult.percentage}%)`,
      steps: [
        `Fórmula: ΔV = (ρ × L × I) / A`,
        `Resistividad (${values.material}): ${
          values.material === "copper" ? "0.0172" : "0.0282"
        } Ω·mm²/m`,
        `Longitud total: ${values.distance}m × ${
          values.phase === "three" ? "√3" : "2"
        } = ${calcResult.totalLength}m`,
        `Cálculo: (${calcResult.totalLength} × ${
          values.material === "copper" ? "0.0172" : "0.0282"
        } × ${values.current}) / ${values.wireSize}`,
        `Resultado: ${calcResult.voltageDrop}V = ${calcResult.percentage}% de ${values.voltage}V`,
        `Recomendación: ${calcResult.recommendation}`,
      ],
    });
  };

  return (
    <div className="card premium-card animate__animated animate__fadeIn">
      <div className="card-body p-4">
        <h4 className="fw-bolder text-gold mb-4">
          📉 Calculadora de Caída de Voltaje
        </h4>

        {/* Diagrama SVG */}
        <div className="text-center mb-4">
          <svg width="250" height="120" viewBox="0 0 250 120">
            <path
              d="M20 60 H100 M150 60 H230"
              stroke="#666"
              strokeWidth="3"
              strokeDasharray="5,5"
              opacity="0.3"
            />

            {/* Fuente */}
            <rect x="10" y="45" width="20" height="30" fill="#4CAF50" rx="3" />
            <text x="20" y="62" textAnchor="middle" fill="white" fontSize="10">
              V+
            </text>

            {/* Cable */}
            <path d="M100 60 L150 60" stroke="#FF9800" strokeWidth="2" />

            {/* Carga */}
            <rect x="230" y="45" width="20" height="30" fill="#f44336" rx="3" />
            <text x="240" y="62" textAnchor="middle" fill="white" fontSize="10">
              V-
            </text>

            {/* Indicadores */}
            <text
              x="75"
              y="40"
              textAnchor="middle"
              fill="#4CAF50"
              fontSize="12"
            >
              V₀ = {values.voltage || "?"}V
            </text>
            <text
              x="175"
              y="40"
              textAnchor="middle"
              fill="#f44336"
              fontSize="12"
            >
              V₁ = ?V
            </text>

            {/* Flecha de caída */}
            <path
              d="M125 30 Q140 20 155 30"
              stroke="#FF9800"
              strokeWidth="2"
              fill="none"
            />
            <text
              x="140"
              y="20"
              textAnchor="middle"
              fill="#FF9800"
              fontSize="10"
            >
              ΔV
            </text>
          </svg>
        </div>

        {/* Formulario */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="small fw-bold text-gold mb-1">
              Corriente (A)
            </label>
            <input
              type="number"
              className={`form-control ${errors.current ? "is-invalid" : ""}`}
              value={values.current}
              onChange={(e) => handleInputChange("current", e.target.value)}
              onKeyDown={preventInvalidChars}
              placeholder="0.00"
            />
            {errors.current && (
              <div className="invalid-feedback">{errors.current}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="small fw-bold text-gold mb-1">
              Distancia (m)
            </label>
            <input
              type="number"
              className={`form-control ${errors.distance ? "is-invalid" : ""}`}
              value={values.distance}
              onChange={(e) => handleInputChange("distance", e.target.value)}
              onKeyDown={preventInvalidChars}
              placeholder="0.00"
            />
            {errors.distance && (
              <div className="invalid-feedback">{errors.distance}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="small fw-bold text-gold mb-1">Voltaje (V)</label>
            <input
              type="number"
              className={`form-control ${errors.voltage ? "is-invalid" : ""}`}
              value={values.voltage}
              onChange={(e) => handleInputChange("voltage", e.target.value)}
              onKeyDown={preventInvalidChars}
              placeholder="127"
            />
            {errors.voltage && (
              <div className="invalid-feedback">{errors.voltage}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="small fw-bold text-gold mb-1">Material</label>
            <select
              className="form-select"
              value={values.material}
              onChange={(e) =>
                setValues({ ...values, material: e.target.value })
              }
            >
              <option value="copper">Cobre (Cu)</option>
              <option value="aluminum">Aluminio (Al)</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="small fw-bold text-gold mb-1">
              Sección (mm²)
            </label>
            <select
              className="form-select"
              value={values.wireSize}
              onChange={(e) =>
                setValues({ ...values, wireSize: e.target.value })
              }
            >
              <option value="1.5">1.5 mm²</option>
              <option value="2.5">2.5 mm²</option>
              <option value="4">4 mm²</option>
              <option value="6">6 mm²</option>
              <option value="10">10 mm²</option>
              <option value="16">16 mm²</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="small fw-bold text-gold mb-1">Fase</label>
            <select
              className="form-select"
              value={values.phase}
              onChange={(e) => setValues({ ...values, phase: e.target.value })}
            >
              <option value="single">Monofásico</option>
              <option value="three">Trifásico</option>
            </select>
          </div>
        </div>

        <button
          className="btn btn-gold w-100 py-3 fw-bold mb-3"
          onClick={handleCalculate}
          disabled={!values.current || !values.distance || !values.voltage}
        >
          CALCULAR CAÍDA DE VOLTAJE
        </button>

        {result && (
          <div
            className={`p-3 mt-3 rounded border-start border-4 ${
              result.status === "success"
                ? "border-success"
                : result.status === "warning"
                ? "border-warning"
                : "border-danger"
            }`}
          >
            <h5 className="fw-bold">Resultados:</h5>
            <div className="row">
              <div className="col-md-6">
                <p className="mb-1">
                  <strong>Caída de voltaje:</strong>
                </p>
                <h3
                  className={`fw-bold ${
                    result.status === "success" ? "text-success" : "text-danger"
                  }`}
                >
                  {result.voltageDrop} V
                </h3>
                <p className="mb-1">
                  <strong>Porcentaje:</strong> {result.percentage}%
                </p>
              </div>
              <div className="col-md-6">
                <p className="mb-1">
                  <strong>Recomendación:</strong>
                </p>
                <p
                  className={
                    result.status === "success"
                      ? "text-success"
                      : "text-warning"
                  }
                >
                  {result.recommendation}
                </p>
                <p className="mb-0 small">
                  <strong>Longitud total:</strong> {result.totalLength} m
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoltageDropCalculator;
