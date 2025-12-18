import React, { useState } from "react";
import { saveToHistory } from "../utils/historyService";
import { calculateWireSize, awgToMM } from "../logic/wireSize";
import { validateNumber } from "../utils/validation";

const WireSizeCalculator = () => {
  const [values, setValues] = useState({
    current: "",
    material: "copper",
    insulation: "PVC",
    installation: "conduit",
    length: "10",
    voltage: "127",
  });

  const [result, setResult] = useState(null);
  const [conversion, setConversion] = useState({ awg: "", mm: "" });

  const handleCalculate = () => {
    if (!values.current) {
      alert("Ingresa la corriente");
      return;
    }

    const result = calculateWireSize(
      values.current,
      values.material,
      values.insulation,
      values.installation,
      parseFloat(values.length)
    );

    setResult(result);

    saveToHistory({
      calculator: "Calibre de Cable",
      inputs: `I=${values.current}A, Material=${values.material}, Aislamiento=${values.insulation}, Instalación=${values.installation}, L=${values.length}m, V=${values.voltage}V`,
      result: `Calibre: ${result.awg} AWG, Diámetro: ${result.diameter}mm, Área: ${result.area}mm²`,
      steps: [
        `Corriente: ${values.current} A`,
        `Material: ${values.material === "copper" ? "Cobre" : "Aluminio"}`,
        `Calibre seleccionado: ${result.awg} AWG`,
        `Área transversal: ${result.area} mm²`,
        `Diámetro: ${result.diameter} mm`,
        `Ampacidad: ${result.ampacity.toFixed(1)} A`,
        `Caída de voltaje estimada: ${result.voltageDrop} V`,
      ],
    });
  };

  const handleConversion = () => {
    if (!conversion.awg && !conversion.mm) {
      alert("Ingresa un valor para convertir");
      return;
    }

    if (conversion.awg) {
      const mm = awgToMM(conversion.awg);
      setConversion({
        ...conversion,
        mm: mm ? mm.toString() : "No encontrado",
      });
    } else if (conversion.mm) {
      // Conversión inversa aproximada
      const awgTable = [
        { awg: "18", area: 0.823 },
        { awg: "16", area: 1.31 },
        { awg: "14", area: 2.08 },
        { awg: "12", area: 3.31 },
        { awg: "10", area: 5.26 },
        { awg: "8", area: 8.37 },
        { awg: "6", area: 13.3 },
        { awg: "4", area: 21.2 },
        { awg: "2", area: 33.6 },
        { awg: "1/0", area: 53.5 },
      ];

      const mm = parseFloat(conversion.mm);
      const closest = awgTable.reduce((prev, curr) =>
        Math.abs(curr.area - mm) < Math.abs(prev.area - mm) ? curr : prev
      );
      setConversion({ ...conversion, awg: closest.awg });
    }
  };

  return (
    <div className="card premium-card animate__animated animate__fadeIn">
      <div className="card-body p-4">
        <h4 className="fw-bolder text-gold mb-4">
          🔌 Calculadora de Calibre de Cable
        </h4>

        {/* Diagrama SVG */}
        <div className="text-center mb-4">
          <svg width="250" height="100" viewBox="0 0 250 100">
            <path
              d="M20 50 H230"
              stroke="#666"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="15"
              fill="#fff"
              stroke="#FF9800"
              strokeWidth="2"
            />
            <text
              x="50"
              y="55"
              textAnchor="middle"
              fill="#FF9800"
              fontSize="12"
            >
              AWG
            </text>
            <text
              x="125"
              y="30"
              textAnchor="middle"
              fill="#000"
              fontSize="10"
              fontWeight="bold"
            >
              Diámetro: {result ? `${result.diameter}mm` : "?"}
            </text>
            <text
              x="125"
              y="70"
              textAnchor="middle"
              fill="#000"
              fontSize="10"
              fontWeight="bold"
            >
              Área: {result ? `${result.area}mm²` : "?"}
            </text>
          </svg>
        </div>

        <div className="row">
          <div className="col-md-6">
            <h5 className="fw-bold">Selección de Calibre</h5>

            <div className="mb-3">
              <label className="small fw-bold text-gold">Corriente (A)</label>
              <input
                type="number"
                className="form-control"
                value={values.current}
                onChange={(e) =>
                  setValues({ ...values, current: e.target.value })
                }
                placeholder="Ej: 20"
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="small fw-bold text-gold">Material</label>
                <select
                  className="form-select"
                  value={values.material}
                  onChange={(e) =>
                    setValues({ ...values, material: e.target.value })
                  }
                >
                  <option value="copper">Cobre</option>
                  <option value="aluminum">Aluminio</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="small fw-bold text-gold">Aislamiento</label>
                <select
                  className="form-select"
                  value={values.insulation}
                  onChange={(e) =>
                    setValues({ ...values, insulation: e.target.value })
                  }
                >
                  <option value="PVC">PVC</option>
                  <option value="XLPE">XLPE</option>
                  <option value="EPR">EPR</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="small fw-bold text-gold">Instalación</label>
                <select
                  className="form-select"
                  value={values.installation}
                  onChange={(e) =>
                    setValues({ ...values, installation: e.target.value })
                  }
                >
                  <option value="conduit">Conduit</option>
                  <option value="freeAir">Aire libre</option>
                  <option value="tray">Bandeja</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="small fw-bold text-gold">Longitud (m)</label>
                <input
                  type="number"
                  className="form-control"
                  value={values.length}
                  onChange={(e) =>
                    setValues({ ...values, length: e.target.value })
                  }
                  placeholder="10"
                />
              </div>

              <div className="col-md-12">
                <label className="small fw-bold text-gold">Voltaje (V)</label>
                <input
                  type="number"
                  className="form-control"
                  value={values.voltage}
                  onChange={(e) =>
                    setValues({ ...values, voltage: e.target.value })
                  }
                  placeholder="127"
                />
              </div>
            </div>

            <button
              className="btn btn-gold w-100 py-3 fw-bold"
              onClick={handleCalculate}
            >
              CALCULAR CALIBRE
            </button>

            {result && (
              <div className="mt-3 p-3 border-start border-4 border-success bg-light">
                <h5 className="fw-bold">Recomendación:</h5>
                <h3 className="text-success">{result.recommendation}</h3>
                <p className="mb-1">
                  <strong>Calibre:</strong> {result.awg} AWG
                </p>
                <p className="mb-1">
                  <strong>Diámetro:</strong> {result.diameter} mm
                </p>
                <p className="mb-1">
                  <strong>Área:</strong> {result.area} mm²
                </p>
                <p className="mb-1">
                  <strong>Ampacidad:</strong> {result.ampacity.toFixed(1)} A
                </p>
                <p className="mb-0">
                  <strong>Caída de voltaje:</strong> {result.voltageDrop} V
                </p>
              </div>
            )}
          </div>

          <div className="col-md-6">
            <h5 className="fw-bold">Conversión AWG ↔ mm²</h5>

            <div className="mb-3">
              <label className="small fw-bold text-gold">Calibre AWG</label>
              <input
                type="text"
                className="form-control"
                value={conversion.awg}
                onChange={(e) =>
                  setConversion({ ...conversion, awg: e.target.value, mm: "" })
                }
                placeholder="Ej: 12"
              />
            </div>

            <div className="text-center my-2">
              <span className="h4">↕</span>
            </div>

            <div className="mb-3">
              <label className="small fw-bold text-gold">Sección (mm²)</label>
              <input
                type="number"
                className="form-control"
                value={conversion.mm}
                onChange={(e) =>
                  setConversion({ ...conversion, mm: e.target.value, awg: "" })
                }
                placeholder="Ej: 3.31"
                step="0.01"
              />
            </div>

            <button
              className="btn btn-outline-gold w-100 py-3 fw-bold"
              onClick={handleConversion}
            >
              CONVERTIR
            </button>

            {(conversion.awg || conversion.mm) && (
              <div className="mt-3 p-3 border border-warning bg-light">
                <h5 className="fw-bold">Resultado:</h5>
                <p className="mb-1">
                  {conversion.awg && (
                    <span>
                      <strong>{conversion.awg} AWG</strong> = {conversion.mm}{" "}
                      mm²
                    </span>
                  )}
                  {conversion.mm && !conversion.awg && (
                    <span>
                      <strong>{conversion.mm} mm²</strong> ≈ {conversion.awg}{" "}
                      AWG
                    </span>
                  )}
                </p>
                <small className="text-muted">
                  * Conversión aproximada basada en tablas estándar
                </small>
              </div>
            )}

            <div className="mt-4">
              <h6 className="fw-bold">Tabla de referencia rápida:</h6>
              <div className="table-responsive">
                <table className="table table-sm table-bordered">
                  <thead>
                    <tr>
                      <th>AWG</th>
                      <th>mm²</th>
                      <th>Ampacidad (Cobre)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>14</td>
                      <td>2.08</td>
                      <td>15A</td>
                    </tr>
                    <tr>
                      <td>12</td>
                      <td>3.31</td>
                      <td>20A</td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>5.26</td>
                      <td>30A</td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td>8.37</td>
                      <td>40A</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>13.3</td>
                      <td>55A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WireSizeCalculator;
