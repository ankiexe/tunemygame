'use client';

import React, { useState, useMemo, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030712] text-zinc-400 p-8 font-mono">Loading Studio Engine...</div>}>
      <StudioApp />
    </Suspense>
  );
}

// =========================================================================
// 1. BASE HAND-CURATED MASTER CATALOG (INCLUDING COMPLETE ROCKSTAR SUITE)
// =========================================================================
const RAW_GAMES_DATABASE = [
  // --- Complete Rockstar Master Collection ---
  { id: 'bully', name: 'Bully: Scholarship Edition', category: 'Rockstar Classics', engine: 'RenderWare', api: 'DirectX 9.0c', disk: '5 GB', gamePass: false, baseCpuReq: 16, baseGpuReq: 16, baseVramReq: 0.5, macSupport: 'CrossOver / Porting Kit', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Install SilentPatch and lock framerate to 30 or 60 FPS to prevent physics mission desyncs.' },
  { id: 'gta3', name: 'Grand Theft Auto III', category: 'Rockstar Classics', engine: 'RenderWare / UE4', api: 'DirectX 9 / DX11', disk: '2 GB', gamePass: false, baseCpuReq: 12, baseGpuReq: 12, baseVramReq: 0.5, macSupport: 'Native Legacy / CrossOver', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Frame limiter ON is required in classic versions to avoid game speed double-clocking.' },
  { id: 'gta_vc', name: 'Grand Theft Auto: Vice City', category: 'Rockstar Classics', engine: 'RenderWare / UE4', api: 'DirectX 9 / DX11', disk: '2 GB', gamePass: false, baseCpuReq: 12, baseGpuReq: 12, baseVramReq: 0.5, macSupport: 'Native Legacy / CrossOver', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Runs locked at maximum refresh rate on virtually all integrated graphics.' },
  { id: 'gta_sa', name: 'Grand Theft Auto: San Andreas', category: 'Rockstar Classics', engine: 'RenderWare / UE4', api: 'DirectX 9 / DX11', disk: '5 GB', gamePass: false, baseCpuReq: 14, baseGpuReq: 14, baseVramReq: 0.5, macSupport: 'Native Legacy / CrossOver', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Use SilentPatch and Widescreen Fix for flawless 1080p/4K rendering without stretching.' },
  { id: 'gta4', name: 'Grand Theft Auto IV: Complete Edition', category: 'Rockstar Open World', engine: 'RAGE (Early)', api: 'DirectX 9.0c', disk: '22 GB', gamePass: false, baseCpuReq: 42, baseGpuReq: 40, baseVramReq: 2.0, macSupport: 'CrossOver 24+ (DXVK)', macTier: 'M1 Pro or higher', potatoTier: true, tips: 'Add DXVK (Vulkan translation) to eliminate infamous PC port stuttering and fix CPU bottlenecking.' },
  { id: 'gta4_eflc', name: 'Grand Theft Auto: Episodes from Liberty City', category: 'Rockstar Open World', engine: 'RAGE', api: 'DirectX 9.0c', disk: '20 GB', gamePass: false, baseCpuReq: 42, baseGpuReq: 40, baseVramReq: 2.0, macSupport: 'CrossOver 24+', macTier: 'M1 Pro or higher', potatoTier: true, tips: 'Set View Distance to 30; exceeding 40 severely taxes CPU draw call buffers with zero visual gain.' },
  { id: 'gta5', name: 'Grand Theft Auto V / GTA Online', category: 'Rockstar Open World', engine: 'RAGE', api: 'DirectX 11', disk: '110 GB', gamePass: true, baseCpuReq: 45, baseGpuReq: 48, baseVramReq: 3.5, macSupport: 'CrossOver 24+ (Flawless)', macTier: 'Any Apple Silicon', potatoTier: false, tips: 'Turn Grass Quality down from Ultra to High for an immediate 20+ FPS recovery in rural areas.' },
  { id: 'lanoire', name: 'L.A. Noire', category: 'Rockstar Detective', engine: 'Custom / RAGE', api: 'DirectX 9 / DX11', disk: '16 GB', gamePass: false, baseCpuReq: 36, baseGpuReq: 38, baseVramReq: 1.5, macSupport: 'CrossOver / Porting Kit', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Native 30 FPS facial capture engine. Use widescreen unlocker for 60 FPS gameplay.' },
  { id: 'manhunt', name: 'Manhunt', category: 'Rockstar Classics', engine: 'RenderWare', api: 'DirectX 8.1 / DX9', disk: '3 GB', gamePass: false, baseCpuReq: 10, baseGpuReq: 10, baseVramReq: 0.2, macSupport: 'CrossOver / Wine', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Requires Windows 98/XP compatibility mode and audio patch on modern Windows 10/11.' },
  { id: 'maxpayne1', name: 'Max Payne 1', category: 'Rockstar Classics', engine: 'MAX-FX', api: 'DirectX 8', disk: '2 GB', gamePass: false, baseCpuReq: 10, baseGpuReq: 10, baseVramReq: 0.2, macSupport: 'CrossOver / Wine', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Install the Startup Sound & Widescreen Fix to prevent modern CPU black-screen crashes.' },
  { id: 'maxpayne2', name: 'Max Payne 2: The Fall of Max Payne', category: 'Rockstar Classics', engine: 'MAX-FX 2', api: 'DirectX 9', disk: '2 GB', gamePass: false, baseCpuReq: 12, baseGpuReq: 12, baseVramReq: 0.3, macSupport: 'CrossOver / Wine', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Runs at hundreds of FPS; enable V-Sync to prevent Havok ragdoll physics desyncs.' },
  { id: 'maxpayne3', name: 'Max Payne 3', category: 'Rockstar Action Shooter', engine: 'RAGE', api: 'DirectX 11', disk: '35 GB', gamePass: false, baseCpuReq: 42, baseGpuReq: 45, baseVramReq: 2.0, macSupport: 'CrossOver 24+ (Metal)', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'One of the most optimized PC ports in history; easily hits 60+ FPS on budget GPUs with MSAA off.' },
  { id: 'rdr1', name: 'Red Dead Redemption 1 (PC Remaster)', category: 'Rockstar Western', engine: 'RAGE', api: 'DirectX 12', disk: '12 GB SSD', gamePass: false, baseCpuReq: 50, baseGpuReq: 52, baseVramReq: 4.0, macSupport: 'CrossOver 24+ / GPTK', macTier: 'M1 Pro or higher', potatoTier: false, tips: 'Excellent PC port with native ultrawide and DLSS/FSR support; runs easily at high refresh rates.' },
  { id: 'rdr2', name: 'Red Dead Redemption 2', category: 'Rockstar Western', engine: 'RAGE', api: 'Vulkan / DirectX 12', disk: '120 GB SSD', gamePass: false, baseCpuReq: 72, baseGpuReq: 75, baseVramReq: 6.0, macSupport: 'CrossOver 24+ (Experimental)', macTier: 'M2 Max or higher', potatoTier: false, tips: 'Use Vulkan API on Windows. Set Volumetric Raymarch Resolution to Medium for a 12% GPU boost.' },

  // --- AAA Flagships, Shooters, Simulators & Masterpieces ---
  { id: 'alankwake2', name: 'Alan Wake 2', category: 'Survival Horror', engine: 'Northlight', api: 'DirectX 12 Mesh Shaders', disk: '90 GB SSD', gamePass: false, baseCpuReq: 88, baseGpuReq: 95, baseVramReq: 8.0, macSupport: 'Unsupported (Mesh Shaders)', macTier: 'Windows Only', potatoTier: false, tips: 'DirectX 12 Mesh Shaders require RTX 2000 / RX 6000 or newer for playable frame rates.' },
  { id: 'apexlegends', name: 'Apex Legends', category: 'Battle Royale', engine: 'Source (Modified)', api: 'DirectX 11 / 12', disk: '75 GB SSD', gamePass: false, baseCpuReq: 55, baseGpuReq: 60, baseVramReq: 4.5, macSupport: 'Unsupported (Easy Anti-Cheat)', macTier: 'Windows Only', potatoTier: false, tips: 'Cap framerate at 180 FPS on 240Hz monitors to prevent Source engine frame pacing spikes.' },
  { id: 'ark_survival_ascended', name: 'ARK: Survival Ascended', category: 'Dinosaur Survival', engine: 'Unreal Engine 5.2', api: 'DirectX 12', disk: '85 GB SSD', gamePass: true, baseCpuReq: 86, baseGpuReq: 92, baseVramReq: 7.5, macSupport: 'Unsupported', macTier: 'Windows Only', potatoTier: false, tips: 'Type "r.VolumetricCloud 0" in developer console to gain up to 25 FPS instantly.' },
  { id: 'balatro', name: 'Balatro', category: 'Roguelike Poker', engine: 'LÖVE (Lua)', api: 'Metal / OpenGL', disk: '200 MB', gamePass: true, baseCpuReq: 12, baseGpuReq: 12, baseVramReq: 0.5, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Native macOS and PC build. Operates at locked 60+ FPS on virtually any hardware.' },
  { id: 'bg3', name: "Baldur's Gate 3", category: 'CRPG', engine: 'Divinity Engine 4.0', api: 'Metal 3 / Vulkan', disk: '150 GB SSD', gamePass: false, baseCpuReq: 75, baseGpuReq: 70, baseVramReq: 5.5, macSupport: 'Native Apple Silicon (Metal 3)', macTier: 'M1 / M2 / M3 Full Native', potatoTier: false, tips: 'Runs natively on macOS with Metal 3. On PC, Vulkan reduces CPU overhead in Act 3.' },
  { id: 'battlefield2042', name: 'Battlefield 2042', category: 'Large-Scale FPS', engine: 'Frostbite 3', api: 'DirectX 12', disk: '90 GB SSD', gamePass: true, baseCpuReq: 80, baseGpuReq: 76, baseVramReq: 6.0, macSupport: 'Unsupported (EA Anti-Cheat)', macTier: 'Windows Only', potatoTier: false, tips: '128-player servers are heavily CPU-bound. Enable Future Frame Rendering to smooth frametimes.' },
  { id: 'bioshock_remastered', name: 'BioShock Remastered', category: 'Atmospheric Immersive Sim', engine: 'Unreal Engine 2.5', api: 'DirectX 11', disk: '25 GB', gamePass: false, baseCpuReq: 32, baseGpuReq: 34, baseVramReq: 2.0, macSupport: 'Native macOS', macTier: 'Any M-Series', potatoTier: true, tips: 'Disable Screen Space Reflections to gain an easy 15% FPS boost on budget graphics.' },
  { id: 'blackmythwukong', name: 'Black Myth: Wukong', category: 'Action RPG', engine: 'Unreal Engine 5', api: 'DirectX 12', disk: '130 GB SSD', gamePass: false, baseCpuReq: 90, baseGpuReq: 94, baseVramReq: 7.8, macSupport: 'CrossOver 24+ / D3DMetal', macTier: 'M3 Max recommended', potatoTier: false, tips: 'TSR / DLSS Balanced mode is required to maintain smooth 1% lows across dense foliage areas.' },
  { id: 'brotato', name: 'Brotato', category: 'Top-Down Arena Shooter', engine: 'Godot', api: 'Vulkan / OpenGL', disk: '500 MB', gamePass: true, baseCpuReq: 14, baseGpuReq: 14, baseVramReq: 0.5, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Turn off damage numbers and screen shake in wave 20+ to keep 60 FPS on potato CPUs.' },
  { id: 'celeste', name: 'Celeste', category: 'Precision Platformer', engine: 'XNA / FNA', api: 'Metal / OpenGL', disk: '2 GB', gamePass: true, baseCpuReq: 12, baseGpuReq: 12, baseVramReq: 0.5, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Extremely lightweight footprint; reaches 144+ FPS on virtually any hardware.' },
  { id: 'civ6', name: "Sid Meier's Civilization VI", category: 'Turn-Based 4X Strategy', engine: 'Custom Engine', api: 'Metal / DX12', disk: '25 GB', gamePass: true, baseCpuReq: 50, baseGpuReq: 40, baseVramReq: 3.0, macSupport: 'Native Apple Silicon (Metal)', macTier: 'Any M-Series', potatoTier: false, tips: 'Late-game turn calculations rely on single-core CPU speeds. Disable animated leaders.' },
  { id: 'cod4_mw', name: 'Call of Duty 4: Modern Warfare (2007)', category: 'Classic Military FPS', engine: 'IW 3.0', api: 'DirectX 9.0c', disk: '8 GB', gamePass: false, baseCpuReq: 18, baseGpuReq: 18, baseVramReq: 0.5, macSupport: 'CrossOver / Legacy', macTier: 'Any M-Series', potatoTier: true, tips: 'DirectX 9 pipeline easily runs 100+ FPS on modern integrated Intel UHD graphics.' },
  { id: 'cod_waw', name: 'Call of Duty: World at War (2008)', category: 'Classic WWII Shooter', engine: 'IW 3.0', api: 'DirectX 9.0c', disk: '8 GB', gamePass: false, baseCpuReq: 20, baseGpuReq: 20, baseVramReq: 0.5, macSupport: 'CrossOver / Legacy', macTier: 'Any M-Series', potatoTier: true, tips: 'Cap framerate at 60 FPS to prevent campaign tank physics desyncs.' },
  { id: 'cod_warzone', name: 'Call of Duty: Warzone / MW3', category: 'Military Shooter', engine: 'IW 9.0', api: 'DirectX 12', disk: '125 GB SSD', gamePass: true, baseCpuReq: 78, baseGpuReq: 82, baseVramReq: 6.8, macSupport: 'Unsupported (Ricochet Anti-Cheat)', macTier: 'Windows Only', potatoTier: false, tips: 'Set VRAM Target Scale to 70% in graphics settings to eliminate stuttering in Urzikstan.' },
  { id: 'cs2', name: 'Counter-Strike 2', category: 'Tactical Shooter', engine: 'Source 2', api: 'DirectX 11 / Vulkan', disk: '50 GB SSD', gamePass: false, baseCpuReq: 50, baseGpuReq: 55, baseVramReq: 3.5, macSupport: 'Unsupported by Valve on macOS', macTier: 'Windows Only', potatoTier: false, tips: 'Set Particle Detail to Low to maximize visibility through smoke grenades and incendiaries.' },
  { id: 'cuphead', name: 'Cuphead: The Delicious Last Course', category: 'Run & Gun Boss Rush', engine: 'Unity', api: 'Metal / DX11', disk: '4 GB', gamePass: false, baseCpuReq: 20, baseGpuReq: 20, baseVramReq: 1.0, macSupport: 'Native macOS', macTier: 'Any M-Series', potatoTier: true, tips: 'Locked hand-drawn 24fps animations inside a 60fps locked render pipeline.' },
  { id: 'cyberpunk2077', name: 'Cyberpunk 2077: Phantom Liberty', category: 'Open World RPG', engine: 'REDengine 4', api: 'DirectX 12 Ultimate', disk: '70 GB SSD', gamePass: false, baseCpuReq: 85, baseGpuReq: 90, baseVramReq: 7.2, macSupport: 'CrossOver 24+ / GPTK 2', macTier: 'M2 Pro / M3 Pro min', potatoTier: false, tips: 'Lower Volumetric Fog to Medium to gain ~14% FPS with near-zero visual degradation.' },
  { id: 'deadcells', name: 'Dead Cells', category: 'Roguevania Action', engine: 'Heaps.io', api: 'Metal / OpenGL', disk: '2 GB', gamePass: true, baseCpuReq: 20, baseGpuReq: 20, baseVramReq: 1.0, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Lock display to 60 FPS or 120 FPS for consistent weapon parry timing.' },
  { id: 'deathstranding', name: "Death Stranding: Director's Cut", category: 'Action Adventure', engine: 'Decima Engine', api: 'Metal 3 / DX12', disk: '80 GB SSD', gamePass: true, baseCpuReq: 60, baseGpuReq: 65, baseVramReq: 5.0, macSupport: 'Native Apple Silicon (Metal 3)', macTier: 'M1 Pro or higher', potatoTier: false, tips: 'Enable MetalFX Upscaling in Quality mode for stable 60 FPS on Apple Silicon chips.' },
  { id: 'detroit', name: 'Detroit: Become Human', category: 'Interactive Cinema', engine: 'Quantic Dream Engine', api: 'Vulkan', disk: '55 GB SSD', gamePass: false, baseCpuReq: 60, baseGpuReq: 65, baseVramReq: 4.8, macSupport: 'GPTK / MoltenVK (Experimental)', macTier: 'M1 Pro or higher', potatoTier: false, tips: 'Lock framerate to 60 to prevent shader micro-stuttering on Vulkan pipelines.' },
  { id: 'discoelysium', name: 'Disco Elysium: The Final Cut', category: 'Narrative RPG', engine: 'Unity', api: 'Metal / DX11', disk: '20 GB', gamePass: false, baseCpuReq: 30, baseGpuReq: 30, baseVramReq: 2.0, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: false, tips: 'Runs natively at full retina resolutions on all M1/M2/M3/M4 chips.' },
  { id: 'dontstarve', name: "Don't Starve Together", category: 'Wilderness Survival', engine: 'Custom C++', api: 'OpenGL / DirectX 9', disk: '3 GB', gamePass: false, baseCpuReq: 24, baseGpuReq: 22, baseVramReq: 1.0, macSupport: 'Native macOS', macTier: 'Any M-Series', potatoTier: true, tips: 'Set Small Textures mode on 1GB iGPUs to eliminate base-building frametime spikes.' },
  { id: 'dragonsdogma2', name: "Dragon's Dogma 2", category: 'Action RPG', engine: 'RE Engine', api: 'DirectX 12', disk: '70 GB SSD', gamePass: false, baseCpuReq: 95, baseGpuReq: 88, baseVramReq: 6.6, macSupport: 'Unsupported (Heavy Denuvo)', macTier: 'Windows Only', potatoTier: false, tips: 'Extremely CPU-heavy in Vernworth city. Lower Crowd Density to Low to prevent stuttering.' },
  { id: 'eldenring', name: 'Elden Ring: Shadow of the Erdtree', category: 'Souls-like Action', engine: 'FromEngine', api: 'DirectX 12', disk: '60 GB SSD', gamePass: false, baseCpuReq: 75, baseGpuReq: 78, baseVramReq: 5.8, macSupport: 'CrossOver 24+ / GPTK 2', macTier: 'M2 Max / M3 Pro', potatoTier: false, tips: 'Cap at 60 FPS and disable Ray Tracing to eliminate sudden frame drops during boss attacks.' },
  { id: 'fallout_nv', name: 'Fallout: New Vegas', category: 'Post-Apocalyptic RPG', engine: 'Gamebryo', api: 'DirectX 9.0c', disk: '10 GB', gamePass: true, baseCpuReq: 25, baseGpuReq: 25, baseVramReq: 1.0, macSupport: 'CrossOver 24+', macTier: 'Any M-Series', potatoTier: true, tips: 'Apply the 4GB Patch utility and cap framerate to 60 FPS to prevent Havok physics desync.' },
  { id: 'fortnite', name: 'Fortnite (Battle Royale)', category: 'Battle Royale', engine: 'Unreal Engine 5.4', api: 'DirectX 12 / Perf Mode', disk: '60 GB SSD', gamePass: false, baseCpuReq: 60, baseGpuReq: 65, baseVramReq: 4.0, macSupport: 'Unsupported', macTier: 'Cloud Gaming Only', potatoTier: false, tips: 'Use Performance Mode (DirectX 11 legacy) on midrange CPUs for the highest 1% lows.' },
  { id: 'forzahorizon5', name: 'Forza Horizon 5', category: 'Racing Simulator', engine: 'ForzaTech', api: 'DirectX 12', disk: '110 GB SSD', gamePass: true, baseCpuReq: 55, baseGpuReq: 60, baseVramReq: 5.0, macSupport: 'CrossOver 23.7+', macTier: 'M2 Max / M3 Pro', potatoTier: false, tips: 'MSAA 4x has lower latency overhead than TAA on discrete GPU pipelines.' },
  { id: 'godofwar', name: 'God of War (2018)', category: 'Action Adventure', engine: 'Santa Monica Engine', api: 'DirectX 11', disk: '70 GB SSD', gamePass: false, baseCpuReq: 68, baseGpuReq: 70, baseVramReq: 5.0, macSupport: 'CrossOver 24+', macTier: 'M2 Pro min', potatoTier: false, tips: 'Set Original preset textures and use FSR 2.0 Quality mode for seamless 60+ FPS frame times.' },
  { id: 'hades', name: 'Hades', category: 'Isometric Roguelike', engine: 'The Forge', api: 'Metal / DX11', disk: '15 GB', gamePass: false, baseCpuReq: 22, baseGpuReq: 20, baseVramReq: 1.5, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Easily locks 60+ FPS even on older Intel UHD / Vega integrated graphics.' },
  { id: 'hades2', name: 'Hades II', category: 'Isometric Roguelike', engine: 'The Forge', api: 'Metal / DX11', disk: '10 GB', gamePass: false, baseCpuReq: 25, baseGpuReq: 22, baseVramReq: 1.8, macSupport: 'Native / Rosetta 2', macTier: 'Any M-Series', potatoTier: true, tips: 'Fullscreen borderless provides minimal input latency on 60Hz and 120Hz panels.' },
  { id: 'halflife2', name: 'Half-Life 2 (20th Anniversary)', category: 'Sci-Fi FPS', engine: 'Source', api: 'DirectX 9 / Vulkan', disk: '10 GB', gamePass: false, baseCpuReq: 15, baseGpuReq: 15, baseVramReq: 0.5, macSupport: 'CrossOver / Legacy', macTier: 'Any M-Series', potatoTier: true, tips: 'Runs at 100+ FPS on ancient iGPUs at native 1080p.' },
  { id: 'helldivers2', name: 'HELLDIVERS 2', category: 'Co-op Extraction Shooter', engine: 'Bitsquid / Stingray', api: 'DirectX 12', disk: '70 GB SSD', gamePass: false, baseCpuReq: 84, baseGpuReq: 80, baseVramReq: 6.5, macSupport: 'Unsupported (nProtect Anti-Cheat)', macTier: 'Windows Only', potatoTier: false, tips: 'Reduce Volumetric Fog and Space Quality to Low to preserve 60 FPS in heavy bug swarms.' },
  { id: 'hollowknight', name: 'Hollow Knight', category: 'Metroidvania Action', engine: 'Unity', api: 'Metal / OpenGL', disk: '9 GB', gamePass: true, baseCpuReq: 18, baseGpuReq: 18, baseVramReq: 1.0, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Guaranteed 60+ FPS on budget dual-core laptops with zero frame drops.' },
  { id: 'l4d2', name: 'Left 4 Dead 2', category: 'Co-op Zombie FPS', engine: 'Source', api: 'DirectX 9 / Vulkan', disk: '13 GB', gamePass: false, baseCpuReq: 22, baseGpuReq: 22, baseVramReq: 1.0, macSupport: 'CrossOver / Legacy', macTier: 'Any M-Series', potatoTier: true, tips: 'Set Paged Pool Memory to High in video options to eliminate horde spawn micro-stutters.' },
  { id: 'liesofp', name: 'Lies of P', category: 'Souls-like Action', engine: 'Unreal Engine 4', api: 'Metal 3 / DX12', disk: '50 GB SSD', gamePass: true, baseCpuReq: 62, baseGpuReq: 68, baseVramReq: 5.2, macSupport: 'Native Apple Silicon (Metal 3)', macTier: 'M1 / M2 / M3 Full Native', potatoTier: false, tips: 'Native Metal build runs with ultra-low latency. Lock at 60 FPS for precise parry windows.' },
  { id: 'lis_de', name: 'Life is Strange: Double Exposure', category: 'Narrative Adventure', engine: 'Unreal Engine 5', api: 'DirectX 12', disk: '45 GB SSD', gamePass: true, baseCpuReq: 68, baseGpuReq: 72, baseVramReq: 6.0, macSupport: 'Unsupported (Windows Native)', macTier: 'Windows Only', potatoTier: false, tips: 'Turn Shadow Quality to High instead of Epic to stabilize 1% low frame dips.' },
  { id: 'lis_truecolors', name: 'Life is Strange: True Colors', category: 'Narrative Adventure', engine: 'Unreal Engine 4', api: 'DirectX 12', disk: '30 GB', gamePass: true, baseCpuReq: 52, baseGpuReq: 56, baseVramReq: 4.0, macSupport: 'CrossOver 23+', macTier: 'M1 Max / M2 Pro', potatoTier: false, tips: 'Ray tracing reflections cause heavy drops; disable for smooth 60 FPS.' },
  { id: 'metro_exodus', name: 'Metro Exodus (Enhanced Edition)', category: 'Atmospheric Shooter', engine: '4A Engine', api: 'Metal 3 / DX12 RT', disk: '70 GB SSD', gamePass: false, baseCpuReq: 74, baseGpuReq: 78, baseVramReq: 6.0, macSupport: 'Native Apple Silicon (Metal 3)', macTier: 'M2 Pro / M3 Pro', potatoTier: false, tips: 'Enable Shading Rate 0.7x for a 20% framerate increase with almost zero visual loss.' },
  { id: 'nomanssky', name: "No Man's Sky", category: 'Space Exploration', engine: 'Custom Engine', api: 'Metal 3 / Vulkan', disk: '20 GB SSD', gamePass: true, baseCpuReq: 55, baseGpuReq: 60, baseVramReq: 4.5, macSupport: 'Native Apple Silicon (Metal 3)', macTier: 'M1 or higher', potatoTier: false, tips: 'MetalFX spatial upscaling delivers smooth frame pacing when entering planetary atmospheres.' },
  { id: 'overwatch2', name: 'Overwatch 2', category: 'Hero Shooter', engine: 'Custom Engine', api: 'DirectX 11', disk: '50 GB', gamePass: false, baseCpuReq: 42, baseGpuReq: 45, baseVramReq: 3.0, macSupport: 'CrossOver 24+ / GPTK', macTier: 'M2 Pro min', potatoTier: false, tips: 'Enable Dynamic Render Scale with 100% threshold to guarantee consistent 144/240Hz lock.' },
  { id: 'palworld', name: 'Palworld', category: 'Creature Survival Crafting', engine: 'Unreal Engine 5', api: 'DirectX 12', disk: '40 GB SSD', gamePass: true, baseCpuReq: 68, baseGpuReq: 70, baseVramReq: 5.0, macSupport: 'CrossOver 24+ / GPTK', macTier: 'M2 Pro or higher', potatoTier: false, tips: 'Set Max Dropped Items to 1500 to prevent world save game bloat and CPU memory stutter.' },
  { id: 'portal2', name: 'Portal 2', category: 'First-Person Puzzle', engine: 'Source', api: 'DirectX 9 / Vulkan', disk: '8 GB', gamePass: false, baseCpuReq: 20, baseGpuReq: 22, baseVramReq: 0.8, macSupport: 'CrossOver / Legacy', macTier: 'Any M-Series', potatoTier: true, tips: 'Source engine runs at 60–120+ FPS on 10-year-old Intel HD graphics.' },
  { id: 'rainbowsixsiege', name: "Tom Clancy's Rainbow Six Siege", category: 'Tactical Shooter', engine: 'AnvilNext 2.0', api: 'Vulkan / DirectX 11', disk: '60 GB', gamePass: true, baseCpuReq: 48, baseGpuReq: 50, baseVramReq: 3.5, macSupport: 'Unsupported (BattlEye)', macTier: 'Windows Only', potatoTier: false, tips: 'Run the Vulkan executable to unlock Raw Input support and lower frame render latency.' },
  { id: 'residentevil4remake', name: 'Resident Evil 4 Remake', category: 'Survival Horror', engine: 'RE Engine', api: 'Metal 3 / DX12', disk: '65 GB SSD', gamePass: false, baseCpuReq: 70, baseGpuReq: 75, baseVramReq: 6.0, macSupport: 'Native Apple Silicon (Metal 3)', macTier: 'M2 / M3 Full Native', potatoTier: false, tips: 'Cap VRAM allocation to 2GB below maximum in settings to prevent texture pop-in.' },
  { id: 'residentevilvillage', name: 'Resident Evil Village', category: 'Survival Horror', engine: 'RE Engine', api: 'Metal 3 / DX12', disk: '30 GB SSD', gamePass: false, baseCpuReq: 58, baseGpuReq: 62, baseVramReq: 4.8, macSupport: 'Native Apple Silicon (Metal 3)', macTier: 'M1 or higher', potatoTier: false, tips: 'MetalFX performance mode allows locked 60 FPS even on base M1/M2 MacBooks.' },
  { id: 'rocketleague', name: 'Rocket League', category: 'Vehicular Soccer', engine: 'Unreal Engine 3', api: 'DirectX 11', disk: '20 GB', gamePass: false, baseCpuReq: 25, baseGpuReq: 28, baseVramReq: 1.5, macSupport: 'CrossOver 24+ (Flawless)', macTier: 'Any M-Series', potatoTier: true, tips: 'Turn off Depth of Field and Bloom for absolute maximum clarity during aerial ball tracking.' },
  { id: 'skyrim_le', name: 'The Elder Scrolls V: Skyrim (Original)', category: 'Open World Fantasy RPG', engine: 'Creation Engine (32-bit)', api: 'DirectX 9.0c', disk: '12 GB', gamePass: false, baseCpuReq: 28, baseGpuReq: 28, baseVramReq: 1.0, macSupport: 'CrossOver 24+', macTier: 'Any M-Series', potatoTier: true, tips: 'Must lock framerate to 60 FPS; exceeding 60 breaks the Havok physics engine.' },
  { id: 'slaythespire', name: 'Slay the Spire', category: 'Roguelike Deckbuilder', engine: 'LibGDX (Java)', api: 'Metal / OpenGL', disk: '1 GB', gamePass: true, baseCpuReq: 15, baseGpuReq: 15, baseVramReq: 0.5, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Zero GPU bottlenecking; runs smooth animations at full retina/4K resolutions.' },
  { id: 'spiderman_remastered', name: "Marvel's Spider-Man Remastered", category: 'Open World Superhero', engine: 'Insomniac Engine', api: 'DirectX 12', disk: '75 GB SSD', gamePass: false, baseCpuReq: 78, baseGpuReq: 74, baseVramReq: 6.0, macSupport: 'CrossOver 24+ / GPTK', macTier: 'M2 Max / M3 Pro', potatoTier: false, tips: 'Web-swinging is heavily CPU thread bound. Lower Crowd Density to relieve CPU bottlenecks.' },
  { id: 'stardewvalley', name: 'Stardew Valley', category: 'Farming Simulation', engine: 'MonoGame', api: 'Metal / DX11', disk: '1 GB', gamePass: true, baseCpuReq: 10, baseGpuReq: 10, baseVramReq: 0.5, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Ultra low battery and CPU draw. Runs locked at 60 FPS on any laptop without fan noise.' },
  { id: 'starfield', name: 'Starfield', category: 'Space RPG', engine: 'Creation Engine 2', api: 'DirectX 12', disk: '125 GB SSD', gamePass: true, baseCpuReq: 82, baseGpuReq: 86, baseVramReq: 7.0, macSupport: 'Unsupported (Windows Native)', macTier: 'Windows Only', potatoTier: false, tips: 'Enable Dynamic Resolution Scaling with 75% render scale for stable 60 FPS in dense cities.' },
  { id: 'subnautica', name: 'Subnautica', category: 'Underwater Survival', engine: 'Unity', api: 'Metal / DX11', disk: '20 GB', gamePass: false, baseCpuReq: 45, baseGpuReq: 50, baseVramReq: 3.5, macSupport: 'Native macOS', macTier: 'M1 Pro or higher', potatoTier: false, tips: 'Lower Water Quality slider to High to prevent frame dips when surfacing near the Aurora.' },
  { id: 'theforest', name: 'Sons of the Forest', category: 'Open World Survival', engine: 'Unity', api: 'DirectX 11', disk: '20 GB SSD', gamePass: false, baseCpuReq: 72, baseGpuReq: 74, baseVramReq: 5.5, macSupport: 'CrossOver 24+', macTier: 'M2 Pro or higher', potatoTier: false, tips: 'Lower Micro-Shadows and Cloud Quality to gain an instant 18% boost in dense forests.' },
  { id: 'terraria', name: 'Terraria', category: '2D Sandbox Adventure', engine: 'XNA / FNA', api: 'Metal / OpenGL / DX9', disk: '1 GB', gamePass: true, baseCpuReq: 15, baseGpuReq: 15, baseVramReq: 0.5, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Turn Lighting to White or Color instead of Trippy to maintain steady 60 FPS on old iGPUs.' },
  { id: 'tombraider_shadow', name: 'Shadow of the Tomb Raider', category: 'Action Adventure', engine: 'Foundation Engine', api: 'Metal / DX12', disk: '40 GB', gamePass: true, baseCpuReq: 55, baseGpuReq: 60, baseVramReq: 4.5, macSupport: 'Native Apple Silicon (Metal)', macTier: 'Any M-Series', potatoTier: false, tips: 'Native macOS Metal port runs smoothly. Turn off PureHair on integrated chips for +15 FPS.' },
  { id: 'totalwar_warhammer3', name: 'Total War: WARHAMMER III', category: 'Grand Strategy RTS', engine: 'TW Engine 3', api: 'Native Metal / DX12', disk: '120 GB SSD', gamePass: true, baseCpuReq: 82, baseGpuReq: 76, baseVramReq: 6.0, macSupport: 'Native Apple Silicon (Metal)', macTier: 'M2 Pro / M3 Pro min', potatoTier: false, tips: 'Lower Grass & Unit Detail to Medium during 40v40 army battles to prevent frame drops.' },
  { id: 'undertale', name: 'Undertale', category: 'Turn-Based Indie RPG', engine: 'GameMaker Studio', api: 'DirectX 9 / OpenGL', disk: '300 MB', gamePass: false, baseCpuReq: 10, baseGpuReq: 10, baseVramReq: 0.2, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Ultra lightweight engine; runs on literally any dual-core PC from 2008+.' },
  { id: 'valorant', name: 'VALORANT', category: 'Tactical Shooter', engine: 'Unreal Engine 4', api: 'DirectX 11', disk: '30 GB', gamePass: true, baseCpuReq: 30, baseGpuReq: 25, baseVramReq: 2.0, macSupport: 'Unsupported (Vanguard Kernel Anti-Cheat)', macTier: 'Windows Only', potatoTier: true, tips: 'Run uncapped FPS with Nvidia Reflex On + Boost for the absolute lowest render latency.' },
  { id: 'vampiresurvivors', name: 'Vampire Survivors', category: 'Gothic Survival Roguelite', engine: 'Phaser / Electron', api: 'WebGL / DX11', disk: '600 MB', gamePass: true, baseCpuReq: 20, baseGpuReq: 16, baseVramReq: 0.5, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Disable flashing VFX in accessibility options to prevent draw call slowdowns on dense swarms.' },
  { id: 'witcher3', name: 'The Witcher 3: Wild Hunt (Next-Gen)', category: 'Fantasy RPG', engine: 'REDengine 3', api: 'DirectX 12 / DX11', disk: '55 GB SSD', gamePass: false, baseCpuReq: 65, baseGpuReq: 72, baseVramReq: 5.5, macSupport: 'CrossOver 24+ / GPTK', macTier: 'M1 Pro or higher', potatoTier: false, tips: 'Switch to DirectX 11 mode on budget PCs to bypass heavy DX12 CPU driver overhead.' }
];

// =========================================================================
// 2. EXPANSION GENERATOR DEFINITION (DEFINED BEFORE USAGE)
// =========================================================================
const EXPANSION_SERIES = [
  { prefix: 'Civilization Anthology & Strategy Suite', count: 20, category: 'Turn-Based 4X Strategy', engine: 'Custom Engine', api: 'Native Metal / DX12', mac: true, potato: false, cpu: 55, gpu: 45, vram: 3.5 },
  { prefix: 'Total War Historical Campaigns', count: 30, category: 'Grand Strategy RTS', engine: 'TW Engine 3', api: 'Metal 3 / DX12', mac: true, potato: false, cpu: 80, gpu: 65, vram: 5.0 },
  { prefix: 'Resident Evil Legacy & Revelations', count: 22, category: 'Survival Horror', engine: 'RE Engine', api: 'Native Metal 3 / DX12', mac: true, potato: false, cpu: 60, gpu: 65, vram: 5.5 },
  { prefix: 'Tomb Raider Survivor Chronicles', count: 18, category: 'Action Adventure', engine: 'Foundation Engine', api: 'Metal / DX12', mac: true, potato: false, cpu: 55, gpu: 60, vram: 4.5 },
  { prefix: 'Metro Underground Redux Operations', count: 12, category: 'Atmospheric Shooter', engine: '4A Engine', api: 'Native Metal / DX12', mac: true, potato: false, cpu: 70, gpu: 75, vram: 6.0 },
  { prefix: 'Hitman World of Assassination Contracts', count: 16, category: 'Stealth Action', engine: 'Glacier 2', api: 'Metal / DX12', mac: true, potato: false, cpu: 70, gpu: 72, vram: 5.5 },
  { prefix: 'Crusader Kings & Paradox Grand Imperial', count: 35, category: 'Grand Strategy', engine: 'Clausewitz', api: 'Native Metal / DX11', mac: true, potato: false, cpu: 80, gpu: 40, vram: 3.0 },
  { prefix: 'Football Manager Scouting Network', count: 25, category: 'Sports Simulation', engine: 'Sports Interactive', api: 'Native Metal / DX11', mac: true, potato: false, cpu: 60, gpu: 30, vram: 2.0 },
  { prefix: 'Warhammer 40,000 Space Marine Tactical', count: 30, category: 'Sci-Fi Action Strategy', engine: 'Unreal Engine 4/5', api: 'Metal 3 / DX12', mac: true, potato: false, cpu: 75, gpu: 78, vram: 6.5 },
  { prefix: 'Simulators & Urban Megacity Suites', count: 50, category: 'Simulation', engine: 'Custom Engine', api: 'DirectX 12 / Metal', mac: true, potato: false, cpu: 90, gpu: 70, vram: 6.0 },
  { prefix: 'Borderlands Vault Hunter Anthology', count: 14, category: 'Looter Shooter', engine: 'Unreal Engine 4', api: 'Native Metal / DX12', mac: true, potato: false, cpu: 60, gpu: 65, vram: 4.5 },
  { prefix: 'Assassin’s Creed Animus Lineage', count: 24, category: 'Open World Action', engine: 'AnvilNext 2.0', api: 'DirectX 12', mac: false, potato: false, cpu: 70, gpu: 75, vram: 6.0 },
  { prefix: 'Call of Duty Black Ops & Modern Fronts', count: 35, category: 'First Person Shooter', engine: 'IW Engine', api: 'DirectX 11/12', mac: false, potato: false, cpu: 65, gpu: 70, vram: 5.5 },
  { prefix: 'Far Cry Frontier Expeditions', count: 15, category: 'Open World Shooter', engine: 'Dunia Engine 2', api: 'DirectX 12', mac: false, potato: false, cpu: 60, gpu: 65, vram: 5.0 },
  { prefix: 'Battlefield Operations & Theaters', count: 20, category: 'Multiplayer Shooter', engine: 'Frostbite 3', api: 'DirectX 12', mac: false, potato: false, cpu: 75, gpu: 75, vram: 6.0 },
  { prefix: 'Need for Speed Underground Apex', count: 22, category: 'Street Racing', engine: 'Frostbite', api: 'DirectX 11/12', mac: false, potato: false, cpu: 55, gpu: 60, vram: 4.5 },
  { prefix: 'Final Fantasy Universe Remasters', count: 24, category: 'JRPG', engine: 'Luminous / UE4', api: 'DirectX 11/12', mac: false, potato: false, cpu: 65, gpu: 70, vram: 6.0 },
  { prefix: 'Monster Hunter Wilds & World Sagas', count: 15, category: 'Action RPG', engine: 'RE Engine / MT', api: 'DirectX 12', mac: false, potato: false, cpu: 75, gpu: 78, vram: 6.2 },
  { prefix: 'Dark Souls & FromSoftware Legends', count: 16, category: 'Souls-like', engine: 'FromEngine', api: 'DirectX 12', mac: false, potato: false, cpu: 75, gpu: 78, vram: 5.5 },
  { prefix: 'Doom & Quake Arena Masterpieces', count: 18, category: 'Fast Arena FPS', engine: 'id Tech 7', api: 'Vulkan', mac: false, potato: false, cpu: 55, gpu: 60, vram: 4.0 },
  { prefix: 'Wolfenstein Combat Frontlines', count: 14, category: 'Action FPS', engine: 'id Tech 6', api: 'Vulkan', mac: false, potato: false, cpu: 50, gpu: 55, vram: 4.0 },
  { prefix: 'Fallout & Elder Scrolls Wasteland Realm', count: 20, category: 'Open World RPG', engine: 'Creation Engine', api: 'DirectX 11', mac: false, potato: false, cpu: 60, gpu: 60, vram: 4.0 },
  { prefix: 'EA Sports FC Stadium Tournament', count: 26, category: 'Sports Simulation', engine: 'Frostbite', api: 'DirectX 12', mac: false, potato: false, cpu: 65, gpu: 65, vram: 5.0 },
  { prefix: 'Indie Roguelike & Pixel Masterpieces', count: 160, category: 'Potato Ultra-Light Indie', engine: 'Unity / Godot / Custom', api: 'Native Metal / Vulkan / DX9', mac: true, potato: true, cpu: 16, gpu: 16, vram: 1.0 },
  { prefix: 'Classic 2000s Retro PC Golden Era', count: 90, category: 'Potato Classic PC', engine: 'Direct3D / OpenGL Legacy', api: 'DirectX 9 / Metal', mac: true, potato: true, cpu: 14, gpu: 14, vram: 0.5 }
];

const GENERATED_EXPANSION_GAMES = [];
EXPANSION_SERIES.forEach((series) => {
  for (let i = 1; i <= series.count; i++) {
    GENERATED_EXPANSION_GAMES.push({
      id: `${series.prefix.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${i}`,
      name: `${series.prefix}: Part ${i}`,
      category: series.category,
      engine: series.engine,
      api: series.api,
      disk: `${series.potato ? 2 + (i % 4) : 20 + (i % 8) * 10} GB`,
      gamePass: (i % 3 === 0),
      baseCpuReq: Math.min(95, series.cpu + (i % 3) * 2),
      baseGpuReq: Math.min(95, series.gpu + (i % 3) * 2),
      baseVramReq: Number((series.vram + (i % 3) * 0.2).toFixed(1)),
      macSupport: series.mac ? 'Native Apple Silicon (Metal 3/4)' : 'Unsupported (Windows Only)',
      macTier: series.mac ? 'M1 / M2 / M3 / M4 Full Support' : 'Incompatible',
      potatoTier: series.potato,
      tips: series.potato
        ? '50–60+ FPS certified on Intel HD 4000 / Vega / Iris Xe graphics.'
        : `Calibrate ${series.category} shader caches and use upscalers for 1% low stability.`
    });
  }
});

// Full Combined Master Catalog Sorted Alphabetically (A → Z)
const ALL_GAMES = [...RAW_GAMES_DATABASE, ...GENERATED_EXPANSION_GAMES].sort((a, b) =>
  a.name.localeCompare(b.name)
);

// Hardware Library
const CPUS = [
  { name: 'AMD Ryzen 7 7800X3D', power: 100, cores: 8, tier: 'Enthusiast' },
  { name: 'Intel Core i9-14900K', power: 98, cores: 24, tier: 'Enthusiast' },
  { name: 'AMD Ryzen 7 9700X', power: 90, cores: 8, tier: 'High Tier' },
  { name: 'Intel Core i7-14700K', power: 88, cores: 20, tier: 'High Tier' },
  { name: 'AMD Ryzen 5 9600X (6C/12T)', power: 86, cores: 6, tier: 'Zen 5 Latest' },
  { name: 'AMD Ryzen 5 7600X / 7600 (6C/12T)', power: 82, cores: 6, tier: 'Zen 4 Modern' },
  { name: 'AMD Ryzen 5 7500F (6C/12T)', power: 80, cores: 6, tier: 'Zen 4 Budget' },
  { name: 'AMD Ryzen 5 5600X / 5600 (6C/12T)', power: 68, cores: 6, tier: 'Zen 3 Sweetspot' },
  { name: 'AMD Ryzen 5 5600G (APU / Vega 7)', power: 62, cores: 6, tier: 'Zen 3 APU' },
  { name: 'AMD Ryzen 5 5500 (6C/12T)', power: 58, cores: 6, tier: 'Zen 3 Budget' },
  { name: 'AMD Ryzen 5 3600X / 3600 (6C/12T)', power: 54, cores: 6, tier: 'Zen 2 Classic' },
  { name: 'AMD Ryzen 5 3400G (APU / Vega 11)', power: 42, cores: 4, tier: 'Zen+ APU' },
  { name: 'AMD Ryzen 5 2600 / 2600X (6C/12T)', power: 44, cores: 6, tier: 'Zen+ Classic' },
  { name: 'AMD Ryzen 5 2400G (APU / Vega 11)', power: 38, cores: 4, tier: 'Zen 1 APU' },
  { name: 'AMD Ryzen 5 1600 / 1600 AF (6C/12T)', power: 40, cores: 6, tier: 'Zen 1 Classic' },
  { name: 'AMD Ryzen 5 5500U / 4500U (Laptop 6C)', power: 48, cores: 6, tier: 'Laptop Mid' },
  { name: 'AMD Ryzen 5 3500U / 2500U (Laptop 4C/8T)', power: 34, cores: 4, tier: 'Laptop Potato' },
  { name: 'AMD Ryzen 3 4100 (4C/8T)', power: 45, cores: 4, tier: 'Zen 2 Budget' },
  { name: 'AMD Ryzen 3 3300X (4C/8T)', power: 48, cores: 4, tier: 'Zen 2 Gaming' },
  { name: 'AMD Ryzen 3 3200G (APU / Vega 8)', power: 30, cores: 4, tier: 'Potato APU' },
  { name: 'AMD Ryzen 3 3100 (4C/8T)', power: 40, cores: 4, tier: 'Zen 2 Entry' },
  { name: 'AMD Ryzen 3 2200G (APU / Vega 8)', power: 26, cores: 4, tier: 'Potato APU' },
  { name: 'AMD Ryzen 3 1300X / 1200 (4C/4T)', power: 25, cores: 4, tier: 'Zen 1 Entry' },
  { name: 'AMD Ryzen 3 5300U / 4300U (Laptop 4C)', power: 35, cores: 4, tier: 'Laptop Budget' },
  { name: 'AMD Ryzen 3 3250U / 2200U (Laptop 2C/4T)', power: 18, cores: 2, tier: 'Ultra Potato' },
  { name: 'Intel Core i5-14600K / 14600 (14 Cores)', power: 85, cores: 14, tier: 'Raptor Lake Refresh' },
  { name: 'Intel Core i5-13600K / 13600 (14 Cores)', power: 83, cores: 14, tier: 'Raptor Lake' },
  { name: 'Intel Core i5-13400F / 13400 (10 Cores)', power: 74, cores: 10, tier: 'Raptor Lake Mid' },
  { name: 'Intel Core i5-12600K (10 Cores)', power: 76, cores: 10, tier: 'Alder Lake' },
  { name: 'Intel Core i5-12400F / 12400 (6C/12T)', power: 66, cores: 6, tier: 'Alder Lake Mid' },
  { name: 'Intel Core i5-11400F / 11400 (6C/12T)', power: 58, cores: 6, tier: 'Rocket Lake' },
  { name: 'Intel Core i5-10400F / 10400 (6C/12T)', power: 52, cores: 6, tier: 'Comet Lake' },
  { name: 'Intel Core i5-9400F / 9400 (6C/6T)', power: 45, cores: 6, tier: 'Coffee Lake Refresh' },
  { name: 'Intel Core i5-8400 (6C/6T)', power: 42, cores: 6, tier: 'Coffee Lake' },
  { name: 'Intel Core i5-7400 / 7500 (4C/4T)', power: 32, cores: 4, tier: 'Kaby Lake' },
  { name: 'Intel Core i5-6400 / 6500 (4C/4T)', power: 28, cores: 4, tier: 'Skylake' },
  { name: 'Intel Core i5-4460 / 4590 / 4690K (Haswell)', power: 24, cores: 4, tier: 'Potato Classic' },
  { name: 'Intel Core i5-3470 / 3570K (Ivy Bridge)', power: 20, cores: 4, tier: 'Potato Classic' },
  { name: 'Intel Core i5-2400 / 2500K (Sandy Bridge)', power: 17, cores: 4, tier: 'Legacy Potato' },
  { name: 'Intel Core i5-1135G7 / 1235U (Laptop)', power: 45, cores: 4, tier: 'Laptop Iris Xe' },
  { name: 'Intel Core i5-8250U / 8265U (Laptop 4C/8T)', power: 26, cores: 4, tier: 'Laptop UHD 620' },
  { name: 'Intel Core i5-7200U / 6200U (Laptop 2C/4T)', power: 16, cores: 2, tier: 'Ultra Potato Laptop' },
  { name: 'Intel Core i5-5200U / 4200U (Laptop 2C/4T)', power: 13, cores: 2, tier: 'Ultra Potato Laptop' },
  { name: 'Intel Core i3-14100F / 14100 (4C/8T)', power: 56, cores: 4, tier: 'Raptor Lake Refresh' },
  { name: 'Intel Core i3-13100F / 13100 (4C/8T)', power: 54, cores: 4, tier: 'Raptor Lake Entry' },
  { name: 'Intel Core i3-12100F / 12100 (4C/8T)', power: 52, cores: 4, tier: 'Alder Lake Value King' },
  { name: 'Intel Core i3-10100F / 10100 (4C/8T)', power: 42, cores: 4, tier: 'Comet Lake Quad' },
  { name: 'Intel Core i3-9100F / 9100 (4C/4T)', power: 34, cores: 4, tier: 'Coffee Lake Entry' },
  { name: 'Intel Core i3-8100 (4C/4T)', power: 30, cores: 4, tier: 'Coffee Lake Entry' },
  { name: 'Intel Core i3-7100 (2C/4T)', power: 20, cores: 2, tier: 'Potato Dual Core' },
  { name: 'Intel Core i3-6100 (2C/4T)', power: 18, cores: 2, tier: 'Potato Dual Core' },
  { name: 'Intel Core i3-4130 / 4160 / 4170 (Haswell)', power: 15, cores: 2, tier: 'Potato Dual Core' },
  { name: 'Intel Core i3-3220 / 3240 (Ivy Bridge)', power: 12, cores: 2, tier: 'Legacy Potato' },
  { name: 'Intel Core i3-2100 / 2120 (Sandy Bridge)', power: 10, cores: 2, tier: 'Legacy Potato' },
  { name: 'Intel Core i3-1115G4 / 1215U (Laptop)', power: 32, cores: 2, tier: 'Laptop UHD' },
  { name: 'Intel Core i3-8130U / 7100U (Laptop 2C/4T)', power: 14, cores: 2, tier: 'Ultra Potato Laptop' },
  { name: 'Intel Core i3-6006U / 5005U (Laptop 2C/4T)', power: 11, cores: 2, tier: 'Ultra Potato Laptop' }
];

const GPUS = [
  { name: 'NVIDIA RTX 4090', power: 100, vram: 24, arch: 'Ada Lovelace' },
  { name: 'NVIDIA RTX 4080 Super', power: 92, vram: 16, arch: 'Ada Lovelace' },
  { name: 'AMD Radeon RX 7900 XTX', power: 90, vram: 24, arch: 'RDNA 3' },
  { name: 'NVIDIA RTX 4070 Super', power: 85, vram: 12, arch: 'Ada Lovelace' },
  { name: 'AMD Radeon RX 7800 XT', power: 83, vram: 16, arch: 'RDNA 3' },
  { name: 'NVIDIA RTX 4060', power: 68, vram: 8, arch: 'Ada Lovelace' },
  { name: 'AMD Radeon RX 6600', power: 58, vram: 8, arch: 'RDNA 2' },
  { name: 'NVIDIA GTX 1650 / 1050 Ti', power: 34, vram: 4, arch: 'Turing/Pascal' },
  { name: 'NVIDIA GT 1030 / 730 / 710', power: 14, vram: 2, arch: 'Potato Dedicated' },
  { name: 'AMD Radeon Vega 7 / Vega 8 / 680M', power: 24, vram: 2, arch: 'AMD APU iGPU' },
  { name: 'Intel Iris Xe Graphics (80/96 EU)', power: 22, vram: 2, arch: 'Intel Tiger/Alder iGPU' },
  { name: 'Intel UHD Graphics 620 / 630', power: 12, vram: 1, arch: 'Intel UHD iGPU' },
  { name: 'Intel HD Graphics 4000 / 4400 / 4600', power: 8, vram: 1, arch: 'Intel HD Potato' }
];

const MAC_CHIPS = [
  { name: 'Apple M4 Pro / Max (Metal 4)', power: 95, defaultMem: 36 },
  { name: 'Apple M3 Max (40-core GPU)', power: 88, defaultMem: 36 },
  { name: 'Apple M3 Pro (18-core GPU)', power: 72, defaultMem: 18 },
  { name: 'Apple M2 Pro (19-core GPU)', power: 65, defaultMem: 16 },
  { name: 'Apple M3 (10-core GPU)', power: 52, defaultMem: 16 },
  { name: 'Apple M2 (10-core GPU)', power: 45, defaultMem: 16 },
  { name: 'Apple M1 (8-core GPU)', power: 38, defaultMem: 8 }
];

function StudioApp() {
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState('landing');
  const [theme, setTheme] = useState('dark');
  const [platform, setPlatform] = useState('pc');
  const [targetMode, setTargetMode] = useState('competitive');
  const [selectedGameId, setSelectedGameId] = useState('cyberpunk2077');
  const [gamePassFilter, setGamePassFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // PC Rig State
  const [selectedCpu, setSelectedCpu] = useState(CPUS[7].name);
  const [selectedGpu, setSelectedGpu] = useState(GPUS[5].name);
  const [ramSize, setRamSize] = useState(16);
  const [ramSpeed, setRamSpeed] = useState('DDR4 (3200 MHz)');

  // Mac Unified Memory State
  const [selectedMacChip, setSelectedMacChip] = useState(MAC_CHIPS[2].name);
  const [macUnifiedMem, setMacUnifiedMem] = useState(18);

  const [resolution, setResolution] = useState('1080p');
  const [copied, setCopied] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);
  const [detectedString, setDetectedString] = useState('');

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const runBrowserHardwareDetection = () => {
    try {
      let rawGpu = '';
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          rawGpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
        }
      }

      const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;
      const memGB = typeof navigator !== 'undefined' && navigator.deviceMemory ? navigator.deviceMemory : 16;

      if (rawGpu) {
        const lowerGpu = rawGpu.toLowerCase();
        if (lowerGpu.includes('apple') || lowerGpu.includes('metal')) {
          setPlatform('mac');
          setSelectedMacChip(MAC_CHIPS[2].name);
          setMacUnifiedMem(18);
        } else if (lowerGpu.includes('4090')) {
          setSelectedGpu(GPUS[0].name);
        } else if (lowerGpu.includes('4080')) {
          setSelectedGpu(GPUS[1].name);
        } else if (lowerGpu.includes('7900')) {
          setSelectedGpu(GPUS[2].name);
        } else if (lowerGpu.includes('4070')) {
          setSelectedGpu(GPUS[3].name);
        } else if (lowerGpu.includes('7800')) {
          setSelectedGpu(GPUS[4].name);
        } else if (lowerGpu.includes('4060') || lowerGpu.includes('3060')) {
          setSelectedGpu(GPUS[5].name);
        } else if (lowerGpu.includes('6600') || lowerGpu.includes('5600 xt')) {
          setSelectedGpu(GPUS[6].name);
        } else if (lowerGpu.includes('1650') || lowerGpu.includes('1050')) {
          setSelectedGpu(GPUS[7].name);
        } else if (lowerGpu.includes('gt 1030') || lowerGpu.includes('gt 730') || lowerGpu.includes('gt 710')) {
          setPlatform('potato');
          setSelectedGpu(GPUS[8].name);
        } else if (lowerGpu.includes('vega') || lowerGpu.includes('radeon graphics')) {
          setPlatform('potato');
          setSelectedGpu(GPUS[9].name);
        } else if (lowerGpu.includes('iris')) {
          setSelectedGpu(GPUS[10].name);
        } else if (lowerGpu.includes('intel') || lowerGpu.includes('uhd') || lowerGpu.includes('hd graphics')) {
          setPlatform('potato');
          setSelectedGpu(GPUS[11].name);
        }
      }

      if (cores >= 24) {
        setSelectedCpu('Intel Core i9-14900K');
      } else if (cores >= 16) {
        setSelectedCpu('Intel Core i7-14700K');
      } else if (cores === 12 || cores === 14) {
        setSelectedCpu('Intel Core i5-13400F / 13400 (10 Cores)');
      } else if (cores === 8) {
        setSelectedCpu('AMD Ryzen 7 7800X3D');
      } else if (cores === 6) {
        setSelectedCpu('AMD Ryzen 5 5600X / 5600 (6C/12T)');
      } else if (cores === 4) {
        setSelectedCpu('Intel Core i3-12100F / 12100 (4C/8T)');
      } else {
        setPlatform('potato');
        setSelectedCpu('Intel Core i3-6100 (2C/4T)');
      }

      setRamSize(memGB >= 16 ? 16 : memGB >= 8 ? 8 : 4);
      setDetectedString(rawGpu ? `${rawGpu.slice(0, 32)}... (${cores} Cores)` : `${cores} Logical Cores Detected`);
      setAutoDetected(true);
      setCurrentView('app');
    } catch (e) {
      console.warn('Browser privacy prevented direct hardware readout:', e);
      setCurrentView('app');
    }
  };

  const platformFilteredGames = useMemo(() => {
    if (platform === 'potato') return ALL_GAMES.filter((g) => g.potatoTier === true);
    if (platform === 'mac') return ALL_GAMES.filter((g) => !g.macSupport.includes('Unsupported'));
    return ALL_GAMES;
  }, [platform]);

  const visibleGames = useMemo(() => {
    return platformFilteredGames.filter((g) => {
      const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            g.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGP = gamePassFilter ? g.gamePass : true;
      return matchesSearch && matchesGP;
    });
  }, [platformFilteredGames, searchQuery, gamePassFilter]);

  const activeGame = useMemo(() => {
    return platformFilteredGames.find((g) => g.id === selectedGameId) || platformFilteredGames[0] || ALL_GAMES[0];
  }, [platformFilteredGames, selectedGameId]);

  const hardwareScore = useMemo(() => {
    if (platform === 'mac') {
      const chip = MAC_CHIPS.find((c) => c.name === selectedMacChip) || MAC_CHIPS[0];
      const dynamicVram = Math.round(macUnifiedMem * 0.75);
      return { cpuScore: chip.power * 1.05, gpuScore: chip.power, maxVram: dynamicVram, totalRam: macUnifiedMem };
    }
    const cpu = CPUS.find((c) => c.name === selectedCpu) || CPUS[0];
    const gpu = GPUS.find((g) => g.name === selectedGpu) || GPUS[0];
    return { cpuScore: cpu.power, gpuScore: gpu.power, maxVram: gpu.vram, totalRam: ramSize };
  }, [platform, selectedCpu, selectedGpu, selectedMacChip, macUnifiedMem, ramSize]);

  const telemetry = useMemo(() => {
    const resMultipliers = { '720p': 1.35, '1080p': 1.0, '1440p': 0.72, '4K': 0.45 };
    const resMult = resMultipliers[resolution] || 1.0;
    const modeMult = targetMode === 'competitive' ? 1.25 : 0.92;

    const rawGpuRatio = hardwareScore.gpuScore / activeGame.baseGpuReq;
    const rawCpuRatio = hardwareScore.cpuScore / activeGame.baseCpuReq;

    const bottleneckRatio = rawCpuRatio / rawGpuRatio;
    let bottleneck = 'Balanced Pipeline';
    if (bottleneckRatio < 0.8) bottleneck = 'CPU Bottleneck (Frame Pacing Drops)';
    if (bottleneckRatio > 1.3) bottleneck = 'GPU Bottleneck (Shader Bound)';

    const baseTarget = 65 * rawGpuRatio * resMult * modeMult;
    const avgLow = Math.max(platform === 'potato' ? 52 : 18, Math.round(baseTarget * 0.92));
    const avgHigh = Math.max(platform === 'potato' ? 64 : 22, Math.round(baseTarget * 1.08));
    const onePercentLow = Math.max(platform === 'potato' ? 48 : 12, Math.round(avgLow * (bottleneckRatio < 0.8 ? 0.75 : 0.88)));

    const vramAllocated = Number((activeGame.baseVramReq * (resolution === '4K' ? 1.4 : resolution === '1440p' ? 1.18 : 1.0) * (targetMode === 'quality' ? 1.15 : 0.9)).toFixed(1));
    const vramStatus = vramAllocated > hardwareScore.maxVram ? 'VRAM OVERLOAD (Spillover Risk)' : 'Optimal Bandwidth';

    return { avgLow, avgHigh, onePercentLow, vramAllocated, maxVram: hardwareScore.maxVram, vramStatus, bottleneck };
  }, [hardwareScore, activeGame, resolution, targetMode, platform]);

  const copyConfiguration = () => {
    const text = `=== TUNEMYGAME PRECISION TELEMETRY REPORT ===
Mode: ${platform.toUpperCase()}
Game: ${activeGame.name} [${activeGame.engine} / ${activeGame.api}]
Rig: ${platform === 'mac' ? `${selectedMacChip} (${macUnifiedMem}GB Unified Memory)` : `${selectedCpu} | ${selectedGpu} | ${ramSize}GB ${ramSpeed}`}
Projected Output: ${telemetry.avgLow}-${telemetry.avgHigh} FPS (1% Lows: ~${telemetry.onePercentLow} FPS)
VRAM Allocation: ${telemetry.vramAllocated} GB / ${telemetry.maxVram} GB [${telemetry.vramStatus}]

Engineered by Ankur Roy (TuneMyGame Studio Pro)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#030712] text-zinc-100' : 'bg-zinc-50 text-zinc-900';
  const bgCard = isDark ? 'bg-zinc-900/50 border-zinc-800/90' : 'bg-white/80 border-zinc-200 shadow-sm';
  const bgHeader = isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white/90 border-zinc-200';
  const bgInput = isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-zinc-100 border-zinc-300 text-zinc-900';

  // View 1: Hero Landing
  if (currentView === 'landing') {
    return (
      <div className={`min-h-screen ${bgMain} flex flex-col justify-between font-mono selection:bg-emerald-500 selection:text-black transition-colors duration-300 relative overflow-hidden`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full"></div>

        <header className={`border-b ${bgHeader} backdrop-blur px-8 py-4 sticky top-0 z-50 transition-colors`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-sm shadow-sm shadow-emerald-500/50"></div>
              <span className="font-bold text-sm tracking-widest uppercase">
                TUNEMYGAME <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>// STUDIO PRO</span>
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={`p-2 rounded border text-xs font-bold transition flex items-center justify-center ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                    : 'bg-zinc-200 border-zinc-300 text-zinc-800 hover:bg-zinc-300'
                }`}
                title="Toggle Theme"
              >
                {isDark ? '☀ LIGHT' : '☾ DARK'}
              </button>

              <button
                onClick={() => setCurrentView('app')}
                className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer ${
                  isDark ? 'bg-zinc-100 hover:bg-white text-zinc-950' : 'bg-zinc-900 hover:bg-black text-white'
                }`}
              >
                Launch Studio →
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-20 flex-1 flex flex-col justify-center text-left relative z-10 space-y-24">
          <div>
            <div className={`inline-flex items-center space-x-3 px-3 py-1 border rounded w-fit mb-8 shadow-inner ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-zinc-200 border-zinc-300 text-zinc-700'
            }`}>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-xs tracking-wider">
                ENGINEERED BY <span className={isDark ? 'text-zinc-200 font-bold' : 'text-zinc-950 font-bold'}>ANKUR ROY</span> (AGE 16)
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Deterministic Hardware Telemetry. <br />
              <span className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>
                Stop Guessing. Lock Your 1% Lows.
              </span>
            </h1>

            <p className={`text-sm sm:text-base max-w-2xl leading-relaxed mb-10 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Publisher spec sheets are notoriously vague, leading to sudden stutters and VRAM overflows. 
              TuneMyGame accurately computes precise in-game sliders, 1% low frame targets, and memory thresholds across <strong className={isDark ? 'text-white' : 'text-zinc-900'}>800+ PC Titles</strong>, <strong className={isDark ? 'text-white' : 'text-zinc-900'}>550+ Mac Profiles</strong>, and a certified <strong className="text-amber-500">Potato Rig 50+ FPS mode</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={runBrowserHardwareDetection}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-widest rounded transition-all text-center cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                ⚡ 1-Click Auto-Detect My Rig
              </button>
              <button
                onClick={() => setCurrentView('app')}
                className={`px-8 py-4 border font-bold text-xs uppercase tracking-widest rounded transition-all text-center cursor-pointer ${
                  isDark ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-900'
                }`}
              >
                Manual Rig Calibrator ({ALL_GAMES.length} Profiles)
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b pb-3 border-zinc-800">
              <span className="text-xs uppercase font-bold text-emerald-500 tracking-widest block">HOW IT WORKS</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">The 3-Step Telemetry Engine</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 border rounded ${bgCard}`}>
                <span className="text-xs font-bold text-emerald-500 mb-2 block">STEP 01</span>
                <h3 className="font-bold text-sm mb-2">Hardware Bandwidth Mapping</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Detects or accepts your exact CPU instructions per clock (IPC), GPU compute raster power, and VRAM memory bus limit.
                </p>
              </div>

              <div className={`p-6 border rounded ${bgCard}`}>
                <span className="text-xs font-bold text-emerald-500 mb-2 block">STEP 02</span>
                <h3 className="font-bold text-sm mb-2">Bottleneck Isolation</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Analyzes if the game engine is bound by CPU draw-calls or GPU shaders, preventing frame-time micro-stuttering.
                </p>
              </div>

              <div className={`p-6 border rounded ${bgCard}`}>
                <span className="text-xs font-bold text-emerald-500 mb-2 block">STEP 03</span>
                <h3 className="font-bold text-sm mb-2">Precision Slider Blueprint</h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Outputs specific slider configurations: Volumetric Fog, Shadow Maps, Crowd Density, and Latency protocols.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-b pb-3 border-zinc-800">
              <span className="text-xs uppercase font-bold text-emerald-500 tracking-widest block">THE DIFFERENCE</span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Standard Requirements vs. Precision Telemetry</h2>
            </div>

            <div className={`border rounded overflow-x-auto ${bgCard}`}>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-zinc-800 bg-zinc-950/60' : 'border-zinc-200 bg-zinc-100/60'}`}>
                    <th className="p-3.5 font-bold">Metric / Feature</th>
                    <th className="p-3.5 font-bold text-rose-500">Generic Publisher Spec Sheet</th>
                    <th className="p-3.5 font-bold text-emerald-500">TuneMyGame Studio Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  <tr>
                    <td className="p-3.5 font-semibold">1% Low Frame Pacing</td>
                    <td className="p-3.5 text-zinc-500">Ignored (Only vague "Recommended" tags)</td>
                    <td className="p-3.5 text-emerald-400 font-bold">Deterministic 1% Low floor calculated</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold">VRAM Memory Overflow Guard</td>
                    <td className="p-3.5 text-zinc-500">Hidden until system RAM crashes FPS</td>
                    <td className="p-3.5 text-emerald-400 font-bold">Live VRAM allocation & safety meter</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold">Apple Silicon & Metal Translation</td>
                    <td className="p-3.5 text-zinc-500">Zero data for Mac gamers</td>
                    <td className="p-3.5 text-emerald-400 font-bold">550+ Native Metal 3/4 & CrossOver profiles</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold">Low-Spec Potato Certification</td>
                    <td className="p-3.5 text-zinc-500">Unplayable or misleading</td>
                    <td className="p-3.5 text-emerald-400 font-bold">300+ Verified 50+ FPS titles for iGPUs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className={`p-6 border rounded ${bgCard}`}>
              <span className="text-xs text-emerald-400 font-bold tracking-widest block mb-2">01 // ROCKSTAR SUITE</span>
              <h3 className="font-bold text-sm mb-1">Rockstar Master Database</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Complete catalog from GTA III to GTA V, RDR1/2, Max Payne 1–3, and Bully with SilentPatch directives.
              </p>
            </div>

            <div className={`p-6 border rounded ${bgCard}`}>
              <span className="text-xs text-zinc-500 font-bold tracking-widest block mb-2">02 // UNIFIED MEMORY</span>
              <h3 className="font-bold text-sm mb-1">Apple Silicon RAM Control</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Dynamically scale between 8GB and 128GB Unified Memory for Metal translation layers.
              </p>
            </div>

            <div className={`p-6 border rounded ${bgCard}`}>
              <span className="text-xs text-amber-500 font-bold tracking-widest block mb-2">03 // POTATO CERTIFIED</span>
              <h3 className="font-bold text-amber-400 text-sm mb-1">Guaranteed 50+ FPS</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Dedicated database calibrated specifically for older dual/quad-cores and integrated Intel/Vega graphics.
              </p>
            </div>
          </div>
        </main>

        <footer className={`border-t ${bgHeader} px-8 py-6 text-xs transition-colors`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center text-zinc-500">
            <span>© 2026 TuneMyGame Studio Pro</span>
            <span>Architect: Ankur Roy</span>
          </div>
        </footer>
      </div>
    );
  }

  // View 2: Studio Workspace
  return (
    <div className={`min-h-screen ${bgMain} flex flex-col justify-between font-mono selection:bg-emerald-500 selection:text-black transition-colors duration-300`}>
      <header className={`border-b ${bgHeader} backdrop-blur px-6 py-4 sticky top-0 z-50 transition-colors`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('landing')}
              className={`text-xs transition px-2.5 py-1 rounded border cursor-pointer ${
                isDark ? 'text-zinc-400 hover:text-white bg-zinc-900 border-zinc-800' : 'text-zinc-600 hover:text-black bg-zinc-100 border-zinc-300'
              }`}
            >
              ← Overview
            </button>
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('landing')}>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></div>
              <span className="font-bold text-sm tracking-widest uppercase">
                TuneMyGame <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>Studio Pro</span>
              </span>
            </div>
          </div>

          <div className={`flex items-center border rounded p-0.5 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-200 border-zinc-300'}`}>
            <button
              onClick={() => {
                setPlatform('pc');
                setSelectedGameId('cyberpunk2077');
              }}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                platform === 'pc'
                  ? isDark ? 'bg-zinc-100 text-zinc-950' : 'bg-white text-black shadow-sm'
                  : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
              }`}
            >
              PC RIG ({ALL_GAMES.length})
            </button>
            <button
              onClick={() => {
                setPlatform('mac');
                setSelectedGameId('bg3');
              }}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                platform === 'mac'
                  ? isDark ? 'bg-zinc-100 text-zinc-950' : 'bg-white text-black shadow-sm'
                  : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
              }`}
            >
              APPLE SILICON ({ALL_GAMES.filter((g) => !g.macSupport.includes('Unsupported')).length})
            </button>
            <button
              onClick={() => {
                setPlatform('potato');
                setSelectedCpu('Intel Core i3-6100 (2C/4T)');
                setSelectedGpu('Intel HD Graphics 4000 / 4400 / 4600');
                setRamSize(8);
                setResolution('720p');
                setSelectedGameId('hades');
              }}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                platform === 'potato' ? 'bg-amber-400 text-zinc-950 shadow-sm' : 'text-amber-500 hover:text-amber-400'
              }`}
            >
              🥔 POTATO (50+ FPS) ({ALL_GAMES.filter((g) => g.potatoTier === true).length})
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-1.5 rounded border text-xs font-bold transition ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                  : 'bg-zinc-100 border-zinc-300 text-zinc-800 hover:bg-zinc-200'
              }`}
              title="Toggle Theme"
            >
              {isDark ? '☀' : '☾'}
            </button>

            <button
              onClick={runBrowserHardwareDetection}
              className="text-xs bg-emerald-950 border border-emerald-700 hover:border-emerald-400 text-emerald-300 px-3 py-1 rounded transition flex items-center space-x-1 cursor-pointer"
            >
              <span>⚡ Auto-Detect My Rig</span>
            </button>
          </div>
        </div>
      </header>

      {autoDetected && (
        <div className="bg-emerald-950/80 border-b border-emerald-700/60 px-6 py-2.5 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span><strong>Hardware Scan Complete:</strong> {detectedString || 'Calibrated from system capabilities.'}</span>
          </div>
          <button onClick={() => setAutoDetected(false)} className="text-emerald-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-5 space-y-6">
          <div className={`border rounded p-6 backdrop-blur space-y-6 ${bgCard}`}>
            <div>
              <label className={`text-[10px] font-bold tracking-widest uppercase block mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Telemetry Profile
              </label>
              <div className={`grid grid-cols-2 gap-2 p-1 border rounded ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-300'}`}>
                <button
                  onClick={() => setTargetMode('competitive')}
                  className={`py-2 rounded text-xs font-bold transition-all cursor-pointer ${
                    targetMode === 'competitive'
                      ? isDark ? 'bg-zinc-100 text-zinc-950' : 'bg-white text-black shadow-sm'
                      : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  Competitive Max FPS
                </button>
                <button
                  onClick={() => setTargetMode('quality')}
                  className={`py-2 rounded text-xs font-bold transition-all cursor-pointer ${
                    targetMode === 'quality'
                      ? isDark ? 'bg-zinc-100 text-zinc-950' : 'bg-white text-black shadow-sm'
                      : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  Cinematic Fidelity
                </button>
              </div>
            </div>

            <div className="space-y-2 relative" ref={dropdownRef}>
              <div className="flex items-center justify-between">
                <label className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Target Title ({visibleGames.length} Titles Alphabetized)
                </label>
                <button
                  onClick={() => setGamePassFilter(!gamePassFilter)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                    gamePassFilter ? 'bg-emerald-950 border-emerald-700 text-emerald-300' : 'border-zinc-800 text-zinc-500'
                  }`}
                >
                  Game Pass Filter
                </button>
              </div>

              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-full border rounded px-3 py-2.5 text-xs text-left flex items-center justify-between cursor-pointer ${bgInput}`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="font-bold text-emerald-400">●</span>
                  <span className="font-bold truncate">{activeGame.name}</span>
                  <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>({activeGame.category})</span>
                </div>
                <span className="text-zinc-500 text-xs ml-2">{dropdownOpen ? '▲' : '▼'}</span>
              </button>

              {dropdownOpen && (
                <div className={`absolute left-0 right-0 top-full mt-1 z-30 border rounded p-2 shadow-2xl space-y-2 ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-300'
                }`}>
                  <input
                    type="text"
                    placeholder="Search A → Z titles or genres..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full border rounded px-3 py-1.5 text-xs focus:outline-none ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500' : 'bg-zinc-100 border-zinc-300 text-black placeholder-zinc-400'
                    }`}
                    autoFocus
                  />

                  <div className="max-h-56 overflow-y-auto space-y-1">
                    {visibleGames.map((game) => {
                      const isSelected = activeGame.id === game.id;
                      return (
                        <button
                          key={game.id}
                          type="button"
                          onClick={() => {
                            setSelectedGameId(game.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-xs transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500 text-zinc-950 font-bold'
                              : isDark ? 'text-zinc-300 hover:bg-zinc-900 hover:text-white' : 'text-zinc-700 hover:bg-zinc-100 hover:text-black'
                          }`}
                        >
                          <span className="truncate">{game.name}</span>
                          <span className={`text-[10px] ml-2 shrink-0 ${isSelected ? 'text-zinc-950' : 'text-zinc-500'}`}>
                            {game.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {platform !== 'mac' ? (
              <div className="space-y-4 pt-4 border-t border-zinc-800/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-[10px] font-bold tracking-widest uppercase block mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      CPU ({CPUS.length} Models)
                    </label>
                    <select
                      value={selectedCpu}
                      onChange={(e) => setSelectedCpu(e.target.value)}
                      className={`w-full border rounded px-3 py-2 text-xs focus:outline-none cursor-pointer ${bgInput}`}
                    >
                      {CPUS.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`text-[10px] font-bold tracking-widest uppercase block mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      GPU ({GPUS.length} Models)
                    </label>
                    <select
                      value={selectedGpu}
                      onChange={(e) => setSelectedGpu(e.target.value)}
                      className={`w-full border rounded px-3 py-2 text-xs focus:outline-none cursor-pointer ${bgInput}`}
                    >
                      {GPUS.map((g) => (
                        <option key={g.name} value={g.name}>{g.name} ({g.vram}GB)</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-[10px] font-bold tracking-widest uppercase block mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>RAM Capacity</label>
                    <select
                      value={ramSize}
                      onChange={(e) => setRamSize(Number(e.target.value))}
                      className={`w-full border rounded px-3 py-2 text-xs focus:outline-none cursor-pointer ${bgInput}`}
                    >
                      <option value={4}>4 GB</option>
                      <option value={8}>8 GB</option>
                      <option value={16}>16 GB</option>
                      <option value={32}>32 GB</option>
                      <option value={64}>64 GB</option>
                    </select>
                  </div>
                  <div>
                    <label className={`text-[10px] font-bold tracking-widest uppercase block mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>RAM Spec</label>
                    <select
                      value={ramSpeed}
                      onChange={(e) => setRamSpeed(e.target.value)}
                      className={`w-full border rounded px-3 py-2 text-xs focus:outline-none cursor-pointer ${bgInput}`}
                    >
                      <option value="DDR3 (1600 MHz)">DDR3 1600MHz</option>
                      <option value="DDR4 (3200 MHz)">DDR4 3200MHz</option>
                      <option value="DDR4 (3600 MHz)">DDR4 3600MHz</option>
                      <option value="DDR5 (5600 MHz)">DDR5 5600MHz</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-4 border-t border-zinc-800/60">
                <div>
                  <label className={`text-[10px] font-bold tracking-widest uppercase block mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Apple Silicon SoC</label>
                  <select
                    value={selectedMacChip}
                    onChange={(e) => setSelectedMacChip(e.target.value)}
                    className={`w-full border rounded px-3 py-2 text-xs focus:outline-none cursor-pointer ${bgInput}`}
                  >
                    {MAC_CHIPS.map((chip) => (
                      <option key={chip.name} value={chip.name}>{chip.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-[10px] font-bold tracking-widest uppercase block mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Unified Memory (Shared RAM / VRAM)
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                    {[8, 16, 18, 24, 36, 48, 64, 128].map((mem) => (
                      <button
                        key={mem}
                        type="button"
                        onClick={() => setMacUnifiedMem(mem)}
                        className={`py-1.5 rounded text-xs font-bold transition-all border cursor-pointer ${
                          macUnifiedMem === mem
                            ? isDark ? 'bg-zinc-100 border-zinc-100 text-zinc-950' : 'bg-zinc-900 border-zinc-900 text-white'
                            : isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 border-zinc-300 text-zinc-600 hover:text-black'
                        }`}
                      >
                        {mem}GB
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className={`text-[10px] font-bold tracking-widest uppercase block mb-2 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Display Resolution</label>
              <div className="grid grid-cols-4 gap-2">
                {['720p', '1080p', '1440p', '4K'].map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`py-2 rounded text-xs font-bold transition-all border cursor-pointer ${
                      resolution === res
                        ? isDark ? 'bg-zinc-100 border-zinc-100 text-zinc-950' : 'bg-zinc-900 border-zinc-900 text-white'
                        : isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-100 border-zinc-300 text-zinc-600 hover:text-black'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={copyConfiguration}
              className={`w-full py-3 font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer ${
                isDark ? 'bg-zinc-100 hover:bg-white text-zinc-950' : 'bg-zinc-900 hover:bg-black text-white'
              }`}
            >
              {copied ? '[✓] Configuration Copied' : 'Export Telemetry Profile'}
            </button>
          </div>
        </section>

        <section className="lg:col-span-7 space-y-6">
          <div className={`border rounded p-6 backdrop-blur space-y-6 ${bgCard}`}>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-bold">{activeGame.name}</h2>
                  {platform === 'potato' && (
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-500 border border-amber-400/40">
                      50+ FPS CERTIFIED
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {platform === 'mac'
                    ? `${selectedMacChip} • ${macUnifiedMem}GB Unified Memory`
                    : `${selectedCpu} / ${selectedGpu}`}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-[10px] uppercase block ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>System Pipeline</span>
                <span className="text-xs font-bold text-emerald-500">{telemetry.bottleneck}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`p-3 border rounded ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                <span className={`text-[10px] uppercase block mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>FPS Range</span>
                <span className="text-lg font-bold text-emerald-500">{telemetry.avgLow}-{telemetry.avgHigh}</span>
              </div>
              <div className={`p-3 border rounded ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                <span className={`text-[10px] uppercase block mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>1% Low Floor</span>
                <span className="text-lg font-bold text-cyan-500">~{telemetry.onePercentLow}</span>
              </div>
              <div className={`p-3 border rounded ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                <span className={`text-[10px] uppercase block mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>API Engine</span>
                <span className="text-xs font-bold block truncate">{activeGame.api}</span>
              </div>
              <div className={`p-3 border rounded ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
                <span className={`text-[10px] uppercase block mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Storage</span>
                <span className="text-xs font-bold block">{activeGame.disk}</span>
              </div>
            </div>

            <div className={`p-3 border rounded flex items-center justify-between text-xs ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}>
              <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Platform Compatibility:</span>
              <span className="font-bold">{activeGame.macSupport}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                  {platform === 'mac' ? 'Unified Dynamic VRAM Bandwidth:' : 'VRAM Memory Allocation:'}
                </span>
                <span className={`font-bold ${telemetry.vramAllocated > telemetry.maxVram ? 'text-red-500' : 'text-emerald-500'}`}>
                  {telemetry.vramAllocated} GB / {telemetry.maxVram} GB Max [{telemetry.vramStatus}]
                </span>
              </div>
              <div className={`w-full rounded h-2 overflow-hidden border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-200 border-zinc-300'}`}>
                <div
                  className={`h-full transition-all ${
                    telemetry.vramAllocated > telemetry.maxVram ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (telemetry.vramAllocated / (telemetry.maxVram || 4)) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <span className={`text-[10px] font-bold tracking-widest uppercase block ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Optimized Configuration Profile
              </span>

              <div className="space-y-1 text-xs">
                <div className={`p-2.5 rounded border flex items-center justify-between ${isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-zinc-100 border-zinc-200'}`}>
                  <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Render Scaling</span>
                  <span className="font-bold">
                    {platform === 'potato' ? '720p / 900p Native' : targetMode === 'competitive' ? '100% Native + Upscaler' : '100% Native'}
                  </span>
                </div>
                <div className={`p-2.5 rounded border flex items-center justify-between ${isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-zinc-100 border-zinc-200'}`}>
                  <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Texture Pool Quality</span>
                  <span className="font-bold">{hardwareScore.maxVram >= 4 ? 'Medium / High' : 'Low'}</span>
                </div>
                <div className={`p-2.5 rounded border flex items-center justify-between ${isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-zinc-100 border-zinc-200'}`}>
                  <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Shadow Map Resolution</span>
                  <span className="font-bold">{targetMode === 'competitive' || platform === 'potato' ? 'Low / Disabled' : 'High'}</span>
                </div>
                <div className={`p-2.5 rounded border flex items-center justify-between ${isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-zinc-100 border-zinc-200'}`}>
                  <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Volumetric Lighting / Fog</span>
                  <span className="font-bold">Low / Disabled</span>
                </div>
                <div className={`p-2.5 rounded border flex items-center justify-between ${isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-zinc-100 border-zinc-200'}`}>
                  <span className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>Low Latency Mode</span>
                  <span className="text-emerald-500 font-bold">Reflex On / Low Latency</span>
                </div>
              </div>
            </div>

            <div className={`p-3 border text-xs ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-100 border-zinc-200 text-zinc-800'}`}>
              <span className="font-bold text-emerald-500">ENGINEERING NOTE:</span> {activeGame.tips}
            </div>
          </div>
        </section>
      </main>

      <footer className={`border-t ${bgHeader} px-6 py-4 transition-colors`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-zinc-500">
          <span>TuneMyGame Studio Pro</span>
          <span>Architect: Ankur Roy</span>
        </div>
      </footer>
    </div>
  );
}