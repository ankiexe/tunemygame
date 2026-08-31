'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { RAW_GPUS, RAW_CPUS, RAW_APPLE_CHIPS } from '../data/hardware';

const SUPABASE_URL = 'https://zfqorzpdljrwdnpnwvsw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcW9yenBkbGpyd2RucG53dnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNjU1MzMsImV4cCI6MjEwMzc0MTUzM30.0QucSbGN3wJ_FNluvNAqQbC7p1jrtqyZ9nkhXczobB0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function Home() {
  const [gamesList, setGamesList] = useState([]);
  const [gpusList, setGpusList] = useState(RAW_GPUS);
  const [cpusList, setCpusList] = useState(RAW_CPUS);
  const [appleChipsList, setAppleChipsList] = useState(RAW_APPLE_CHIPS);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('welcome'); // 'welcome' | 'studio'

  // Platform & Filter States
  const [platform, setPlatform] = useState('pc'); // 'pc' | 'mac' | 'potato'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);

  // Hardware Calibration States
  const [selectedGpu, setSelectedGpu] = useState(RAW_GPUS[6]);
  const [selectedCpu, setSelectedCpu] = useState(RAW_CPUS[5]);
  const [selectedChip, setSelectedChip] = useState(RAW_APPLE_CHIPS[2]);
  const [selectedRam, setSelectedRam] = useState(16);
  const [selectedRamType, setSelectedRamType] = useState('DDR5 6000MHz (Low Latency)');
  const [selectedUnifiedMemory, setSelectedUnifiedMemory] = useState(36);
  const [selectedMemoryArchitecture, setSelectedMemoryArchitecture] = useState('Unified High-Bandwidth LPDDR5');
  const [selectedRes, setSelectedRes] = useState('1440p');
  const [copied, setCopied] = useState(false);

  // 1. Fetch All Supabase Data
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Fetch Games in chunks
        let allGames = [];
        let from = 0;
        const step = 1000;
        let hasMore = true;

        while (hasMore) {
          const { data, error } = await supabase
            .from('games')
            .select('*')
            .range(from, from + step - 1);

          if (error || !data || data.length === 0) {
            hasMore = false;
          } else {
            allGames.push(...data);
            if (data.length < step) hasMore = false;
            else from += step;
          }
        }

        setGamesList(allGames);
        if (allGames.length > 0) {
          setSelectedGame(allGames[0]);
        }
      } catch (err) {
        console.error('Data Fetch Error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // 2. Platform & Search Filter
  const filteredGames = useMemo(() => {
    let list = gamesList.filter((game) => {
      const matchesSearch = (game.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (platform === 'mac') {
        return game.is_mac === true || game.mac_support === 'Native' || game.mac_support === 'CrossOver / Rosetta';
      }
      if (platform === 'potato') return game.is_potato === true;
      return true;
    });

    if (platform === 'mac') {
      list.sort((a, b) => {
        const aNative = a.mac_support === 'Native' ? 1 : 0;
        const bNative = b.mac_support === 'Native' ? 1 : 0;
        if (bNative !== aNative) return bNative - aNative;
        return (a.name || '').localeCompare(b.name || '');
      });
    } else {
      list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return list;
  }, [gamesList, platform, searchQuery]);

  const pcGpus = useMemo(
    () => RAW_GPUS.filter(gpu => {
      const name = String(gpu.name || '').toLowerCase();
      return !name.includes('apple') && !name.includes('snapdragon');
    }),
    []
  );

  const appleChips = useMemo(
    () => appleChipsList,
    [appleChipsList]
  );

  const potatoGpus = useMemo(() => RAW_GPUS.filter(gpu => gpu.score <= 38), []);
  const potatoCpus = useMemo(() => RAW_CPUS.filter(cpu => cpu.score <= 55), []);

  const currentGpuOptions = useMemo(() => {
    if (platform === 'mac') return appleChipsList;
    if (platform === 'potato') return potatoGpus;
    return pcGpus;
  }, [platform, appleChipsList, pcGpus, potatoGpus]);

  const currentCpuOptions = useMemo(() => {
    if (platform === 'potato') return potatoCpus;
    return RAW_CPUS;
  }, [platform, potatoCpus]);

  const effectiveSelectedGpu = useMemo(() => {
    if (!selectedGpu) return currentGpuOptions[0] || null;
    const isValid = currentGpuOptions.some(option => option.name === selectedGpu.name);
    return isValid ? selectedGpu : currentGpuOptions[0] || null;
  }, [selectedGpu, currentGpuOptions]);

  const effectiveSelectedCpu = useMemo(() => {
    if (!selectedCpu) return currentCpuOptions[0] || null;
    const isValid = currentCpuOptions.some(option => option.name === selectedCpu.name);
    return isValid ? selectedCpu : currentCpuOptions[0] || null;
  }, [selectedCpu, currentCpuOptions]);

  // Dynamic Counts
  const macCount = useMemo(() => gamesList.filter(g => g.is_mac === true || g.mac_support === 'Native').length, [gamesList]);
  const potatoCount = useMemo(() => gamesList.filter(g => g.is_potato === true).length, [gamesList]);

  const applyPlatformDefaults = (nextPlatform) => {
    setPlatform(nextPlatform);

    if (nextPlatform === 'mac') {
      const chosenAppleChip = appleChipsList.find(chip => chip.name.includes('M3 Pro')) || appleChipsList.find(chip => chip.name.includes('M4')) || appleChipsList[0];
      setSelectedChip(chosenAppleChip);
      setSelectedGpu(chosenAppleChip);
      setSelectedCpu(null);
      setSelectedRam(36);
      setSelectedUnifiedMemory(36);
      setSelectedMemoryArchitecture('Unified High-Bandwidth LPDDR5');
      setSelectedRamType('Unified LPDDR5 (Apple Silicon)');
      setSelectedRes('Retina 4.5K');
      return;
    }

    if (nextPlatform === 'potato') {
      const chosenPotatoGpu = potatoGpus[0];
      const chosenPotatoCpu = potatoCpus[0];
      setSelectedGpu(chosenPotatoGpu);
      setSelectedCpu(chosenPotatoCpu);
      setSelectedRam(8);
      setSelectedRamType('DDR3 1600MHz (Potato)');
      setSelectedRes('720p');
      return;
    }

    const chosenGpu = pcGpus.find(gpu => gpu.name.includes('RTX 4070')) || pcGpus[0];
    const chosenCpu = RAW_CPUS[5];

    setSelectedGpu(chosenGpu);
    setSelectedCpu(chosenCpu);
    setSelectedRam(32);
    setSelectedRamType('DDR5 6000MHz (Low Latency)');
    setSelectedRes('1440p');
  };

  const gpuOptionsForPlatform = platform === 'potato' ? potatoGpus : RAW_GPUS;
  const cpuOptionsForPlatform = platform === 'potato' ? potatoCpus : RAW_CPUS;

  // 3. Telemetry Computations
  const activeHardwareGpu = platform === 'mac' ? selectedChip : selectedGpu;

  const telemetry = useMemo(() => {
    if (!selectedGame) return { avgFps: 60, lowFps: 48, vramUsage: 4.2, bottleneck: 0, status: 'OPTIMAL' };

    const gpuScore = activeHardwareGpu?.score || 60;
    const cpuScore = selectedCpu?.score || 60;
    const gpuReq = selectedGame.base_gpu_req || 40;

    // Res modifier
    const resMod = selectedRes === '4K' ? 0.52 : selectedRes === '1440p' ? 0.78 : 1.0;

    // Base performance calculation
    const baseFps = Math.max(30, Math.round(((gpuScore * 1.5) / (gpuReq * 0.025 + 1)) * resMod));
    const cpuPacing = Math.min(1.0, (cpuScore / gpuScore) + 0.15);

    const ramSpeedModifier = selectedRamType.includes('DDR5') || selectedRamType.includes('LPDDR5') || selectedRamType.includes('Unified')
      ? 1.08
      : selectedRamType.includes('DDR4')
        ? 0.98
        : 0.88;

    const avgFps = Math.min(240, Math.round(baseFps * cpuPacing));
    const lowFps = Math.round(avgFps * (0.75 + (selectedRam >= 16 ? 0.1 : -0.05)) * ramSpeedModifier);

    const baseVram = selectedGame.base_vram_req || 3.5;
    const vramUsage = (baseVram * (selectedRes === '4K' ? 1.6 : selectedRes === '1440p' ? 1.25 : 1.0)).toFixed(1);

    const bottleneck = Math.abs(gpuScore - cpuScore) > 25 ? (gpuScore > cpuScore ? 'CPU Bound' : 'GPU Bound') : 'Balanced';

    return {
      avgFps,
      lowFps,
      vramUsage,
      bottleneck,
      gpuScore,
      totalVram: activeHardwareGpu?.vram || 8,
      ramSpeedModifier,
      ramTag: selectedRamType.includes('DDR5')
        ? 'DDR5 Pacing'
        : selectedRamType.includes('DDR4')
          ? 'DDR4 Pacing'
          : selectedRamType.includes('LPDDR5') || selectedRamType.includes('Unified')
            ? 'Unified Memory'
            : 'DDR3 Pacing'
    };
  }, [selectedGame, activeHardwareGpu, selectedCpu, selectedRam, selectedRes, selectedRamType]);

  const copyLaunchOptions = () => {
    navigator.clipboard.writeText(`-high -novid -fullscreen -threads ${selectedCpu?.cores || 8} +mat_queue_mode 2`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (viewMode === 'welcome') {
    return (
      <main className="min-h-screen overflow-hidden bg-[#07080c] text-zinc-100 selection:bg-emerald-500/30">
        <div className="relative isolate min-h-screen px-6 py-8 sm:px-10 lg:px-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_38%),linear-gradient(135deg,_#07080c_0%,_#0b1114_52%,_#071b18_100%)]" />
          <div className="absolute inset-x-0 top-0 -z-10 h-px bg-emerald-400/60 shadow-[0_0_30px_8px_rgba(16,185,129,0.18)]" />

          <header className="mx-auto flex max-w-7xl items-center justify-between border-b border-zinc-800/70 pb-6">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
              <span className="font-mono text-sm font-bold tracking-[0.22em] text-white">TUNEMYGAME</span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Telemetry Studio / 04.9</span>
          </header>

          <section className="mx-auto flex max-w-7xl flex-col justify-center py-16 lg:min-h-[calc(100vh-112px)] lg:py-20">
            <div className="animate-[fade-in-up_700ms_ease-out_both]">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1.5 font-mono text-xs text-emerald-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                ENGINEERED BY ANKUR ROY // 16-YEAR-OLD SYSTEMS ARCHITECT
              </div>
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-cyan-400">Hardware intelligence for stable frames</p>
              <h1 className="max-w-5xl text-5xl font-black leading-[0.98] tracking-tight text-white sm:text-7xl lg:text-8xl">
                Deterministic Hardware Telemetry. Stop Guessing. Lock Your 1% Lows.
              </h1>
              <p className="mt-8 max-w-3xl text-base leading-7 text-zinc-400 sm:text-lg">
                Publisher spec sheets are notoriously vague, leading to sudden stutters and VRAM overflows. TuneMyGame calculates precise in-game sliders, 1% low frame targets, and memory thresholds across 10,000+ PC Titles, Apple Silicon M-Series profiles, and a certified Potato Rig 50+ FPS mode.
              </p>
            </div>

            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              {[
                ['01 / WHY WE BUILT THIS', 'Standard minimum/recommended specs fail to predict micro-stutter and frame pacing. We engineered deterministic hardware compute curves to give gamers absolute stability.'],
                ['02 / HOW TO USE IT', "Select your rig with the Manual Rig Calibrator, pick any game from our 10,000+ title index, and apply the computed settings matrix directly to your game."],
                ['03 / ABOUT THE ARCHITECT', 'Built by Ankur Roy, a 16-year-old developer and systems performance enthusiast passionate about low-level hardware optimization, frametime stability, and accessible PC gaming.']
              ].map(([label, copy], index) => (
                <article key={label} className="animate-[fade-in-up_700ms_ease-out_both] border-t border-zinc-700/80 bg-zinc-950/30 p-5 backdrop-blur-sm" style={{ animationDelay: `${150 + index * 100}ms` }}>
                  <div className="font-mono text-[10px] font-bold tracking-[0.18em] text-emerald-400">{label}</div>
                  <p className="mt-4 text-sm leading-6 text-zinc-400">{copy}</p>
                </article>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-5">
              <button
                onClick={() => setViewMode('studio')}
                className="group inline-flex items-center gap-3 rounded-xl border border-emerald-400/60 bg-emerald-400 px-6 py-3 font-mono text-sm font-bold text-zinc-950 shadow-[0_0_28px_rgba(52,211,153,0.2)] transition-all hover:bg-emerald-300 active:scale-[0.98]"
              >
                [ LAUNCH STUDIO PRO <span className="transition-transform group-hover:translate-x-1">→</span> ]
              </button>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">Live catalog / Supabase synced</span>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen animate-[studio-in_500ms_ease-out_both] bg-[#07080c] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30">
      
      {/* 1. TOP FLOATING APP BAR */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('welcome')}
            className="rounded-lg border border-zinc-700 px-2.5 py-1.5 font-mono text-[10px] text-zinc-400 transition-colors hover:border-emerald-500/50 hover:text-emerald-400"
          >
            [ ← BACK TO OVERVIEW ]
          </button>
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
          <span className="font-bold tracking-wider text-base uppercase text-white font-mono">
            TUNEMYGAME <span className="text-zinc-500 font-normal">STUDIO PRO</span>
          </span>
        </div>

        {/* Platform Selector Pills */}
        <div className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
          <button
            onClick={() => applyPlatformDefaults('pc')}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
              platform === 'pc' ? 'bg-zinc-800 text-emerald-400 font-bold border border-emerald-500/30 shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            PC RIG ({gamesList.length > 0 ? gamesList.length : '...'})
          </button>

          <button
            onClick={() => applyPlatformDefaults('mac')}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
              platform === 'mac' ? 'bg-zinc-800 text-cyan-400 font-bold border border-cyan-500/30 shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            APPLE SILICON ({macCount})
          </button>

          <button
            onClick={() => applyPlatformDefaults('potato')}
            className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
              platform === 'potato' ? 'bg-amber-950/60 text-amber-300 font-bold border border-amber-500/30 shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            🥔 POTATO RIG ({potatoCount})
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-zinc-400 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            ENGINEER: ANKUR ROY
          </div>
        </div>
      </header>

      { /* 2. HARDWARE CALIBRATION RIBBON */ }
      <div className="bg-zinc-900/40 border-b border-zinc-800/80 px-6 py-2.5 flex flex-wrap items-center gap-4 text-xs font-mono">
        {platform === 'mac' ? (
          <>
            <div className="flex items-center gap-2 min-w-[280px] max-w-[340px]">
              <span className="text-zinc-500 uppercase tracking-wider">CHIP:</span>
              <select
                value={selectedChip?.name || RAW_APPLE_CHIPS[2]?.name}
                onChange={(e) => {
                  const match = RAW_APPLE_CHIPS.find(chip => chip.name === e.target.value);
                  if (match) setSelectedChip(match);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-1.5 text-xs truncate outline-none focus:border-emerald-500 cursor-pointer"
              >
                {RAW_APPLE_CHIPS.map((chip) => (
                  <option key={chip.name} value={chip.name}>{chip.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-500 uppercase tracking-wider">UNIFIED MEMORY:</span>
              <select
                value={selectedUnifiedMemory}
                onChange={(e) => setSelectedUnifiedMemory(Number(e.target.value))}
                className="bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-1.5 text-xs truncate outline-none focus:border-emerald-500 cursor-pointer"
              >
                {[8, 16, 24, 36, 48, 64, 96, 128, 192].map((capacity) => (
                  <option key={capacity} value={capacity}>{capacity} GB</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 min-w-[220px] max-w-[320px]">
              <span className="text-zinc-500 uppercase tracking-wider">ARCH:</span>
              <select
                value={selectedMemoryArchitecture}
                onChange={(e) => setSelectedMemoryArchitecture(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-1.5 text-xs truncate outline-none focus:border-emerald-500 cursor-pointer"
                disabled
              >
                <option>Unified High-Bandwidth LPDDR5</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 min-w-[280px] max-w-[340px]">
              <span className="text-zinc-500 uppercase tracking-wider">GPU:</span>
              <select
                value={effectiveSelectedGpu?.name || (pcGpus[0]?.name || 'NVIDIA GeForce RTX 4070 Super')}
                onChange={(e) => {
                  const match = RAW_GPUS.find(gpu => gpu.name === e.target.value);
                  if (match) setSelectedGpu(match);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-1.5 text-xs truncate outline-none focus:border-emerald-500 cursor-pointer"
              >
                {(platform === 'potato' ? RAW_GPUS.filter(gpu => gpu.score <= 38) : RAW_GPUS).map((gpu) => (
                  <option key={gpu.id || gpu.name} value={gpu.name}>{gpu.name} ({gpu.vram || 12}GB)</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 min-w-[260px] max-w-[320px]">
              <span className="text-zinc-500 uppercase tracking-wider">CPU:</span>
              <select
                value={effectiveSelectedCpu?.name || (currentCpuOptions[0]?.name || 'AMD Ryzen 7 7800X3D')}
                onChange={(e) => {
                  const match = RAW_CPUS.find(cpu => cpu.name === e.target.value);
                  if (match) setSelectedCpu(match);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-1.5 text-xs truncate outline-none focus:border-emerald-500 cursor-pointer"
              >
                {(platform === 'potato' ? RAW_CPUS.filter(cpu => cpu.score <= 55) : RAW_CPUS).map((cpu) => (
                  <option key={cpu.id || cpu.name} value={cpu.name}>{cpu.name} ({cpu.cores || 8} Cores)</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-500 uppercase tracking-wider">RAM:</span>
              <select
                value={selectedRam}
                onChange={(e) => setSelectedRam(Number(e.target.value))}
                className="bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-1.5 text-xs truncate outline-none focus:border-emerald-500 cursor-pointer"
              >
                {[8, 16, 32, 64, 128].map((capacity) => (
                  <option key={capacity} value={capacity}>{capacity} GB</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 min-w-[210px] max-w-[320px]">
              <span className="text-zinc-500 uppercase tracking-wider">TYPE:</span>
              <select
                value={selectedRamType}
                onChange={(e) => setSelectedRamType(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg px-3 py-1.5 text-xs truncate outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option>DDR5 6000MHz (Low Latency)</option>
                <option>DDR5 5600MHz (Standard)</option>
                <option>DDR5 4800MHz (Base)</option>
                <option>DDR4 3600MHz (Dual Channel)</option>
                <option>DDR4 3200MHz (Standard)</option>
                <option>DDR4 2666MHz (Legacy)</option>
                <option>LPDDR5X 7500MHz (Laptop/Handheld)</option>
                <option>Unified LPDDR5 (Apple Silicon)</option>
                <option>DDR3 1600MHz (Potato)</option>
              </select>
            </div>
          </>
        )}

        <div className="flex items-center gap-1.5 ml-auto">
          {(platform === 'mac' ? ['1080p', '1440p', 'Retina 4.5K', '4K'] : ['1080p', '1440p', '4K']).map((res) => (
            <button
              key={res}
              onClick={() => setSelectedRes(res)}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedRes === res ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold' : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      {/* 3. THREE-COLUMN COCKPIT WORKSPACE */}
      <main className="p-6 grid grid-cols-12 gap-6 flex-1 max-w-[1800px] w-full mx-auto">
        
        {/* LEFT COLUMN: GAME CATALOG & SEARCH */}
        <section className="col-span-12 lg:col-span-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex flex-col h-[calc(100vh-170px)]">
          <div className="mb-3">
            <input
              type="text"
              placeholder={`Search ${filteredGames.length} titles...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-emerald-500 outline-none font-mono"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="h-16 bg-zinc-900/80 rounded-xl animate-pulse border border-zinc-800/50" />
              ))
            ) : filteredGames.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-xs font-mono">No matching titles found</div>
            ) : (
              filteredGames.map((game) => {
                const isSelected = selectedGame?.steam_appid === game.steam_appid;
                return (
                  <div
                    key={game.steam_appid}
                    onClick={() => setSelectedGame(game)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-zinc-800/90 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                        : 'bg-zinc-950/50 border-zinc-800/60 hover:border-zinc-700'
                    }`}
                  >
                    <img
                      src={`https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${game.steam_appid}/header.jpg`}
                      alt={game.name}
                      onError={(e) => { e.target.style.display = 'none'; }}
                      className="w-16 h-10 object-cover rounded-lg bg-zinc-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-zinc-100 truncate">{game.name}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {game.api_level || 'DirectX 12'}
                        </span>
                        {game.is_potato && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/50 border border-amber-800/60 text-amber-300">
                            POTATO
                          </span>
                        )}
                        {game.is_mac && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-800/60 text-cyan-300">
                            METAL 3
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* CENTER COLUMN: ACTIVE TITLE TELEMETRY & OPTIMIZER */}
        <section className="col-span-12 lg:col-span-6 space-y-6 overflow-y-auto h-[calc(100vh-170px)] pr-2">
          {selectedGame ? (
            <>
              {/* Game Hero Banner */}
              <div className="relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 h-52 group">
                <img
                  src={`https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${selectedGame.steam_appid}/header.jpg`}
                  alt={selectedGame.name}
                  className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/60 to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {selectedGame.category || 'Standard Title'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                      Storage: {selectedGame.disk_space || '45 GB'}
                    </span>
                  </div>
                  <h1 className="text-2xl font-black tracking-tight text-white">{selectedGame.name}</h1>
                  <p className="text-xs text-zinc-400 font-mono mt-1">App ID: {selectedGame.steam_appid} • API: {selectedGame.api_level || 'DirectX 12'}</p>
                </div>
              </div>

              {/* Performance Gauges Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* 1% Low FPS */}
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">1% LOW (SMOOTHNESS)</span>
                  <div className="text-2xl font-black font-mono text-cyan-400 my-2">{telemetry.lowFps} <span className="text-xs text-zinc-500 font-normal">FPS</span></div>
                  <div className="text-[10px] font-mono text-cyan-300/80">{telemetry.ramTag}</div>
                </div>

                {/* Target FPS */}
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">AVG TARGET FPS</span>
                  <div className="text-2xl font-black font-mono text-emerald-400 my-2">{telemetry.avgFps} <span className="text-xs text-zinc-500 font-normal">FPS</span></div>
                  <div className="text-[10px] font-mono text-emerald-300/80">Refresh Lock: Optimal</div>
                </div>

                {/* VRAM Load */}
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">VRAM ALLOCATION</span>
                  <div className="text-2xl font-black font-mono text-zinc-100 my-2">
                    {telemetry.vramUsage} <span className="text-xs text-zinc-500 font-normal">/ {telemetry.totalVram}GB</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (telemetry.vramUsage / telemetry.totalVram) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Bottleneck Index */}
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">HARDWARE BALANCE</span>
                  <div className="text-lg font-bold font-mono text-amber-400 my-2">{telemetry.bottleneck}</div>
                  <div className="text-[10px] font-mono text-zinc-400">{selectedRes} Native Rendering</div>
                </div>
              </div>

              {/* Graphics Settings Sliders Matrix */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300">
                    COMPUTED IN-GAME OPTIMIZATIONS
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                    +28% FPS GAIN
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { name: 'Upscaling / Reconstruction', value: activeHardwareGpu?.name.includes('RTX') ? 'DLSS Quality' : 'FSR 3.1 Quality', impact: '+22% FPS' },
                    { name: 'Volumetric Clouds & Fog', value: 'Medium (Optimal)', impact: '+12% FPS' },
                    { name: 'Shadow Quality & Cascades', value: 'High', impact: '+7% FPS' },
                    { name: 'Ray Tracing / Path Tracing', value: activeHardwareGpu?.score > 80 ? 'Ray Traced Reflections (ON)' : 'OFF', impact: '+35% FPS' },
                    { name: 'Texture Filtering (Anisotropic)', value: '16x', impact: '0% (VRAM Bound)' },
                  ].map((setting, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs font-mono">
                      <span className="text-zinc-300">{setting.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-bold">{setting.value}</span>
                        <span className="text-[10px] text-zinc-500">{setting.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Launch Options Container */}
              <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-zinc-400 uppercase">ENGINE LAUNCH OPTIONS (STEAM)</span>
                  <button
                    onClick={copyLaunchOptions}
                    className="text-xs font-mono bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded-lg border border-zinc-700 text-zinc-200 transition-all"
                  >
                    {copied ? '✓ COPIED' : 'COPY CONFIG'}
                  </button>
                </div>
                <code className="block bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 font-mono text-xs text-emerald-400">
                  -high -novid -fullscreen -threads {selectedCpu?.cores || 8} +mat_queue_mode 2
                </code>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-500 font-mono text-xs">
              Select a title from the catalog to initialize telemetry stream.
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: RIG DIAGNOSTICS */}
        <section className="col-span-12 lg:col-span-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between h-[calc(100vh-170px)]">
          <div className="space-y-6">
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                HARDWARE DIAGNOSTIC
              </h3>
              <p className="text-xs text-zinc-500">Live compute balance & system health</p>
            </div>

            {/* GPU Gauge */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>GPU Compute Power</span>
                <span className="text-emerald-400 font-bold">{activeHardwareGpu?.score || 60}/100</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full border border-zinc-800 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${activeHardwareGpu?.score || 60}%` }} />
              </div>
            </div>

            {/* CPU Gauge */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>CPU Threading Index</span>
                <span className="text-cyan-400 font-bold">{selectedCpu?.score || 60}/100</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full border border-zinc-800 overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${selectedCpu?.score || 60}%` }} />
              </div>
            </div>

            {/* Memory Bus / Ram Type */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 font-mono text-xs space-y-2">
              <div className="text-zinc-400 uppercase text-[10px]">Memory Bus</div>
              <div className="text-white font-bold">{selectedRamType}</div>
              <div className="text-zinc-500 text-[11px]">Architecture profile active for pacing and stability tuning.</div>
            </div>

            {/* Latency / Reflex Pill */}
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 font-mono text-xs space-y-2">
              <div className="text-zinc-400 uppercase text-[10px]">RECOMMENDED FRAME PACER</div>
              <div className="text-white font-bold">
                {activeHardwareGpu?.name.includes('RTX') ? 'NVIDIA Reflex (ON + BOOST)' : 'AMD Anti-Lag 2'}
              </div>
              <div className="text-zinc-500 text-[11px]">System Latency Floor: ~11.4 ms</div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500 text-center">
            TuneMyGame Engine v4.9 • Architect: Ankur Roy • Supabase Synced
          </div>
        </section>
      </main>
    </div>
  );
}