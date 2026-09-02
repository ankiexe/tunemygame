'use client';

import { useEffect, useMemo, useState } from 'react';
import DiagnosticCard from '@/components/DiagnosticCard';
import { supabase } from '@/lib/supabase';
import { calculateTelemetry } from '@/lib/telemetry-engine';

const FALLBACK_GPU_BENCHMARKS = [
  {
    name: 'Intel UHD 620',
    brand: 'Intel',
    series: 'UHD 620',
    vram_gb: 1,
    relative_perf_score: 18,
  },
  {
    name: 'Apple M1 (8-core GPU)',
    brand: 'Apple',
    series: 'M1',
    vram_gb: 8,
    relative_perf_score: 58,
  },
  {
    name: 'GTX 1050 Ti',
    brand: 'NVIDIA',
    series: 'GTX 1050 Ti',
    vram_gb: 4,
    relative_perf_score: 48,
  },
  {
    name: 'RTX 3060 12GB',
    brand: 'NVIDIA',
    series: 'RTX 3060',
    vram_gb: 12,
    relative_perf_score: 82,
  },
  {
    name: 'RTX 4070',
    brand: 'NVIDIA',
    series: 'RTX 4070',
    vram_gb: 12,
    relative_perf_score: 116,
  },
];

const FALLBACK_CPU_BENCHMARKS = [
  {
    name: 'Core i3-10100',
    brand: 'Intel',
    series: 'Comet Lake',
    cores: 4,
    threads: 8,
    single_thread_score: 115,
    multi_thread_score: 290,
    tdp_watts: 65,
  },
  {
    name: 'Ryzen 5 3600',
    brand: 'AMD',
    series: 'Zen 2',
    cores: 6,
    threads: 12,
    single_thread_score: 146,
    multi_thread_score: 360,
    tdp_watts: 65,
  },
  {
    name: 'Ryzen 5 5600X',
    brand: 'AMD',
    series: 'Zen 3',
    cores: 6,
    threads: 12,
    single_thread_score: 178,
    multi_thread_score: 430,
    tdp_watts: 65,
  },
  {
    name: 'Core i7-13700K',
    brand: 'Intel',
    series: '13th Gen',
    cores: 16,
    threads: 24,
    single_thread_score: 228,
    multi_thread_score: 760,
    tdp_watts: 125,
  },
];

const FALLBACK_GAME_BENCHMARKS = [
  {
    name: 'Valorant',
    base_gpu_req: 25,
    base_cpu_req: 90,
    base_vram_req: 2,
    directx_api: 'DirectX 11',
    storage_gb: 22,
    drive_speed: 'SSD Recommended',
    is_potato: true,
    mac_tier: 'None',
  },
  {
    name: 'Resident Evil Village',
    base_gpu_req: 62,
    base_cpu_req: 140,
    base_vram_req: 8,
    directx_api: 'Metal 3 Native',
    storage_gb: 45,
    drive_speed: 'SSD Required',
    is_potato: false,
    mac_tier: 'Metal 3 Native',
  },
  {
    name: 'Cyberpunk 2077',
    base_gpu_req: 78,
    base_cpu_req: 170,
    base_vram_req: 10,
    directx_api: 'DirectX 12 Ultimate',
    storage_gb: 80,
    drive_speed: 'SSD Required',
    is_potato: false,
    mac_tier: 'None',
  },
];

function normalizeGpuRow(row) {
  if (!row || !row.name) return null;

  const name = String(row.name);
  const brand = row.brand || (name.includes('Intel') ? 'Intel' : name.includes('Apple') ? 'Apple' : name.includes('NVIDIA') ? 'NVIDIA' : name.includes('AMD') ? 'AMD' : 'Unknown');

  return {
    name,
    brand,
    series: row.series || row.generation || name,
    vram_gb: Number(row.vram_gb ?? row.vram ?? row.memory_gb ?? 0),
    relative_perf_score: Number(row.relative_perf_score ?? row.score ?? row.relative_performance ?? row.value ?? 0),
  };
}

function normalizeCpuRow(row) {
  if (!row || !row.name) return null;

  const name = String(row.name);
  const brand = row.brand || (name.includes('Intel') ? 'Intel' : name.includes('AMD') ? 'AMD' : 'Unknown');

  return {
    name,
    brand,
    series: row.series || row.generation || name,
    cores: Number(row.cores ?? row.core_count ?? 0),
    threads: Number(row.threads ?? row.thread_count ?? Math.max(Number(row.cores ?? row.core_count ?? 0) * 2, 1)),
    single_thread_score: Number(row.single_thread_score ?? row.single_core_score ?? row.single_thread ?? row.score ?? 0),
    multi_thread_score: Number(row.multi_thread_score ?? row.multi_core_score ?? row.multi_thread ?? row.multi_core ?? 0),
    tdp_watts: Number(row.tdp_watts ?? row.tdp ?? 65),
  };
}

function normalizeGameRow(row) {
  if (!row || !row.name) return null;

  return {
    name: String(row.name),
    base_gpu_req: Number(row.base_gpu_req ?? row.base_gpu ?? row.gpu_req ?? row.gpu_requirement ?? 0),
    base_cpu_req: Number(row.base_cpu_req ?? row.base_cpu ?? row.cpu_req ?? row.cpu_requirement ?? 0),
    base_vram_req: Number(row.base_vram_req ?? row.base_vram ?? row.vram_req ?? row.vram_requirement ?? 0),
    directx_api: row.directx_api || row.api || row.api_compatibility || 'Unknown',
    storage_gb: Number(row.storage_gb ?? row.storage ?? row.install_size_gb ?? 0),
    drive_speed: row.drive_speed || row.drive_requirement || 'Unknown',
    is_potato: Boolean(row.is_potato ?? row.potato_verified ?? false),
    mac_tier: row.mac_tier || row.mac_support || 'None',
  };
}

export default function HomePage() {
  const [gpuOptions, setGpuOptions] = useState(FALLBACK_GPU_BENCHMARKS);
  const [cpuOptions, setCpuOptions] = useState(FALLBACK_CPU_BENCHMARKS);
  const [gameOptions, setGameOptions] = useState(FALLBACK_GAME_BENCHMARKS);
  const [selectedGpu, setSelectedGpu] = useState(FALLBACK_GPU_BENCHMARKS[3]);
  const [selectedCpu, setSelectedCpu] = useState(FALLBACK_CPU_BENCHMARKS[2]);
  const [selectedGame, setSelectedGame] = useState(FALLBACK_GAME_BENCHMARKS[2]);
  const [ramGb, setRamGb] = useState(16);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadHardwareData() {
      setIsLoading(true);
      setFetchError('');

      try {
        const [gpuResponse, cpuResponse, gamesResponse] = await Promise.all([
          supabase.from('hardware_gpus').select('*').order('name', { ascending: true }).limit(200),
          supabase.from('hardware_cpus').select('*').order('name', { ascending: true }).limit(200),
          supabase.from('games_alphabetical').select('*').limit(100),
        ]);

        if (!active) return;

        const normalizedGpus = (gpuResponse.data ?? []).map(normalizeGpuRow).filter(Boolean);
        const normalizedCpus = (cpuResponse.data ?? []).map(normalizeCpuRow).filter(Boolean);
        const normalizedGames = (gamesResponse.data ?? []).map(normalizeGameRow).filter(Boolean);

        const nextGpuOptions = normalizedGpus.length ? normalizedGpus : FALLBACK_GPU_BENCHMARKS;
        const nextCpuOptions = normalizedCpus.length ? normalizedCpus : FALLBACK_CPU_BENCHMARKS;
        const nextGameOptions = normalizedGames.length ? normalizedGames : FALLBACK_GAME_BENCHMARKS;

        setGpuOptions(nextGpuOptions);
        setCpuOptions(nextCpuOptions);
        setGameOptions(nextGameOptions);

        setSelectedGpu(nextGpuOptions[0] ?? FALLBACK_GPU_BENCHMARKS[3]);
        setSelectedCpu(nextCpuOptions[0] ?? FALLBACK_CPU_BENCHMARKS[2]);
        setSelectedGame(nextGameOptions[0] ?? FALLBACK_GAME_BENCHMARKS[2]);
      } catch (error) {
        console.error('Supabase load failed:', error);
        if (active) {
          setFetchError('Unable to load live Supabase data. Showing fallback benchmarks.');
          setGpuOptions(FALLBACK_GPU_BENCHMARKS);
          setCpuOptions(FALLBACK_CPU_BENCHMARKS);
          setGameOptions(FALLBACK_GAME_BENCHMARKS);
          setSelectedGpu(FALLBACK_GPU_BENCHMARKS[3]);
          setSelectedCpu(FALLBACK_CPU_BENCHMARKS[2]);
          setSelectedGame(FALLBACK_GAME_BENCHMARKS[2]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadHardwareData();

    return () => {
      active = false;
    };
  }, []);

  const telemetry = useMemo(
    () => calculateTelemetry(selectedGpu, selectedCpu, selectedGame, ramGb),
    [selectedGpu, selectedCpu, selectedGame, ramGb]
  );

  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 border-b border-zinc-800 pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            TuneMyGame
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
            Hardware Telemetry Studio
          </h1>
        </header>

        {isLoading && (
          <div className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
              <span>Loading live hardware and game data from Supabase…</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-12 animate-pulse rounded-xl bg-zinc-800/80" />
              ))}
            </div>
          </div>
        )}

        {fetchError && (
          <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
            {fetchError}
          </div>
        )}

        <div className="mb-8 grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 md:grid-cols-4">
          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">Game</span>
            <select
              value={selectedGame?.name ?? ''}
              onChange={(event) => {
                const next = gameOptions.find((game) => game.name === event.target.value);
                if (next) setSelectedGame(next);
              }}
              disabled={isLoading || gameOptions.length === 0}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {gameOptions.map((game) => (
                <option key={game.name} value={game.name}>
                  {game.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">GPU</span>
            <select
              value={selectedGpu?.name ?? ''}
              onChange={(event) => {
                const next = gpuOptions.find((gpu) => gpu.name === event.target.value);
                if (next) setSelectedGpu(next);
              }}
              disabled={isLoading || gpuOptions.length === 0}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {gpuOptions.map((gpu) => (
                <option key={gpu.name} value={gpu.name}>
                  {gpu.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">CPU</span>
            <select
              value={selectedCpu?.name ?? ''}
              onChange={(event) => {
                const next = cpuOptions.find((cpu) => cpu.name === event.target.value);
                if (next) setSelectedCpu(next);
              }}
              disabled={isLoading || cpuOptions.length === 0}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cpuOptions.map((cpu) => (
                <option key={cpu.name} value={cpu.name}>
                  {cpu.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">RAM</span>
            <select
              value={ramGb}
              onChange={(event) => setRamGb(Number(event.target.value))}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-emerald-500"
            >
              {[8, 16, 32, 64].map((gb) => (
                <option key={gb} value={gb}>
                  {gb} GB
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-2xl shadow-black/30">
          <DiagnosticCard
            result={telemetry}
            game={selectedGame}
            gpu={selectedGpu}
            cpu={selectedCpu}
          />
        </div>
      </div>
    </main>
  );
}
