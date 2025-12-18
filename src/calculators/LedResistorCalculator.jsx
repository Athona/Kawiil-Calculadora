import React, { useState, useEffect } from "react";
import { LED_PRESETS, LED_ERRORS } from "../constants/ledData";
import { calculateLedResistor } from "../logic/ledResistor";
import { saveToHistory, getHistory } from "../utils/historyService";

const LedResistorCalculator = () => {
  const [values, setValues] = useState({ vin: "", vled: "", iled: "20" });
  const [calculation, setCalculation] = useState(null);
  const [activeLed, setActiveLed] = useState(null);
  const [recentHistory, setRecentHistory] = useState([]);

  useEffect(() => {
    if (values.vin && values.vled && values.iled) {
      const res = calculateLedResistor(values.vin, values.vled, values.iled);
      setCalculation(res);
    } else {
      setCalculation(null);
    }
  }, [values]);

  useEffect(() => {
    loadRecent();
    window.addEventListener("historyUpdated", loadRecent);
    return () => window.removeEventListener("historyUpdated", loadRecent);
  }, []);

  const loadRecent = () => {
    const data = getHistory();
    setRecentHistory(
      data.filter((i) => i.calculator === "Resistencia de LED").slice(0, 3)
    );
  };

  // Validación reforzada: Solo números positivos, sin letras ni símbolos negativos
  const handleInputChange = (id, val) => {
    // 1. Si el valor está vacío, permitir para que el usuario pueda borrar
    if (val === "") {
      setValues({ ...values, [id]: "" });
      return;
    }

    // 2. Convertir a número para validar valor real
    const numVal = parseFloat(val);

    // 3. Bloqueo estricto de no-números y negativos
    if (isNaN(numVal) || numVal < 0) return;

    setValues({ ...values, [id]: val });
    if (id === "vled") setActiveLed(null);
  };

  const selectPreset = (led) => {
    setValues({ ...values, vled: led.vout, iled: led.defaultCurrent });
    setActiveLed(led.id);
  };

  const generateSteps = (res) => {
    const Vi = parseFloat(values.vin);
    const Vf = parseFloat(values.vled);
    const If_amp = parseFloat(values.iled) / 1000;
    return [
      `FÓRMULA: R = (Vin - Vled) / Iled`,
      `DATOS: Vin=${Vi}V, Vled=${Vf}V, Iled=${values.iled}mA`,
      `PASO 1: VR = ${Vi} - ${Vf} = ${(Vi - Vf).toFixed(2)}V`,
      `PASO 2: I = ${values.iled}/1000 = ${If_amp}A`,
      `RESULTADO: R = ${res.result}Ω | Potencia: ${res.power}W`,
    ];
  };

  const handleSave = () => {
    if (calculation && !calculation.isError) {
      saveToHistory({
        id: crypto.randomUUID(),
        calculator: "Resistencia de LED",
        inputs: `Vin:${values.vin}V, Vled:${values.vled}V, Iled:${values.iled}mA`,
        result: `${calculation.result} Ω`,
        steps: generateSteps(calculation),
      });
    }
  };

  const getLedHex = () => {
    const colors = {
      red: "#ff4d4d",
      green: "#2ecc71",
      yellow: "#f1c40f",
      blue: "#3498db",
      white: "#e0e0e0",
      ir: "#8e44ad",
    };
    return colors[activeLed] || "var(--kawiil-gold)";
  };

  return (
    <div className="container animate__animated animate__fadeIn">
      <div
        className="p-4 mb-4 shadow-lg border-0"
        style={{
          backgroundColor: "var(--kawiil-card)",
          borderTop: "4px solid var(--kawiil-gold)",
          borderRadius: "12px",
        }}
      >
        <h2
          className="fw-bold mb-4 text-uppercase"
          style={{ color: "var(--kawiil-gold)" }}
        >
          Resistencia para LED
        </h2>

        {/* DIAGRAMA ANIMADO ADAPTABLE */}
        <div
          className="text-center mb-4 py-4 rounded-3"
          style={{
            backgroundColor: "var(--kawiil-bg)",
            border: "1px solid rgba(128,128,128,0.1)",
          }}
        >
          <svg width="240" height="110" viewBox="0 0 240 110">
            <path
              d="M30 60 H70 M130 60 H170"
              stroke="var(--kawiil-text)"
              strokeWidth="2"
              opacity="0.2"
              fill="none"
            />
            {calculation && !calculation.isError && (
              <path
                d="M30 60 H70 M130 60 H170"
                stroke={getLedHex()}
                strokeWidth="3"
                fill="none"
                strokeDasharray="8,4"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="24"
                  to="0"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            )}
            <rect
              x="10"
              y="45"
              width="25"
              height="30"
              rx="4"
              fill="var(--kawiil-gold)"
            />
            <text x="14" y="65" fill="#000" fontSize="12" fontWeight="bold">
              V+
            </text>
            <g stroke="var(--kawiil-gold)" strokeWidth="2" fill="none">
              <rect
                x="70"
                y="50"
                width="60"
                height="20"
                rx="2"
                strokeOpacity="0.3"
              />
              <path d="M70 60 L75 52 L85 68 L95 52 L105 68 L115 52 L125 68 L130 60" />
            </g>
            <g transform="translate(175, 45)">
              <path
                d="M0 0 L25 15 L0 30 Z"
                fill={activeLed ? getLedHex() : "none"}
                stroke={getLedHex()}
                strokeWidth="2"
              />
              <line
                x1="25"
                y1="0"
                x2="25"
                y2="30"
                stroke={getLedHex()}
                strokeWidth="3"
              />
            </g>
            <path
              d="M30 75 V100 H200 V75"
              stroke="var(--kawiil-text)"
              strokeWidth="2"
              fill="none"
              opacity="0.1"
            />
          </svg>
        </div>

        {/* PRESETS */}
        <div className="mb-4 d-flex gap-2 flex-wrap">
          {LED_PRESETS.map((led) => (
            <button
              key={led.id}
              className="btn btn-sm fw-bold border-0 px-3"
              style={{
                backgroundColor:
                  activeLed === led.id
                    ? "var(--kawiil-gold)"
                    : "rgba(128,128,128,0.1)",
                color: activeLed === led.id ? "#000" : "var(--kawiil-text)",
              }}
              onClick={() => selectPreset(led)}
            >
              {led.name}
            </button>
          ))}
        </div>

        {/* INPUTS BLINDADOS */}
        <div className="row g-3 mb-4">
          {[
            { id: "vin", label: "VIN (V)" },
            { id: "vled", label: "VLED (V)" },
            { id: "iled", label: "ILED (mA)" },
          ].map((field) => (
            <div className="col-md-4" key={field.id}>
              <label
                className="small fw-bold mb-1"
                style={{ color: "var(--kawiil-gold)" }}
              >
                {field.label}
              </label>
              <input
                type="number"
                pattern="[0-9]*"
                min="0"
                step="any"
                onKeyDown={(e) =>
                  ["e", "E", "-", "+"].includes(e.key) && e.preventDefault()
                }
                className="form-control border-0 fw-bold"
                style={{
                  backgroundColor: "var(--kawiil-bg)",
                  color: "var(--kawiil-text)",
                }}
                value={values[field.id]}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder="0.00"
              />
            </div>
          ))}
        </div>

        {/* RESULTADO ADAPTABLE */}
        {calculation && (
          <div
            className="p-3 rounded-3 animate__animated animate__fadeInUp"
            style={{
              backgroundColor: "var(--kawiil-bg)",
              borderLeft: `5px solid ${
                calculation.isError ? "#ff4d4d" : "var(--kawiil-gold)"
              }`,
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small
                  className="fw-bold opacity-50"
                  style={{ color: "var(--kawiil-text)" }}
                >
                  {calculation.isError ? "ERROR" : "VALOR R:"}
                </small>
                <div
                  className="h2 fw-bold mb-0"
                  style={{
                    color: calculation.isError
                      ? "#ff4d4d"
                      : "var(--kawiil-text)",
                  }}
                >
                  {calculation.isError
                    ? calculation.error
                    : `${calculation.result} Ω`}
                </div>
                {!calculation.isError && (
                  <small className="text-success fw-bold">
                    Potencia: {calculation.power}W
                  </small>
                )}
              </div>
              {!calculation.isError && (
                <button
                  className="btn fw-bold px-4 shadow-sm"
                  style={{
                    backgroundColor: "var(--kawiil-gold)",
                    color: "#000",
                  }}
                  onClick={handleSave}
                >
                  GUARDAR
                </button>
              )}
            </div>
          </div>
        )}

        {/* HISTORIAL */}
        <div
          className="mt-5 pt-3 border-top"
          style={{ borderColor: "rgba(128,128,128,0.2)" }}
        >
          <h6
            className="fw-bold mb-3 small"
            style={{ color: "var(--kawiil-gold)", letterSpacing: "1px" }}
          >
            HISTORIAL RECIENTE
          </h6>
          {recentHistory.length > 0 ? (
            recentHistory.map((h, idx) => (
              <div
                key={idx}
                className="d-flex justify-content-between py-2 border-bottom"
                style={{ borderColor: "rgba(128,128,128,0.1)" }}
              >
                <div className="d-flex flex-column">
                  <span
                    className="fw-bold small"
                    style={{ color: "var(--kawiil-text)" }}
                  >
                    {h.result}
                  </span>
                  <span
                    className="opacity-50 small"
                    style={{ color: "var(--kawiil-text)", fontSize: "0.7rem" }}
                  >
                    {h.inputs}
                  </span>
                </div>
                <span
                  className="badge align-self-center"
                  style={{
                    backgroundColor: "rgba(40, 167, 69, 0.1)",
                    color: "#28a745",
                    fontSize: "0.6rem",
                  }}
                >
                  RESISTENCIA
                </span>
              </div>
            ))
          ) : (
            <div
              className="text-center opacity-25 small py-2"
              style={{ color: "var(--kawiil-text)" }}
            >
              No hay registros
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LedResistorCalculator;
