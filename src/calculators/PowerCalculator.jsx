import React, { useState, useEffect } from "react";
import { calculatePower } from "../logic/power";
import {
  saveToHistory as saveCalculation,
  getHistory,
} from "../utils/historyService";

const PowerCalculator = () => {
  const [vals, setVals] = useState({ p: "", v: "", i: "", r: "" });
  const [res, setRes] = useState(null);
  const [lockedFields, setLockedFields] = useState([]);
  const [recent, setRecent] = useState([]);

  // Historial global sincronizado (Igual que en ResistanceCalculator)
  useEffect(() => {
    const syncHistory = () => {
      setRecent(getHistory().slice(0, 3));
    };
    syncHistory();
    window.addEventListener("historyUpdated", syncHistory);
    return () => window.removeEventListener("historyUpdated", syncHistory);
  }, []);

  // Bloqueo de campos al tener 2 valores
  useEffect(() => {
    const filled = Object.keys(vals).filter((key) => vals[key] !== "");
    if (filled.length >= 2) {
      const empty = Object.keys(vals).filter((key) => vals[key] === "");
      setLockedFields(empty);
    } else {
      setLockedFields([]);
    }
  }, [vals]);

  // Validación de entrada (Solo números positivos)
  const handleInputChange = (id, val) => {
    if (val === "" || (parseFloat(val) >= 0 && !isNaN(val))) {
      setVals({ ...vals, [id]: val });
    }
  };

  const handleCalc = (e) => {
    // ESTO EVITA QUE TE MANDE A OTRA PÁGINA
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { v, i, r, p } = vals;
    const result = calculatePower(
      parseFloat(v),
      parseFloat(i),
      parseFloat(r),
      parseFloat(p)
    );

    if (result) {
      setRes(result);

      // --- GENERACIÓN DE PASOS DESARROLLADOS PARA EL PDF ---
      const steps = [
        `1. Identificar valores conocidos: ${vals.p ? `P=${vals.p}W` : ""} ${
          vals.v ? `V=${vals.v}V` : ""
        } ${vals.i ? `I=${vals.i}A` : ""} ${
          vals.r ? `R=${vals.r}Ω` : ""
        }`.trim(),
        `2. Objetivo: Calcular la magnitud de ${result.label.toLowerCase()}.`,
        `3. Aplicar fórmula de la Ley de Watt/Ohm correspondiente.`,
        `4. Sustituir y resolver: ${result.result.toFixed(4)} ${result.unit}.`,
      ];

      // Estructura de guardado idéntica a la de Resistencias
      saveCalculation({
        calculator: "Ley de Watt",
        formula: `Cálculo de ${result.label}`,
        inputs: `P:${vals.p || "?"}W, V:${vals.v || "?"}V, I:${
          vals.i || "?"
        }A, R:${vals.r || "?"}Ω`,
        result: `${result.result.toFixed(4)} ${result.unit}`,
        steps: steps,
      });
    }
  };

  const reset = () => {
    setVals({ p: "", v: "", i: "", r: "" });
    setRes(null);
  };

  const getFill = (key) =>
    vals[key] !== "" ? "#D4AF37" : "rgba(128,128,128,0.2)";

  return (
    <div className="card premium-card animate__animated animate__fadeIn">
      <div className="card-body p-4">
        <h4 className="fw-bolder mb-4 text-gold text-uppercase">Ley de Watt</h4>

        {/* Círculo de Potencia con R */}
        <div className="text-center mb-4 d-flex justify-content-center">
          <svg width="150" height="150" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1.5"
            />
            <line
              x1="15"
              y1="50"
              x2="85"
              y2="50"
              stroke="#D4AF37"
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="15"
              x2="50"
              y2="85"
              stroke="#D4AF37"
              strokeWidth="1"
            />
            <text
              x="35"
              y="42"
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill={getFill("p")}
            >
              P
            </text>
            <text
              x="65"
              y="42"
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill={getFill("v")}
            >
              V
            </text>
            <text
              x="35"
              y="72"
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill={getFill("i")}
            >
              I
            </text>
            <text
              x="65"
              y="72"
              textAnchor="middle"
              fontSize="12"
              fontWeight="bold"
              fill={getFill("r")}
            >
              R
            </text>
          </svg>
        </div>

        {/* Div contenedor en lugar de Form para evitar refresco */}
        <div className="row g-3 mb-4">
          {[
            { id: "p", label: "POTENCIA", unit: "W" },
            { id: "v", label: "VOLTAJE", unit: "V" },
            { id: "i", label: "CORRIENTE", unit: "A" },
            { id: "r", label: "RESISTENCIA", unit: "Ω" },
          ].map((f) => (
            <div className="col-6" key={f.id}>
              <label className="small fw-bold text-gold">{f.label}</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control border-2"
                  value={vals[f.id]}
                  disabled={lockedFields.includes(f.id)}
                  onChange={(e) => handleInputChange(f.id, e.target.value)}
                />
                <span className="input-group-text bg-dark text-white fw-bold">
                  {f.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-dark w-100 py-3 fw-bold mb-2 shadow-sm"
          onClick={(e) => handleCalc(e)}
          disabled={lockedFields.length < 2}
        >
          CALCULAR RESULTADO
        </button>

        <button
          type="button"
          className="btn btn-link text-muted btn-sm w-100 text-decoration-none"
          onClick={reset}
        >
          Limpiar y desbloquear campos
        </button>

        {res && (
          <div className="mt-4 p-3 bg-light border-start border-gold border-4 text-center">
            <small className="d-block text-muted text-uppercase">
              {res.label} CALCULADA:
            </small>
            <span className="h2 fw-bolder text-dark">
              {res.result.toFixed(4)} {res.unit}
            </span>
          </div>
        )}

        {/* HISTORIAL GLOBAL (Aparecerá siempre aquí abajo) */}
        {recent.length > 0 && (
          <div className="mt-4 pt-3 border-top">
            <h6 className="fw-bold small text-gold text-uppercase mb-2">
              Historial Reciente
            </h6>
            {recent.map((h) => (
              <div
                key={h.id}
                className="d-flex justify-content-between small mb-1 py-1 border-bottom border-light opacity-75"
              >
                <span>{h.calculator}:</span>
                <span className="fw-bold">{h.result}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerCalculator;
