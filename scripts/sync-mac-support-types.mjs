import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

async function ensureColumn() {
  const sql = `
    ALTER TABLE public.games
      ADD COLUMN IF NOT EXISTS mac_support_type text;

    UPDATE public.games
    SET mac_support_type = CASE
      WHEN is_mac = true AND LOWER(COALESCE(mac_support, '')) LIKE '%rosetta%' THEN 'rosetta'
      WHEN is_mac = true AND LOWER(COALESCE(mac_support, '')) LIKE '%native%' THEN 'native'
      WHEN is_mac = true THEN 'unsupported'
      ELSE 'unsupported'
    END
    WHERE mac_support_type IS NULL OR mac_support_type NOT IN ('native', 'rosetta', 'unsupported');
  `;

  console.log('Run the following SQL in Supabase SQL editor to add/maintain the column:');
  console.log(sql);
}

async function syncMacSupportTypes() {
  const { data: games, error } = await supabase.from('games').select('steam_appid, name, is_mac, mac_support, mac_support_type');

  if (error) {
    console.error('Failed to fetch games for mac support sync:', error);
    return;
  }

  let updated = 0;
  for (const game of games ?? []) {
    const nextValue = (() => {
      const type = String(game.mac_support_type ?? '').toLowerCase();
      if (type === 'native' || type === 'rosetta') return type;
      if (game.is_mac) {
        const support = String(game.mac_support ?? '').toLowerCase();
        if (support.includes('rosetta')) return 'rosetta';
        if (support.includes('native') || support.includes('metal')) return 'native';
        return 'unsupported';
      }
      return 'unsupported';
    })();

    if (game.mac_support_type === nextValue) continue;

    const { error: updateError } = await supabase
      .from('games')
      .update({ mac_support_type: nextValue })
      .eq('steam_appid', game.steam_appid);

    if (updateError) {
      console.error(`Failed updating ${game.name}:`, updateError);
      continue;
    }

    updated += 1;
  }

  console.log(`Synced mac_support_type for ${updated} games.`);
}

async function main() {
  await ensureColumn();
  await syncMacSupportTypes();
}

main().catch((err) => {
  console.error('sync-mac-support-types failed:', err);
  process.exit(1);
});
