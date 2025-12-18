import React, { useState } from "react";
import { saveToHistory } from "../utils/historyService";
import {
  calculatePowerFactor,
  calculateCapacitorBank,
} from "../logic/powerFactor";
import { validateNumber } from "../utils/validation";

const PowerFactorCalculator = () => {
  const [mode, setMode] = useState("pf"); // "pf" o "correction"
  const [pfValues, setPfValues] = useState({
    realPower: "",
    apparentPower: "",
    reactivePower: "",
  });

  const [correctionValues, setCorrectionValues] = useState({
    power: "",
    currentPF: "0.75",
    desiredPF: "0.95",
    voltage: "127",
    frequency: "60",
  });

  const [pfResult, setPfResult] = useState(null);
  const [correctionResult, setCorrectionResult] = useState(null);

  const handleCalculatePF = () => {
    const { realPower, apparentPower, reactivePower } = pfValues;

    if (realPower && apparentPower) {
      const result = calculatePowerFactor(realPower, apparentPower, null);
      setPfResult(result);

      saveToHistory({
        calculator: "Factor de Potencia",
        inputs: `P=${realPower}W, S=${apparentPower}VA`,
        result: `FP=${result.powerFactor}, Q=${result.reactivePower}VAR, Ángulo=${result.angle}°`,
        steps: [
          `Fórmula: FP = P / S`,
          `Cálculo: ${realPower} / ${apparentPower} = ${result.powerFactor}`,
          `Potencia reactiva: Q = √(S² - P²) = √(${apparentPower}² - ${realPower}²) = ${result.reactivePower} VAR`,
          `Ángulo: φ = acos(FP) = ${result.angle}°`,
        ],
      });
    } else if (realPower && reactivePower) {
      const result = calculatePowerFactor(realPower, null, reactivePower);
      setPfResult(result);

      saveToHistory({
        calculator: "Factor de Potencia",
        inputs: `P=${realPower}W, Q=${reactivePower}VAR`,
        result: `FP=${result.powerFactor}, S=${result.apparentPower}VA, Ángulo=${result.angle}°`,
        steps: [
          `Fórmula: S = √(P² + Q²)`,
          `Cálculo: √(${realPower}² + ${reactivePower}²) = ${result.apparentPower} VA`,
          `Factor de potencia: FP = P / S = ${realPower} / ${result.apparentPower} = ${result.powerFactor}`,
          `Ángulo: φ = acos(FP) = ${result.angle}°`,
        ],
      });
    } else {
      alert("Ingresa al menos dos valores (P y S, o P y Q)");
    }
  };

  const handleCalculateCorrection = () => {
    const { power, currentPF, desiredPF, voltage, frequency } =
      correctionValues;

    if (!power || !currentPF || !desiredPF || !voltage) {
      alert("Completa todos los campos");
      return;
    }

    if (parseFloat(currentPF) >= parseFloat(desiredPF)) {
      alert("El factor de potencia deseado debe ser mayor al actual");
      return;
    }

    const result = calculateCapacitorBank(
      power,
      currentPF,
      desiredPF,
      voltage,
      frequency
    );
    setCorrectionResult(result);

    saveToHistory({
      calculator: "Corrección Factor de Potencia",
      inputs: `P=${power}W, FP_actual=${currentPF}, FP_deseado=${desiredPF}, V=${voltage}V, f=${frequency}Hz`,
      result: `Qc=${result.reactivePowerNeeded}VAR, C=${result.capacitance}µF`,
      steps: [
        `Fórmula: Qc = P × (tan(φ1) - tan(φ2))`,
        `Cálculo: ${power} × (tan(acos(${currentPF})) - tan(acos(${desiredPF}))) = ${result.reactivePowerNeeded} VAR`,
        `Capacitancia: C = Qc / (2πfV²) = ${result.capacitance} µF`,
        `Banco de capacitores: ${result.kVAR} kVAR`,
      ],
    });
  };

  return (
    <div className="card premium-card animate__animated animate__fadeIn">
      <div className="card-body p-4">
        <h4 className="fw-bolder text-gold mb-4">
          📊 Calculadora de Factor de Potencia
        </h4>

        {/* Diagrama SVG */}
        <div className="text-center mb-4">
          <svg width="250" height="120" viewBox="0 0 250 120">
            {/* Triángulo de potencia */}
            <line
              x1="50"
              y1="100"
              x2="150"
              y2="100"
              stroke="#4CAF50"
              strokeWidth="3"
            />
            <line
              x1="50"
              y1="100"
              x2="50"
              y2="50"
              stroke="#FF9800"
              strokeWidth="3"
            />
            <line
              x1="50"
              y1="50"
              x2="150"
              y2="100"
              stroke="#2196F3"
              strokeWidth="3"
            />

            <text
              x="100"
              y="105"
              fill="#4CAF50"
              fontSize="12"
              fontWeight="bold"
            >
              P (W)
            </text>
            <text x="30" y="75" fill="#FF9800" fontSize="12" fontWeight="bold">
              Q (VAR)
            </text>
            <text x="90" y="40" fill="#2196F3" fontSize="12" fontWeight="bold">
              S (VA)
            </text>
            <text x="70" y="85" fill="#000" fontSize="10">
              φ
            </text>
          </svg>
        </div>

        <div className="mb-4">
          <div className="btn-group w-100" role="group">
            <button
              className={`btn ${
                mode === "pf" ? "btn-gold" : "btn-outline-gold"
              }`}
              onClick={() => setMode("pf")}
            >
              Cálculo FP
            </button>
            <button
              className={`btn ${
                mode === "correction" ? "btn-gold" : "btn-outline-gold"
              }`}
              onClick={() => setMode("correction")}
            >
              Corrección FP
            </button>
          </div>
        </div>

        {mode === "pf" ? (
          <div>
            <h5 className="fw-bold">Cálculo de Factor de Potencia</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="small fw-bold text-gold">
                  Potencia Real (P)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={pfValues.realPower}
                  onChange={(e) =>
                    setPfValues({ ...pfValues, realPower: e.target.value })
                  }
                  placeholder="W"
                />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-gold">
                  Potencia Aparente (S)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={pfValues.apparentPower}
                  onChange={(e) =>
                    setPfValues({ ...pfValues, apparentPower: e.target.value })
                  }
                  placeholder="VA"
                />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-gold">
                  Potencia Reactiva (Q)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={pfValues.reactivePower}
                  onChange={(e) =>
                    setPfValues({ ...pfValues, reactivePower: e.target.value })
                  }
                  placeholder="VAR"
                />
              </div>
            </div>
            <button
              className="btn btn-gold w-100 py-3 fw-bold"
              onClick={handleCalculatePF}
            >
              CALCULAR FACTOR DE POTENCIA
            </button>

            {pfResult && (
              <div className="mt-3 p-3 border-start border-4 border-success bg-light">
                <h5 className="fw-bold">Resultado:</h5>
                <h3>FP = {pfResult.powerFactor}</h3>
                <p className="mb-1">
                  Potencia Reactiva:{" "}
                  {pfResult.reactivePower || pfValues.reactivePower} VAR
                </p>
                <p className="mb-1">
                  Potencia Aparente:{" "}
                  {pfResult.apparentPower || pfValues.apparentPower} VA
                </p>
                <p className="mb-0">Ángulo: {pfResult.angle}°</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h5 className="fw-bold">Corrección de Factor de Potencia</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="small fw-bold text-gold">Potencia (W)</label>
                <input
                  type="number"
                  className="form-control"
                  value={correctionValues.power}
                  onChange={(e) =>
                    setCorrectionValues({
                      ...correctionValues,
                      power: e.target.value,
                    })
                  }
                  placeholder="Ej: 10000"
                />
              </div>
              <div className="col-md-6">
                <label className="small fw-bold text-gold">FP Actual</label>
                <input
                  type="number"
                  className="form-control"
                  value={correctionValues.currentPF}
                  onChange={(e) =>
                    setCorrectionValues({
                      ...correctionValues,
                      currentPF: e.target.value,
                    })
                  }
                  placeholder="Ej: 0.75"
                  step="0.01"
                  min="0"
                  max="1"
                />
              </div>
              <div className="col-md-6">
                <label className="small fw-bold text-gold">FP Deseado</label>
                <input
                  type="number"
                  className="form-control"
                  value={correctionValues.desiredPF}
                  onChange={(e) =>
                    setCorrectionValues({
                      ...correctionValues,
                      desiredPF: e.target.value,
                    })
                  }
                  placeholder="Ej: 0.95"
                  step="0.01"
                  min="0"
                  max="1"
                />
              </div>
              <div className="col-md-6">
                <label className="small fw-bold text-gold">Voltaje (V)</label>
                <input
                  type="number"
                  className="form-control"
                  value={correctionValues.voltage}
                  onChange={(e) =>
                    setCorrectionValues({
                      ...correctionValues,
                      voltage: e.target.value,
                    })
                  }
                  placeholder="Ej: 127"
                />
              </div>
              <div className="col-md-6">
                <label className="small fw-bold text-gold">
                  Frecuencia (Hz)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={correctionValues.frequency}
                  onChange={(e) =>
                    setCorrectionValues({
                      ...correctionValues,
                      frequency: e.target.value,
                    })
                  }
                  placeholder="Ej: 60"
                />
              </div>
            </div>
            <button
              className="btn btn-gold w-100 py-3 fw-bold"
              onClick={handleCalculateCorrection}
            >
              CALCULAR CORRECCIÓN
            </button>

            {correctionResult && (
              <div className="mt-3 p-3 border-start border-4 border-info bg-light">
                <h5 className="fw-bold">Resultado:</h5>
                <h3>
                  Capacitancia necesaria: {correctionResult.capacitance} µF
                </h3>
                <p className="mb-1">
                  Potencia reactiva: {correctionResult.reactivePowerNeeded} VAR
                </p>
                <p className="mb-1">
                  Banco de capacitores: {correctionResult.kVAR} kVAR
                </p>
                <p className="mb-0">Nota: Conectar en paralelo a la carga</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerFactorCalculator;
