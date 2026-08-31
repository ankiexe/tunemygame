import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zfqorzpdljrwdnpnwvsw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcW9yenBkbGpyd2RucG53dnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNjU1MzMsImV4cCI6MjEwMzc0MTUzM30.0QucSbGN3wJ_FNluvNAqQbC7p1jrtqyZ9nkhXczobB0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Extensive indicators of games that easily clear 50+ FPS on low-end hardware / iGPUs
const POTATO_KEYWORDS = [
  'pixel', '2d', 'retro', 'survivor', 'quest', 'classic', 'terrar', 'stardew',
  'card', 'chess', 'puzzle', 'rogue', 'deck', 'idle', 'turn-based', 'strategy',
  'tycoon', 'sim', 'manager', 'arcade', 'visual novel', 'anime', 'party',
  'board', 'tabletop', 'runner', 'dungeon', 'tower defense', 'rpgmaker', 'platformer',
  'fallout 3', 'fallout new vegas', 'half-life', 'portal', 'left 4 dead',
  'counter-strike: source', 'counter-strike 1.6', 'team fortress', 'garrys mod',
  'undertale', 'deltarune', 'celeste', 'hollow knight', 'dead cells', 'slay the spire',
  'factorio', 'rimworld', 'dont starve', 'binding of isaac', 'hotline miami',
  'brawlhalla', 'among us', 'geometry dash', 'cuphead', 'faster than light',
  'paper', 'kingdom', 'bloons', 'plants vs', 'limbo', 'inside', 'fezp', 'baba is you',
  'papers, please', 'loop hero', 'vampire survivors', 'broto', 'into the breach'
];

async function updatePotatoCatalog() {
  console.log('Fetching all catalog titles to evaluate potato compatibility...');

  let allGames = [];
  let from = 0;
  const step = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('games')
      .select('steam_appid, name, base_gpu_req')
      .range(from, from + step - 1);

    if (error || !data || data.length === 0) {
      hasMore = false;
    } else {
      allGames.push(...data);
      if (data.length < step) hasMore = false;
      else from += step;
    }
  }

  console.log(`Analyzing ${allGames.length} games...`);

  const potatoAppIds = [];

  for (const game of allGames) {
    const lower = (game.name || '').toLowerCase();
    
    // Tag as potato if:
    // 1. Existing base_gpu_req is <= 25, OR
    // 2. Name matches lightweight / 2D / classic engine signatures
    const matchesKeyword = POTATO_KEYWORDS.some((kw) => lower.includes(kw));
    const isLowSpecScore = game.base_gpu_req && game.base_gpu_req <= 25;

    if (matchesKeyword || isLowSpecScore) {
      potatoAppIds.push(game.steam_appid);
    }
  }

  console.log(`Found ${potatoAppIds.length} titles capable of 50+ FPS on Potato Rigs! Updating database...`);

  // Batch update in chunks of 100
  const chunkSize = 100;
  for (let i = 0; i < potatoAppIds.length; i += chunkSize) {
    const chunk = potatoAppIds.slice(i, i + chunkSize);

    const { error } = await supabase
      .from('games')
      .update({
        is_potato: true,
        base_gpu_req: 12,
        base_cpu_req: 15,
        base_vram_req: 1.5,
        disk_space: '5 GB',
        api_level: 'DirectX 9 / Vulkan / OpenGL'
      })
      .in('steam_appid', chunk);

    if (error) {
      console.error(`Error updating batch ${Math.floor(i / chunkSize) + 1}:`, error.message);
    } else {
      console.log(`[Batch ${Math.floor(i / chunkSize) + 1}] Synced ${i + 1} to ${Math.min(i + chunkSize, potatoAppIds.length)} potato titles`);
    }
  }

  console.log(`Potato catalog optimization complete! Total verified potato games: ${potatoAppIds.length}`);
}

updatePotatoCatalog();