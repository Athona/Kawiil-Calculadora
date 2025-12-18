import React, { useState, useEffect } from "react";
import { getHistory, clearHistory } from "../utils/historyService";
import Logo from "../components/Logo";

const HistoryPage = () => {
  const [list, setList] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [projectName, setProjectName] = useState(
    localStorage.getItem("kawiil_project") || "Proyecto_Kawiil"
  );
  const [responsable, setResponsable] = useState(
    localStorage.getItem("kawiil_responsable") || ""
  );
  const [extraData, setExtraData] = useState(
    localStorage.getItem("kawiil_extra") || ""
  );

  useEffect(() => {
    setList(getHistory());
    const handleUpdate = () => setList(getHistory());
    window.addEventListener("historyUpdated", handleUpdate);
    return () => window.removeEventListener("historyUpdated", handleUpdate);
  }, []);

  const deleteItem = (id) => {
    if (window.confirm("¿Eliminar esta operación?")) {
      const updatedList = list.filter((item) => item.id !== id);
      localStorage.setItem("kawiil_history", JSON.stringify(updatedList));
      setList(updatedList);
      window.dispatchEvent(new CustomEvent("historyUpdated"));
    }
  };

  const handleClearAll = () => {
    if (window.confirm("¿Borrar todo el historial?")) {
      clearHistory();
      setList([]);
    }
  };

  const filteredList = list.filter((item) => {
    if (!item.date) return false;
    const itemDateStr = item.date.split(",")[0].trim();
    const [day, month, year] = itemDateStr.split("/");
    const itemDateObj = new Date(year, month - 1, day);
    if (filterType === "single" && selectedDate) {
      const [sYear, sMonth, sDay] = selectedDate.split("-");
      return day === sDay && month === sMonth && year === sYear;
    }
    if (filterType === "range" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return itemDateObj >= start && itemDateObj <= end;
    }
    return true;
  });

  const groupedHistory = filteredList.reduce((groups, item) => {
    const dateKey = item.date.split(",")[0] || "Sin Fecha";
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(item);
    return groups;
  }, {});

  const updateMeta = (key, value, setter) => {
    setter(value);
    localStorage.setItem(key, value);
  };

  // ==================== FUNCIONES DE EXPORTACIÓN MEJORADAS ====================

  const exportJSON = () => {
    const data = {
      proyecto: projectName,
      responsable,
      datos: extraData,
      fecha_generacion: new Date().toLocaleString(),
      version_app: "K'AWIIL ELECT v2.0",
      desarrollador: "Dioscuro Studio",
      historial: filteredList.map((item) => ({
        id: item.id,
        fecha: item.date,
        calculadora: item.calculator,
        formula: item.formula || "N/A",
        entradas: item.inputs,
        resultado: item.result,
        pasos: item.steps || [],
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Reporte_${projectName}_${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
  };

  const exportTXT = () => {
    let txt = `╔═══════════════════════════════════════════════════════╗\n`;
    txt += `║              REPORTE TÉCNICO - K'AWIIL ELECT           ║\n`;
    txt += `╚═══════════════════════════════════════════════════════╝\n\n`;
    txt += `PROYECTO: ${projectName}\n`;
    txt += `RESPONSABLE: ${responsable}\n`;
    txt += `FECHA DE GENERACIÓN: ${new Date().toLocaleString()}\n`;
    txt += `NOTAS: ${extraData || "N/A"}\n`;
    txt += `DESARROLLADO POR: Dioscuro Studio\n`;
    txt += `=".repeat(60)\n\n`;

    Object.keys(groupedHistory).forEach((date) => {
      txt += `📅 FECHA: ${date}\n`;
      txt += `─`.repeat(40) + "\n";

      groupedHistory[date].forEach((item, idx) => {
        txt += `\n${idx + 1}. [${item.calculator}]\n`;
        txt += `   📊 Entradas: ${item.inputs}\n`;
        txt += `   ✅ Resultado: ${item.result}\n`;
        txt += `   📝 Procedimiento:\n`;
        item.steps?.forEach((step) => {
          txt += `      • ${step}\n`;
        });
      });
      txt += "\n";
    });

    txt += `\n════════════════════════════════════════════════════════\n`;
    txt += `Total de registros: ${filteredList.length}\n`;
    txt += `Fin del reporte - Dioscuro Studio ® ${new Date().getFullYear()}\n`;

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Reporte_${projectName}_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    link.click();
  };

  const exportCSV = () => {
    let csv = "\uFEFF"; // BOM para UTF-8
    csv += "REPORTE TÉCNICO - FORMATO CSV PROFESIONAL\n";
    csv += `Proyecto,${projectName}\n`;
    csv += `Responsable,${responsable}\n`;
    csv += `Notas,${extraData || "N/A"}\n`;
    csv += `Fecha de generación,${new Date().toLocaleString()}\n`;
    csv += `Desarrollador,Dioscuro Studio\n`;
    csv += `\n`; // Línea en blanco

    // Encabezados de datos
    csv +=
      "ID,Fecha,Hora,Calculadora,Fórmula,Entradas,Resultado,Pasos_Detallados\n";

    filteredList.forEach((item) => {
      const [date = "", time = ""] = item.date.split(", ");
      const steps = item.steps ? item.steps.join(" | ") : "";
      // Escapar comillas para CSV
      const escapedSteps = steps.replace(/"/g, '""');
      const escapedInputs = item.inputs.replace(/"/g, '""');

      csv += `"${item.id}","${date}","${time}","${item.calculator}","${
        item.formula || ""
      }","${escapedInputs}","${item.result}","${escapedSteps}"\n`;
    });

    // Resumen
    csv += `\nRESUMEN,,,Total Registros:,${filteredList.length},,,`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Excel_${projectName}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  const exportPDF = () => {
    // Guardar estados actuales antes de modificar
    const originalFilterType = filterType;
    const originalSelectedDate = selectedDate;
    const originalStartDate = startDate;
    const originalEndDate = endDate;

    // Configurar para mostrar todo en el PDF
    setFilterType("all");
    setSelectedDate("");
    setStartDate("");
    setEndDate("");

    // Esperar a que se actualice el estado y el DOM
    setTimeout(() => {
      const printContent = document.getElementById("print-area");
      if (!printContent) {
        console.error("No se encontró el área de impresión");
        restoreOriginalState(
          originalFilterType,
          originalSelectedDate,
          originalStartDate,
          originalEndDate
        );
        return;
      }

      const originalContent = document.body.innerHTML;

      // SVG del logo para el PDF
      const logoSVG = `
        <svg width="80" height="80" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="400" fill="#0a1929" rx="10"/>
          <g transform="translate(100, 80)">
            <rect x="40" y="160" width="120" height="12" fill="#FFFFFF" rx="2"/>
            <rect x="30" y="172" width="140" height="12" fill="#FFFFFF" rx="2"/>
            <rect x="50" y="100" width="15" height="60" fill="#FFFFFF" rx="2"/>
            <rect x="75" y="100" width="15" height="60" fill="#FFFFFF" rx="2"/>
            <rect x="100" y="100" width="15" height="60" fill="#FFFFFF" rx="2"/>
            <rect x="125" y="100" width="15" height="60" fill="#FFFFFF" rx="2"/>
            <polygon points="50,100 150,100 100,60" fill="#FFFFFF" stroke="#FFD700" stroke-width="2"/>
          </g>
          <text x="200" y="280" text-anchor="middle" fill="#FFFFFF" font-family="Arial" font-size="24" font-weight="bold">
            DIOSCUROS
          </text>
          <text x="200" y="310" text-anchor="middle" fill="#FFD700" font-family="Arial" font-size="14" font-weight="300">
            STUDIO
          </text>
        </svg>
      `;

      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reporte Técnico - ${projectName}</title>
          <meta charset="utf-8">
          <style>
            @media print {
              @page {
                size: A4 portrait;
                margin: 1.5cm;
              }
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                color: #000;
                line-height: 1.4;
              }
              .pdf-header {
                display: flex;
                align-items: center;
                border-bottom: 3px solid #000;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .logo-container {
                flex-shrink: 0;
                margin-right: 20px;
              }
              .header-info {
                flex-grow: 1;
              }
              .header-info h1 {
                color: #000;
                font-size: 28px;
                margin: 0 0 5px 0;
                font-weight: 900;
              }
              .header-info h5 {
                color: #666;
                font-size: 16px;
                margin: 0;
              }
              .header-meta {
                text-align: right;
                flex-shrink: 0;
                border-left: 2px solid #ddd;
                padding-left: 20px;
              }
              .pdf-item {
                border: 1px solid #ddd;
                margin-bottom: 20px;
                padding: 15px;
                page-break-inside: avoid;
                border-radius: 5px;
                background: #fff;
              }
              .date-group-header {
                background: #2c3e50;
                color: #fff;
                padding: 10px 15px;
                margin-bottom: 15px;
                border-radius: 5px;
                font-weight: bold;
              }
              .no-print {
                display: none !important;
              }
              .steps-container {
                background: #f8f9fa;
                padding: 12px;
                margin: 12px 0;
                border-left: 4px solid #d4af37;
                font-size: 12px;
              }
              .step-item {
                margin-bottom: 5px;
                padding-left: 5px;
              }
              .result-highlight {
                font-size: 20px;
                font-weight: bold;
                color: #2c3e50;
                text-align: right;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid #eee;
              }
              .footer {
                text-align: center;
                margin-top: 50px;
                font-size: 11px;
                color: #666;
                padding-top: 20px;
                border-top: 1px solid #ddd;
              }
              .watermark {
                position: fixed;
                bottom: 30px;
                right: 30px;
                opacity: 0.05;
                font-size: 100px;
                font-weight: bold;
                color: #000;
                transform: rotate(-30deg);
                pointer-events: none;
              }
              .company-logo {
                text-align: center;
                margin-bottom: 30px;
                font-size: 12px;
                color: #666;
              }
              .calculation-meta {
                background: #f0f0f0;
                padding: 8px;
                margin: 8px 0;
                border-radius: 4px;
                font-size: 12px;
              }
            }
          </style>
        </head>
        <body>
          <div class="watermark">DIOSCURO</div>
          <div class="company-logo">
            <strong>Dioscuro Studio</strong> | K'AWIIL ELECT Engineering Suite
          </div>

          <div class="pdf-header">
            <div class="logo-container">
              ${logoSVG}
            </div>
            <div class="header-info">
              <h1>REPORTE TÉCNICO PROFESIONAL</h1>
              <h5><i class="bi bi-gear"></i> ${projectName}</h5>
              <p><i class="bi bi-cpu"></i> Dioscuro Studio - K'AWIIL ELECT</p>
            </div>
            <div class="header-meta">
              <p><strong><i class="bi bi-person"></i> Ingeniero:</strong> ${
                responsable || "________________"
              }</p>
              <p><strong><i class="bi bi-chat-left-text"></i> Notas:</strong> ${
                extraData || "N/A"
              }</p>
              <p><strong><i class="bi bi-calendar"></i> Generado:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </div>

          ${printContent.innerHTML
            .replace(
              '<div class="pdf-header border-bottom border-4 border-warning pb-3 mb-4">',
              ""
            )
            .replace("</div>", "")}

          <div class="footer">
            <p><strong>© ${new Date().getFullYear()} Dioscuro Studio - K'AWIIL ELECT Engineering Suite</strong></p>
            <p>Total registros: ${
              filteredList.length
            } | Página generada automáticamente</p>
          </div>
        </body>
        </html>
      `;

      const printWindow = window.open("", "_blank", "width=800,height=600");
      printWindow.document.write(pdfContent);
      printWindow.document.close();

      printWindow.onload = function () {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = function () {
          printWindow.close();
          restoreOriginalState(
            originalFilterType,
            originalSelectedDate,
            originalStartDate,
            originalEndDate
          );
        };
      };
    }, 300);
  };

  const restoreOriginalState = (
    filterType,
    selectedDate,
    startDate,
    endDate
  ) => {
    setFilterType(filterType);
    setSelectedDate(selectedDate);
    setStartDate(startDate);
    setEndDate(endDate);
    setList(getHistory());
  };

  // ==================== JSX ACTUALIZADO ====================

  return (
    <div className="container animate__animated animate__fadeIn pb-5">
      <div className="premium-card p-4 mb-4 no-print shadow-sm border-warning bg-white">
        <h5 className="text-gold fw-bold mb-3 text-uppercase">
          ⚙️ Configuración y Exportación
        </h5>
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <label className="small fw-bold text-muted">PROYECTO</label>
            <input
              type="text"
              className="form-control"
              value={projectName}
              onChange={(e) =>
                updateMeta("kawiil_project", e.target.value, setProjectName)
              }
              placeholder="Nombre del proyecto"
            />
          </div>
          <div className="col-md-3">
            <label className="small fw-bold text-muted">RESPONSABLE</label>
            <input
              type="text"
              className="form-control"
              value={responsable}
              onChange={(e) =>
                updateMeta("kawiil_responsable", e.target.value, setResponsable)
              }
              placeholder="Nombre del ingeniero"
            />
          </div>
          <div className="col-md-3">
            <label className="small fw-bold text-muted">
              DATOS ADICIONALES
            </label>
            <input
              type="text"
              className="form-control"
              value={extraData}
              onChange={(e) =>
                updateMeta("kawiil_extra", e.target.value, setExtraData)
              }
              placeholder="Notas o referencias"
            />
          </div>
          <div className="col-md-3">
            <label className="small fw-bold text-muted">FILTRAR POR</label>
            <select
              className="form-select border-warning"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Todo el historial</option>
              <option value="single">Un día específico</option>
              <option value="range">Rango de fechas</option>
            </select>
          </div>
        </div>

        <div className="row g-3 align-items-end border-top pt-3">
          {filterType === "single" && (
            <div className="col-md-4">
              <label className="small fw-bold text-muted">
                SELECCIONAR DÍA
              </label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          )}
          {filterType === "range" && (
            <div className="col-md-8">
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="small fw-bold text-muted">DESDE</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="small fw-bold text-muted">HASTA</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          // En el JSX de HistoryPage, reemplaza la sección de botones de
          exportación:
          <div className="col text-end">
            <div className="btn-group me-2" role="group">
              <button
                className="btn btn-sm btn-export txt-export fw-bold"
                onClick={exportTXT}
                title="Exportar como texto plano"
              >
                <i className="bi bi-file-earmark-text me-1"></i> TXT
              </button>
              <button
                className="btn btn-sm btn-export json-export fw-bold"
                onClick={exportJSON}
                title="Exportar como JSON"
              >
                <i className="bi bi-code me-1"></i> JSON
              </button>
              <button
                className="btn btn-sm btn-export csv-export fw-bold"
                onClick={exportCSV}
                title="Exportar como Excel (CSV)"
              >
                <i className="bi bi-file-earmark-excel me-1"></i> EXCEL
              </button>
            </div>
            <button
              className="btn btn-pdf-export px-4 fw-bold mx-2"
              onClick={exportPDF}
              title="Generar PDF profesional"
            >
              <i className="bi bi-file-earmark-pdf me-1"></i> PDF
            </button>
            <button
              className="btn btn-sm btn-outline-danger no-print fw-bold"
              onClick={handleClearAll}
              title="Eliminar todo el historial"
            >
              <i className="bi bi-trash me-1"></i> Borrar Historial
            </button>
          </div>
        </div>
      </div>

      <div id="print-area">
        <div className="pdf-header border-bottom border-4 border-warning pb-3 mb-4">
          <div className="row align-items-center">
            <div className="col-2">
              <Logo
                variant="light"
                width={100}
                height={100}
                className="logo-glow"
              />
            </div>
            <div className="col-6">
              <h1 className="fw-black text-dark mb-0">
                REPORTE TÉCNICO PROFESIONAL
              </h1>
              <h5 className="text-muted mb-0">
                <i className="bi bi-gear me-1"></i> {projectName}
              </h5>
              <p className="mb-0 small text-muted">
                <i className="bi bi-cpu me-1"></i> Dioscuro Studio - K'AWIIL
                ELECT
              </p>
            </div>
            <div className="col-4 text-end border-start ps-4">
              <p className="mb-1">
                <strong>
                  <i className="bi bi-person me-1"></i> Ingeniero:
                </strong>{" "}
                {responsable || "________________"}
              </p>
              <p className="mb-1 small text-success">
                <strong>
                  <i className="bi bi-chat-left-text me-1"></i> Notas:
                </strong>{" "}
                {extraData || "N/A"}
              </p>
              <p className="mb-0 small text-uppercase fw-bold text-warning">
                <i className="bi bi-filter me-1"></i>
                {filterType === "all"
                  ? "Historial Completo"
                  : filterType === "single"
                  ? `Día: ${selectedDate}`
                  : `Rango: ${startDate} al ${endDate}`}
              </p>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <small className="text-muted">
                <i className="bi bi-calendar me-1"></i> Generado:{" "}
                {new Date().toLocaleString()} |
                <i className="bi bi-hash ms-2 me-1"></i> Registros:{" "}
                {filteredList.length} |<i className="bi bi-award ms-2 me-1"></i>{" "}
                Dioscuro Studio
              </small>
            </div>
          </div>
        </div>

        {Object.keys(groupedHistory).length > 0 ? (
          Object.keys(groupedHistory).map((date) => (
            <div key={date} className="mb-5">
              <div className="date-group-header bg-dark text-warning p-3 mb-3 rounded d-flex justify-content-between align-items-center">
                <span className="fw-bold ps-2 text-uppercase">
                  <i className="bi bi-calendar-date me-2"></i> REGISTROS: {date}
                </span>
                <span className="small opacity-75 pe-2">
                  <i className="bi bi-lightning me-1"></i> K'AWIIL ELECT
                </span>
              </div>

              {groupedHistory[date].map((item) => (
                <div
                  key={item.id}
                  className="pdf-item p-4 mb-3 border rounded bg-white position-relative shadow-sm"
                >
                  <button
                    className="btn btn-sm btn-light text-danger position-absolute top-0 end-0 m-2 no-print border-0 rounded-circle"
                    onClick={() => deleteItem(item.id)}
                    title="Eliminar este registro"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>

                  <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                    <h5 className="fw-bold text-dark mb-0">
                      <i className="bi bi-calculator me-2"></i>
                      {item.calculator}
                      {item.formula && (
                        <small className="text-muted ms-2">
                          ({item.formula})
                        </small>
                      )}
                    </h5>
                    <span className="text-success fw-bold">
                      <i className="bi bi-clock me-1"></i>
                      {item.date.split(",")[1]}
                    </span>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <div className="calculation-meta">
                        <strong>
                          <i className="bi bi-input-cursor me-1"></i> Entradas:
                        </strong>
                        <span className="text-success fw-bold ms-2">
                          {item.inputs}
                        </span>
                      </div>

                      <div className="steps-container">
                        <strong>
                          <i className="bi bi-list-ol me-1"></i> Procedimiento
                          detallado:
                        </strong>
                        {item.steps?.map((s, i) => (
                          <div key={i} className="step-item text-dark">
                            <span className="fw-bold text-gold me-2">
                              {i + 1}.
                            </span>
                            {s.replace(/^\d+[\.\s\-]+/, "")}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="result-highlight">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Resultado: <span className="text-dark">{item.result}</span>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-inbox display-1 text-muted"></i>
            <h4 className="text-muted mt-3">No hay registros para mostrar</h4>
            <p className="text-muted">
              Realiza algunos cálculos para ver tu historial aquí
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
