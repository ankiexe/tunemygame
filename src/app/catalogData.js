// Shared catalog data (plain ESM so Node scripts can import it).

export const RAW_GAMES_DATABASE = [
  // --- Complete Rockstar Master Collection ---
  { id: 'bully', name: 'Bully: Scholarship Edition', category: 'Rockstar Classics', engine: 'RenderWare', api: 'DirectX 9.0c', disk: '5 GB', gamePass: false, baseCpuReq: 16, baseGpuReq: 16, baseVramReq: 0.5, macSupport: 'CrossOver / Porting Kit', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Install SilentPatch and lock framerate to 30 or 60 FPS to prevent physics mission desyncs.' },
  { id: 'gta3', name: 'Grand Theft Auto III', category: 'Rockstar Classics', engine: 'RenderWare / UE4', api: 'DirectX 9 / DX11', disk: '2 GB', gamePass: false, baseCpuReq: 12, baseGpuReq: 12, baseVramReq: 0.5, macSupport: 'Native Legacy / CrossOver', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Frame limiter ON is required in classic versions to avoid game speed double-clocking.' },
  { id: 'gta_vc', name: 'Grand Theft Auto: Vice City', category: 'Rockstar Classics', engine: 'RenderWare / UE4', api: 'DirectX 9 / DX11', disk: '2 GB', gamePass: false, baseCpuReq: 12, baseGpuReq: 12, baseVramReq: 0.5, macSupport: 'Native Legacy / CrossOver', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Runs locked at maximum refresh rate on virtually all integrated graphics.' },
  { id: 'gta_sa', name: 'Grand Theft Auto: San Andreas', category: 'Rockstar Classics', engine: 'RenderWare / UE4', api: 'DirectX 9 / DX11', disk: '5 GB', gamePass: false, baseCpuReq: 14, baseGpuReq: 14, baseVramReq: 0.5, macSupport: 'Native Legacy / CrossOver', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Use SilentPatch and Widescreen Fix for flawless 1080p/4K rendering without stretching.' },
  { id: 'gta4', name: 'Grand Theft Auto IV: Complete Edition', category: 'Rockstar Open World', engine: 'RAGE (Early)', api: 'DirectX 9.0c', disk: '22 GB', gamePass: false, baseCpuReq: 42, baseGpuReq: 40, baseVramReq: 2.0, macSupport: 'CrossOver 24+ (DXVK)', macTier: 'M1 Pro or higher', potatoTier: true, tips: 'Add DXVK (Vulkan translation) to eliminate PC port stuttering and fix CPU bottlenecking.' },
  { id: 'gta4_eflc', name: 'Grand Theft Auto: Episodes from Liberty City', category: 'Rockstar Open World', engine: 'RAGE', api: 'DirectX 9.0c', disk: '20 GB', gamePass: false, baseCpuReq: 42, baseGpuReq: 40, baseVramReq: 2.0, macSupport: 'CrossOver 24+', macTier: 'M1 Pro or higher', potatoTier: true, tips: 'Set View Distance to 30; exceeding 40 severely taxes CPU draw call buffers with zero visual gain.' },
  { id: 'gta5', name: 'Grand Theft Auto V / GTA Online', category: 'Rockstar Open World', engine: 'RAGE', api: 'DirectX 11', disk: '110 GB', gamePass: true, baseCpuReq: 45, baseGpuReq: 48, baseVramReq: 3.5, macSupport: 'CrossOver 24+ (Flawless)', macTier: 'Any Apple Silicon', potatoTier: false, tips: 'Turn Grass Quality down from Ultra to High for an immediate 20+ FPS recovery in rural areas.' },
  { id: 'lanoire', name: 'L.A. Noire', category: 'Rockstar Detective', engine: 'Custom / RAGE', api: 'DirectX 9 / DX11', disk: '16 GB', gamePass: false, baseCpuReq: 36, baseGpuReq: 38, baseVramReq: 1.5, macSupport: 'CrossOver / Porting Kit', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Native 30 FPS facial capture engine. Use widescreen unlocker for 60 FPS gameplay.' },
  { id: 'manhunt', name: 'Manhunt', category: 'Rockstar Classics', engine: 'RenderWare', api: 'DirectX 8.1 / DX9', disk: '3 GB', gamePass: false, baseCpuReq: 10, baseGpuReq: 10, baseVramReq: 0.2, macSupport: 'CrossOver / Wine', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Requires Windows 98/XP compatibility mode and audio patch on modern Windows 10/11.' },
  { id: 'maxpayne1', name: 'Max Payne 1', category: 'Rockstar Classics', engine: 'MAX-FX', api: 'DirectX 8', disk: '2 GB', gamePass: false, baseCpuReq: 10, baseGpuReq: 10, baseVramReq: 0.2, macSupport: 'CrossOver / Wine', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Install Startup Sound & Widescreen Fix to prevent modern CPU black-screen crashes.' },
  { id: 'maxpayne2', name: 'Max Payne 2: The Fall of Max Payne', category: 'Rockstar Classics', engine: 'MAX-FX 2', api: 'DirectX 9', disk: '2 GB', gamePass: false, baseCpuReq: 12, baseGpuReq: 12, baseVramReq: 0.3, macSupport: 'CrossOver / Wine', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Runs at hundreds of FPS; enable V-Sync to prevent Havok ragdoll physics desyncs.' },
  { id: 'maxpayne3', name: 'Max Payne 3', category: 'Rockstar Action Shooter', engine: 'RAGE', api: 'DirectX 11', disk: '35 GB', gamePass: false, baseCpuReq: 42, baseGpuReq: 45, baseVramReq: 2.0, macSupport: 'CrossOver 24+ (Metal)', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'One of the most optimized PC ports in history; easily hits 60+ FPS on budget GPUs with MSAA off.' },
  { id: 'rdr1', name: 'Red Dead Redemption 1 (PC Remaster)', category: 'Rockstar Western', engine: 'RAGE', api: 'DirectX 12', disk: '12 GB SSD', gamePass: false, baseCpuReq: 50, baseGpuReq: 52, baseVramReq: 4.0, macSupport: 'CrossOver 24+ / GPTK', macTier: 'M1 Pro or higher', potatoTier: false, tips: 'Native ultrawide and DLSS/FSR support; runs cleanly at high refresh rates.' },
  { id: 'rdr2', name: 'Red Dead Redemption 2', category: 'Rockstar Western', engine: 'RAGE', api: 'Vulkan / DirectX 12', disk: '120 GB SSD', gamePass: false, baseCpuReq: 72, baseGpuReq: 75, baseVramReq: 6.0, macSupport: 'CrossOver 24+ (Experimental)', macTier: 'M2 Max or higher', potatoTier: false, tips: 'Use Vulkan API on Windows. Set Volumetric Raymarch Resolution to Medium for a 12% GPU boost.' },

  // --- Spider-Man & Superhero Sagas ---
  { id: 'spiderman_remastered', name: "Marvel's Spider-Man Remastered", category: 'Open World Superhero', engine: 'Insomniac Engine', api: 'DirectX 12', disk: '75 GB SSD', gamePass: false, baseCpuReq: 78, baseGpuReq: 74, baseVramReq: 6.0, macSupport: 'CrossOver 24+ / GPTK', macTier: 'M2 Max / M3 Pro', potatoTier: false, tips: 'Web-swinging is heavily CPU thread bound. Lower Crowd Density to relieve bottlenecks.' },
  { id: 'spiderman_mm', name: "Marvel's Spider-Man: Miles Morales", category: 'Open World Superhero', engine: 'Insomniac Engine', api: 'DirectX 12', disk: '75 GB SSD', gamePass: false, baseCpuReq: 60, baseGpuReq: 65, baseVramReq: 5.0, macSupport: 'CrossOver 24+ / GPTK', macTier: 'M2 Pro min', potatoTier: false, tips: 'Lower Crowd Density and Hair Quality to stabilize frame pacing during winter snow sequences.' },
  { id: 'spiderman_2', name: "Marvel's Spider-Man 2", category: 'Open World Superhero', engine: 'Insomniac Engine', api: 'DirectX 12 Ultimate', disk: '140 GB SSD', gamePass: false, baseCpuReq: 82, baseGpuReq: 88, baseVramReq: 7.5, macSupport: 'Unsupported (DirectX 12 / Windows)', macTier: 'Windows Only', potatoTier: false, tips: 'Requires Fast SSD streaming and DLSS/FSR Quality mode to handle high-velocity web wings.' },
  { id: 'batman_arkham_knight', name: 'Batman: Arkham Knight', category: 'Action Superhero', engine: 'Unreal Engine 3.5', api: 'DirectX 11', disk: '55 GB', gamePass: true, baseCpuReq: 50, baseGpuReq: 55, baseVramReq: 4.0, macSupport: 'CrossOver 24+', macTier: 'M1 Pro or higher', potatoTier: false, tips: 'Disable Interactive Smoke / Fog in NVIDIA Gameworks for instant 20+ FPS in Batmobile.' },
  { id: 'batman_arkham_city', name: 'Batman: Arkham City GOTY', category: 'Action Superhero', engine: 'Unreal Engine 3', api: 'DirectX 9 / DX11', disk: '18 GB', gamePass: false, baseCpuReq: 25, baseGpuReq: 25, baseVramReq: 1.5, macSupport: 'Native macOS / CrossOver', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Run in DirectX 9 mode on budget systems to bypass DirectX 11 shader hitching.' },
  { id: 'batman_arkham_asylum', name: 'Batman: Arkham Asylum GOTY', category: 'Action Superhero', engine: 'Unreal Engine 3', api: 'DirectX 9', disk: '9 GB', gamePass: false, baseCpuReq: 20, baseGpuReq: 20, baseVramReq: 1.0, macSupport: 'Native macOS / CrossOver', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Flawless 60+ FPS on almost all integrated Intel and AMD APU graphics.' },

  // --- Forza Racing Master Collection ---
  { id: 'forza_horizon_5', name: 'Forza Horizon 5', category: 'Open World Racing', engine: 'ForzaTech', api: 'DirectX 12', disk: '110 GB SSD', gamePass: true, baseCpuReq: 55, baseGpuReq: 60, baseVramReq: 5.0, macSupport: 'CrossOver 23.7+', macTier: 'M2 Max / M3 Pro', potatoTier: false, tips: 'MSAA 4x has lower CPU latency overhead than TAA in dense jungle and dust biomes.' },
  { id: 'forza_horizon_4', name: 'Forza Horizon 4', category: 'Open World Racing', engine: 'ForzaTech', api: 'DirectX 12', disk: '90 GB SSD', gamePass: true, baseCpuReq: 48, baseGpuReq: 52, baseVramReq: 4.0, macSupport: 'CrossOver 24+', macTier: 'M1 Pro or higher', potatoTier: false, tips: 'Runs exceptionally well on midrange cards; set Shadow Quality to High for locked 60+ FPS.' },
  { id: 'forza_horizon_3', name: 'Forza Horizon 3', category: 'Open World Racing', engine: 'ForzaTech', api: 'DirectX 12', disk: '60 GB', gamePass: false, baseCpuReq: 50, baseGpuReq: 54, baseVramReq: 4.0, macSupport: 'Unsupported', macTier: 'Windows Only', potatoTier: false, tips: 'Lock FPS to 60 in video settings to prevent frame time spikes in Surfers Paradise city.' },
  { id: 'forza_motorsport_2023', name: 'Forza Motorsport (2023)', category: 'Track Simulator', engine: 'ForzaTech', api: 'DirectX 12 Ray Tracing', disk: '130 GB SSD', gamePass: true, baseCpuReq: 82, baseGpuReq: 85, baseVramReq: 8.0, macSupport: 'Unsupported', macTier: 'Windows Only', potatoTier: false, tips: 'Turn off Ray-Traced Ambient Occlusion to regain up to 28% GPU performance.' },
  { id: 'forza_motorsport_7', name: 'Forza Motorsport 7', category: 'Track Simulator', engine: 'ForzaTech', api: 'DirectX 12', disk: '100 GB', gamePass: false, baseCpuReq: 45, baseGpuReq: 48, baseVramReq: 3.5, macSupport: 'Unsupported', macTier: 'Windows Only', potatoTier: false, tips: 'Native 4K 60 FPS optimized on moderate GPUs; keep resolution scale at 100%.' },

  // --- Need for Speed Racing Master Collection ---
  { id: 'nfs_unbound', name: 'Need for Speed Unbound', category: 'Arcade Racing', engine: 'Frostbite 3', api: 'DirectX 12', disk: '50 GB SSD', gamePass: true, baseCpuReq: 74, baseGpuReq: 78, baseVramReq: 6.0, macSupport: 'Unsupported (EA App)', macTier: 'Windows Only', potatoTier: false, tips: 'Turn off Dynamic Resolution Scaling and use DLSS/FSR Balanced mode for sharper textures.' },
  { id: 'nfs_heat', name: 'Need for Speed Heat', category: 'Arcade Racing', engine: 'Frostbite 3', api: 'DirectX 11', disk: '50 GB', gamePass: true, baseCpuReq: 52, baseGpuReq: 58, baseVramReq: 4.0, macSupport: 'Unsupported (EA App)', macTier: 'Windows Only', potatoTier: false, tips: 'Cap framerate at 60 FPS to avoid sudden physics hiccups in night pursuit events.' },
  { id: 'nfs_payback', name: 'Need for Speed Payback', category: 'Arcade Racing', engine: 'Frostbite 3', api: 'DirectX 11', disk: '30 GB', gamePass: true, baseCpuReq: 44, baseGpuReq: 48, baseVramReq: 3.0, macSupport: 'CrossOver 24+', macTier: 'M1 Pro or higher', potatoTier: false, tips: 'Set Ambient Occlusion to HBAO for clean performance-to-visual fidelity ratio.' },
  { id: 'nfs_2015', name: 'Need for Speed (2015)', category: 'Arcade Racing', engine: 'Frostbite 3', api: 'DirectX 11', disk: '30 GB', gamePass: true, baseCpuReq: 46, baseGpuReq: 50, baseVramReq: 3.5, macSupport: 'CrossOver 24+', macTier: 'M1 Pro or higher', potatoTier: false, tips: 'Lower Motion Blur and Film Grain to enhance visual clarity in dark wet city streets.' },
  { id: 'nfs_rivals', name: 'Need for Speed Rivals', category: 'Arcade Racing', engine: 'Frostbite 3', api: 'DirectX 11', disk: '30 GB', gamePass: true, baseCpuReq: 38, baseGpuReq: 40, baseVramReq: 2.0, macSupport: 'CrossOver 24+', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Hard-coded 30 FPS cap. Use launch command "-GameTime.MaxSimFps 60" for 60 FPS.' },
  { id: 'nfs_most_wanted_2012', name: 'Need for Speed Most Wanted (2012)', category: 'Arcade Racing', engine: 'Chameleon', api: 'DirectX 11', disk: '12 GB', gamePass: false, baseCpuReq: 32, baseGpuReq: 34, baseVramReq: 1.5, macSupport: 'CrossOver 24+', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Runs at 60+ FPS on modern budget graphics cards with Headlight Shadows on Medium.' },
  { id: 'nfs_hot_pursuit_remastered', name: 'Need for Speed Hot Pursuit Remastered', category: 'Arcade Racing', engine: 'Chameleon', api: 'DirectX 11', disk: '45 GB', gamePass: true, baseCpuReq: 30, baseGpuReq: 32, baseVramReq: 2.0, macSupport: 'CrossOver 24+', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Extremely well-optimized PC port; easily handles 60+ FPS on budget GPUs.' },
  { id: 'nfs_underground_2', name: 'Need for Speed: Underground 2', category: 'Arcade Racing', engine: 'EAGL', api: 'DirectX 9.0c', disk: '2 GB', gamePass: false, baseCpuReq: 10, baseGpuReq: 10, baseVramReq: 0.2, macSupport: 'CrossOver / Wine', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Install Widescreen Fix and HD Textures for modern 1080p/4K resolution support.' },
  { id: 'nfs_most_wanted_2005', name: 'Need for Speed: Most Wanted (2005)', category: 'Arcade Racing', engine: 'EAGL 3', api: 'DirectX 9.0c', disk: '3 GB', gamePass: false, baseCpuReq: 12, baseGpuReq: 12, baseVramReq: 0.3, macSupport: 'CrossOver / Wine', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Use Extra-Options script and Widescreen patch for 60+ FPS at widescreen displays.' },
  { id: 'nfs_carbon', name: 'Need for Speed: Carbon', category: 'Arcade Racing', engine: 'EAGL 4', api: 'DirectX 9.0c', disk: '5 GB', gamePass: false, baseCpuReq: 14, baseGpuReq: 14, baseVramReq: 0.4, macSupport: 'CrossOver / Wine', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Canyon drift physics remain stable at 60+ FPS on almost any low-spec computer.' },

  // --- AAA Blockbusters & Esports Staples ---
  { id: 'alankwake2', name: 'Alan Wake 2', category: 'Survival Horror', engine: 'Northlight', api: 'DirectX 12 Mesh Shaders', disk: '90 GB SSD', gamePass: false, baseCpuReq: 88, baseGpuReq: 95, baseVramReq: 8.0, macSupport: 'Unsupported (Mesh Shaders)', macTier: 'Windows Only', potatoTier: false, tips: 'DirectX 12 Mesh Shaders require modern GPUs for playable frame rates.' },
  { id: 'apexlegends', name: 'Apex Legends', category: 'Battle Royale', engine: 'Source (Modified)', api: 'DirectX 11 / 12', disk: '75 GB SSD', gamePass: false, baseCpuReq: 55, baseGpuReq: 60, baseVramReq: 4.5, macSupport: 'Unsupported (Anti-Cheat)', macTier: 'Windows Only', potatoTier: false, tips: 'Cap framerate at 180 FPS on high refresh monitors to prevent frame pacing spikes.' },
  { id: 'ark_survival_ascended', name: 'ARK: Survival Ascended', category: 'Dinosaur Survival', engine: 'Unreal Engine 5.2', api: 'DirectX 12', disk: '85 GB SSD', gamePass: true, baseCpuReq: 86, baseGpuReq: 92, baseVramReq: 7.5, macSupport: 'Unsupported', macTier: 'Windows Only', potatoTier: false, tips: 'Type "r.VolumetricCloud 0" in console to gain up to 25 FPS instantly.' },
  { id: 'balatro', name: 'Balatro', category: 'Roguelike Poker', engine: 'LÖVE (Lua)', api: 'Metal / OpenGL', disk: '200 MB', gamePass: true, baseCpuReq: 12, baseGpuReq: 12, baseVramReq: 0.5, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Operates at locked 60+ FPS on virtually any hardware.' },
  { id: 'bg3', name: "Baldur's Gate 3", category: 'CRPG', engine: 'Divinity Engine 4.0', api: 'Metal 3 / Vulkan', disk: '150 GB SSD', gamePass: false, baseCpuReq: 75, baseGpuReq: 70, baseVramReq: 5.5, macSupport: 'Native Apple Silicon (Metal 3)', macTier: 'M1 / M2 / M3 Full Native', potatoTier: false, tips: 'Runs natively on macOS with Metal 3. On PC, Vulkan reduces Act 3 CPU overhead.' },
  { id: 'blackmythwukong', name: 'Black Myth: Wukong', category: 'Action RPG', engine: 'Unreal Engine 5', api: 'DirectX 12', disk: '130 GB SSD', gamePass: false, baseCpuReq: 90, baseGpuReq: 94, baseVramReq: 7.8, macSupport: 'CrossOver 24+ / D3DMetal', macTier: 'M3 Max recommended', potatoTier: false, tips: 'DLSS/FSR Balanced mode is required to maintain smooth 1% lows across foliage areas.' },
  { id: 'brotato', name: 'Brotato', category: 'Top-Down Arena Shooter', engine: 'Godot', api: 'Vulkan / OpenGL', disk: '500 MB', gamePass: true, baseCpuReq: 14, baseGpuReq: 14, baseVramReq: 0.5, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Turn off damage numbers and screen shake in wave 20+ to keep 60 FPS on potato CPUs.' },
  { id: 'celeste', name: 'Celeste', category: 'Precision Platformer', engine: 'XNA / FNA', api: 'Metal / OpenGL', disk: '2 GB', gamePass: true, baseCpuReq: 12, baseGpuReq: 12, baseVramReq: 0.5, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Extremely lightweight footprint; reaches 144+ FPS on virtually any hardware.' },
  { id: 'civ6', name: "Sid Meier's Civilization VI", category: 'Turn-Based 4X Strategy', engine: 'Custom Engine', api: 'Metal / DX12', disk: '25 GB', gamePass: true, baseCpuReq: 50, baseGpuReq: 40, baseVramReq: 3.0, macSupport: 'Native Apple Silicon (Metal)', macTier: 'Any M-Series', potatoTier: false, tips: 'Late-game turn calculations rely on single-core CPU speeds. Disable animated leaders.' },
  { id: 'cod4_mw', name: 'Call of Duty 4: Modern Warfare (2007)', category: 'Classic Military FPS', engine: 'IW 3.0', api: 'DirectX 9.0c', disk: '8 GB', gamePass: false, baseCpuReq: 18, baseGpuReq: 18, baseVramReq: 0.5, macSupport: 'CrossOver / Legacy', macTier: 'Any M-Series', potatoTier: true, tips: 'DirectX 9 pipeline easily runs 100+ FPS on modern integrated Intel UHD graphics.' },
  { id: 'cod_waw', name: 'Call of Duty: World at War (2008)', category: 'Classic WWII Shooter', engine: 'IW 3.0', api: 'DirectX 9.0c', disk: '8 GB', gamePass: false, baseCpuReq: 20, baseGpuReq: 20, baseVramReq: 0.5, macSupport: 'CrossOver / Legacy', macTier: 'Any M-Series', potatoTier: true, tips: 'Cap framerate at 60 FPS to prevent campaign tank physics desyncs.' },
  { id: 'cod_warzone', name: 'Call of Duty: Warzone / MW3', category: 'Military Shooter', engine: 'IW 9.0', api: 'DirectX 12', disk: '125 GB SSD', gamePass: true, baseCpuReq: 78, baseGpuReq: 82, baseVramReq: 6.8, macSupport: 'Unsupported (Ricochet Anti-Cheat)', macTier: 'Windows Only', potatoTier: false, tips: 'Set VRAM Target Scale to 70% in graphics settings to eliminate stuttering in large maps.' },
  { id: 'cs2', name: 'Counter-Strike 2', category: 'Tactical Shooter', engine: 'Source 2', api: 'DirectX 11 / Vulkan', disk: '50 GB SSD', gamePass: false, baseCpuReq: 50, baseGpuReq: 55, baseVramReq: 3.5, macSupport: 'Unsupported by Valve on macOS', macTier: 'Windows Only', potatoTier: false, tips: 'Set Particle Detail to Low to maximize visibility through smoke grenades and incendiaries.' },
  { id: 'cyberpunk2077', name: 'Cyberpunk 2077: Phantom Liberty', category: 'Open World RPG', engine: 'REDengine 4', api: 'DirectX 12 Ultimate', disk: '70 GB SSD', gamePass: false, baseCpuReq: 85, baseGpuReq: 90, baseVramReq: 7.2, macSupport: 'CrossOver 24+ / GPTK 2', macTier: 'M2 Pro / M3 Pro min', potatoTier: false, tips: 'Lower Volumetric Fog to Medium to gain ~14% FPS with near-zero visual degradation.' },
  { id: 'deadcells', name: 'Dead Cells', category: 'Roguevania Action', engine: 'Heaps.io', api: 'Metal / OpenGL', disk: '2 GB', gamePass: true, baseCpuReq: 20, baseGpuReq: 20, baseVramReq: 1.0, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Lock display to 60 FPS or 120 FPS for consistent weapon parry timing.' },
  { id: 'deathstranding', name: "Death Stranding: Director's Cut", category: 'Action Adventure', engine: 'Decima Engine', api: 'Metal 3 / DX12', disk: '80 GB SSD', gamePass: true, baseCpuReq: 60, baseGpuReq: 65, baseVramReq: 5.0, macSupport: 'Native Apple Silicon (Metal 3)', macTier: 'M1 Pro or higher', potatoTier: false, tips: 'Enable MetalFX Upscaling in Quality mode for stable 60 FPS on Apple Silicon chips.' },
  { id: 'eldenring', name: 'Elden Ring: Shadow of the Erdtree', category: 'Souls-like Action', engine: 'FromEngine', api: 'DirectX 12', disk: '60 GB SSD', gamePass: false, baseCpuReq: 75, baseGpuReq: 78, baseVramReq: 5.8, macSupport: 'CrossOver 24+ / GPTK 2', macTier: 'M2 Max / M3 Pro', potatoTier: false, tips: 'Cap at 60 FPS and disable Ray Tracing to eliminate sudden frame drops during boss attacks.' },
  { id: 'fallout_nv', name: 'Fallout: New Vegas', category: 'Post-Apocalyptic RPG', engine: 'Gamebryo', api: 'DirectX 9.0c', disk: '10 GB', gamePass: true, baseCpuReq: 25, baseGpuReq: 25, baseVramReq: 1.0, macSupport: 'CrossOver 24+', macTier: 'Any M-Series', potatoTier: true, tips: 'Apply 4GB Patch utility and cap framerate to 60 FPS to prevent Havok physics desync.' },
  { id: 'fortnite', name: 'Fortnite (Battle Royale)', category: 'Battle Royale', engine: 'Unreal Engine 5.4', api: 'DirectX 12 / Perf Mode', disk: '60 GB SSD', gamePass: false, baseCpuReq: 60, baseGpuReq: 65, baseVramReq: 4.0, macSupport: 'Unsupported', macTier: 'Cloud Gaming Only', potatoTier: false, tips: 'Use Performance Mode (DirectX 11 legacy) on midrange CPUs for highest 1% lows.' },
  { id: 'godofwar', name: 'God of War (2018)', category: 'Action Adventure', engine: 'Santa Monica Engine', api: 'DirectX 11', disk: '70 GB SSD', gamePass: false, baseCpuReq: 68, baseGpuReq: 70, baseVramReq: 5.0, macSupport: 'CrossOver 24+', macTier: 'M2 Pro min', potatoTier: false, tips: 'Set Original preset textures and use FSR 2.0 Quality mode for seamless 60+ FPS frame times.' },
  { id: 'hades', name: 'Hades', category: 'Isometric Roguelike', engine: 'The Forge', api: 'Metal / DX11', disk: '15 GB', gamePass: false, baseCpuReq: 22, baseGpuReq: 20, baseVramReq: 1.5, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Easily locks 60+ FPS even on older Intel UHD / Vega integrated graphics.' },
  { id: 'hades2', name: 'Hades II', category: 'Isometric Roguelike', engine: 'The Forge', api: 'Metal / DX11', disk: '10 GB', gamePass: false, baseCpuReq: 25, baseGpuReq: 22, baseVramReq: 1.8, macSupport: 'Native / Rosetta 2', macTier: 'Any M-Series', potatoTier: true, tips: 'Fullscreen borderless provides minimal input latency on 60Hz and 120Hz panels.' },
  { id: 'helldivers2', name: 'HELLDIVERS 2', category: 'Co-op Extraction Shooter', engine: 'Bitsquid / Stingray', api: 'DirectX 12', disk: '70 GB SSD', gamePass: false, baseCpuReq: 84, baseGpuReq: 80, baseVramReq: 6.5, macSupport: 'Unsupported (nProtect Anti-Cheat)', macTier: 'Windows Only', potatoTier: false, tips: 'Reduce Volumetric Fog and Space Quality to Low to preserve 60 FPS in heavy bug swarms.' },
  { id: 'hollowknight', name: 'Hollow Knight', category: 'Metroidvania Action', engine: 'Unity', api: 'Metal / OpenGL', disk: '9 GB', gamePass: true, baseCpuReq: 18, baseGpuReq: 18, baseVramReq: 1.0, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Guaranteed 60+ FPS on budget dual-core laptops with zero frame drops.' },
  { id: 'liesofp', name: 'Lies of P', category: 'Souls-like Action', engine: 'Unreal Engine 4', api: 'Metal 3 / DX12', disk: '50 GB SSD', gamePass: true, baseCpuReq: 62, baseGpuReq: 68, baseVramReq: 5.2, macSupport: 'Native Apple Silicon (Metal 3)', macTier: 'M1 / M2 / M3 Full Native', potatoTier: false, tips: 'Native Metal build runs with ultra-low latency. Lock at 60 FPS for precise parry windows.' },
  { id: 'portal2', name: 'Portal 2', category: 'First-Person Puzzle', engine: 'Source', api: 'DirectX 9 / Vulkan', disk: '8 GB', gamePass: false, baseCpuReq: 20, baseGpuReq: 22, baseVramReq: 0.8, macSupport: 'CrossOver / Legacy', macTier: 'Any M-Series', potatoTier: true, tips: 'Source engine runs at 60–120+ FPS on 10-year-old Intel HD graphics.' },
  { id: 'rainbowsixsiege', name: "Tom Clancy's Rainbow Six Siege", category: 'Tactical Shooter', engine: 'AnvilNext 2.0', api: 'Vulkan / DirectX 11', disk: '60 GB', gamePass: true, baseCpuReq: 48, baseGpuReq: 50, baseVramReq: 3.5, macSupport: 'Unsupported (BattlEye)', macTier: 'Windows Only', potatoTier: false, tips: 'Run the Vulkan executable to unlock Raw Input support and lower frame render latency.' },
  { id: 'residentevil4remake', name: 'Resident Evil 4 Remake', category: 'Survival Horror', engine: 'RE Engine', api: 'Metal 3 / DX12', disk: '65 GB SSD', gamePass: false, baseCpuReq: 70, baseGpuReq: 75, baseVramReq: 6.0, macSupport: 'Native Apple Silicon (Metal 3)', macTier: 'M2 / M3 Full Native', potatoTier: false, tips: 'Cap VRAM allocation to 2GB below maximum in settings to prevent texture pop-in.' },
  { id: 'rocketleague', name: 'Rocket League', category: 'Vehicular Soccer', engine: 'Unreal Engine 3', api: 'DirectX 11', disk: '20 GB', gamePass: false, baseCpuReq: 25, baseGpuReq: 28, baseVramReq: 1.5, macSupport: 'CrossOver 24+ (Flawless)', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Turn off Depth of Field and Bloom for absolute maximum clarity during aerial ball tracking.' },
  { id: 'skyrim_le', name: 'The Elder Scrolls V: Skyrim (Original)', category: 'Open World Fantasy RPG', engine: 'Creation Engine (32-bit)', api: 'DirectX 9.0c', disk: '12 GB', gamePass: false, baseCpuReq: 28, baseGpuReq: 28, baseVramReq: 1.0, macSupport: 'CrossOver 24+', macTier: 'Any Apple Silicon', potatoTier: true, tips: 'Must lock framerate to 60 FPS; exceeding 60 breaks the Havok physics engine.' },
  { id: 'stardewvalley', name: 'Stardew Valley', category: 'Farming Simulation', engine: 'MonoGame', api: 'Metal / DX11', disk: '1 GB', gamePass: true, baseCpuReq: 10, baseGpuReq: 10, baseVramReq: 0.5, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Ultra low battery and CPU draw. Runs locked at 60 FPS on any laptop without fan noise.' },
  { id: 'starfield', name: 'Starfield', category: 'Space RPG', engine: 'Creation Engine 2', api: 'DirectX 12', disk: '125 GB SSD', gamePass: true, baseCpuReq: 82, baseGpuReq: 86, baseVramReq: 7.0, macSupport: 'Unsupported (Windows Native)', macTier: 'Windows Only', potatoTier: false, tips: 'Enable Dynamic Resolution Scaling with 75% render scale for stable 60 FPS in dense cities.' },
  { id: 'subnautica', name: 'Subnautica', category: 'Underwater Survival', engine: 'Unity', api: 'Metal / DX11', disk: '20 GB', gamePass: false, baseCpuReq: 45, baseGpuReq: 50, baseVramReq: 3.5, macSupport: 'Native macOS', macTier: 'M1 Pro or higher', potatoTier: false, tips: 'Lower Water Quality slider to High to prevent frame dips when surfacing near the Aurora.' },
  { id: 'terraria', name: 'Terraria', category: '2D Sandbox Adventure', engine: 'XNA / FNA', api: 'Metal / OpenGL / DX9', disk: '1 GB', gamePass: true, baseCpuReq: 15, baseGpuReq: 15, baseVramReq: 0.5, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Turn Lighting to White or Color instead of Trippy to maintain steady 60 FPS on old iGPUs.' },
  { id: 'totalwar_warhammer3', name: 'Total War: WARHAMMER III', category: 'Grand Strategy RTS', engine: 'TW Engine 3', api: 'Native Metal / DX12', disk: '120 GB SSD', gamePass: true, baseCpuReq: 82, baseGpuReq: 76, baseVramReq: 6.0, macSupport: 'Native Apple Silicon (Metal)', macTier: 'M2 Pro / M3 Pro min', potatoTier: false, tips: 'Lower Grass & Unit Detail to Medium during 40v40 army battles to prevent frame drops.' },
  { id: 'undertale', name: 'Undertale', category: 'Turn-Based Indie RPG', engine: 'GameMaker Studio', api: 'DirectX 9 / OpenGL', disk: '300 MB', gamePass: false, baseCpuReq: 10, baseGpuReq: 10, baseVramReq: 0.2, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Ultra lightweight engine; runs on literally any dual-core PC from 2008+.' },
  { id: 'valorant', name: 'VALORANT', category: 'Tactical Shooter', engine: 'Unreal Engine 4', api: 'DirectX 11', disk: '30 GB', gamePass: true, baseCpuReq: 30, baseGpuReq: 25, baseVramReq: 2.0, macSupport: 'Unsupported (Vanguard Kernel Anti-Cheat)', macTier: 'Windows Only', potatoTier: true, tips: 'Run uncapped FPS with Nvidia Reflex On + Boost for absolute lowest render latency.' },
  { id: 'vampiresurvivors', name: 'Vampire Survivors', category: 'Gothic Survival Roguelite', engine: 'Phaser / Electron', api: 'WebGL / DX11', disk: '600 MB', gamePass: true, baseCpuReq: 20, baseGpuReq: 16, baseVramReq: 0.5, macSupport: 'Native Apple Silicon', macTier: 'Any M-Series', potatoTier: true, tips: 'Disable flashing VFX in accessibility options to prevent draw call slowdowns on dense swarms.' },
  { id: 'witcher3', name: 'The Witcher 3: Wild Hunt (Next-Gen)', category: 'Fantasy RPG', engine: 'REDengine 3', api: 'DirectX 12 / DX11', disk: '55 GB SSD', gamePass: false, baseCpuReq: 65, baseGpuReq: 72, baseVramReq: 5.5, macSupport: 'CrossOver 24+ / GPTK', macTier: 'M1 Pro or higher', potatoTier: false, tips: 'Switch to DirectX 11 mode on budget PCs to bypass heavy DX12 CPU driver overhead.' }
];

export const CPUS = [
  // Flagships
  { name: 'AMD Ryzen 7 7800X3D', power: 100, cores: 8, tier: 'Enthusiast' },
  { name: 'Intel Core i9-14900K', power: 98, cores: 24, tier: 'Enthusiast' },
  { name: 'AMD Ryzen 7 9700X', power: 90, cores: 8, tier: 'High Tier' },
  { name: 'Intel Core i7-14700K', power: 88, cores: 20, tier: 'High Tier' },

  // AMD Ryzen 5
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

  // AMD Ryzen 3
  { name: 'AMD Ryzen 3 4100 (4C/8T)', power: 45, cores: 4, tier: 'Zen 2 Budget' },
  { name: 'AMD Ryzen 3 3300X (4C/8T)', power: 48, cores: 4, tier: 'Zen 2 Gaming' },
  { name: 'AMD Ryzen 3 3200G (APU / Vega 8)', power: 30, cores: 4, tier: 'Potato APU' },
  { name: 'AMD Ryzen 3 3100 (4C/8T)', power: 40, cores: 4, tier: 'Zen 2 Entry' },
  { name: 'AMD Ryzen 3 2200G (APU / Vega 8)', power: 26, cores: 4, tier: 'Potato APU' },
  { name: 'AMD Ryzen 3 1300X / 1200 (4C/4T)', power: 25, cores: 4, tier: 'Zen 1 Entry' },
  { name: 'AMD Ryzen 3 5300U / 4300U (Laptop 4C)', power: 35, cores: 4, tier: 'Laptop Budget' },
  { name: 'AMD Ryzen 3 3250U / 2200U (Laptop 2C/4T)', power: 18, cores: 2, tier: 'Ultra Potato' },

  // Intel Core i5
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

  // Intel Core i3
  { name: 'Intel Core i3-14100F / 14100 (4C/8T)', power: 56, cores: 4, tier: 'Raptor Lake Refresh' },
  { name: 'Intel Core i3-13100F / 13100 (4C/8T)', power: 54, cores: 4, tier: 'Raptor Lake Entry' },
  { name: 'Intel Core i3-12100F / 12100 (4C/8T)', power: 52, cores: 4, tier: 'Alder Lake Value King' },
  { name: 'Intel Core i3-1215U / 1215U (Laptop)', power: 34, cores: 6, tier: 'Alder Lake Mobile' },
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

export const GPUS = [
  // NVIDIA RTX 40 Series
  { name: 'NVIDIA GeForce RTX 4090 (24GB)', power: 100, vram: 24, arch: 'Ada Lovelace' },
  { name: 'NVIDIA GeForce RTX 4080 Super / 4080 (16GB)', power: 92, vram: 16, arch: 'Ada Lovelace' },
  { name: 'NVIDIA GeForce RTX 4070 Ti Super (16GB)', power: 88, vram: 16, arch: 'Ada Lovelace' },
  { name: 'NVIDIA GeForce RTX 4070 Ti (12GB)', power: 86, vram: 12, arch: 'Ada Lovelace' },
  { name: 'NVIDIA GeForce RTX 4070 Super (12GB)', power: 85, vram: 12, arch: 'Ada Lovelace' },
  { name: 'NVIDIA GeForce RTX 4070 (12GB)', power: 82, vram: 12, arch: 'Ada Lovelace' },
  { name: 'NVIDIA GeForce RTX 4060 Ti (16GB / 8GB)', power: 74, vram: 16, arch: 'Ada Lovelace' },
  { name: 'NVIDIA GeForce RTX 4060 (8GB)', power: 68, vram: 8, arch: 'Ada Lovelace' },
  { name: 'NVIDIA GeForce RTX 4050 Laptop (6GB)', power: 52, vram: 6, arch: 'Ada Lovelace Mobile' },

  // NVIDIA RTX 30 Series
  { name: 'NVIDIA GeForce RTX 3090 Ti / 3090 (24GB)', power: 88, vram: 24, arch: 'Ampere' },
  { name: 'NVIDIA GeForce RTX 3080 Ti / 3080 (12GB / 10GB)', power: 84, vram: 12, arch: 'Ampere' },
  { name: 'NVIDIA GeForce RTX 3070 Ti / 3070 (8GB)', power: 76, vram: 8, arch: 'Ampere' },
  { name: 'NVIDIA GeForce RTX 3060 Ti (8GB)', power: 68, vram: 8, arch: 'Ampere' },
  { name: 'NVIDIA GeForce RTX 3060 (12GB)', power: 62, vram: 12, arch: 'Ampere' },
  { name: 'NVIDIA GeForce RTX 3050 (8GB / 6GB)', power: 46, vram: 8, arch: 'Ampere' },

  // NVIDIA RTX 20 Series & GTX 16 Series
  { name: 'NVIDIA GeForce RTX 2080 Ti (11GB)', power: 75, vram: 11, arch: 'Turing' },
  { name: 'NVIDIA GeForce RTX 2080 Super / 2080 (8GB)', power: 68, vram: 8, arch: 'Turing' },
  { name: 'NVIDIA GeForce RTX 2070 Super / 2070 (8GB)', power: 62, vram: 8, arch: 'Turing' },
  { name: 'NVIDIA GeForce RTX 2060 Super / 2060 (8GB / 6GB)', power: 55, vram: 6, arch: 'Turing' },
  { name: 'NVIDIA GeForce GTX 1660 Ti / 1660 Super (6GB)', power: 48, vram: 6, arch: 'Turing' },
  { name: 'NVIDIA GeForce GTX 1660 (6GB)', power: 44, vram: 6, arch: 'Turing' },
  { name: 'NVIDIA GeForce GTX 1650 Super / 1650 (4GB)', power: 34, vram: 4, arch: 'Turing' },

  // NVIDIA GTX 10 Series & Older Legacy
  { name: 'NVIDIA GeForce GTX 1080 Ti (11GB)', power: 65, vram: 11, arch: 'Pascal' },
  { name: 'NVIDIA GeForce GTX 1080 (8GB)', power: 58, vram: 8, arch: 'Pascal' },
  { name: 'NVIDIA GeForce GTX 1070 (8GB)', power: 50, vram: 8, arch: 'Pascal' },
  { name: 'NVIDIA GeForce GTX 1060 (6GB / 3GB)', power: 40, vram: 6, arch: 'Pascal' },
  { name: 'NVIDIA GeForce GTX 1050 Ti / 1050 (4GB / 2GB)', power: 28, vram: 4, arch: 'Pascal' },
  { name: 'NVIDIA GeForce GTX 970 / 960 (4GB / 2GB)', power: 32, vram: 4, arch: 'Maxwell' },
  { name: 'NVIDIA GeForce GT 1030 (2GB Dedicated)', power: 14, vram: 2, arch: 'Pascal Entry' },
  { name: 'NVIDIA GeForce GT 730 / 710 (2GB / 1GB)', power: 8, vram: 2, arch: 'Legacy Entry' },

  // AMD Radeon RX 7000 Series
  { name: 'AMD Radeon RX 7900 XTX (24GB)', power: 90, vram: 24, arch: 'RDNA 3' },
  { name: 'AMD Radeon RX 7900 XT (20GB)', power: 86, vram: 20, arch: 'RDNA 3' },
  { name: 'AMD Radeon RX 7900 GRE (16GB)', power: 84, vram: 16, arch: 'RDNA 3' },
  { name: 'AMD Radeon RX 7800 XT (16GB)', power: 83, vram: 16, arch: 'RDNA 3' },
  { name: 'AMD Radeon RX 7700 XT (12GB)', power: 77, vram: 12, arch: 'RDNA 3' },
  { name: 'AMD Radeon RX 7600 XT / 7600 (16GB / 8GB)', power: 65, vram: 16, arch: 'RDNA 3' },

  // AMD Radeon RX 6000 Series
  { name: 'AMD Radeon RX 6950 XT / 6900 XT (16GB)', power: 82, vram: 16, arch: 'RDNA 2' },
  { name: 'AMD Radeon RX 6800 XT / 6800 (16GB)', power: 78, vram: 16, arch: 'RDNA 2' },
  { name: 'AMD Radeon RX 6750 XT / 6700 XT (12GB)', power: 72, vram: 12, arch: 'RDNA 2' },
  { name: 'AMD Radeon RX 6650 XT / 6600 XT (8GB)', power: 62, vram: 8, arch: 'RDNA 2' },
  { name: 'AMD Radeon RX 6600 (8GB)', power: 58, vram: 8, arch: 'RDNA 2' },
  { name: 'AMD Radeon RX 6500 XT / 6400 (4GB)', power: 30, vram: 4, arch: 'RDNA 2 Budget' },

  // AMD Radeon RX 5000 & Polaris
  { name: 'AMD Radeon RX 5700 XT / 5700 (8GB)', power: 54, vram: 8, arch: 'RDNA 1' },
  { name: 'AMD Radeon RX 580 / 570 (8GB / 4GB)', power: 36, vram: 8, arch: 'Polaris' },

  // Intel Arc & Integrated Graphics
  { name: 'Intel Arc A770 / A750 (16GB / 8GB)', power: 64, vram: 16, arch: 'Alchemist' },
  { name: 'Intel Arc A580 (8GB)', power: 56, vram: 8, arch: 'Alchemist' },
  { name: 'Intel Arc A380 (6GB)', power: 32, vram: 6, arch: 'Alchemist Entry' },
  { name: 'Intel Iris Xe Graphics (80/96 EU)', power: 22, vram: 2, arch: 'Intel Tiger/Alder iGPU' },
  { name: 'Intel UHD Graphics 770 / 730 / 630', power: 12, vram: 1, arch: 'Intel UHD iGPU' },
  { name: 'Intel HD Graphics 4000 / 4400 / 4600', power: 8, vram: 1, arch: 'Intel HD Potato' },

  // AMD Integrated / APU
  { name: 'AMD Radeon 780M / 760M (RDNA 3 iGPU)', power: 35, vram: 4, arch: 'AMD Ryzen 7000/8000 iGPU' },
  { name: 'AMD Radeon Vega 7 / Vega 8 / 680M', power: 24, vram: 2, arch: 'AMD APU iGPU' }
];

export const MAC_CHIPS = [
  { name: 'Apple M4 Pro / Max (Metal 4)', power: 95, defaultMem: 36 },
  { name: 'Apple M3 Max (40-core GPU)', power: 88, defaultMem: 36 },
  { name: 'Apple M3 Pro (18-core GPU)', power: 72, defaultMem: 18 },
  { name: 'Apple M2 Pro (19-core GPU)', power: 65, defaultMem: 16 },
  { name: 'Apple M3 (10-core GPU)', power: 52, defaultMem: 16 },
  { name: 'Apple M2 (10-core GPU)', power: 45, defaultMem: 16 },
  { name: 'Apple M1 (8-core GPU)', power: 38, defaultMem: 8 }
];
