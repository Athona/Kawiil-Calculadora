import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import OhmCalculator from "./calculators/OhmCalculator";
import PowerCalculator from "./calculators/PowerCalculator";
import ResistanceCalculator from "./calculators/ResistanceCalculator";
import VoltageDividerCalculator from "./calculators/VoltageDividerCalculator";
import LedResistorCalculator from "./calculators/LedResistorCalculator";
import HistoryPage from "./pages/HistoryPage";
import VoltageDropCalculator from "./calculators/VoltageDropCalculator";
import TransformerCalculator from "./calculators/TransformerCalculator";
import CapacitorCalculator from "./calculators/CapacitorCalculator";
import PowerFactorCalculator from "./calculators/PowerFactorCalculator";
import WireSizeCalculator from "./calculators/WireSizeCalculator";
import ConfigPage from "./pages/ConfigPage";
import { initTheme } from "./utils/themeService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    initTheme();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home onStart={setActiveTab} />;
      case "ohm":
        return <OhmCalculator />;
      case "power":
        return <PowerCalculator />;
      case "resistor":
        return <ResistanceCalculator />;
      case "voltageDivider":
        return <VoltageDividerCalculator />;
      case "ledResistor":
        return <LedResistorCalculator />;
      case "voltageDrop":
        return <VoltageDropCalculator />;
      case "transformer":
        return <TransformerCalculator />;
      case "capacitor":
        return <CapacitorCalculator />;
      case "powerFactor":
        return <PowerFactorCalculator />;
      case "wireSize":
        return <WireSizeCalculator />;
      case "config":
        return <ConfigPage />;
      case "history":
        return <HistoryPage />;
      default:
        return <Home onStart={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 mt-4">{renderContent()}</div>
      </div>
    </Layout>
  );
}

export default App;
