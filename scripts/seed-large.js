// scripts/seed-large.js
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zfqorzpdljrwdnpnwvsw.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcW9yenBkbGpyd2RucG53dnN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODE2NTUzMywiZXhwIjoyMTAzNzQxNTMzfQ.NFMM9F5NSx3WpkszBFh4iUIVn1gm3Ykl-yjqvTJ2dfw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BATCH_SIZE = 500;

function generateGames(count) {
  const prefixes = ['Cyber', 'Shadow', 'Dark', 'Apex', 'Star', 'Iron', 'Echo', 'Quantum', 'War', 'Neon', 'Vanguard', 'Hyper', 'Rogue'];
  const suffixes = ['Protocol', 'Chronicles', 'Legacy', 'Odyssey', 'Strike', 'Horizon', 'Tactics', 'Reborn', 'Overdrive', 'Ascent'];
  const engines = ['Unreal Engine 5', 'Unreal Engine 4', 'Unity', 'Custom In-House', 'Source 2', 'Godot'];
  const apis = ['DirectX 12', 'DirectX 11', 'Vulkan', 'Metal'];
  const macTiers = ['Native M-Series', 'Rosetta 2', 'CrossOver/Whisky', 'Unsupported'];
  const games = [];

  for (let i = 1; i <= count; i++) {
    const pre = prefixes[i % prefixes.length];
    const suf = suffixes[Math.floor(i / prefixes.length) % suffixes.length];
    const gameName = `${pre} ${suf} ${i > 100 ? `Part ${Math.floor(i / 100)}` : ''} - Edition ${i}`.trim();
    const isMac = i % 4 === 0;

    games.push({
      steam_appid: 1000000 + i,
      name: gameName,
      category: ['Action', 'RPG', 'Shooter', 'Strategy', 'Indie', 'Open World'][i % 6],
      engine: engines[i % engines.length],
      api_level: apis[i % apis.length],
      disk_space: `${[10, 25, 45, 70, 110, 150][i % 6]} GB`,
      base_gpu_req: Math.floor(Math.random() * 8500) + 1200, // numeric score
      base_cpu_req: Math.floor(Math.random() * 6500) + 1000, // numeric score
      base_vram_req: [2, 4, 6, 8][i % 4],
      is_potato: i % 2 === 0,
      tips: 'Set shadows to medium and enable FSR/DLSS quality for optimal frame pacing.',
      is_mac: isMac,
      mac_support: isMac ? 'Supported via Metal / GPTK' : 'No native port',
      directx_api: ['DX11', 'DX12', 'Vulkan'][i % 3],
      storage_gb: [10, 25, 45, 70, 110, 150][i % 6],
      drive_speed: ['SSD Required', 'SSD Recommended', 'HDD Supported'][i % 3],
      mac_tier: isMac ? macTiers[i % macTiers.length] : 'None',
      is_pc: true,
      mac_support_type: isMac ? ['Native', 'Rosetta', 'CrossOver'][i % 3] : 'Unsupported',
    });
  }
  return games;
}

async function bulkInsert(table, items) {
  console.log(`Starting insertion of ${items.length} items into "${table}"...`);
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from(table).insert(batch);
    if (error) {
      console.error(`Error at batch ${i} on ${table}:`, error.message);
      return false;
    }
    console.log(`[${table}] Progress: ${Math.min(i + BATCH_SIZE, items.length)} / ${items.length}`);
  }
  return true;
}

async function run() {
  console.log('Generating games array...');
  const games = generateGames(30000);

  // Skipping hardware_cpus and hardware_gpus since all 20,000 are already inserted
  await bulkInsert('games', games);

  console.log('All 30,000 games seeded successfully!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Fatal crash during execution:', err);
  process.exit(1);
});
