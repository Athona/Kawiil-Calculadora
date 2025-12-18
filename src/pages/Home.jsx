import React from "react";
import Logo from "../components/Logo";

const Home = ({ onStart }) => {
  const currentYear = new Date().getFullYear();

  const menuItems = [
    {
      id: "ohm",
      title: "LEY DE OHM",
      desc: "Voltaje, Corriente y Resistencia",
      icon: "⚡",
    },
    {
      id: "power",
      title: "CALCULADORA DE POTENCIA",
      desc: "Ley de Watt y eficiencia",
      icon: "🔋",
    },
    {
      id: "resistor",
      title: "RESISTENCIAS",
      desc: "Código de colores, Serie y Paralelo",
      icon: "🎨",
    },
    {
      id: "voltageDivider",
      title: "DIVISOR DE VOLTAJE",
      desc: "Cálculo de Vout y atenuación",
      icon: "🔌",
    },
    {
      id: "ledResistor",
      title: "RESISTENCIA PARA LED",
      desc: "Cálculo de limitadora por color",
      icon: "🎨",
    },
    // Nuevas calculadoras
    {
      id: "voltageDrop",
      title: "CAÍDA DE VOLTAJE",
      desc: "Cálculo en conductores y cables",
      icon: "📉",
    },
    {
      id: "transformer",
      title: "TRANSFORMADORES",
      desc: "Relación de vueltas y potencia",
      icon: "🔁",
    },
    {
      id: "capacitor",
      title: "CAPACITORES",
      desc: "Serie, paralelo y reactancia",
      icon: "🔋",
    },
    {
      id: "powerFactor",
      title: "FACTOR DE POTENCIA",
      desc: "Corrección y banco de capacitores",
      icon: "📊",
    },
    {
      id: "wireSize",
      title: "SECCIÓN DE CABLE",
      desc: "AWG, mm² y capacidad de corriente",
      icon: "🔌",
    },
    {
      id: "history",
      title: "REPORTE TÉCNICO",
      desc: "Historial y exportación profesional",
      icon: "📜",
    },
  ];

  return (
    <div className="text-center animate__animated animate__fadeIn px-2">
      {/* HEADER ADAPTABLE */}
      <div className="py-5">
        <div className="d-flex justify-content-center align-items-center mb-3">
          <Logo variant="color" width={80} height={80} />
        </div>
        <h1
          className="display-4 fw-bolder mb-0"
          style={{
            letterSpacing: "4px",
            color: "var(--kawiil-text)",
            textShadow: "0 0 15px rgba(40, 167, 69, 0.2)",
          }}
        >
          K'AWIIL
        </h1>
        <p
          className="text-uppercase tracking-widest small fw-bold mt-1"
          style={{ color: "var(--kawiil-gold)", opacity: 0.9 }}
        >
          Precision Engineering Tools
        </p>
        <div
          className="mx-auto my-3"
          style={{
            height: "4px",
            width: "60px",
            backgroundColor: "var(--kawiil-gold)",
            boxShadow: "0 0 10px var(--kawiil-gold)",
            borderRadius: "2px",
          }}
        ></div>
      </div>

      {/* GRID DE CALCULADORAS */}
      <div className="row g-3 px-2">
        {menuItems.map((item) => (
          <div key={item.id} className="col-12 col-md-6 col-lg-4">
            <button
              onClick={() => onStart(item.id)}
              className="btn w-100 p-4 text-start shadow-sm position-relative overflow-hidden"
              style={{
                backgroundColor: "var(--kawiil-card)",
                border: "1px solid rgba(128,128,128,0.1)",
                borderTop: "4px solid var(--kawiil-gold)",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ zIndex: 2 }}>
                <h6
                  className="fw-bold mb-1"
                  style={{ color: "var(--kawiil-gold)", letterSpacing: "1px" }}
                >
                  {item.title}
                </h6>
                <p
                  className="small mb-0 opacity-75"
                  style={{ fontSize: "0.75rem", color: "var(--kawiil-text)" }}
                >
                  {item.desc}
                </p>
              </div>
              <span
                className="h3 mb-0 opacity-25"
                style={{ color: "var(--kawiil-text)" }}
              >
                {item.icon}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* FOOTER ACTUALIZADO */}
      <div className="mt-5 pb-5">
        <p
          className="small mb-1 opacity-50 text-uppercase tracking-widest"
          style={{ color: "var(--kawiil-text)", fontSize: "0.7rem" }}
        >
          Desarrollado por <strong>Dioscuro Studio</strong>
        </p>
        <p
          className="small opacity-25"
          style={{ color: "var(--kawiil-text)", fontSize: "0.6rem" }}
        >
          © {currentYear} K'AWIIL ELECT • ENGINEERING SUITE
        </p>
      </div>

      <style jsx>{`
        button:hover {
          background-color: var(--kawiil-bg) !important;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default Home;
