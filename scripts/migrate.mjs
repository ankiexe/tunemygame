import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import {
  RAW_GAMES_DATABASE,
  CPUS,
  GPUS,
  MAC_CHIPS,
} from '../src/app/catalogData.js';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnvLocal() {
  const envPath = resolve(rootDir, '.env.local');
  let raw;
  try {
    raw = readFileSync(envPath, 'utf8');
  } catch {
    throw new Error('Missing .env.local. Add NEXT_PUBLIC_SUPABASE_URL and a Supabase key.');
  }

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function requireEnv(...keys) {
  for (const key of keys) {
    if (process.env[key]) return process.env[key];
  }
  throw new Error(`Set one of ${keys.join(', ')} in .env.local`);
}

async function upsertAll(supabase, table, rows, onConflict) {
  const { data, error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) {
    throw new Error(`${table}: ${error.message}`);
  }
  return data;
}

loadEnvLocal();

const supabaseUrl = requireEnv('NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL');
const supabaseKey = requireEnv(
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_ANON_KEY'
);

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const games = RAW_GAMES_DATABASE.map((game) => ({
  id: game.id,
  name: game.name,
  category: game.category,
  engine: game.engine,
  api: game.api,
  disk: game.disk,
  game_pass: game.gamePass,
  cpu_req: game.baseCpuReq,
  gpu_req: game.baseGpuReq,
  vram_req: game.baseVramReq,
  mac_support: game.macSupport,
  mac_tier: game.macTier,
  potato_tier: game.potatoTier,
  tips: game.tips,
}));

const cpus = CPUS.map((cpu) => ({
  name: cpu.name,
  power: cpu.power,
  cores: cpu.cores,
  tier: cpu.tier,
}));

const gpus = GPUS.map((gpu) => ({
  name: gpu.name,
  power: gpu.power,
  vram: gpu.vram,
  arch: gpu.arch,
}));

const macChips = MAC_CHIPS.map((chip) => ({
  name: chip.name,
  power: chip.power,
  default_mem: chip.defaultMem,
}));

const result = await Promise.all([
  upsertAll(supabase, 'games', games, 'id'),
  upsertAll(supabase, 'cpus', cpus, 'name'),
  upsertAll(supabase, 'gpus', gpus, 'name'),
  upsertAll(supabase, 'mac_chips', macChips, 'name'),
]);

console.log(
  `Migrated ${games.length} games, ${cpus.length} CPUs, ${gpus.length} GPUs, ${macChips.length} Mac chips.`
);
void result;
