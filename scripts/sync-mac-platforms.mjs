import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zfqorzpdljrwdnpnwvsw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcW9yenBkbGpyd2RucG53dnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNjU1MzMsImV4cCI6MjEwMzc0MTUzM30.0QucSbGN3wJ_FNluvNAqQbC7p1jrtqyZ9nkhXczobB0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CONCURRENCY = 20;
const DELAY_MS = 200;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchSteamPlatform(appId) {
  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&filters=platforms`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json[appId]?.success) return null;
    return json[appId].data?.platforms || null;
  } catch {
    return null;
  }
}

async function syncUnverifiedMacTitles() {
  console.log('Finding games that have not been checked for Mac support yet...');
  
  // Only select games where mac_support is not yet confirmed
  const { data: games, error } = await supabase
    .from('games')
    .select('steam_appid, name')
    .or('mac_support.is.null,mac_support.eq.Unsupported')
    .limit(5000);

  if (error || !games) {
    console.error('Error querying Supabase:', error);
    return;
  }

  console.log(`Checking official Mac support for ${games.length} new titles...`);

  let nativeMacCount = 0;

  for (let i = 0; i < games.length; i += CONCURRENCY) {
    const batch = games.slice(i, i + CONCURRENCY);

    await Promise.all(
      batch.map(async (game) => {
        const platforms = await fetchSteamPlatform(game.steam_appid);
        const isMacNative = platforms?.mac === true;

        if (isMacNative) {
          nativeMacCount++;
          await supabase
            .from('games')
            .update({ is_mac: true, mac_support: 'Native', api_level: 'Metal 3 / MoltenVK' })
            .eq('steam_appid', game.steam_appid);
        } else {
          await supabase
            .from('games')
            .update({ is_mac: false, mac_support: 'CrossOver / Rosetta' })
            .eq('steam_appid', game.steam_appid);
        }
      })
    );

    console.log(`[Progress ${Math.min(i + CONCURRENCY, games.length)}/${games.length}] New native Mac titles found: ${nativeMacCount}`);
    await sleep(DELAY_MS);
  }

  console.log(`Verification complete! Added ${nativeMacCount} verified Mac games to your database.`);
}

syncUnverifiedMacTitles();