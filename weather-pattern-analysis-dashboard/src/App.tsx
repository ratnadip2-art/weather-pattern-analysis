/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  CloudRain,
  Thermometer,
  Wind,
  Gauge,
  FileText,
  Compass,
  HelpCircle,
  Send,
  RefreshCw,
  Sliders,
  Database,
  Upload,
  Info,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Globe,
  ChevronRight,
  BookOpen,
  ArrowDownCircle,
  Wand2
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import Markdown from "react-markdown";
import { CITY_PROFILES, calculateClimateIndicators } from "./data/cityData";
import { WeatherDataPoint, CityProfile } from "./types";

export default function App() {
  // Navigation & Active States
  const [selectedProfileId, setSelectedProfileId] = useState<string>("reykjavik");
  const [activeProfile, setActiveProfile] = useState<CityProfile>(() => {
    return CITY_PROFILES.find(p => p.id === "reykjavik") || CITY_PROFILES[0];
  });

  // Current Working Dataset (allows modifications, simulation, and custom imports)
  const [currentDataset, setCurrentDataset] = useState<WeatherDataPoint[]>([]);

  // Simulation Sliders (Offsets/Multipliers applied to active profile)
  const [tempOffset, setTempOffset] = useState<number>(0); // in degrees C (e.g. simulation of global warming)
  const [precipMultiplier, setPrecipMultiplier] = useState<number>(1); // 0.5x to 2x (e.g. monsoon intensifies)
  const [pressureOffset, setPressureOffset] = useState<number>(0); // in hPa (e.g. pressure system trends)

  // CSV Importer State
  const [csvInput, setCsvInput] = useState<string>("");
  const [csvError, setCsvError] = useState<string | null>(null);
  const [showImporter, setShowImporter] = useState<boolean>(false);

  // AI Assistant States
  const [aiReport, setAiReport] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiLogMessages, setAiLogMessages] = useState<string[]>([]);
  const [chatQuery, setChatQuery] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "climatologist"; text: string }>>([]);

  // Load and apply city simulation values
  useEffect(() => {
    const original = CITY_PROFILES.find(p => p.id === selectedProfileId);
    if (original) {
      setActiveProfile(original);
      setCurrentDataset(JSON.parse(JSON.stringify(original.dataset)));
      // Reset simulator offsets on city shift
      setTempOffset(0);
      setPrecipMultiplier(1);
      setPressureOffset(0);
      // Clear AI reports specific to previous city
      setAiReport("");
      setChatHistory([]);
    }
  }, [selectedProfileId]);

  // Apply real-time simulation modifiers to dataset on slide/input
  const simulatedDataset = useMemo(() => {
    return currentDataset.map(pt => {
      const simulatedPt = { ...pt };
      simulatedPt.avgTemp = parseFloat((pt.avgTemp + tempOffset).toFixed(1));
      simulatedPt.maxTemp = parseFloat((pt.maxTemp + tempOffset).toFixed(1));
      simulatedPt.minTemp = parseFloat((pt.minTemp + tempOffset).toFixed(1));
      simulatedPt.precipitation = Math.max(0, Math.round(pt.precipitation * precipMultiplier));
      simulatedPt.pressure = Math.round(pt.pressure + pressureOffset);
      return simulatedPt;
    });
  }, [currentDataset, tempOffset, precipMultiplier, pressureOffset]);

  // Intermediate Climatological Mathematical indicators
  const indicators = useMemo(() => {
    return calculateClimateIndicators(simulatedDataset);
  }, [simulatedDataset]);

  // Quick preset simulation triggers
  const triggerClimateScenario = (type: "warming" | "la-nina" | "cyclone-surge" | "reset") => {
    if (type === "warming") {
      setTempOffset(2.4);
      setPrecipMultiplier(1.15);
      setPressureOffset(-3);
    } else if (type === "la-nina") {
      setTempOffset(-1.2);
      setPrecipMultiplier(1.45);
      setPressureOffset(2);
    } else if (type === "cyclone-surge") {
      setTempOffset(0.8);
      setPrecipMultiplier(1.8);
      setPressureOffset(-12);
    } else {
      setTempOffset(0);
      setPrecipMultiplier(1);
      setPressureOffset(0);
    }
  };

  // Parsing pasted custom CSV datasets
  const handleCsvImport = (e: React.FormEvent) => {
    e.preventDefault();
    setCsvError(null);
    try {
      if (!csvInput.trim()) {
        throw new Error("CSV input is empty. Please paste some rows.");
      }

      const rows = csvInput.trim().split("\n");
      if (rows.length < 2) {
        throw new Error("Invalid format. Copy at least a header row and one data row.");
      }

      // Parse headers
      const headers = rows[0].split(",").map(h => h.trim().toLowerCase());
      const requiredHeaders = ["period", "avgtemp", "maxtemp", "mintemp", "precipitation", "pressure", "windspeed"];
      const missing = requiredHeaders.filter(req => !headers.includes(req));

      if (missing.length > 0) {
        throw new Error(`Missing required CSV columns: ${missing.join(", ")}`);
      }

      const parsedPoints: WeatherDataPoint[] = [];

      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(",").map(col => col.trim());
        if (cols.length < headers.length) continue; // skip broken lines

        const periodVal = cols[headers.indexOf("period")];
        const avgTemp = parseFloat(cols[headers.indexOf("avgtemp")]);
        const maxTemp = parseFloat(cols[headers.indexOf("maxtemp")]);
        const minTemp = parseFloat(cols[headers.indexOf("mintemp")]);
        const precip = parseFloat(cols[headers.indexOf("precipitation")]);
        const press = parseFloat(cols[headers.indexOf("pressure")]);
        const wind = parseFloat(cols[headers.indexOf("windspeed")]);

        if (
          isNaN(avgTemp) || isNaN(maxTemp) || isNaN(minTemp) ||
          isNaN(precip) || isNaN(press) || isNaN(wind)
        ) {
          throw new Error(`Data syntax error on row ${i + 1}. Ensure all meteorological values are positive numbers.`);
        }

        parsedPoints.push({
          period: periodVal || `P${i}`,
          monthName: `Period ${periodVal}`,
          avgTemp,
          maxTemp,
          minTemp,
          precipitation: precip,
          humidity: 75, // fallback default
          pressure: press,
          windSpeed: wind,
          windDirection: "W" // fallback default
        });
      }

      if (parsedPoints.length === 0) {
        throw new Error("Could not parse any records successfully.");
      }

      // Setup a custom profile state
      const customProfile: CityProfile = {
        id: "custom",
        name: "Custom Dataset Station",
        country: "Imported Workspace",
        climateType: "User-Defined Tabular Data",
        elevation: "N/A",
        latitude: "Unknown",
        longitude: "Unknown",
        description: "Manually registered climate sequence initialized through custom comma-separated telemetry rows.",
        defaultTimeframe: `${parsedPoints.length}-Period Frame`,
        dataset: parsedPoints
      };

      // Set state to Custom
      setActiveProfile(customProfile);
      setCurrentDataset(parsedPoints);
      setSelectedProfileId("custom");
      setTempOffset(0);
      setPrecipMultiplier(1);
      setPressureOffset(0);
      setShowImporter(false);
      setCsvInput("");
    } catch (err: any) {
      setCsvError(err.message || "An unexpected error occurred during CSV ingestion.");
    }
  };

  // Multi-step animated logging simulator for scientific depth
  const pushScientificLogs = async () => {
    const logs = [
      "Gathering physical indices from active sensor matrix...",
      "Interpolating regional temperature anomalies and thermal inertia...",
      "Analyzing barometric system gradient (dp/dx) & wind advection response...",
      "Mapping hydrological saturation indices & precipitation peaks...",
      "Transmitting refined climate schema vectors to Gemini AI...",
      "Synthesizing Climatologist Climate Assessment Report..."
    ];
    setAiLogMessages([]);
    for (let i = 0; i < logs.length; i++) {
      setAiLogMessages(prev => [...prev, logs[i]]);
      await new Promise(resolve => setTimeout(resolve, 350));
    }
  };

  // Request comprehensive report from AI
  const handleTriggerAiReport = async () => {
    setIsAiLoading(true);
    setAiReport("");
    await pushScientificLogs();

    try {
      const response = await fetch("/api/analyze-weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: simulatedDataset,
          city: activeProfile.name,
          timeframe: activeProfile.defaultTimeframe
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Server responded with an error.");
      }
      setAiReport(result.text);
    } catch (err: any) {
      setAiReport(`### ⚠️ Meteorological Assessment Error\n\nFailed to initiate AI climate model: **${err.message}**\n\nPlease check your workspace credentials (is matching \`GEMINI_API_KEY\` stored inside the secrets container?) and ensure the Express server is up and listening.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Submit conversational query
  const handleSendChatQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim() || isAiLoading) return;

    const userMessage = chatQuery.trim();
    setChatQuery("");
    setChatHistory(prev => [...prev, { role: "user", text: userMessage }]);
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/analyze-weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: simulatedDataset,
          city: activeProfile.name,
          timeframe: activeProfile.defaultTimeframe,
          query: userMessage
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Server query execution failed.");
      }

      setChatHistory(prev => [...prev, { role: "climatologist", text: result.text }]);
    } catch (err: any) {
      setChatHistory(prev => [
        ...prev,
        { role: "climatologist", text: `⛔ **Error executing climate query:** ${err.message}` }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Direct cell editing in the meteorology table
  const handleUpdateCell = (index: number, key: keyof WeatherDataPoint, val: string | number) => {
    const updated = [...currentDataset];
    let numVal = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(numVal)) return;

    updated[index] = {
      ...updated[index],
      [key]: numVal
    };
    setCurrentDataset(updated);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-900">
      
      {/* Upper Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-teal-500 to-blue-600 p-2.5 rounded-lg shadow-lg shadow-teal-500/10">
            <Globe className="h-6 w-6 text-slate-950 animate-pulse" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-teal-400 font-mono font-semibold">Intermediate Met-Research Studio</span>
            <h1 className="text-xl font-bold font-sans tracking-tight flex items-center gap-2">
              Weather Pattern Analysis Console
            </h1>
          </div>
        </div>

        {/* Desktop City Switcher */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-805">
          {CITY_PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setSelectedProfileId(profile.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                selectedProfileId === profile.id
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
            >
              {profile.name}
            </button>
          ))}
          <button
            onClick={() => setShowImporter(!showImporter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
              selectedProfileId === "custom" || showImporter
                ? "bg-purple-600 text-purple-100"
                : "text-purple-400 hover:text-purple-100 hover:bg-purple-950/45"
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            Importer
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Left Column: Metrics & Simulator & Edit Table (7 Cols) */}
        <div className="xl:col-span-8 flex flex-col gap-6">

          {/* CSV Custom Importer Drawer (Conditional) */}
          {showImporter && (
            <div className="bg-slate-950 rounded-2xl p-5 border-2 border-purple-600/40 shadow-xl shadow-purple-500/5 animate-fade-in">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-purple-200 flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-400" />
                    Ingest Tabular Meteorological CSV
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Paste raw numeric climate columns. Your table must include a header and use standard names as defined below.
                  </p>
                </div>
                <button
                  onClick={() => setShowImporter(false)}
                  className="text-slate-500 hover:text-slate-300 text-xs font-semibold bg-slate-900 px-2 py-1 rounded"
                >
                  Close Importer
                </button>
              </div>

              <form onSubmit={handleCsvImport} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-mono mb-1">
                    Formatted Comma-Separated Data String
                  </label>
                  <textarea
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    placeholder={`period,avgtemp,maxtemp,mintemp,precipitation,pressure,windspeed
Jan,4.2,8.0,1.2,45,1015,16
Feb,5.1,9.2,1.8,55,1010,22
Mar,8.4,12.5,4.0,60,998,32
Apr,12.0,16.2,6.5,70,1014,14
May,15.5,20.1,9.8,80,1008,12`}
                    className="w-full h-36 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-purple-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {csvError && (
                  <div className="bg-red-950/60 border border-red-500/50 rounded-lg p-3 text-red-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                    <span>{csvError}</span>
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setCsvInput(`period,avgtemp,maxtemp,mintemp,precipitation,pressure,windspeed
Cycle_A,14.2,21.0,8.4,120,992,34
Cycle_B,17.1,24.5,10.2,160,985,48
Cycle_C,19.8,27.0,12.6,310,980,55
Cycle_D,15.2,22.1,9.0,85,1014,18
Cycle_E,11.5,16.0,5.2,40,1018,12`);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-slate-400 rounded-lg hover:text-slate-200"
                  >
                    Load Sample Column Format
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 text-purple-50 py-1.5 px-4 rounded-lg text-xs font-bold hover:bg-purple-500 transition shadow-lg shadow-purple-600/10"
                  >
                    Initialize telemetry Dataset
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Weather Station Descriptor Card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row gap-5 items-start md:items-center">
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-850 self-start md:self-center">
              <Compass className="h-8 w-8 text-teal-400" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-lg font-bold text-slate-100">{activeProfile.name}</h2>
                <span className="text-[11px] font-mono bg-teal-950 text-teal-400 border border-teal-800 px-2.5 py-0.5 rounded-full font-bold">
                  {activeProfile.climateType}
                </span>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  Timeframe: {activeProfile.defaultTimeframe}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                {activeProfile.description}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-slate-500 pt-0.5">
                <span>Latitude: <strong className="text-slate-300">{activeProfile.latitude}</strong></span>
                <span>Longitude: <strong className="text-slate-300">{activeProfile.longitude}</strong></span>
                <span>Elevation: <strong className="text-slate-300">{activeProfile.elevation}</strong></span>
              </div>
            </div>
          </div>

          {/* Bento Grid: Climatological Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1 */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Thermometer className="h-10 w-10 text-orange-500" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Thermal Amplitude</span>
                <div className="text-2xl font-black text-rose-400 font-mono mt-1">
                  {indicators.thermalAmplitude}°C
                </div>
              </div>
              <span className="text-[11px] text-slate-500 mt-2">
                Tmax - Tmin gap. Demonstrates thermal inertia.
              </span>
            </div>

            {/* Metric 2 */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <CloudRain className="h-10 w-10 text-cyan-500" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Avg Precipitation</span>
                <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
                  {indicators.averagePrecipitation} mm
                </div>
              </div>
              <span className="text-[11px] text-slate-500 mt-2">
                Average rainfall across active timeline.
              </span>
            </div>

            {/* Metric 3 */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wind className="h-10 w-10 text-teal-500" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Pressure-Wind r</span>
                <div className={`text-2xl font-black font-mono mt-1 ${
                  indicators.correlationPressureWind < -0.4 ? "text-emerald-400" : "text-yellow-400"
                }`}>
                  {indicators.correlationPressureWind}
                </div>
              </div>
              <span className="text-[11px] text-slate-500 mt-2">
                {indicators.correlationPressureWind < -0.4 
                  ? "Negative correlation (Trough system storms)" 
                  : "Stable barometric-friction coefficient"}
              </span>
            </div>

            {/* Metric 4 */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="h-10 w-10 text-purple-500" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Temp Shift Slope</span>
                <div className="text-2xl font-black text-indigo-400 font-mono mt-1">
                  {indicators.climateWarmingSlope > 0 ? "+" : ""}{indicators.climateWarmingSlope}
                </div>
              </div>
              <span className="text-[11px] text-slate-500 mt-2">
                Monthly regression rate. Positive = warming profile.
              </span>
            </div>

          </div>

          {/* Interactive Simulated Param Sandbox */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-teal-400" />
                <h3 className="font-bold text-sm tracking-tight">Active Climate Parameter Controls</h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => triggerClimateScenario("warming")}
                  className="px-2 py-1 text-[10px] font-bold tracking-tight uppercase bg-orange-950/40 text-orange-400 hover:bg-orange-900/50 rounded border border-orange-900/50 transition"
                  title="Increases temp by 2.4C and decreases average pressure"
                >
                  Global Warming Bias
                </button>
                <button
                  onClick={() => triggerClimateScenario("cyclone-surge")}
                  className="px-2 py-1 text-[10px] font-bold tracking-tight uppercase bg-teal-950/40 text-teal-400 hover:bg-teal-900/50 rounded border border-teal-900/50 transition"
                  title="Spikes precipitation, plummets barometric levels"
                >
                  Storm Surge
                </button>
                <button
                  onClick={() => triggerClimateScenario("la-nina")}
                  className="px-2 py-1 text-[10px] font-bold tracking-tight uppercase bg-cyan-950/40 text-cyan-400 hover:bg-cyan-900/50 rounded border border-cyan-900/50 transition"
                  title="Decreases temp, spikes rain"
                >
                  La Niña Preset
                </button>
                <button
                  onClick={() => triggerClimateScenario("reset")}
                  className="px-2 py-1 text-[10px] font-bold tracking-tight uppercase bg-slate-800 text-slate-300 hover:bg-slate-700 rounded transition"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1.5">
              
              {/* Temp Offset */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Temperature Bias</span>
                  <span className="text-orange-400 font-bold">
                    {tempOffset > 0 ? "+" : ""}{tempOffset}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.1"
                  value={tempOffset}
                  onChange={(e) => setTempOffset(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Glacial cooling (-5°C)</span>
                  <span>Scorching (+5°C)</span>
                </div>
              </div>

              {/* Rain Multiplier */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Precipitation Multiplier</span>
                  <span className="text-cyan-400 font-bold">
                    {(precipMultiplier * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.05"
                  value={precipMultiplier}
                  onChange={(e) => setPrecipMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Extreme Drought (20%)</span>
                  <span>Convective Spike (250%)</span>
                </div>
              </div>

              {/* Pressure Shift */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Barometric Grid Shift</span>
                  <span className="text-teal-400 font-bold">
                    {pressureOffset > 0 ? "+" : ""}{pressureOffset} hPa
                  </span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="1"
                  value={pressureOffset}
                  onChange={(e) => setPressureOffset(parseFloat(e.target.value))}
                  className="w-full accent-teal-400 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Deep Depression (-30 hPa)</span>
                  <span>High Anticyclone (+30 hPa)</span>
                </div>
              </div>

            </div>
          </div>

          {/* Visual Dual Charts Frame */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Chart 1: Moisture Gradient vs Thermal Gradient */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col">
              <div className="mb-4">
                <h4 className="font-bold text-xs uppercase tracking-wide text-slate-400 font-mono">
                  Thermal Gradient & Hydrological Saturation
                </h4>
                <p className="text-[11px] text-slate-500 leading-none mt-1">
                  Area: Avg Temperature (°C) • Bar: Precipitation Volume (mm)
                </p>
              </div>

              <div className="h-64 w-full text-slate-900 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={simulatedDataset}
                    margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="period"
                      stroke="#475569"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#f97316"
                      fontSize={11}
                      label={{ value: "Temp (°C)", angle: -90, position: "insideLeft", fill: "#f97316", offset: 10 }}
                      domain={['auto', 'auto']}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#06b6d4"
                      fontSize={11}
                      label={{ value: "Precip (mm)", angle: 90, position: "insideRight", fill: "#06b6d4", offset: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        borderColor: "#334155",
                        borderRadius: "8px",
                        color: "#f8fafc"
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar
                      yAxisId="right"
                      dataKey="precipitation"
                      name="Precipitation (mm)"
                      fill="#06b6d4"
                      fillOpacity={0.6}
                      radius={[4, 4, 0, 0]}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="avgTemp"
                      name="Avg Temp (°C)"
                      fill="url(#tempGradient)"
                      stroke="#f97316"
                      strokeWidth={2.5}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="maxTemp"
                      name="Max Temp"
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                      dot={false}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="minTemp"
                      name="Min Temp"
                      stroke="#3b82f6"
                      strokeDasharray="4 4"
                      dot={false}
                    />
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Pressure Low vs Wind Speed Spike */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col">
              <div className="mb-4">
                <h4 className="font-bold text-xs uppercase tracking-wide text-slate-400 font-mono">
                  Barometric Pressure vs Wind Velocity Correlation
                </h4>
                <p className="text-[11px] text-slate-500 leading-none mt-1">
                  Line Left: Barometric Pressure (hPa) • Line Right: Wind Velocity (km/h)
                </p>
              </div>

              <div className="h-64 w-full text-slate-900 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={simulatedDataset}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="period"
                      stroke="#475569"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#2dd4bf"
                      fontSize={11}
                      domain={['dataMin - 5', 'dataMax + 5']}
                      label={{ value: "Pressure (hPa)", angle: -90, position: "insideLeft", fill: "#2dd4bf", offset: 10 }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#a855f7"
                      fontSize={11}
                      domain={[0, 'auto']}
                      label={{ value: "Wind Speed (km/h)", angle: 90, position: "insideRight", fill: "#a855f7", offset: 10 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        borderColor: "#334155",
                        borderRadius: "8px",
                        color: "#f8fafc"
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="pressure"
                      name="Barometric Press."
                      stroke="#2dd4bf"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 1 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="windSpeed"
                      name="Wind Velocity"
                      stroke="#a855f7"
                      strokeWidth={2.5}
                      dot={{ r: 3 }}
                    />
                    {/* Reference Line for normal sea level pressure */}
                    <ReferenceLine yAxisId="left" y={1013.25} stroke="#64748b" strokeDasharray="3 3" label={{ value: "Sea Level Normal", fill: "#64748b", fontSize: 10, position: "top" }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Interactive Numerical Met-Data Grid Table */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Database className="h-4 w-4 text-teal-400" />
                  Meteorological Row-Telemetry Table
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Direct cell modification: Click and change any value to alter the simulation dynamically.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
                  Sensors Online
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-300 font-mono text-[11px] uppercase">
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-3">Avg Temp (°C)</th>
                    <th className="py-3 px-3">Max Temp (°C)</th>
                    <th className="py-3 px-3">Min Temp (°C)</th>
                    <th className="py-3 px-3">Rain (mm)</th>
                    <th className="py-3 px-3">Pressure (hPa)</th>
                    <th className="py-3 px-3">Wind (km/h)</th>
                    <th className="py-3 px-3">Dir</th>
                    <th className="py-3 px-4 text-right">Anomaly Indicator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {currentDataset.map((pt, index) => {
                    // Display calculated values based on current multipliers for immediate reactive feedback
                    const adjAvg = parseFloat((pt.avgTemp + tempOffset).toFixed(1));
                    const adjMax = parseFloat((pt.maxTemp + tempOffset).toFixed(1));
                    const adjMin = parseFloat((pt.minTemp + tempOffset).toFixed(1));
                    const adjPrecip = Math.max(0, Math.round(pt.precipitation * precipMultiplier));
                    const adjPress = Math.round(pt.pressure + pressureOffset);

                    return (
                      <tr 
                        key={pt.period} 
                        className={`hover:bg-slate-900/40 transition-colors ${
                          pt.anomalyFlag ? "bg-amber-950/10" : ""
                        }`}
                      >
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-300">
                          {pt.period}
                        </td>
                        
                        {/* Avg Temp input */}
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            step="0.1"
                            value={adjAvg}
                            onChange={(e) => handleUpdateCell(index, "avgTemp", parseFloat(e.target.value) - tempOffset)}
                            className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 w-16 text-xs text-orange-400 text-center focus:outline-none focus:border-orange-500 font-mono"
                          />
                        </td>

                        {/* Max Temp input */}
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            step="0.1"
                            value={adjMax}
                            onChange={(e) => handleUpdateCell(index, "maxTemp", parseFloat(e.target.value) - tempOffset)}
                            className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 w-16 text-xs text-rose-400 text-center focus:outline-none focus:border-rose-500 font-mono"
                          />
                        </td>

                        {/* Min Temp input */}
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            step="0.1"
                            value={adjMin}
                            onChange={(e) => handleUpdateCell(index, "minTemp", parseFloat(e.target.value) - tempOffset)}
                            className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 w-16 text-xs text-blue-400 text-center focus:outline-none focus:border-blue-500 font-mono"
                          />
                        </td>

                        {/* Precipitation input */}
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            value={adjPrecip}
                            onChange={(e) => handleUpdateCell(index, "precipitation", Math.round(parseFloat(e.target.value) / precipMultiplier))}
                            className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 w-16 text-xs text-cyan-400 text-center focus:outline-none focus:border-cyan-500 font-mono"
                          />
                        </td>

                        {/* Pressure input */}
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            value={adjPress}
                            onChange={(e) => handleUpdateCell(index, "pressure", parseInt(e.target.value) - pressureOffset)}
                            className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 w-20 text-xs text-teal-400 text-center focus:outline-none focus:border-teal-500 font-mono"
                          />
                        </td>

                        {/* Wind Speed input */}
                        <td className="py-2.5 px-3">
                          <input
                            type="number"
                            value={pt.windSpeed}
                            onChange={(e) => handleUpdateCell(index, "windSpeed", parseFloat(e.target.value))}
                            className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 w-16 text-xs text-purple-400 text-center focus:outline-none focus:border-purple-500 font-mono"
                          />
                        </td>

                        {/* Wind Direction text display */}
                        <td className="py-2.5 px-3 font-mono text-slate-500 text-center">
                          {pt.windDirection}
                        </td>

                        {/* Anomaly Indicator Column */}
                        <td className="py-2.5 px-4 text-right">
                          {pt.anomalyFlag ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800/60 font-mono">
                              <AlertTriangle className="h-3 w-3 text-amber-500" />
                              {pt.anomalyName || "Anomaly Flag"}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-600 font-mono">Normal Range</span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: AI Climatologist Portal (4 Cols) */}
        <div className="xl:col-span-4 flex flex-col gap-6">

          {/* AI Station Panel */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 flex flex-col flex-1 shadow-md gap-4 min-h-[500px]">
            
            <div className="border-b border-slate-850 pb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-teal-400" />
                  <h3 className="font-bold text-sm tracking-tight text-slate-200">
                    AI Climatological Analyst
                  </h3>
                </div>
                <span className="text-[10px] font-bold font-mono bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900">
                  GEMINI-3.5-FLASH
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                Query weather patterns, trigger monsoonal analyses, or compute thermal-barometric anomaly reports securely of actual dataset metrics.
              </p>
            </div>

            {/* AI Reports Console/History container */}
            <div className="flex-1 overflow-y-auto max-h-[600px] min-h-[300px] bg-slate-900/60 rounded-xl p-4 border border-slate-850 space-y-4 font-normal text-xs text-slate-300">
              
              {/* Initial Screen / Instructions */}
              {!aiReport && chatHistory.length === 0 && !isAiLoading && (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="p-3 bg-slate-950 rounded-full text-slate-600">
                    <BookOpen className="h-8 w-8 text-slate-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-300 text-xs">Awaiting Analysis Parameters</h4>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-[280px]">
                      Trigger a comprehensive meteorological study or ask the climatologist custom concerns regarding the dataset above.
                    </p>
                  </div>
                  <button
                    onClick={handleTriggerAiReport}
                    className="mt-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-slate-950 font-black py-2 px-4 rounded-lg flex items-center gap-1.5 shadow-md shadow-teal-500/15"
                  >
                    <Wand2 className="h-4 w-4" />
                    Write Climate Report
                  </button>
                </div>
              )}

              {/* Dynamic Loader Logs */}
              {isAiLoading && aiReport === "" && (
                <div className="space-y-3 py-6">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 text-teal-400 animate-spin" />
                  </div>
                  <div className="font-mono text-[10px] text-slate-400 space-y-1 bg-slate-950 p-3 rounded-lg border border-slate-800/60">
                    <span className="text-teal-400 block mb-1">Climatology Model Loading...</span>
                    {aiLogMessages.map((msg, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-teal-500">✓</span>
                        <span>{msg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Climate Markdown Report Display */}
              {aiReport !== "" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono">Generated Meteorological Study</span>
                    <button
                      onClick={handleTriggerAiReport}
                      className="text-[10px] text-teal-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" /> Re-Analyze
                    </button>
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none text-slate-300 leading-relaxed space-y-3 border-l-2 border-teal-500/40 pl-3">
                    <Markdown>{aiReport}</Markdown>
                  </div>
                </div>
              )}

              {/* Chat Conversation History */}
              {chatHistory.map((chat, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg flex flex-col space-y-1 ${
                    chat.role === "user"
                      ? "bg-slate-950 border border-slate-800 text-slate-200 ml-4"
                      : "bg-teal-950/20 border-l-2 border-teal-500 text-slate-300 mr-4"
                  }`}
                >
                  <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500">
                    {chat.role === "user" ? "Researcher Query" : "AI Climatologist Response"}
                  </span>
                  <div className="leading-relaxed font-sans mt-0.5">
                    {chat.role === "user" ? (
                      <p>{chat.text}</p>
                    ) : (
                      <div className="prose prose-sm prose-invert max-w-none space-y-2 mt-1">
                        <Markdown>{chat.text}</Markdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Mini Loader during Chat Responses */}
              {isAiLoading && chatHistory.length > 0 && (
                <div className="flex items-center gap-2 text-slate-500 italic p-2">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-teal-400" />
                  <span>Climatologist drafting response...</span>
                </div>
              )}

            </div>

            {/* Conversation Input Bar */}
            <form onSubmit={handleSendChatQuery} className="flex gap-2">
              <input
                type="text"
                value={chatQuery}
                disabled={isAiLoading}
                onChange={(e) => setChatQuery(e.target.value)}
                placeholder="Ask Climatologist about anomalies or trends..."
                className="flex-1 bg-slate-900 border border-slate-800 focus:outline-none focus:border-teal-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={!chatQuery.trim() || isAiLoading}
                className="bg-teal-500 text-slate-950 font-bold p-2.5 rounded-xl transition hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            {/* Direct Instant Guidance Panel */}
            <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-850 space-y-1">
              <span className="text-[10px] text-teal-400 font-mono font-semibold flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" /> Recommended Investigative Inquiries:
              </span>
              <ul className="text-[11px] text-slate-400 space-y-1 font-sans pl-5 list-disc">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setChatQuery("Tell me about the correlation of pressure wind. Does a negative index of Reykjavik reflect winter cyclonic storms?");
                    }}
                    className="hover:text-teal-300 text-left underline decoration-dotted"
                  >
                    What is the winter cyclonic storm threshold?
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setChatQuery("Evaluate the linear regression temperature slope. Is there an active thermal trend or heating cycle present?");
                    }}
                    className="hover:text-teal-300 text-left underline decoration-dotted"
                  >
                    Is there an active thermal warming slope?
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setChatQuery("Explain what risks arise from the July temperature spike anomaly.");
                    }}
                    className="hover:text-teal-300 text-left underline decoration-dotted"
                  >
                    July temperature anomaly implications?
                  </button>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </main>

      {/* Footer System Credits */}
      <footer className="border-t border-slate-800/80 bg-slate-950/40 py-4 px-6 mt-12 flex justify-between items-center text-xs text-slate-500 font-mono">
        <span>Intermediate Weather Pattern Analyzer © 2026</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> API Gateway Secure
          </span>
          <span className="text-[10px] text-slate-600">v1.2.0</span>
        </div>
      </footer>

    </div>
  );
}
