"use client";

import { useState } from "react";
import Logo from "./Logo";
import { 
  gamesList, 
  cpusList, 
  gpusList, 
  ramCapacities, 
  ramTypes, 
  resolutionsList, 
  specificGameWeights,
  getTunedProfile 
} from "./gameData";

const macChipsList = [
  "Apple M4 Max (40-core GPU)",
  "Apple M4 Pro (20-core GPU)",
  "Apple M4 (10-core GPU)",
  "Apple M3 Max (40-core GPU)",
  "Apple M3 Pro (18-core GPU)",
  "Apple M3 (10-core GPU)",
  "Apple M2 Ultra (76-core GPU)",
  "Apple M2 Max (38-core GPU)",
  "Apple M2 Pro (19-core GPU)",
  "Apple M2 (10-core GPU)",
  "Apple M1 Ultra (64-core GPU)",
  "Apple M1 Max (32-core GPU)",
  "Apple M1 Pro (16-core GPU)",
  "Apple M1 (8-core GPU)",
  "Apple M1 (7-core GPU, Air Base)"
];

const macUnifiedMemory = ["8 GB Unified", "16 GB Unified", "18 GB Unified", "24 GB Unified", "36 GB Unified", "48 GB Unified", "64 GB Unified", "128 GB Unified"];

export default function Home() {
  const [platformTab, setPlatformTab] = useState("pc"); // "pc" or "mac"
  const [onlyGamePass, setOnlyGamePass] = useState(false); // Game Pass quick filter

  // PC Rig States
  const [selectedGame, setSelectedGame] = useState(gamesList[0]);
  const [customGameMode, setCustomGameMode] = useState(false);
  const [customGameTitle, setCustomGameTitle] = useState("");

  const [selectedCpu, setSelectedCpu] = useState(cpusList[2]); // 7800X3D
  const [customCpuMode, setCustomCpuMode] = useState(false);
  const [customCpuTitle, setCustomCpuTitle] = useState("");

  const [selectedGpu, setSelectedGpu] = useState(gpusList[11]); // RTX 4060
  const [customGpuMode, setCustomGpuMode] = useState(false);
  const [customGpuTitle, setCustomGpuTitle] = useState("");

  const [selectedRamCap, setSelectedRamCap] = useState(ramCapacities[2]); // 16 GB
  const [selectedRamType, setSelectedRamType] = useState(ramTypes[2]); // DDR4 3200
  const [selectedRes, setSelectedRes] = useState(resolutionsList[1]); // 1080p
  const [mode, setMode] = useState("competitive");

  // Mac Tab Specific States
  const [selectedMacChip, setSelectedMacChip] = useState(macChipsList[4]); // M3 Pro
  const [selectedMacRam, setSelectedMacRam] = useState(macUnifiedMemory[3]); // 24 GB

  // PC Upgrade Comparison
  const [compareMode, setCompareMode] = useState(false);
  const [upgradeGpu, setUpgradeGpu] = useState(gpusList[6]);
  const [upgradeCpu, setUpgradeCpu] = useState(cpusList[0]);

  const [gameSearch, setGameSearch] = useState("");
  const [cpuSearch, setCpuSearch] = useState("");
  const [gpuSearch, setGpuSearch] = useState("");

  const [result, setResult] = useState(null);
  const [upgradeResult, setUpgradeResult] = useState(null);

  const activeGame = customGameMode && customGameTitle.trim() ? customGameTitle : selectedGame;
  const activeCpu = platformTab === "mac" ? selectedMacChip : (customCpuMode && customCpuTitle.trim() ? customCpuTitle : selectedCpu);
  const activeGpu = platformTab === "mac" ? `[Metal 3] ${selectedMacChip.split("(")[0]}` : (customGpuMode && customGpuTitle.trim() ? customGpuTitle : selectedGpu);
  const activeRamCap = platformTab === "mac" ? selectedMacRam.replace(" Unified", "") : selectedRamCap;
  const activeRamType = platformTab === "mac" ? "DDR5 (6000+ MHz Cl30)" : selectedRamType;

  const handleTune = () => {
    const profile = getTunedProfile(activeGame, activeCpu, activeGpu, activeRamCap, activeRamType, selectedRes, mode);
    setResult(profile);

    if (compareMode && platformTab === "pc") {
      const upProfile = getTunedProfile(activeGame, upgradeCpu, upgradeGpu, selectedRamCap, selectedRamType, selectedRes, mode);
      setUpgradeResult(upProfile);
    }
  };

  const handleExportConfig = () => {
    if (!result) return;
    const isGP = result.isGamePass;
    const iniContent = `[TuneMyGame-Precision-Config]
TargetGame=${activeGame}
Platform=${platformTab === "mac" ? "macOS (Apple Silicon)" : "Windows PC"}
HardwareConfig=${platformTab === "mac" ? selectedMacChip : `${activeCpu} / ${activeGpu}`}
RenderResolution=${selectedRes}
ExpectedAvgFPS=${result.expectedFps}
DistributionChannel=${isGP ? "Xbox App / PC Game Pass (UWP)" : "Steam / Standalone Win32"}

[InGameSettingsOverrides]
${result.settings.map(s => `${s.name.replace(/\s+/g, '')}=${s.value}`).join('\n')}

[LaunchOptionsOrDirectories]
${isGP ? "%LOCALAPPDATA%\\Packages\\ - Enable Xbox Game Bar High Performance" : "-high -threads 8 -novid -fullscreen +exec autoexec.cfg"}

; Engineered with precision by Ankur Roy`;

    const blob = new Blob([iniContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeGame.replace(/[^a-zA-Z0-9]/g, "_")}_TuneMyGame.ini`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredGames = gamesList.filter(g => {
    const matchesSearch = g.toLowerCase().includes(gameSearch.toLowerCase());
    if (onlyGamePass) {
      const gp = specificGameWeights[g]?.gamePass;
      return matchesSearch && gp === true;
    }
    return matchesSearch;
  });

  const filteredCpus = cpusList.filter(c => c.toLowerCase().includes(cpuSearch.toLowerCase()));
  const filteredGpus = gpusList.filter(gp => gp.toLowerCase().includes(gpuSearch.toLowerCase()));

  const isMacNative = result?.macSupport?.includes("Native");

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 selection:bg-cyan-500 selection:text-black antialiased relative overflow-hidden flex flex-col justify-between">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[350px] bg-gradient-to-b from-cyan-600/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Brand Header */}
      <header className="w-full border-b border-zinc-800/80 backdrop-blur-md bg-[#07090e]/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo className="w-9 h-9" />
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
              TuneMyGame <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">STUDIO PRO</span>
            </span>
          </div>

          {/* Platform Tab Switcher */}
          <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => { setPlatformTab("pc"); setResult(null); }}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                platformTab === "pc" ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span>🖥️ PC Rig</span>
            </button>
            <button
              onClick={() => { setPlatformTab("mac"); setResult(null); }}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                platformTab === "mac" ? "bg-gradient-to-r from-zinc-100 to-zinc-300 text-black shadow-md shadow-white/10" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span>🍎 Mac Gaming</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-zinc-400">
            <span>Engineered by <strong className="text-zinc-200">Ankur Roy</strong></span>
          </div>
        </div>
      </header>

      {/* Main Studio Frame */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-grow flex flex-col items-center">
        
        {/* Mac Joke Callout Banner */}
        {platformTab === "mac" && (
          <div className="w-full mb-6 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-700/70 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <span className="text-3xl">☕</span>
              <div>
                <h2 className="text-sm font-black text-white flex items-center justify-center sm:justify-start gap-2">
                  <span>Apple Silicon Telemetry Terminal</span>
                  <span className="text-[10px] bg-red-500/20 border border-red-500/40 text-red-300 px-2 py-0.5 rounded-full font-mono uppercase">Unintended Use-Case</span>
                </h2>
                <p className="text-xs text-zinc-400 italic mt-0.5">
                  &ldquo;Bro bought a $3,000 MacBook for Final Cut Pro and Figma, but now wants to run Cyberpunk... you aren&apos;t meant to game on this!&rdquo; 💀
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 whitespace-nowrap">
              MetalFX + GPTK Active
            </span>
          </div>
        )}

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Controls Deck (5 Cols) */}
          <section className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-5 backdrop-blur-xl shadow-2xl space-y-4">
            
            {/* Mode Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Optimization Target</label>
              <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setMode("competitive")}
                  className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    mode === "competitive" ? "bg-cyan-500 text-black shadow-md" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  ⚡ Frame Rate Priority
                </button>
                <button
                  type="button"
                  onClick={() => setMode("cinematic")}
                  className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    mode === "cinematic" ? "bg-indigo-600 text-white shadow-md" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  🎬 Fidelity / Quality
                </button>
              </div>
            </div>

            {/* Game Selector with Game Pass Quick Filter */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Target Game Title</label>
                  <button
                    type="button"
                    onClick={() => setOnlyGamePass(!onlyGamePass)}
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold border transition cursor-pointer ${
                      onlyGamePass 
                        ? "bg-green-500 text-black border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]" 
                        : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    🟢 Game Pass Only
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomGameMode(!customGameMode)}
                  className="text-[10px] text-cyan-400 hover:underline font-mono cursor-pointer"
                >
                  {customGameMode ? "← Catalog" : "+ Custom Title"}
                </button>
              </div>

              {customGameMode ? (
                <input
                  type="text"
                  placeholder="Type any game on Earth..."
                  value={customGameTitle}
                  onChange={(e) => setCustomGameTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-cyan-500/50 rounded-lg p-2.5 text-xs text-cyan-300 placeholder-zinc-600 focus:outline-none font-mono"
                />
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Search games..."
                    value={gameSearch}
                    onChange={(e) => setGameSearch(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-t-lg p-2 text-xs text-cyan-300 placeholder-zinc-600 focus:outline-none font-mono"
                  />
                  <select
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="w-full bg-zinc-900 border-x border-b border-zinc-800 rounded-b-lg p-2 text-zinc-100 text-xs focus:outline-none cursor-pointer"
                  >
                    {filteredGames.map((g) => (<option key={g} value={g}>{g}</option>))}
                  </select>
                </div>
              )}
            </div>

            {/* Platform Hardware Controls */}
            {platformTab === "pc" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">CPU</label>
                      <button
                        type="button"
                        onClick={() => setCustomCpuMode(!customCpuMode)}
                        className="text-[9px] text-cyan-400 hover:underline cursor-pointer"
                      >
                        {customCpuMode ? "List" : "+ Custom"}
                      </button>
                    </div>
                    {customCpuMode ? (
                      <input
                        type="text"
                        placeholder="Type CPU..."
                        value={customCpuTitle}
                        onChange={(e) => setCustomCpuTitle(e.target.value)}
                        className="w-full bg-zinc-950 border border-cyan-500/50 rounded-lg p-2 text-xs text-cyan-300 font-mono"
                      />
                    ) : (
                      <select
                        value={selectedCpu}
                        onChange={(e) => setSelectedCpu(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 cursor-pointer"
                      >
                        {filteredCpus.map((c) => (<option key={c} value={c}>{c}</option>))}
                      </select>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">GPU</label>
                      <button
                        type="button"
                        onClick={() => setCustomGpuMode(!customGpuMode)}
                        className="text-[9px] text-cyan-400 hover:underline cursor-pointer"
                      >
                        {customGpuMode ? "List" : "+ Custom"}
                      </button>
                    </div>
                    {customGpuMode ? (
                      <input
                        type="text"
                        placeholder="Type GPU..."
                        value={customGpuTitle}
                        onChange={(e) => setCustomGpuTitle(e.target.value)}
                        className="w-full bg-zinc-950 border border-cyan-500/50 rounded-lg p-2 text-xs text-cyan-300 font-mono"
                      />
                    ) : (
                      <select
                        value={selectedGpu}
                        onChange={(e) => setSelectedGpu(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 cursor-pointer"
                      >
                        {filteredGpus.map((gp) => (<option key={gp} value={gp}>{gp}</option>))}
                      </select>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">RAM Size</label>
                    <select
                      value={selectedRamCap}
                      onChange={(e) => setSelectedRamCap(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 cursor-pointer"
                    >
                      {ramCapacities.map((r) => (<option key={r} value={r}>{r}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">RAM Speed</label>
                    <select
                      value={selectedRamType}
                      onChange={(e) => setSelectedRamType(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 cursor-pointer"
                    >
                      {ramTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
                    </select>
                  </div>
                </div>
              </>
            ) : (
              /* Mac Hardware Inputs */
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Apple Silicon SoC / Model</label>
                  <select
                    value={selectedMacChip}
                    onChange={(e) => setSelectedMacChip(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 font-mono cursor-pointer"
                  >
                    {macChipsList.map((chip) => (<option key={chip} value={chip}>{chip}</option>))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Unified Memory Pool</label>
                  <select
                    value={selectedMacRam}
                    onChange={(e) => setSelectedMacRam(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 cursor-pointer"
                  >
                    {macUnifiedMemory.map((m) => (<option key={m} value={m}>{m}</option>))}
                  </select>
                </div>
              </>
            )}

            {/* Resolution */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Display Resolution</label>
              <div className="grid grid-cols-4 gap-2">
                {resolutionsList.map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setSelectedRes(res)}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition border cursor-pointer ${
                      selectedRes === res
                        ? "bg-cyan-500 text-black border-cyan-400 font-bold"
                        : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleTune}
              className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition shadow-lg cursor-pointer ${
                platformTab === "mac" 
                  ? "bg-gradient-to-r from-zinc-100 to-zinc-300 text-black hover:from-white hover:to-zinc-200" 
                  : "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 text-white"
              }`}
            >
              {platformTab === "mac" ? "Calibrate Apple Silicon & Metal ⚡" : "Analyze & Calibrate Rig ⚡"}
            </button>
          </section>

          {/* Telemetry Output Deck (7 Cols) */}
          <section className="lg:col-span-7 space-y-4">
            {result ? (
              <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-5">
                
                {/* Result Title Bar & Service Badges */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 flex-wrap">
                      {activeGame}
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-cyan-400 border border-zinc-700 uppercase">
                        {platformTab === "mac" ? "Metal 3 / Apple Silicon" : mode}
                      </span>
                      {result.isGamePass && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-950/80 text-green-400 border border-green-500/40">
                          🟢 Included on PC Game Pass
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      {platformTab === "mac" ? `${selectedMacChip} • ${selectedMacRam}` : `${activeCpu} • ${activeGpu}`}
                    </p>
                  </div>
                  <button
                    onClick={handleExportConfig}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 transition cursor-pointer"
                  >
                    Export Config 💾
                  </button>
                </div>

                {/* Unplayable Cloud Fallback Advisory */}
                {result.isUnplayableLocally && (
                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold">
                      <span className="text-lg">⚠️</span>
                      <span>Local Hardware Deficiency Detected ({result.numericFps} FPS)</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed text-[11px]">
                      Your selected local hardware cannot sustain playable framerates (minimum 30–60 FPS) for <strong>{activeGame}</strong>. 
                    </p>
                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      <span className="text-zinc-400 font-semibold text-[10px] uppercase">Recommended Cloud Alternative:</span>
                      {result.isGfn && (
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                          Stream via GeForce NOW (RTX 4080 Tier)
                        </span>
                      )}
                      {result.isGamePass && (
                        <span className="text-[10px] bg-green-950 text-green-300 border border-green-500/40 px-2 py-0.5 rounded font-bold">
                          Stream via Xbox Cloud Gaming (Game Pass)
                        </span>
                      )}
                      {!result.isGfn && !result.isGamePass && (
                        <span className="text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded font-bold">
                          Hardware Upgrade Required
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 4 Key Performance Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Expected Avg</span>
                    <p className={`text-xl font-black font-mono mt-0.5 ${result.isUnplayableLocally ? "text-rose-400" : "text-emerald-400"}`}>
                      {result.expectedFps}
                    </p>
                  </div>
                  <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">1% Low Target</span>
                    <p className="text-xl font-black text-cyan-400 font-mono mt-0.5">{result.onePercentLow}</p>
                  </div>
                  <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">API / Engine</span>
                    <p className="text-xs font-bold text-indigo-300 font-mono mt-2">{platformTab === "mac" ? "Metal 3 / MetalFX" : result.directX}</p>
                  </div>
                  <div className="bg-zinc-950/80 border border-zinc-800 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Disk Footprint</span>
                    <p className="text-xs font-bold text-amber-300 font-mono mt-2">{result.storageRequired}</p>
                  </div>
                </div>

                {/* macOS Compatibility / Execution Status */}
                <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                  isMacNative 
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300" 
                    : "bg-amber-950/20 border-amber-500/30 text-amber-300"
                }`}>
                  <div>
                    <span className="font-semibold text-zinc-400">macOS Platform Support: </span>
                    <span className="font-bold">{result.macSupport}</span>
                  </div>
                  <span className="text-[10px] bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded font-mono font-bold">
                    {isMacNative ? "Native Binary" : "Requires CrossOver / GPTK"}
                  </span>
                </div>

                {/* VRAM / Unified Memory Safety */}
                <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-zinc-400">{platformTab === "mac" ? "Unified Memory Frame Allocation:" : "VRAM Allocation Safety Meter:"}</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {result.vramTelemetry.used} GB / {result.vramTelemetry.total} GB
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <div 
                      style={{ width: `${result.vramTelemetry.percent}%` }} 
                      className={`h-full transition-all ${
                        result.vramTelemetry.isOverloaded ? "bg-rose-500" : result.vramTelemetry.percent > 75 ? "bg-amber-500" : "bg-cyan-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Recommended Sliders */}
                <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl divide-y divide-zinc-800/80 overflow-hidden">
                  {result.settings.map((item, idx) => (
                    <div key={idx} className="px-3.5 py-2.5 flex justify-between items-center text-xs">
                      <span className="text-zinc-400 font-medium">{item.name}</span>
                      <span className="font-mono font-bold text-cyan-300 text-[11px] bg-zinc-900 border border-zinc-700/60 px-2.5 py-0.5 rounded">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[380px] bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
                <span className="text-2xl mb-2">{platformTab === "mac" ? "🍎" : "⚡"}</span>
                <h3 className="text-sm font-bold text-zinc-300">
                  {platformTab === "mac" ? "Awaiting Apple Silicon Calibration" : "Studio Standby"}
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mt-1">
                  Select your hardware configuration and click calibrate to analyze FPS and cloud streaming availability.
                </p>
              </div>
            )}
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800 bg-[#07090e]/90 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <p>© 2026 TuneMyGame Studio Pro. Precision benchmarking engine.</p>
          <p>Engineered with precision by <span className="text-cyan-400 font-bold">Ankur Roy</span></p>
        </div>
      </footer>
    </div>
  );
}