import React, { useState } from "react";
import { saveToHistory } from "../utils/historyService";
import {
  calculateCapacitor,
  calculateCapacitorReactance,
} from "../logic/capacitor";
import { validateNumber, preventInvalidChars } from "../utils/validation";

const CapacitorCalculator = () => {
  const [mode, setMode] = useState("parallel");
  const [capacitorValues, setCapacitorValues] = useState(["", ""]);
  const [reactanceValues, setReactanceValues] = useState({
    capacitance: "",
    frequency: "60",
  });
  const [result, setResult] = useState(null);
  const [reactanceResult, setReactanceResult] = useState(null);

  const handleCapacitorChange = (index, value) => {
    const validation = validateNumber(value, 0);
    const newValues = [...capacitorValues];
    newValues[index] = validation.valid ? value : "";
    setCapacitorValues(newValues);
  };

  const handleAddCapacitor = () => {
    setCapacitorValues([...capacitorValues, ""]);
  };

  const handleRemoveCapacitor = (index) => {
    if (capacitorValues.length > 2) {
      const newValues = capacitorValues.filter((_, i) => i !== index);
      setCapacitorValues(newValues);
    }
  };

  const handleCalculateCapacitance = () => {
    const validValues = capacitorValues
      .map((v) => parseFloat(v))
      .filter((v) => !isNaN(v) && v > 0);

    if (validValues.length < 2) {
      alert("Ingresa al menos dos valores de capacitancia válidos");
      return;
    }

    const result = calculateCapacitor(validValues, mode);
    setResult(result);

    saveToHistory({
      calculator: "Capacitores",
      inputs: `Modo: ${
        mode === "series" ? "Serie" : "Paralelo"
      }, Valores: ${validValues.join(", ")} µF`,
      result: `${result.total} ${result.unit}`,
      steps: [
        `Fórmula: ${result.formula}`,
        `Valores: ${validValues.join(", ")} µF`,
        `Cálculo: ${result.total} ${result.unit}`,
      ],
    });
  };

  const handleCalculateReactance = () => {
    const { capacitance, frequency } = reactanceValues;

    if (!capacitance || !frequency) {
      alert("Ingresa la capacitancia y la frecuencia");
      return;
    }

    const result = calculateCapacitorReactance(capacitance, frequency);
    setReactanceResult(result);

    saveToHistory({
      calculator: "Reactancia Capacitiva",
      inputs: `C=${capacitance} µF, f=${frequency} Hz`,
      result: `${result.reactance} ${result.unit}`,
      steps: [
        `Fórmula: ${result.formula}`,
        `Cálculo: Xc = 1 / (2 × π × ${frequency} × ${capacitance}µF)`,
        `Resultado: ${result.reactance} ${result.unit}`,
      ],
    });
  };

  return (
    <div className="card premium-card animate__animated animate__fadeIn">
      <div className="card-body p-4">
        <h4 className="fw-bolder text-gold mb-4">
          🔋 Calculadora de Capacitores
        </h4>

        {/* Diagrama SVG */}
        <div className="text-center mb-4">
          <svg width="250" height="150" viewBox="0 0 250 150">
            {/* Capacitores en serie/paralelo según el modo */}
            {mode === "series" ? (
              <>
                <rect
                  x="50"
                  y="50"
                  width="40"
                  height="20"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="2"
                />
                <line
                  x1="90"
                  y1="60"
                  x2="110"
                  y2="60"
                  stroke="#4CAF50"
                  strokeWidth="2"
                />
                <rect
                  x="110"
                  y="50"
                  width="40"
                  height="20"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="2"
                />
                <text x="70" y="45" fill="#4CAF50" fontSize="10">
                  C₁
                </text>
                <text x="130" y="45" fill="#4CAF50" fontSize="10">
                  C₂
                </text>
                <text x="160" y="90" fill="#FF9800" fontSize="12">
                  Serie
                </text>
              </>
            ) : (
              <>
                <rect
                  x="50"
                  y="30"
                  width="40"
                  height="20"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="2"
                />
                <rect
                  x="50"
                  y="80"
                  width="40"
                  height="20"
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="2"
                />
                <line
                  x1="90"
                  y1="40"
                  x2="120"
                  y2="40"
                  stroke="#4CAF50"
                  strokeWidth="2"
                />
                <line
                  x1="90"
                  y1="90"
                  x2="120"
                  y2="90"
                  stroke="#4CAF50"
                  strokeWidth="2"
                />
                <text x="70" y="25" fill="#4CAF50" fontSize="10">
                  C₁
                </text>
                <text x="70" y="75" fill="#4CAF50" fontSize="10">
                  C₂
                </text>
                <text x="160" y="60" fill="#FF9800" fontSize="12">
                  Paralelo
                </text>
              </>
            )}
          </svg>
        </div>

        <div className="row">
          <div className="col-md-6">
            <h5 className="fw-bold">Capacitancia Equivalente</h5>

            <div className="mb-3">
              <label className="small fw-bold text-gold">
                Modo de Conexión
              </label>
              <select
                className="form-select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="parallel">Paralelo</option>
                <option value="series">Serie</option>
              </select>
            </div>

            {capacitorValues.map((value, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  type="number"
                  className="form-control"
                  value={value}
                  onChange={(e) => handleCapacitorChange(index, e.target.value)}
                  onKeyDown={preventInvalidChars}
                  placeholder={`C${index + 1} (µF)`}
                />
                {capacitorValues.length > 2 && (
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleRemoveCapacitor(index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              className="btn btn-sm btn-outline-dark w-100 mb-3"
              onClick={handleAddCapacitor}
            >
              + Agregar otro capacitor
            </button>

            <button
              className="btn btn-gold w-100 py-3 fw-bold"
              onClick={handleCalculateCapacitance}
            >
              CALCULAR CAPACITANCIA {mode === "series" ? "SERIE" : "PARALELO"}
            </button>

            {result && (
              <div className="mt-3 p-3 border-start border-4 border-success bg-light">
                <h5 className="fw-bold">Resultado:</h5>
                <h3>
                  {result.total} {result.unit}
                </h3>
                <small className="text-muted">{result.formula}</small>
              </div>
            )}
          </div>

          <div className="col-md-6">
            <h5 className="fw-bold">Reactancia Capacitiva</h5>

            <div className="mb-3">
              <label className="small fw-bold text-gold">
                Capacitancia (µF)
              </label>
              <input
                type="number"
                className="form-control"
                value={reactanceValues.capacitance}
                onChange={(e) =>
                  setReactanceValues({
                    ...reactanceValues,
                    capacitance: e.target.value,
                  })
                }
                onKeyDown={preventInvalidChars}
                placeholder="Ej: 100"
              />
            </div>

            <div className="mb-3">
              <label className="small fw-bold text-gold">Frecuencia (Hz)</label>
              <input
                type="number"
                className="form-control"
                value={reactanceValues.frequency}
                onChange={(e) =>
                  setReactanceValues({
                    ...reactanceValues,
                    frequency: e.target.value,
                  })
                }
                onKeyDown={preventInvalidChars}
                placeholder="Ej: 60"
              />
            </div>

            <button
              className="btn btn-gold w-100 py-3 fw-bold"
              onClick={handleCalculateReactance}
            >
              CALCULAR REACTANCIA
            </button>

            {reactanceResult && (
              <div className="mt-3 p-3 border-start border-4 border-info bg-light">
                <h5 className="fw-bold">Resultado:</h5>
                <h3>
                  {reactanceResult.reactance} {reactanceResult.unit}
                </h3>
                <small className="text-muted">{reactanceResult.formula}</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapacitorCalculator;
