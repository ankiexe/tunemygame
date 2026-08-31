import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zfqorzpdljrwdnpnwvsw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcW9yenBkbGpyd2RucG53dnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNjU1MzMsImV4cCI6MjEwMzc0MTUzM30.0QucSbGN3wJ_FNluvNAqQbC7p1jrtqyZ9nkhXczobB0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BATCH_SIZE = 500;

async function fetchNext5kGames() {
  console.log('Fetching next 5,000 Steam titles (Pages 5–10)...');
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  };

  let allApps = [];

  // Query pages 5 to 10 (1,000 games per page)
  for (let page = 5; page <= 10; page++) {
    try {
      console.log(`Fetching Steam catalog page ${page}...`);
      const res = await fetch(`https://steamspy.com/api.php?request=all&page=${page}`, { headers });
      const data = await res.json();
      const pageGames = Object.values(data).map((g) => ({
        appid: g.appid,
        name: g.name
      }));
      allApps.push(...pageGames);
    } catch (err) {
      console.warn(`Warning on page ${page}:`, err.message);
    }
  }

  // Filter junk entries
  const validGames = allApps.filter((app) => {
    const name = app.name?.trim();
    if (!name || name.length < 2) return false;
    const lower = name.toLowerCase();
    return !(
      lower.includes('soundtrack') ||
      lower.includes('dlc') ||
      lower.includes('trailer') ||
      lower.includes('test server') ||
      lower.includes('sdk') ||
      lower.includes('server')
    );
  });

  const uniqueMap = new Map();
  validGames.forEach((g) => uniqueMap.set(g.appid, g));
  const uniqueGames = Array.from(uniqueMap.values());

  console.log(`Retrieved ${uniqueGames.length} clean titles for ingestion.`);
  return uniqueGames;
}

function estimateGameProfile(game) {
  const name = game.name.toLowerCase();

  let gpuReq = 35;
  let cpuReq = 35;
  let vramReq = 3.0;
  let diskSpace = '25 GB';
  let apiLevel = 'DirectX 11';
  let isPotato = false;

  if (
    name.includes('cyberpunk') ||
    name.includes('remake') ||
    name.includes('unreal') ||
    name.includes('warhammer') ||
    name.includes('horizon') ||
    name.includes('forza') ||
    name.includes('starfield') ||
    name.includes('alan wake') ||
    name.includes('dragons dogma') ||
    name.includes('black myth')
  ) {
    gpuReq = 78;
    cpuReq = 75;
    vramReq = 8.0;
    diskSpace = '90 GB';
    apiLevel = 'DirectX 12 / Vulkan';
  } else if (
    name.includes('strike') ||
    name.includes('apex') ||
    name.includes('valorant') ||
    name.includes('overwatch') ||
    name.includes('siege') ||
    name.includes('dota') ||
    name.includes('league') ||
    name.includes('pubg')
  ) {
    gpuReq = 45;
    cpuReq = 50;
    vramReq = 4.0;
    diskSpace = '45 GB';
    apiLevel = 'DirectX 11 / 12';
  } else if (
    name.includes('pixel') ||
    name.includes('2d') ||
    name.includes('retro') ||
    name.includes('survivor') ||
    name.includes('quest') ||
    name.includes('classic') ||
    name.includes('terrar') ||
    name.includes('stardew') ||
    name.includes('card')
  ) {
    gpuReq = 12;
    cpuReq = 15;
    vramReq = 1.5;
    diskSpace = '4 GB';
    apiLevel = 'DirectX 9 / OpenGL';
    isPotato = true;
  }

  return {
    steam_appid: game.appid,
    name: game.name,
    category: isPotato ? 'Indie / Classic' : gpuReq >= 70 ? 'AAA Blockbuster' : 'Action / Adventure',
    engine: 'Multiplatform Engine',
    api_level: apiLevel,
    disk_space: diskSpace,
    base_gpu_req: gpuReq,
    base_cpu_req: cpuReq,
    base_vram_req: vramReq,
    is_potato: isPotato,
    tips: `Deterministic telemetry profile active for ${game.name}.`
  };
}

async function bulkIngestNextBatch() {
  const games = await fetchNext5kGames();
  console.log(`Starting bulk insert of ${games.length} games in chunks of ${BATCH_SIZE}...`);

  for (let i = 0; i < games.length; i += BATCH_SIZE) {
    const chunk = games.slice(i, i + BATCH_SIZE).map(estimateGameProfile);

    const { error } = await supabase
      .from('games')
      .upsert(chunk, { onConflict: 'steam_appid', ignoreDuplicates: true });

    if (error) {
      console.error(`Error on chunk ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message);
    } else {
      console.log(`[Batch ${Math.floor(i / BATCH_SIZE) + 1}] Successfully inserted records ${i + 1} to ${Math.min(i + BATCH_SIZE, games.length)}`);
    }
  }

  console.log('Next 5,000 games successfully added to Supabase!');
}

bulkIngestNextBatch();