import React, { useState, useEffect } from "react";
import { calculateOhm } from "../logic/ohm";
import {
  saveToHistory as saveCalculation,
  getHistory,
} from "../utils/historyService";
import { validateNumber, preventInvalidChars } from "../utils/validation";

const OhmCalculator = () => {
  const [vals, setVals] = useState({ v: "", i: "", r: "" });
  const [errors, setErrors] = useState({ v: "", i: "", r: "" });
  const [res, setRes] = useState(null);
  const [locked, setLocked] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const syncHistory = () => {
      setRecent(
        getHistory()
          .filter((h) => h.calculator === "Ley de Ohm")
          .slice(0, 3)
      );
    };
    syncHistory();
    window.addEventListener("historyUpdated", syncHistory);
    return () => window.removeEventListener("historyUpdated", syncHistory);
  }, []);

  useEffect(() => {
    const filled = Object.keys(vals).filter(
      (key) => vals[key] !== "" && !errors[key]
    );
    setLocked(
      filled.length >= 2 ? Object.keys(vals).find((k) => vals[k] === "") : null
    );
  }, [vals, errors]);

  const handleInputChange = (id, val) => {
    // Validar entrada
    const validation = validateNumber(val, 0);

    setErrors({ ...errors, [id]: validation.valid ? "" : validation.message });

    if (val === "" || validation.valid) {
      setVals({ ...vals, [id]: val });
    }
  };

  const handleCalc = () => {
    // Validar que haya exactamente 2 valores
    const filled = Object.keys(vals).filter(
      (key) => vals[key] !== "" && !errors[key]
    );
    if (filled.length !== 2) {
      setRes({ isError: true, error: "Ingresa exactamente 2 valores" });
      return;
    }

    const v = parseFloat(vals.v) || 0;
    const i = parseFloat(vals.i) || 0;
    const r = parseFloat(vals.r) || 0;
    const calc = calculateOhm(v, i, r);

    if (calc) {
      setRes(calc);

      let formula = "",
        steps = [];
      if (!vals.v) {
        formula = "V = I × R";
        steps = [
          `1. Variables conocidas: I = ${vals.i}A, R = ${vals.r}Ω`,
          `2. Aplicar fórmula: V = I × R`,
          `3. Sustitución: V = ${vals.i} × ${vals.r}`,
          `4. Resultado: ${calc.result} V`,
          `5. Interpretación: Se requiere ${calc.result}V para circular ${vals.i}A a través de ${vals.r}Ω`,
        ];
      } else if (!vals.i) {
        formula = "I = V / R";
        steps = [
          `1. Variables conocidas: V = ${vals.v}V, R = ${vals.r}Ω`,
          `2. Aplicar fórmula: I = V / R`,
          `3. Sustitución: I = ${vals.v} / ${vals.r}`,
          `4. Resultado: ${calc.result} A`,
          `5. Interpretación: Circularán ${calc.result}A con ${vals.v}V aplicados a ${vals.r}Ω`,
        ];
      } else {
        formula = "R = V / I";
        steps = [
          `1. Variables conocidas: V = ${vals.v}V, I = ${vals.i}A`,
          `2. Aplicar fórmula: R = V / I`,
          `3. Sustitución: R = ${vals.v} / ${vals.i}`,
          `4. Resultado: ${calc.result} Ω`,
          `5. Interpretación: Se necesita ${calc.result}Ω para limitar a ${vals.i}A con ${vals.v}V`,
        ];
      }

      saveCalculation({
        calculator: "Ley de Ohm",
        formula: formula,
        inputs: `V: ${vals.v || "?"}V, I: ${vals.i || "?"}A, R: ${
          vals.r || "?"
        }Ω`,
        result: `${parseFloat(calc.result).toFixed(3)} ${calc.unit}`,
        steps: steps,
      });
    }
  };

  const getFill = (key) =>
    vals[key] !== "" && !errors[key]
      ? "var(--kawiil-gold)"
      : errors[key]
      ? "#dc3545"
      : "rgba(128,128,128,0.3)";

  return (
    <div className="card premium-card animate__animated animate__fadeIn">
      <div className="card-body p-4 text-center">
        <h4 className="fw-bolder text-gold mb-4 text-start">⚡ LEY DE OHM</h4>

        {/* DIAGRAMA MEJORADO */}
        <div className="mb-4 d-flex justify-content-center align-items-center">
          <div className="position-relative">
            <svg width="220" height="180" viewBox="0 0 220 180">
              {/* Fondo del circuito */}
              <path
                d="M30 90 H80 M140 90 H190"
                stroke="var(--kawiil-text)"
                strokeWidth="2"
                fill="none"
                opacity="0.2"
              />

              {/* Resistor */}
              <rect
                x="80"
                y="70"
                width="60"
                height="40"
                rx="5"
                fill="none"
                stroke={getFill("r")}
                strokeWidth="3"
                strokeOpacity="0.7"
              />
              <path
                d="M80 90 L85 75 L95 105 L105 75 L115 105 L125 75 L130 90"
                stroke={getFill("r")}
                strokeWidth="2"
                fill="none"
              />

              {/* Fuente de voltaje */}
              <circle
                cx="30"
                cy="90"
                r="15"
                fill="none"
                stroke={getFill("v")}
                strokeWidth="3"
              />
              <line
                x1="30"
                y1="75"
                x2="30"
                y2="105"
                stroke={getFill("v")}
                strokeWidth="2"
              />
              <line
                x1="20"
                y1="90"
                x2="40"
                y2="90"
                stroke={getFill("v")}
                strokeWidth="2"
              />

              {/* Amperímetro */}
              <circle
                cx="190"
                cy="90"
                r="15"
                fill="none"
                stroke={getFill("i")}
                strokeWidth="3"
              />
              <text
                x="190"
                y="95"
                textAnchor="middle"
                fontSize="14"
                fill={getFill("i")}
                fontWeight="bold"
              >
                A
              </text>

              {/* Flechas de corriente */}
              {vals.i && !errors.i && (
                <g>
                  <path
                    d="M100 40 Q110 30 120 40"
                    stroke="#28a745"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                  <text
                    x="110"
                    y="25"
                    textAnchor="middle"
                    fill="#28a745"
                    fontSize="10"
                  >
                    I = {vals.i}A
                  </text>
                </g>
              )}

              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#28a745" />
                </marker>
              </defs>
            </svg>

            {/* Etiquetas flotantes */}
            <div
              className="position-absolute"
              style={{ top: "20px", left: "10px" }}
            >
              <span className="badge bg-dark text-gold">
                V = {vals.v || "?"}V
              </span>
            </div>
            <div
              className="position-absolute"
              style={{ top: "20px", right: "10px" }}
            >
              <span className="badge bg-dark text-gold">
                I = {vals.i || "?"}A
              </span>
            </div>
            <div
              className="position-absolute"
              style={{
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <span className="badge bg-dark text-gold">
                R = {vals.r || "?"}Ω
              </span>
            </div>
          </div>
        </div>

        {/* INPUTS CON VALIDACIÓN */}
        <div className="mb-4 text-start">
          {["v", "i", "r"].map((key) => (
            <div className="mb-3" key={key}>
              <label className="small fw-bold text-gold mb-1">
                {key === "v"
                  ? "VOLTAJE (V)"
                  : key === "i"
                  ? "CORRIENTE (A)"
                  : "RESISTENCIA (Ω)"}
              </label>
              <div className="input-group">
                <input
                  type="number"
                  step="any"
                  className={`form-control ${errors[key] ? "input-error" : ""}`}
                  value={vals[key]}
                  disabled={locked === key}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  onKeyDown={preventInvalidChars}
                  placeholder={locked === key ? "Calculando..." : "0.00"}
                />
                <span className="input-group-text bg-dark text-white">
                  {key === "v" ? "V" : key === "i" ? "A" : "Ω"}
                </span>
              </div>
              {errors[key] && (
                <small className="text-danger">{errors[key]}</small>
              )}
            </div>
          ))}
        </div>

        <button
          className="btn btn-dark w-100 py-3 fw-bold mb-3"
          onClick={handleCalc}
          disabled={!locked || Object.values(errors).some((e) => e)}
        >
          CALCULAR{" "}
          {locked === "v"
            ? "VOLTAJE"
            : locked === "i"
            ? "CORRIENTE"
            : "RESISTENCIA"}
        </button>

        {res && (
          <div
            className={`p-3 mb-4 border-start border-4 ${
              res.isError ? "result-error" : "result-success"
            } bg-light shadow-sm animate__animated animate__pulse`}
          >
            <small className="d-block text-uppercase fw-bold">
              {res.isError ? "⚠️ ERROR" : "✅ RESULTADO"}
            </small>
            <span className="h2 fw-bolder">
              {res.isError
                ? res.error
                : `${parseFloat(res.result).toFixed(3)} ${res.unit}`}
            </span>
            {!res.isError && (
              <div className="mt-2">
                <small className="text-muted d-block">
                  {locked === "v"
                    ? `Se requiere ${res.result}V`
                    : locked === "i"
                    ? `Circularán ${res.result}A`
                    : `Resistencia necesaria: ${res.result}Ω`}
                </small>
              </div>
            )}
          </div>
        )}

        {/* HISTORIAL MEJORADO */}
        {recent.length > 0 && (
          <div className="mt-4 pt-3 border-top border-secondary">
            <h6 className="fw-bold small text-gold text-uppercase mb-2">
              📊 Historial Reciente (Ohm)
            </h6>
            {recent.map((h, idx) => (
              <div
                key={idx}
                className="d-flex justify-content-between align-items-center small mb-2 p-2 rounded bg-dark"
              >
                <div>
                  <div className="fw-bold">{h.result}</div>
                  <small className="opacity-50">{h.inputs}</small>
                </div>
                <span className="badge bg-gold text-dark">{h.formula}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OhmCalculator;
