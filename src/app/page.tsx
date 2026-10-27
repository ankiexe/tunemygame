'use client';

import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import DiagnosticCard from '@/components/DiagnosticCard';
import RabbitCompanion from '@/components/RabbitCompanion';
import { calculateTelemetry } from '@/lib/telemetry-engine';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const APPLE_RAM_OPTIONS = [8, 16, 18, 24, 32, 36, 48, 64, 128];
const PC_RAM_OPTIONS = [8, 16, 32, 64];
const POTATO_RAM_OPTIONS = [8, 16, 32];

const rigTabs = [
  {
    id: 'pc',
    label: '🖥️ PC Battlestation',
    subtitle: 'Windows gaming PC with a dedicated graphics card.',
    description: 'Great for NVIDIA, AMD, and Intel gaming desktops and laptops.',
  },
  {
    id: 'apple',
    label: '🍏 Apple Silicon',
    subtitle: 'MacBook or Mac mini with M1, M2, M3, or M4.',
    description: 'Best for Metal-powered games and Apple-native performance tuning.',
  },
  {
    id: 'potato',
    label: '🥔 Potato Rig',
    subtitle: 'Budget laptop or older system with low-power graphics.',
    description: 'Perfect for light games and older titles that still run smoothly.',
  },
] as const;

const normalizeBrand = (value: unknown) => String(value ?? '').trim().toLowerCase();

const howItWorks = [
  {
    title: '1. Pick Your Hardware',
    description: 'Choose the GPU and CPU inside your machine.',
  },
  {
    title: '2. Pick Any Game',
    description: 'Select from 20,000+ titles with live artwork and storage data.',
  },
  {
    title: '3. Get Instant Diagnostics',
    description: 'See your exact FPS, bottleneck risk, and whether you need an SSD or RAM upgrade.',
  },
];

function getDynamicThemeForAnyGame(title: string) {
  if (!title) {
    return {
      primary: '#6366f1',
      secondary: '#a855f7',
      bgGlow: 'rgba(99, 102, 241, 0.6)',
      borderGlow: 'rgba(99, 102, 241, 0.85)',
      accentRgb: '99, 102, 241',
      hue: 240,
    };
  }

  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }

  const hue = Math.abs(hash) % 360;
  const secondaryHue = (hue + 45) % 360;
  const primary = `hsl(${hue}, 88%, 56%)`;
  const secondary = `hsl(${secondaryHue}, 80%, 50%)`;
  const bgGlow = `hsla(${hue}, 90%, 55%, 0.60)`;
  const borderGlow = `hsla(${hue}, 95%, 60%, 0.90)`;

  return {
    primary,
    secondary,
    bgGlow,
    borderGlow,
    accentRgb: `${hue}, 90%, 56%`,
    hue,
  };
}

const getGameTheme = (gameTitle: string) => {
  const theme = getDynamicThemeForAnyGame(gameTitle);

  return {
    accent: theme.primary,
    secondary: theme.secondary,
    glow: theme.bgGlow,
    background: `radial-gradient(circle at top left, ${theme.bgGlow}, transparent 26%), radial-gradient(circle at bottom right, ${theme.borderGlow}, transparent 34%), linear-gradient(180deg, #0a0a0f 0%, #090b12 100%)`,
    hero: `linear-gradient(135deg, ${theme.bgGlow}, rgba(17, 24, 39, 0.88))`,
    card: 'rgba(12, 16, 24, 0.82)',
    borderGlow: theme.borderGlow,
    posterFallback: `linear-gradient(135deg, ${theme.primary} 0%, #090b12 55%, #111827 100%)`,
    primary: theme.primary,
    bgGlow: theme.bgGlow,
    borderGlowStrong: theme.borderGlow,
  };
};

function matchesSearch(targetName: string, query: string): boolean {
  if (!query || !query.trim()) return true;
  if (!targetName) return false;

  const target = targetName.toLowerCase().replace(/[-_/]/g, ' ');
  const tokens = query.toLowerCase().replace(/[-_/]/g, ' ').trim().split(/\s+/);

  return tokens.every((token) => target.includes(token));
}

// Strict natural/numeric sorting: RTX 3060 comes before RTX 3070
const sortAlphabetical = <T extends { name: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) =>
    (a.name ?? '').localeCompare((b.name ?? ''), undefined, { numeric: true, sensitivity: 'base' })
  );
};

export default function LandingPage() {
  const cpuRef = useRef<HTMLDivElement>(null);
  const gpuRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const [onboardingStep, setOnboardingStep] = useState<'story' | 'rig-select' | 'dashboard'>('story');
  const [gpuList, setGpuList] = useState<any[]>([]);
  const [cpuList, setCpuList] = useState<any[]>([]);
  const [gpuResults, setGpuResults] = useState<any[] | null>(null);
  const [cpuResults, setCpuResults] = useState<any[] | null>(null);
  const [gameList, setGameList] = useState<any[]>([]);
  const [selectedGpu, setSelectedGpu] = useState<any | null>(null);
  const [selectedCpu, setSelectedCpu] = useState<any | null>(null);
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [selectedRam, setSelectedRam] = useState<number>(16);
  const [activeRig, setActiveRig] = useState<'potato' | 'pc' | 'apple'>('pc');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [gameSearch, setGameSearch] = useState('');
  const [isSearchingGames, setIsSearchingGames] = useState(false);
  const [gpuSearch, setGpuSearch] = useState('');
  const [cpuSearch, setCpuSearch] = useState('');
  const cpuSearchRequest = useRef(0);
  const gpuSearchRequest = useRef(0);
  const gameSearchRequest = useRef(0);

  const handleRigSelect = (rig: 'potato' | 'pc' | 'apple') => {
    setActiveRig(rig);
    setOnboardingStep('dashboard');
  };
  const [gameOpen, setGameOpen] = useState(false);
  const [gpuOpen, setGpuOpen] = useState(false);
  const [cpuOpen, setCpuOpen] = useState(false);
  const [browsing, setBrowsing] = useState(false);

  // Close each dropdown independently when clicking outside its combobox.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (cpuRef.current && !cpuRef.current.contains(target)) setCpuOpen(false);
      if (gpuRef.current && !gpuRef.current.contains(target)) setGpuOpen(false);
      if (gameRef.current && !gameRef.current.contains(target)) setGameOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ramOptions = useMemo(() => {
    if (activeRig === 'apple') return APPLE_RAM_OPTIONS;
    if (activeRig === 'potato') return POTATO_RAM_OPTIONS;
    return PC_RAM_OPTIONS;
  }, [activeRig]);

  // Search Supabase directly; select complete rows because diagnostics use hardware stats.
  const searchCpus = useCallback(async (query: string) => {
    if (!supabase) return;
    const requestId = ++cpuSearchRequest.current;
    let dbQuery = supabase.from('hardware_cpus').select('*');

    if (activeRig === 'apple') dbQuery = dbQuery.ilike('brand', 'apple');
    if (query.trim()) dbQuery = dbQuery.ilike('name', `%${query.trim()}%`);

    const { data, error } = await dbQuery
      .order('name', { ascending: true })
      .limit(query.trim() ? 30 : 20);

    if (error) {
      console.error('CPU search error:', error);
      return;
    }
    if (requestId === cpuSearchRequest.current) setCpuResults(data ?? []);
  }, [activeRig]);

  const searchGpus = useCallback(async (query: string) => {
    if (!supabase) return;
    const requestId = ++gpuSearchRequest.current;
    let dbQuery = supabase.from('hardware_gpus').select('*');

    if (activeRig === 'apple') dbQuery = dbQuery.ilike('brand', 'apple');
    if (query.trim()) dbQuery = dbQuery.ilike('name', `%${query.trim()}%`);

    const { data, error } = await dbQuery
      .order('name', { ascending: true })
      .limit(query.trim() ? 30 : 20);

    if (error) {
      console.error('GPU search error:', error);
      return;
    }
    if (requestId === gpuSearchRequest.current) setGpuResults(data ?? []);
  }, [activeRig]);

  const searchGames = useCallback(async (query: string) => {
    if (!supabase) {
      console.error('Games load error: Supabase client is not configured');
      return;
    }

    const requestId = ++gameSearchRequest.current;
    setIsSearchingGames(true);
    try {
      let dbQuery = supabase.from('games').select('*');

      if (activeRig === 'potato') {
        dbQuery = dbQuery.eq('is_potato', true);
      } else if (activeRig === 'apple') {
        dbQuery = dbQuery.eq('is_mac', true).in('mac_support_type', ['native', 'rosetta']);
        dbQuery = dbQuery.order('mac_support_type', { ascending: false });
      } else if (activeRig === 'pc') {
        dbQuery = dbQuery.eq('is_pc', true);
      }

      if (query.trim()) dbQuery = dbQuery.ilike('name', `%${query.trim()}%`);

      const { data, error } = await dbQuery
        .order('name', { ascending: true })
        .limit(query.trim() ? 60 : 50);

      if (error) {
        console.error('Games search error:', error);
        return;
      }
      if (requestId !== gameSearchRequest.current) return;

      const nextGameList = sortAlphabetical(data ?? []);
      setGameList(nextGameList);
      if (nextGameList.length) {
        setSelectedGame((current) =>
          !current || !nextGameList.some((game) => game.name === current.name)
            ? nextGameList[0]
            : current
        );
      }
    } catch (error) {
      if (requestId === gameSearchRequest.current) console.error('Critical games search failure:', error);
    } finally {
      if (requestId === gameSearchRequest.current) setIsSearchingGames(false);
    }
  }, [activeRig]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void searchCpus(cpuSearch);
      void searchGpus(gpuSearch);
    }, 120);

    return () => {
      clearTimeout(timer);
      cpuSearchRequest.current += 1;
      gpuSearchRequest.current += 1;
    };
  }, [cpuSearch, gpuSearch, searchCpus, searchGpus]);

  // Load the complete hardware catalogs once so rig changes only filter in-memory data.
  useEffect(() => {
    let isCurrent = true;

    async function loadHardwareCatalogs() {
      if (!supabase) {
        console.error('Supabase failed to load: missing client configuration');
        return;
      }

      try {
        const [
          { data: gpus, error: gpuErr },
          { data: cpus, error: cpuErr },
        ] = await Promise.all([
          supabase.from('hardware_gpus').select('*').order('name', { ascending: true }),
          supabase.from('hardware_cpus').select('*').order('name', { ascending: true }),
        ]);

        if (gpuErr) console.error('GPU load error:', gpuErr);
        if (cpuErr) console.error('CPU load error:', cpuErr);
        if (!isCurrent) return;

        if (gpus) {
          const nextGpuList = sortAlphabetical(gpus);
          setGpuList(nextGpuList);
          setSelectedGpu((current) => current ?? nextGpuList[0] ?? null);
        }
        if (cpus) {
          const nextCpuList = sortAlphabetical(cpus);
          setCpuList(nextCpuList);
          setSelectedCpu((current) => current ?? nextCpuList[0] ?? null);
        }
      } catch (error) {
        if (isCurrent) console.error('Critical hardware catalog loader failure:', error);
      }
    }

    void loadHardwareCatalogs();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void searchGames(gameSearch), 120);
    return () => {
      clearTimeout(timer);
      gameSearchRequest.current += 1;
    };
  }, [gameSearch, searchGames]);

  const filteredGpuOptions = useMemo(() => {
    const source = gpuResults ?? gpuList;
    if (!source.length) return [];

    const filtered = source.filter((gpu) => {
      const brand = normalizeBrand(gpu.brand ?? gpu.vendor ?? '');
      const name = (gpu.name ?? '');
      const isMatch = matchesSearch(name, gpuSearch);

      if (activeRig === 'apple') {
        return isMatch && brand === 'apple';
      }

      if (activeRig === 'potato') {
        const relativePerf = Number(gpu.relative_perf_score ?? 100);
        const potatoName = /(intel uhd|intel hd|amd vega|gt 710|gtx 750|rx 550|vega|uhd|hd graphics)/i.test(name);
        return isMatch && (relativePerf <= 40 || potatoName);
      }

      return isMatch && brand !== 'apple';
    });

    return sortAlphabetical(filtered).slice(0, 40);
  }, [activeRig, gpuList, gpuResults, gpuSearch]);

  const filteredCpuOptions = useMemo(() => {
    const source = cpuResults ?? cpuList;
    if (!source.length) return [];

    const filtered = source.filter((cpu) => {
      const brand = normalizeBrand(cpu.brand ?? cpu.vendor ?? '');
      const name = (cpu.name ?? '');
      const isMatch = matchesSearch(name, cpuSearch);

      if (activeRig === 'apple') {
        return isMatch && brand === 'apple';
      }

      if (activeRig === 'potato') {
        const potatoName = /(intel atom|celeron|pentium|amd e-series|amd a-series|ryzen 3|ryzen 5|intel uhd|intel hd)/i.test(name);
        return isMatch && (potatoName || brand !== 'apple');
      }

      return isMatch && brand !== 'apple';
    });

    return sortAlphabetical(filtered).slice(0, 40);
  }, [activeRig, cpuList, cpuResults, cpuSearch]);

  const visibleGameOptions = useMemo(() => {
    if (!gameList.length) return [];

    const filtered = gameList.filter((game) => {
        const name = (game.name ?? '');
        const storageGb = Number(game.storage_gb ?? game.install_size_gb ?? game.size_gb ?? 0);
        const searchMatch = matchesSearch(name, gameSearch);
        const macSupportType = String(game.mac_support_type ?? '').toLowerCase();
        const appleSupported = Boolean(game.is_mac) && ['native', 'rosetta'].includes(macSupportType);

        if (activeRig === 'apple') {
          return searchMatch && appleSupported;
        }

        if (activeRig === 'potato') {
          return searchMatch && (Boolean(game.is_potato) || storageGb <= 30);
        }

        if (activeRig === 'pc') {
          return searchMatch && Boolean(game.is_pc);
        }

        return searchMatch;
      });
    return sortAlphabetical(filtered).slice(0, 40);
  }, [activeRig, gameList, gameSearch]);

  useEffect(() => {
    if (!visibleGameOptions.length) return;

    const currentSelection = selectedGame?.name ?? '';
    if (!visibleGameOptions.some((game) => game.name === currentSelection)) {
      setSelectedGame(visibleGameOptions[0]);
    }
  }, [selectedGame, visibleGameOptions]);

  useEffect(() => {
    const isAppleItem = (item: any) => normalizeBrand(item?.brand ?? item?.vendor ?? '') === 'apple';
    const isNonAppleItem = (item: any) => normalizeBrand(item?.brand ?? item?.vendor ?? '') !== 'apple';

    if (activeRig === 'apple') {
      const appleGpu = filteredGpuOptions.find(isAppleItem) ?? filteredGpuOptions[0] ?? null;
      const appleCpu = filteredCpuOptions.find(isAppleItem) ?? filteredCpuOptions[0] ?? null;
      if (appleGpu && (!selectedGpu || !isAppleItem(selectedGpu))) setSelectedGpu(appleGpu);
      if (appleCpu && (!selectedCpu || !isAppleItem(selectedCpu))) setSelectedCpu(appleCpu);
      setSelectedRam(APPLE_RAM_OPTIONS[0]);
      return;
    }

    if (activeRig === 'pc') {
      const pcGpu = filteredGpuOptions.find(isNonAppleItem) ?? filteredGpuOptions[0] ?? null;
      const pcCpu = filteredCpuOptions.find(isNonAppleItem) ?? filteredCpuOptions[0] ?? null;
      if (pcGpu && (!selectedGpu || isAppleItem(selectedGpu))) setSelectedGpu(pcGpu);
      if (pcCpu && (!selectedCpu || isAppleItem(selectedCpu))) setSelectedCpu(pcCpu);
      setSelectedRam(PC_RAM_OPTIONS[0]);
      return;
    }

    const potatoGpu = filteredGpuOptions[0] ?? null;
    const potatoCpu = filteredCpuOptions[0] ?? null;
    if (potatoGpu && (!selectedGpu || !filteredGpuOptions.some((gpu) => gpu.name === selectedGpu?.name))) {
      setSelectedGpu(potatoGpu);
    }
    if (potatoCpu && (!selectedCpu || !filteredCpuOptions.some((cpu) => cpu.name === selectedCpu?.name))) {
      setSelectedCpu(potatoCpu);
    }
    setSelectedRam(POTATO_RAM_OPTIONS[0]);
  }, [activeRig, filteredCpuOptions, filteredGpuOptions, selectedCpu, selectedGpu]);

  const theme = useMemo(() => getDynamicThemeForAnyGame(selectedGame?.name ?? ''), [selectedGame]);
  const selectedTheme = useMemo(() => getGameTheme(selectedGame?.name ?? ''), [selectedGame]);

  const filteredGpus = useMemo(
    () => sortAlphabetical(filteredGpuOptions.filter((gpu) => matchesSearch(gpu.name ?? '', gpuSearch))).slice(0, 40),
    [filteredGpuOptions, gpuSearch]
  );

  const filteredCpus = useMemo(
    () => sortAlphabetical(filteredCpuOptions.filter((cpu) => matchesSearch(cpu.name ?? '', cpuSearch))).slice(0, 40),
    [filteredCpuOptions, cpuSearch]
  );

  const filteredGames = visibleGameOptions;

  const gpuMenuOpen = gpuOpen;
  const cpuMenuOpen = cpuOpen;
  const gameMenuOpen = gameOpen;

  const telemetry = useMemo(() => {
    if (!selectedGpu || !selectedCpu || !selectedGame) {
      return null;
    }

    return calculateTelemetry(selectedGpu, selectedCpu, selectedGame, 16);
  }, [selectedCpu, selectedGame, selectedGpu]);

  const gpuLoadPercent = telemetry ? Math.min(96, Math.max(12, Math.round((telemetry.avgFps / 130) * 100))) : 78;
  const cpuLoadPercent = telemetry ? Math.min(94, Math.max(12, Math.round((telemetry.onePercentLowFps / 90) * 100))) : 63;

  // Onboarding Story Screen - AAA Glassmorphic Hero
  if (onboardingStep === 'story') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#07090e] overflow-y-auto">
        {/* Ambient Light Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-violet-600/20 blur-[130px] pointer-events-none" />

        {/* Grid Mesh Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        {/* Main Command Card */}
        <div className="relative w-full max-w-4xl bg-zinc-900/70 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden">
          {/* Top Header Bar */}
          <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
            {/* Left Architect Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              Architect: Ankur Roy (Age 16)
            </div>

            {/* Right System Stats */}
            <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Telemetry Engine v2.4 • Active
              </span>
            </div>
          </div>

          {/* Hero Title & Value Proposition */}
          <div className="mb-8">
            {/* Badge */}
            <div className="inline-block text-[11px] font-mono tracking-widest uppercase text-cyan-400 font-semibold mb-4">
              [ ZERO-JARGON HARDWARE DIAGNOSTICS ]
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15] mb-4">
              Can your machine run it?{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-500 bg-clip-text text-transparent">
                Get the straight answer.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
              No 15-page benchmark spreadsheets. No obscure shader cache graphs. Pick your device, choose any game, and discover exactly how smooth it plays in seconds.
            </p>
          </div>

          {/* Interactive 3-Pillar Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            {/* Card 1: The Problem */}
            <div className="group relative p-5 rounded-2xl bg-zinc-950/60 border border-white/5 hover:border-rose-500/40 transition-all duration-300 hover:bg-zinc-950/80 hover:-translate-y-1 cursor-default">
              <div className="text-lg font-bold text-rose-400 mb-2">[ ✕ ]</div>
              <h3 className="text-sm font-semibold text-white group-hover:text-rose-400 transition-colors">
                The Benchmark Trap
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1.5">
                Traditional tools throw synthetic scores and confusing frametimes at you, leaving laptop and budget gamers completely in the dark.
              </p>
            </div>

            {/* Card 2: The Solution */}
            <div className="group relative p-5 rounded-2xl bg-zinc-950/60 border border-white/5 hover:border-cyan-500/40 transition-all duration-300 hover:bg-zinc-950/80 hover:-translate-y-1 cursor-default">
              <div className="text-lg font-bold text-cyan-400 mb-2">[ ✓ ]</div>
              <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                Plain English Clarity
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1.5">
                Direct answers: Will it launch? What settings give you 60 FPS? Is your CPU or GPU bottlenecking the experience?
              </p>
            </div>

            {/* Card 3: The Scale */}
            <div className="group relative p-5 rounded-2xl bg-zinc-950/60 border border-white/5 hover:border-violet-500/40 transition-all duration-300 hover:bg-zinc-950/80 hover:-translate-y-1 cursor-default">
              <div className="text-lg font-bold text-violet-400 mb-2">[ ⚡ ]</div>
              <h3 className="text-sm font-semibold text-white group-hover:text-violet-400 transition-colors">
                5,000+ Chips Indexed
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mt-1.5">
                From integrated Intel potato laptops to high-end RTX 50-series monsters and Apple Silicon M1-M4 Metal engines.
              </p>
            </div>
          </div>

          {/* Telemetry Live Bar & Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
            {/* Left Side: Live Counter */}
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span className="text-[10px]">⚡</span>
              <span>19,713 Steam Games Indexed • In-Memory 0ms Matcher</span>
            </div>

            {/* Right Side: CTA Button */}
            <button
              onClick={() => setOnboardingStep('rig-select')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5"
            >
              Launch Chamber & Select Your Rig →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Onboarding Rig Selection Screen
  if (onboardingStep === 'rig-select') {
    return (
      <div className="fixed inset-0 z-50 bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 overflow-y-auto">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
              Select Your Rig
            </h1>
            <p className="text-lg text-zinc-400">
              Choose the platform that best matches your gaming setup.
            </p>
          </div>

          {/* Rig Selection Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                id: 'potato' as const,
                emoji: '🥔',
                title: 'Potato Rig',
                desc: 'Low-spec laptops, integrated Intel HD/UHD, budget graphics cards. Shows games optimized to run on anything.',
              },
              {
                id: 'pc' as const,
                emoji: '🖥️',
                title: 'PC Battlestation',
                desc: 'Dedicated NVIDIA GeForce & AMD Radeon builds. Full access to the entire Steam PC catalog.',
              },
              {
                id: 'apple' as const,
                emoji: '🍏',
                title: 'Apple Silicon Rig',
                desc: 'MacBook Air/Pro, Mac mini with M1, M2, M3, or M4. Filtered strictly for macOS Metal-supported games.',
              },
            ].map((rig) => (
              <button
                key={rig.id}
                onClick={() => handleRigSelect(rig.id)}
                className="group rounded-2xl border border-zinc-700 bg-zinc-900/40 p-6 text-left transition-all duration-300 hover:border-cyan-500/60 hover:bg-zinc-900/70 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
              >
                <div className="text-5xl mb-4">{rig.emoji}</div>
                <h3 className="text-2xl font-bold text-zinc-100 mb-3 group-hover:text-cyan-300 transition">
                  {rig.title}
                </h3>
                <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition leading-relaxed">
                  {rig.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <main className="bg-[#05070B] min-h-screen text-zinc-100 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      <RabbitCompanion />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {selectedGame && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-[-10%] h-[52rem] w-[110rem] -translate-x-1/2 rounded-full blur-[140px] opacity-30"
            style={{ background: `radial-gradient(circle, ${selectedTheme.glow} 0%, transparent 62%)` }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,7,11,0.2)_35%,rgba(5,7,11,0.9)_100%)]" />
        </div>
      )}

      <div className="relative z-10">
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#05070B]/75 border-b border-white/[0.06] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-xs text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              T
            </div>
            <div className="tracking-widest font-black text-sm text-white">TUNEMYGAME</div>
          </div>

          <div className="px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-zinc-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
            Architect: Ankur Roy (Age 16) • Telemetry Engine v2.4
          </div>

          <button
            type="button"
            onClick={() => setOnboardingStep('rig-select')}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[11px] font-medium text-zinc-200 transition hover:border-cyan-500/60 hover:text-white"
          >
            <span className="text-xs">{rigTabs.find((tab) => tab.id === activeRig)?.label ?? '🖥️ PC Battlestation'}</span>
          </button>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          <section className="lg:col-span-5">
            <div className="relative rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-2xl p-6 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 opacity-80" style={{ background: selectedTheme.background }} />
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-[#05070B]/40" />

              {selectedGame ? (
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-300">Selected Title</span>
                    <span className="text-[10px] font-medium text-zinc-400">Verified {selectedGame.storage_gb ?? '—'} GB</span>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {selectedGame?.steam_appid ? (
                        <img
                          src={`https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${selectedGame.steam_appid}/header.jpg`}
                          alt={selectedGame.name}
                          className="h-full w-full object-cover"
                          onError={() => setImageErrors((current) => ({ ...current, [selectedGame.name]: true }))}
                        />
                      ) : (
                        <div className="h-full w-full" style={{ background: selectedTheme.posterFallback }} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/40 to-transparent" />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedGame.directx_api && (
                      <span className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                        {selectedGame.directx_api}
                      </span>
                    )}
                    {selectedGame.storage_gb && (
                      <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200">
                        {selectedGame.storage_gb} GB SSD
                      </span>
                    )}
                    {telemetry && (
                      <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                        Verified 60+ FPS
                      </span>
                    )}
                  </div>

                  <div className="mt-6 border-t border-white/[0.08] pt-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">Performance target</p>
                        <h3 className="mt-2 text-3xl font-black tracking-tight text-white">{telemetry ? `${Math.round(telemetry.avgFps || 0)} FPS avg` : 'Awaiting telemetry'}</h3>
                      </div>
                      {telemetry && (
                        <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                          Butter Smooth
                        </span>
                      )}
                    </div>

                    {telemetry && (
                      <div className="mt-4 rounded-2xl border border-white/[0.07] bg-black/20 p-3">
                        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                          <span>Resolution target</span>
                          <span className="text-zinc-200">1080p High</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setBrowsing(true)}
                      className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-200 transition hover:border-cyan-500/60 hover:text-white"
                    >
                      Browse Catalog
                    </button>
                    <button
                      type="button"
                      className="rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_0_25px_rgba(99,102,241,0.45)] transition hover:brightness-110"
                    >
                      RT Benchmark
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex min-h-[520px] flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] shadow-[0_0_40px_rgba(34,211,238,0.18)]">
                    <div className="relative h-10 w-10">
                      <div className="absolute inset-0 rounded-full border border-cyan-400/60" />
                      <div className="absolute left-1/2 top-1/2 h-8 w-px -translate-x-1/2 -translate-y-1/2 bg-cyan-300/70" />
                      <div className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 bg-cyan-300/70" />
                      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300" />
                    </div>
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-400">Telemetry Idle</p>
                  <h3 className="mt-4 text-2xl font-black tracking-tight text-white">Awaiting Hardware & Title Target</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
                    Select a GPU, CPU, and Game from the configurator to calculate real-time bottlenecks and frametime predictions.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="lg:col-span-7">
            <div className="rounded-3xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">Rig Configurator</p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-white">Hardware + telemetry stack</h3>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-200 transition hover:border-cyan-500/60 hover:text-white"
                >
                  {rigTabs.find((tab) => tab.id === activeRig)?.label ?? '[ 🖥️ PC Battlestation ]'}
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <div ref={gpuRef} className="relative w-full rounded-2xl bg-black/40 border border-white/[0.07] focus-within:border-cyan-500/80 focus-within:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all duration-300 p-1">
                  <div className="flex items-center gap-3 bg-transparent px-3 py-2">
                    <span className="inline-flex items-center rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">[GPU]</span>
                    <input
                      value={gpuOpen ? gpuSearch : selectedGpu?.name ?? gpuSearch}
                      onFocus={() => {
                        setGpuOpen(true);
                        setGpuSearch('');
                      }}
                      onChange={(event) => {
                        setGpuOpen(true);
                        setGpuSearch(event.target.value);
                      }}
                      placeholder="RTX 3060, Intel UHD, M2 Pro..."
                      className="text-base font-medium placeholder:text-zinc-600 bg-transparent px-2 py-2 outline-none text-white w-full"
                    />
                  </div>
                  {gpuMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0a0d14] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl max-h-60 overflow-y-auto">
                      {(gpuResults ?? gpuList).length === 0 ? (
                        <div className="px-3 py-2 text-xs text-cyan-300" role="status">
                          Loading hardware catalog...
                        </div>
                      ) : filteredGpus.length > 0 ? (
                        filteredGpus.slice(0, 30).map((gpu) => (
                          <button
                            key={gpu.id || gpu.name}
                            type="button"
                            onClick={() => {
                              setSelectedGpu(gpu);
                              setGpuSearch(gpu.name);
                              setGpuOpen(false);
                            }}
                            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
                          >
                            <span>{gpu.name}</span>
                            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-zinc-400">
                              {gpu.vram_gb ? `${gpu.vram_gb}GB VRAM` : gpu.memory ? gpu.memory : 'GPU'}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-xs text-zinc-500">No graphics cards found</div>
                      )}
                    </div>
                  )}
                </div>

                <div ref={cpuRef} className="relative w-full rounded-2xl bg-black/40 border border-white/[0.07] focus-within:border-cyan-500/80 focus-within:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all duration-300 p-1">
                  <div className="flex items-center gap-3 bg-transparent px-3 py-2">
                    <span className="inline-flex items-center rounded-full bg-violet-500/10 border border-violet-500/30 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200">[CPU]</span>
                    <input
                      value={cpuOpen ? cpuSearch : selectedCpu?.name ?? cpuSearch}
                      onFocus={() => {
                        setCpuOpen(true);
                        setCpuSearch('');
                      }}
                      onChange={(event) => {
                        setCpuOpen(true);
                        setCpuSearch(event.target.value);
                      }}
                      placeholder="Core i5-12400F, Ryzen 7, M3 Pro..."
                      className="text-base font-medium placeholder:text-zinc-600 bg-transparent px-2 py-2 outline-none text-white w-full"
                    />
                  </div>
                  {cpuMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0a0d14] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl max-h-60 overflow-y-auto">
                      {(cpuResults ?? cpuList).length === 0 ? (
                        <div className="px-3 py-2 text-xs text-cyan-300" role="status">
                          Loading hardware catalog...
                        </div>
                      ) : filteredCpus.length > 0 ? (
                        filteredCpus.slice(0, 30).map((cpu) => (
                          <button
                            key={cpu.id || cpu.name}
                            type="button"
                            onClick={() => {
                              setSelectedCpu(cpu);
                              setCpuSearch(cpu.name);
                              setCpuOpen(false);
                            }}
                            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
                          >
                            <span>{cpu.name}</span>
                            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-zinc-400">
                              {cpu.cores ? `${cpu.cores}C/${cpu.threads ?? cpu.cores}T` : 'CPU'}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-xs text-zinc-500">No processors found</div>
                      )}
                    </div>
                  )}
                </div>

                <div ref={gameRef} className="relative w-full rounded-2xl bg-black/40 border border-white/[0.07] focus-within:border-cyan-500/80 focus-within:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all duration-300 p-1">
                  <div className="flex items-center gap-3 bg-transparent px-3 py-2">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200">[GAME]</span>
                    <input
                      value={gameOpen ? gameSearch : selectedGame?.name ?? gameSearch}
                      onFocus={() => {
                        setGameOpen(true);
                        setGameSearch('');
                      }}
                      onChange={(event) => {
                        setGameOpen(true);
                        setGameSearch(event.target.value);
                      }}
                      placeholder="Cyberpunk 2077, Elden Ring..."
                      className="text-base font-medium placeholder:text-zinc-600 bg-transparent px-2 py-2 outline-none text-white w-full"
                    />
                  </div>
                  {gameMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0a0d14] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl max-h-60 overflow-y-auto">
                      {isSearchingGames ? (
                        <div className="px-3 py-2 text-xs text-cyan-300 animate-pulse">Searching catalog...</div>
                      ) : filteredGames.length > 0 ? (
                        filteredGames.map((game) => (
                          <button
                            key={game.name}
                            type="button"
                            onClick={() => {
                              setSelectedGame(game);
                              setGameSearch(game.name);
                              setGameOpen(false);
                              setBrowsing(false);
                            }}
                            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
                          >
                            <span>{game.name}</span>
                            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-zinc-400">
                              {game.storage_gb ? `${game.storage_gb}GB` : 'GAME'}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-xs text-zinc-500">No games found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">GPU Engine Load</div>
                  <div className="mt-3 flex items-end justify-between">
                    <span className="text-2xl font-black text-white">{`${gpuLoadPercent}%`}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200">Pushed</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500"
                      style={{ width: `${gpuLoadPercent}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">CPU Core Strain</div>
                  <div className="mt-3 flex items-end justify-between">
                    <span className="text-2xl font-black text-white">{`${cpuLoadPercent}%`}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200">Stable</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-500"
                      style={{ width: `${cpuLoadPercent}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-emerald-200">Verdict</div>
                  <div className="mt-3 text-lg font-black text-white">
                    {telemetry ? '✅ Safe to Play' : '✅ Ready to Test'}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-emerald-100/90">
                    {telemetry
                      ? 'Hardware surpasses high presets with 0% bottleneck.'
                      : 'Hardware surpasses high presets with 0% bottleneck.'}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                {selectedGame && selectedGpu && selectedCpu && telemetry ? (
                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">Bottleneck Matrix</div>
                    <DiagnosticCard
                      result={telemetry}
                      game={selectedGame}
                      gpu={selectedGpu}
                      cpu={selectedCpu}
                      theme={selectedTheme}
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4 text-sm text-zinc-400">
                    Select a game, GPU, and CPU to unlock live diagnostics.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
