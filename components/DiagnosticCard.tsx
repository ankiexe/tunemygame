'use client';

import React from 'react';
import { DiagnosticResult, GameRequirement, HardwareCPU, HardwareGPU } from '@/lib/telemetry-engine';

interface ThemeAccent {
  accent: string;
  secondary?: string;
}

interface Props {
  result: DiagnosticResult;
  game: GameRequirement;
  gpu: HardwareGPU;
  cpu: HardwareCPU;
  theme?: ThemeAccent;
}

export default function DiagnosticCard({ result, game, gpu, cpu, theme }: Props) {
  const accent = theme?.accent ?? '#22d3ee';

  const getFpsColor = (fps: number) => {
    if (fps >= 60) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (fps >= 30) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getRiskBadge = (prob: number) => {
    if (prob > 50) return { text: 'High Risk', style: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
    if (prob > 25) return { text: 'Moderate', style: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { text: 'Low / Optimal', style: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  };

  const throttleRisk = getRiskBadge(result.throttleProbability);

  return (
    <div
      className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl transition-all duration-700"
      style={{ boxShadow: `0 0 32px ${accent}20`, borderColor: `${accent}44` }}
    >
      <div className="flex flex-col justify-between gap-2 border-b border-zinc-800/80 pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-wide text-white">{game.name}</h2>
          <p className="mt-0.5 text-xs text-zinc-400">
            Testing on <span className="text-zinc-200">{gpu.name}</span> + <span className="text-zinc-200">{cpu.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {game.is_potato && (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
              🥔 Potato Verified
            </span>
          )}
          {game.mac_tier !== 'None' && (
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300">
               {game.mac_tier}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className={`flex flex-col items-center justify-center rounded-xl border p-4 ${getFpsColor(result.avgFps)}`}>
          <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Expected Average</span>
          <span className="mt-1 text-4xl font-extrabold tracking-tight">
            {result.avgFps} <span className="text-base font-normal">FPS</span>
          </span>
        </div>
        <div className={`flex flex-col items-center justify-center rounded-xl border p-4 ${getFpsColor(result.onePercentLowFps)}`}>
          <span className="text-xs font-semibold uppercase tracking-wider opacity-80">1% Low Stability</span>
          <span className="mt-1 text-4xl font-extrabold tracking-tight">
            {result.onePercentLowFps} <span className="text-base font-normal">FPS</span>
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Bottleneck</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-zinc-100">
              {result.bottleneckComponent === 'Balanced' ? '0%' : `${result.bottleneckPercent}%`}
            </span>
            <span className="text-xs text-zinc-400">({result.bottleneckComponent})</span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Throttle Probability</span>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="text-lg font-bold text-zinc-100">{result.throttleProbability}%</span>
            <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${throttleRisk.style}`}>
              {throttleRisk.text}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Engine API</span>
          <span className="mt-2 block truncate text-xs font-semibold text-zinc-200">{game.directx_api}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-3.5 text-xs">
        <div className="space-y-0.5">
          <span className="text-zinc-400">Required Drive Footprint</span>
          <p className="font-medium text-zinc-200">{game.storage_gb} GB Space Required</p>
        </div>
        <span
          className="rounded-md border px-2.5 py-1 font-medium"
          style={{
            borderColor: `${accent}55`,
            background: `${accent}10`,
            color: accent,
          }}
        >
          {game.drive_speed}
        </span>
      </div>

      <div
        className="mt-6 rounded-xl border p-4"
        style={{
          borderColor: `${accent}35`,
          background: `linear-gradient(90deg, ${accent}14, rgba(17,24,39,0.8))`,
        }}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: accent }}>
            Upgrade Recommendation
          </span>
        </div>
        <p className="text-xs leading-relaxed text-zinc-300">{result.recommendedUpgrade}</p>
      </div>
    </div>
  );
}