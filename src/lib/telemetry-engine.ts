export interface HardwareGPU {
  name: string;
  brand: string;
  series: string;
  vram_gb: number;
  relative_perf_score: number;
}

export interface HardwareCPU {
  name: string;
  brand: string;
  series: string;
  cores: number;
  threads: number;
  single_thread_score: number;
  multi_thread_score: number;
  tdp_watts?: number;
}

export interface GameRequirement {
  name: string;
  base_gpu_req: number; // baseline target perf score
  base_cpu_req: number; // baseline single-thread score
  base_vram_req: number;
  directx_api: string;
  storage_gb: number;
  drive_speed: string;
  is_potato: boolean;
  mac_tier: string;
}

export interface DiagnosticResult {
  avgFps: number;
  onePercentLowFps: number;
  bottleneckPercent: number;
  bottleneckComponent: 'CPU' | 'GPU' | 'Balanced';
  throttleProbability: number;
  recommendedUpgrade: string;
  storageWarning?: string;
  apiCompatStatus: string;
}

export function calculateTelemetry(
  gpu: HardwareGPU,
  cpu: HardwareCPU,
  game: GameRequirement,
  ramGb: number = 16
): DiagnosticResult {
  // 1. Core Performance Ratios
  const gpuRatio = gpu.relative_perf_score / Math.max(game.base_gpu_req, 1);
  const cpuRatio = cpu.single_thread_score / Math.max(game.base_cpu_req, 1);

  // 2. Average FPS & 1% Low Floor
  // Baseline target is calibrated at 60 FPS for baseline requirement ratio of 1.0
  const effectiveRatio = Math.min(gpuRatio * 0.7 + cpuRatio * 0.3, gpuRatio * 1.1);
  const rawAvg = Math.round(effectiveRatio * 60);
  const avgFps = Math.max(12, Math.min(rawAvg, 240));

  // VRAM & RAM penalties on 1% Lows
  let lowMultiplier = 0.72;
  if (gpu.vram_gb < game.base_vram_req) lowMultiplier -= 0.18;
  if (ramGb < 16) lowMultiplier -= 0.12;

  const onePercentLowFps = Math.max(5, Math.round(avgFps * Math.max(lowMultiplier, 0.35)));

  // 3. Bottleneck Percentage Calculation
  let bottleneckPercent = 0;
  let bottleneckComponent: 'CPU' | 'GPU' | 'Balanced' = 'Balanced';

  if (gpuRatio > cpuRatio * 1.25) {
    bottleneckComponent = 'CPU';
    bottleneckPercent = Math.min(
      Math.round(((gpuRatio - cpuRatio) / gpuRatio) * 100),
      65
    );
  } else if (cpuRatio > gpuRatio * 1.25) {
    bottleneckComponent = 'GPU';
    bottleneckPercent = Math.min(
      Math.round(((cpuRatio - gpuRatio) / cpuRatio) * 100),
      65
    );
  }

  // 4. CPU Throttle Probability Calculation
  // Higher TDP on older nodes or tight core configurations elevate thermal risk
  let throttleProbability = 5;
  if ((cpu.tdp_watts ?? 65) >= 125) throttleProbability += 25;
  if (cpu.cores <= 4 && avgFps > 45) throttleProbability += 30;
  if (cpu.brand === 'Intel' && cpu.series.includes('13th') || cpu.series.includes('14th')) {
    throttleProbability += 15;
  }
  throttleProbability = Math.min(throttleProbability, 85);

  // 5. "What to Buy" Component Recommendation
  let recommendedUpgrade = 'System is well-balanced for this profile.';
  if (bottleneckComponent === 'CPU') {
    recommendedUpgrade = cpu.brand === 'AMD' 
      ? 'Upgrade to Ryzen 5 5600 or Ryzen 7 5700X3D (AM4) / Ryzen 5 7600 (AM5)'
      : 'Upgrade to Core i5-12400F or Core i5-13400F';
  } else if (bottleneckComponent === 'GPU') {
    recommendedUpgrade = gpu.relative_perf_score < 50
      ? 'Upgrade GPU to Radeon RX 6600 8GB or GeForce RTX 3060 12GB'
      : 'Upgrade GPU to GeForce RTX 4060 / Radeon RX 7600';
  } else if (ramGb < 16) {
    recommendedUpgrade = 'Add a secondary 8GB RAM stick for dual-channel 16GB.';
  }

  // Storage and API checks
  const storageWarning = game.drive_speed === 'SSD Required'
    ? 'Game requires high stream bandwidth. NVMe/SATA SSD strongly recommended.'
    : undefined;

  return {
    avgFps,
    onePercentLowFps,
    bottleneckPercent,
    bottleneckComponent,
    throttleProbability,
    recommendedUpgrade,
    storageWarning,
    apiCompatStatus: `${game.directx_api} | ${game.storage_gb} GB Required`
  };
}