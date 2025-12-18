import React, { useState, useEffect } from "react";
import {
  saveToHistory as saveCalculation,
  getHistory,
} from "../utils/historyService";
import { RESISTOR_COLORS, TOLERANCES } from "../constants/resistorColors";
import { calculateSeries, calculateParallel } from "../logic/resistance";

const ResistanceCalculator = () => {
  const [mode, setMode] = useState(4);
  const [bands, setBands] = useState({
    b1: 1,
    b2: 0,
    b3: 0,
    mult: 2,
    tol: 5,
    ppm: 100,
  });
  const [inputList, setInputList] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const syncHistory = () => setRecent(getHistory().slice(0, 3));
    syncHistory();
    window.addEventListener("historyUpdated", syncHistory);
    return () => window.removeEventListener("historyUpdated", syncHistory);
  }, []);

  const calculateTotal = () => {
    let val = 0;
    const digit1 = parseInt(bands.b1);
    const digit2 = parseInt(bands.b2);
    const multiplier = Math.pow(10, parseInt(bands.mult));
    if (mode === 4) {
      val = (digit1 * 10 + digit2) * multiplier;
    } else {
      const digit3 = parseInt(bands.b3);
      val = (digit1 * 100 + digit2 * 10 + digit3) * multiplier;
    }
    return val;
  };

  const currentRes = calculateTotal();

  const saveToHistory = (type, title, value) => {
    let steps = [];
    let displayInputs = "";

    if (type === "Banda") {
      const b1Label = RESISTOR_COLORS.find((c) => c.value == bands.b1)?.label;
      const b2Label = RESISTOR_COLORS.find((c) => c.value == bands.b2)?.label;
      const b3Label = RESISTOR_COLORS.find((c) => c.value == bands.b3)?.label;
      const multLabel = RESISTOR_COLORS.find(
        (c) => c.value == bands.mult
      )?.label;
      const tolLabel = TOLERANCES.find((t) => t.value == bands.tol)?.label;

      displayInputs = `Colores: ${b1Label}, ${b2Label}${
        mode >= 5 ? `, ${b3Label}` : ""
      }, ${multLabel}, ${tolLabel}`;

      steps = [
        `1. Identificación de bandas (${mode} bandas): ${displayInputs}.`,
        `2. Conversión: Digitos [${bands.b1}${bands.b2}${
          mode >= 5 ? bands.b3 : ""
        }] × Multiplicador [10^${bands.mult}].`,
        `3. Valor Nominal: ${value} Ω.`,
        `4. Precisión: Se aplica una tolerancia de ${tolLabel}.`,
      ];
    } else if (title === "R. Serie") {
      displayInputs = `Red Serie: ${inputList.join(", ")} Ω`;
      steps = [
        `1. Configuración: Asociación en Serie detectada.`,
        `2. Aplicación de fórmula: Rt = Σ Rn (Suma lineal).`,
        `3. Operación: ${inputList.join(" + ")} Ω.`,
        `4. Resultado Total: ${value} Ω.`,
      ];
    } else {
      displayInputs = `Red Paralelo: ${inputList.join(", ")} Ω`;
      steps = [
        `1. Configuración: Asociación en Paralelo detectada.`,
        `2. Aplicación de fórmula: Rt = 1 / (Σ 1/Rn).`,
        `3. Conductancia: Suma de recíprocos calculada de ${inputList.length} elementos.`,
        `4. Resultado Total: ${value} Ω.`,
      ];
    }

    saveCalculation({
      calculator: title,
      formula:
        type === "Red"
          ? "Asociación de Resistencias"
          : `${mode} Bandas de Color`,
      inputs: displayInputs,
      result: `${value} Ω`,
      steps: steps,
    });
  };

  return (
    <div className="card premium-card animate__animated animate__fadeIn">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bolder m-0 text-uppercase">Resistencias</h4>
          <select
            className="form-select form-select-sm w-auto border-gold"
            value={mode}
            onChange={(e) => setMode(parseInt(e.target.value))}
          >
            <option value={4}>4 Bandas</option>
            <option value={5}>5 Bandas</option>
            <option value={6}>6 Bandas</option>
          </select>
        </div>

        <div className="d-flex justify-content-center mb-4 p-4 bg-light rounded shadow-inner">
          <div
            className="resistor-body d-flex align-items-center px-2"
            style={{
              background: "#d1b07d",
              borderRadius: "10px",
              height: "50px",
              width: "220px",
            }}
          >
            <div
              className="band"
              style={{
                width: "12px",
                height: "100%",
                backgroundColor: RESISTOR_COLORS.find(
                  (c) => c.value == bands.b1
                )?.color,
                marginRight: "8px",
              }}
            ></div>
            <div
              className="band"
              style={{
                width: "12px",
                height: "100%",
                backgroundColor: RESISTOR_COLORS.find(
                  (c) => c.value == bands.b2
                )?.color,
                marginRight: "8px",
              }}
            ></div>
            {mode >= 5 && (
              <div
                className="band"
                style={{
                  width: "12px",
                  height: "100%",
                  backgroundColor: RESISTOR_COLORS.find(
                    (c) => c.value == bands.b3
                  )?.color,
                  marginRight: "8px",
                }}
              ></div>
            )}
            <div
              className="band"
              style={{
                width: "12px",
                height: "100%",
                backgroundColor: RESISTOR_COLORS.find(
                  (c) => c.value == bands.mult
                )?.color,
                marginRight: "20px",
              }}
            ></div>
            <div
              className="band"
              style={{
                width: "12px",
                height: "100%",
                backgroundColor: TOLERANCES.find((t) => t.value == bands.tol)
                  ?.color,
                marginRight: mode === 6 ? "8px" : "0",
              }}
            ></div>
            {mode === 6 && (
              <div
                className="band"
                style={{
                  width: "12px",
                  height: "100%",
                  backgroundColor: "#804000",
                }}
              ></div>
            )}
          </div>
        </div>

        <div className="h2 text-center mb-4 fw-bolder">
          {currentRes.toLocaleString()} Ω{" "}
          <small className="fs-6 opacity-50">±{bands.tol}%</small>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-4">
            <label className="small fw-bold">B1</label>
            <select
              className="form-select border-2"
              value={bands.b1}
              onChange={(e) => setBands({ ...bands, b1: e.target.value })}
            >
              {RESISTOR_COLORS.slice(1).map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-4">
            <label className="small fw-bold">B2</label>
            <select
              className="form-select border-2"
              value={bands.b2}
              onChange={(e) => setBands({ ...bands, b2: e.target.value })}
            >
              {RESISTOR_COLORS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          {mode >= 5 && (
            <div className="col-4">
              <label className="small fw-bold">B3</label>
              <select
                className="form-select border-2"
                value={bands.b3}
                onChange={(e) => setBands({ ...bands, b3: e.target.value })}
              >
                {RESISTOR_COLORS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="col-4">
            <label className="small fw-bold">MULT</label>
            <select
              className="form-select border-2"
              value={bands.mult}
              onChange={(e) => setBands({ ...bands, mult: e.target.value })}
            >
              {RESISTOR_COLORS.map((c) => (
                <option key={c.value} value={c.value}>
                  x10^{c.value} ({c.label})
                </option>
              ))}
            </select>
          </div>
          <div className="col-4">
            <label className="small fw-bold">TOL</label>
            <select
              className="form-select border-2"
              value={bands.tol}
              onChange={(e) => setBands({ ...bands, tol: e.target.value })}
            >
              {TOLERANCES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="btn btn-outline-dark btn-sm w-100 mb-4 fw-bold"
          onClick={() =>
            saveToHistory(
              "Banda",
              "Resistencia Color",
              currentRes.toLocaleString()
            )
          }
        >
          GUARDAR VALOR EN HISTORIAL
        </button>

        <hr />

        <section className="mt-4">
          <h6 className="fw-bold text-muted small text-uppercase mb-3">
            Cálculo de Redes
          </h6>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control border-2"
              placeholder="Ej: 100, 220, 330"
              onChange={(e) =>
                setInputList(
                  e.target.value
                    .split(",")
                    .map((v) => parseFloat(v.trim()))
                    .filter((v) => !isNaN(v))
                )
              }
            />
            <span className="input-group-text bg-dark text-white">Ω</span>
          </div>
          <div className="row g-2 mb-3">
            <div className="col-6">
              <button
                className="btn btn-dark w-100 py-3"
                onClick={() =>
                  saveToHistory(
                    "Red",
                    "R. Serie",
                    calculateSeries(inputList).toFixed(2)
                  )
                }
              >
                <small className="d-block opacity-75">SERIE</small>
                <span className="fw-bold">
                  {calculateSeries(inputList).toFixed(2)} Ω
                </span>
              </button>
            </div>
            <div className="col-6">
              <button
                className="btn btn-dark w-100 py-3"
                onClick={() =>
                  saveToHistory(
                    "Red",
                    "R. Paralelo",
                    calculateParallel(inputList).toFixed(2)
                  )
                }
              >
                <small className="d-block opacity-75">PARALELO</small>
                <span className="fw-bold">
                  {calculateParallel(inputList).toFixed(2)} Ω
                </span>
              </button>
            </div>
          </div>
        </section>

        {recent.length > 0 && (
          <div className="mt-2 pt-3 border-top">
            <h6 className="fw-bold small text-muted text-uppercase mb-2">
              Historial Reciente
            </h6>
            {recent.map((h) => (
              <div
                key={h.id}
                className="d-flex justify-content-between small mb-1 opacity-75 py-1 border-bottom"
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

export default ResistanceCalculator;
