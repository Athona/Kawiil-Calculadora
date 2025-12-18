import React from "react";

const Logo = ({
  variant = "dark", // "dark" | "light" | "color"
  width = 200,
  height = 200,
  className = "",
}) => {
  const colors = {
    dark: {
      background: "#0a1929",
      elements: "#FFFFFF",
      text: "#FFFFFF",
    },
    light: {
      background: "#FFFFFF",
      elements: "#0a1929",
      text: "#0a1929",
    },
    color: {
      background: "#0a1929",
      elements: "#D4AF37", // Oro K'AWIIL
      text: "#D4AF37",
    },
  };

  const current = colors[variant] || colors.dark;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 400"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: "block",
        margin: "0 auto",
      }}
    >
      {/* Fondo con gradiente radial sutil */}
      <defs>
        <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0a1929" />
          <stop offset="100%" stopColor="#1a365d" />
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3" />
        </filter>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>

      {/* Fondo - solo para variante dark */}
      {variant === "dark" && (
        <rect width="400" height="400" fill="url(#bgGradient)" rx="20" />
      )}

      {/* Templo Griego Minimalista */}
      <g filter="url(#shadow)" transform="translate(100, 80)">
        {/* Base escalonada */}
        <rect
          x="40"
          y="160"
          width="120"
          height="12"
          fill={current.elements}
          rx="2"
        />
        <rect
          x="30"
          y="172"
          width="140"
          height="12"
          fill={current.elements}
          rx="2"
        />

        {/* Columnas (4 rectángulos verticales) */}
        <rect
          x="50"
          y="100"
          width="15"
          height="60"
          fill={current.elements}
          rx="2"
        />
        <rect
          x="75"
          y="100"
          width="15"
          height="60"
          fill={current.elements}
          rx="2"
        />
        <rect
          x="100"
          y="100"
          width="15"
          height="60"
          fill={current.elements}
          rx="2"
        />
        <rect
          x="125"
          y="100"
          width="15"
          height="60"
          fill={current.elements}
          rx="2"
        />

        {/* Frontón triangular (pedimento) */}
        <polygon
          points="50,100 150,100 100,60"
          fill={current.elements}
          stroke={variant === "color" ? "#FFD700" : current.elements}
          strokeWidth="2"
        />

        {/* Detalle del frontón */}
        <line
          x1="70"
          y1="80"
          x2="130"
          y2="80"
          stroke={current.elements}
          strokeWidth="1"
        />
        <line
          x1="80"
          y1="85"
          x2="120"
          y2="85"
          stroke={current.elements}
          strokeWidth="1"
        />
      </g>

      {/* Texto DIOSCUROS - Tipografía geométrica moderna */}
      <text
        x="200"
        y="280"
        textAnchor="middle"
        fill={current.text}
        style={{
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          fontSize: "28px",
          fontWeight: "800",
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        DIOSCUROS
      </text>

      {/* Subtítulo STUDIO */}
      <text
        x="200"
        y="310"
        textAnchor="middle"
        fill={variant === "color" ? "#FFD700" : current.text}
        style={{
          fontFamily: "'Segoe UI', 'Arial', sans-serif",
          fontSize: "16px",
          fontWeight: "300",
          letterSpacing: "3px",
          opacity: "0.8",
        }}
      >
        STUDIO
      </text>

      {/* Línea decorativa */}
      <line
        x1="120"
        y1="260"
        x2="280"
        y2="260"
        stroke={current.text}
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
};

// Versión simplificada para navbar/botones
export const LogoIcon = ({ size = 40, color = "#D4AF37" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Icono simplificado: templo griego */}
    <rect x="8" y="20" width="24" height="4" fill={color} rx="1" />
    <rect x="5" y="24" width="30" height="4" fill={color} rx="1" />

    {/* Columnas */}
    <rect x="10" y="10" width="4" height="10" fill={color} rx="1" />
    <rect x="18" y="10" width="4" height="10" fill={color} rx="1" />
    <rect x="26" y="10" width="4" height="10" fill={color} rx="1" />

    {/* Frontón */}
    <polygon points="10,10 30,10 20,5" fill={color} />

    {/* Estrella/logo pequeño */}
    <circle cx="20" cy="33" r="2" fill={color} />
  </svg>
);

export default Logo;
