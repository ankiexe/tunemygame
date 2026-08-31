import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zfqorzpdljrwdnpnwvsw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcW9yenBkbGpyd2RucG53dnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNjU1MzMsImV4cCI6MjEwMzc0MTUzM30.0QucSbGN3wJ_FNluvNAqQbC7p1jrtqyZ9nkhXczobB0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MAC_KEYWORDS = [
  'baldur', 'death stranding', 'resident evil', 'lies of p', 'hades',
  'disco elysium', 'divinity', 'civilization', 'subnautica', 'total war',
  'metro exodus', 'no mans sky', 'stardew', 'terraria', 'dota 2',
  'counter-strike', 'factorio', 'tomb raider', 'hollow knight', 'dead cells',
  'slay the spire', 'celeste', 'portal', 'half-life', 'rust', 'rimworld',
  'crusader kings', 'football manager', 'valheim', 'warframe', 'world of warcraft',
  'minecraft', 'psychonauts', 'bioshock', 'borderlands', 'batman', 'shadow of the tomb raider'
];

async function tagNativeMacGames() {
  console.log('Fetching games from Supabase to tag Mac native titles...');
  
  // Use steam_appid instead of id
  const { data: games, error } = await supabase.from('games').select('steam_appid, name');
  if (error || !games) {
    console.error('Error querying Supabase:', error);
    return;
  }

  const matches = games.filter((game) => {
    const lower = game.name.toLowerCase();
    return MAC_KEYWORDS.some((kw) => lower.includes(kw));
  });

  console.log(`Found ${matches.length} titles matching Mac native criteria. Updating records...`);

  // Batch updates in chunks
  const chunkSize = 50;
  for (let i = 0; i < matches.length; i += chunkSize) {
    const chunk = matches.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map((g) =>
        supabase
          .from('games')
          .update({ is_mac: true, api_level: 'Metal 3 / MoltenVK' })
          .eq('steam_appid', g.steam_appid)
      )
    );
    console.log(`Updated items ${i + 1} to ${Math.min(i + chunkSize, matches.length)}`);
  }

  console.log('macOS native games successfully tagged!');
}

tagNativeMacGames();