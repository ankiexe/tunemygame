import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zfqorzpdljrwdnpnwvsw.supabase.co';
// Paste your Supabase Anon or Service Role key here
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcW9yenBkbGpyd2RucG53dnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNjU1MzMsImV4cCI6MjEwMzc0MTUzM30.0QucSbGN3wJ_FNluvNAqQbC7p1jrtqyZ9nkhXczobB0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function parseHardwareReqs(html) {
  if (!html) return { gpuScore: 35, cpuScore: 35, vram: 3.0, isPotato: true };
  const text = html.toLowerCase();

  let gpuScore = 30;
  let cpuScore = 30;
  let vram = 3.0;

  // GPU Tier Detection
  if (text.includes('rtx 40') || text.includes('rx 7900') || text.includes('rx 7800')) { gpuScore = 85; vram = 8.0; }
  else if (text.includes('rtx 3080') || text.includes('rx 6800') || text.includes('rtx 3070')) { gpuScore = 75; vram = 8.0; }
  else if (text.includes('rtx 3060') || text.includes('rtx 2070') || text.includes('rx 6600')) { gpuScore = 60; vram = 6.0; }
  else if (text.includes('rtx 2060') || text.includes('gtx 1080') || text.includes('rx 5700')) { gpuScore = 50; vram = 6.0; }
  else if (text.includes('gtx 1060') || text.includes('gtx 1660') || text.includes('rx 580')) { gpuScore = 35; vram = 4.0; }
  else if (text.includes('gtx 1050') || text.includes('gtx 960') || text.includes('rx 560')) { gpuScore = 25; vram = 2.0; }
  else if (text.includes('gtx 750') || text.includes('intel hd') || text.includes('intel uhd') || text.includes('geforce gt')) { gpuScore = 14; vram = 1.0; }

  // CPU Tier Detection
  if (text.includes('i7-13') || text.includes('i7-14') || text.includes('ryzen 7 7') || text.includes('ryzen 7 9')) cpuScore = 85;
  else if (text.includes('i7-12') || text.includes('i5-13') || text.includes('ryzen 7 5') || text.includes('ryzen 5 7')) cpuScore = 70;
  else if (text.includes('i5-1') || text.includes('ryzen 5 5') || text.includes('ryzen 5 3')) cpuScore = 55;
  else if (text.includes('i7-8') || text.includes('i7-7') || text.includes('i5-8')) cpuScore = 45;
  else if (text.includes('i3') || text.includes('fx-') || text.includes('core 2')) cpuScore = 20;

  return { gpuScore, cpuScore, vram, isPotato: gpuScore <= 25 };
}

async function fetchTopSteamGames(pagesToFetch = 5) {
  console.log(`Fetching top catalog from SteamSpy across ${pagesToFetch} pages (100 per page)...`);
  const appIds = [];

  for (let page = 0; page < pagesToFetch; page++) {
    try {
      const res = await fetch(`https://steamspy.com/api.php?request=all&page=${page}`);
      const data = await res.json();
      const ids = Object.keys(data).slice(0, 100); // 100 titles per page
      appIds.push(...ids);
      console.log(`Retrieved page ${page}: Found ${ids.length} games.`);
    } catch (e) {
      console.error(`Failed to fetch SteamSpy page ${page}:`, e.message);
    }
  }

  console.log(`Total App IDs queued for ingestion: ${appIds.length}`);
  return appIds;
}

async function runMassIngestion() {
  // Set to 3-5 pages for 300-500 of Steam's most played titles
  const allAppIds = await fetchTopSteamGames(4);

  let successCount = 0;

  for (const appId of allAppIds) {
    try {
      const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
      const data = await res.json();

      if (!data[appId] || !data[appId].success || !data[appId].data) {
        continue;
      }

      const game = data[appId].data;
      if (game.type !== 'game') continue;

      const specs = parseHardwareReqs(game.pc_requirements?.minimum || '');
      const storageStr = (game.pc_requirements?.minimum || '').match(/(\d+)\s*(?:gb|mb)\s*(?:available space|storage|free disk)/i);
      const diskSpace = storageStr ? `${storageStr[1]} GB` : '40 GB';

      const payload = {
        steam_appid: game.steam_appid,
        name: game.name,
        category: game.genres?.[0]?.description || 'Action',
        engine: 'Multiplatform Engine',
        api_level: 'DirectX 11 / 12',
        disk_space: diskSpace,
        base_gpu_req: specs.gpuScore,
        base_cpu_req: specs.cpuScore,
        base_vram_req: specs.vram,
        is_potato: specs.isPotato,
        tips: `Optimized execution profile for ${game.name}.`
      };

      const { error } = await supabase.from('games').upsert(payload, { onConflict: 'steam_appid' });
      
      if (!error) {
        successCount++;
        console.log(`[${successCount}] Synced: ${game.name} | GPU Req: ${specs.gpuScore} | Potato: ${specs.isPotato}`);
      }

      // 1-second delay to comply with Steam's API rate limits
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.error(`Skipping AppID ${appId}:`, err.message);
    }
  }

  console.log(`Ingestion completed! Added/Updated ${successCount} games in Supabase.`);
}

runMassIngestion();