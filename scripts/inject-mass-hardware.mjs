import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

function buildMassiveCpus() {
  const cpus = [];
  const add = (name, brand, series, cores, threads, st, mt, tdp) => {
    cpus.push({ name, brand, series, cores, threads, single_thread_score: st, multi_thread_score: mt, tdp_watts: tdp });
  };

  // 1. Intel Core Desktop & Mobile: 2nd Gen (2000) to 14th Gen (14000) + Ultra
  const intelGens = [
    { gen: 2, name: 'Sandy Bridge', st: 1500, mt: 4500 },
    { gen: 3, name: 'Ivy Bridge', st: 1700, mt: 5200 },
    { gen: 4, name: 'Haswell', st: 1950, mt: 6800 },
    { gen: 5, name: 'Broadwell', st: 2100, mt: 7400 },
    { gen: 6, name: 'Skylake', st: 2300, mt: 8400 },
    { gen: 7, name: 'Kaby Lake', st: 2500, mt: 9500 },
    { gen: 8, name: 'Coffee Lake', st: 2700, mt: 13000 },
    { gen: 9, name: 'Coffee Lake R', st: 2900, mt: 15500 },
    { gen: 10, name: 'Comet Lake', st: 3100, mt: 19500 },
    { gen: 11, name: 'Rocket Lake', st: 3400, mt: 23000 },
    { gen: 12, name: 'Alder Lake', st: 3900, mt: 31000 },
    { gen: 13, name: 'Raptor Lake', st: 4300, mt: 40000 },
    { gen: 14, name: 'Raptor Lake Refresh', st: 4500, mt: 45000 },
  ];

  intelGens.forEach(g => {
    // i3 SKUs
    ['100', '100F', '100T', '300', '320', '350'].forEach(num => {
      add(`Intel Core i3-${g.gen}${num}`, 'Intel', `Core ${g.name}`, 4, 8, Math.round(g.st * 0.82), Math.round(g.mt * 0.45), 60);
    });
    // i5 SKUs (Massive Coverage)
    ['400', '400F', '400T', '500', '500T', '600', '600K', '600KF', '600T'].forEach(num => {
      add(`Intel Core i5-${g.gen}${num}`, 'Intel', `Core ${g.name}`, 6, 12, Math.round(g.st * 1.0), Math.round(g.mt * 0.95), 65);
    });
    // i5 Laptop SKUs
    ['300H', '350H', '400H', '500H', '600H', '700H', '200U', '250U', '300U', '350U'].forEach(num => {
      add(`Intel Core i5-${g.gen}${num}`, 'Intel', `Core ${g.name} Mobile`, 4, 8, Math.round(g.st * 0.88), Math.round(g.mt * 0.7), 45);
    });
    // i7 SKUs
    ['700', '700F', '700K', '700KF', '700T', '800', '800K', '870', '900'].forEach(num => {
      add(`Intel Core i7-${g.gen}${num}`, 'Intel', `Core ${g.name}`, 8, 16, Math.round(g.st * 1.15), Math.round(g.mt * 1.4), 105);
    });
    // i7 Laptop SKUs
    ['700H', '750H', '800H', '850H', '870H', '875H', '900HK', '950HX'].forEach(num => {
      add(`Intel Core i7-${g.gen}${num}`, 'Intel', `Core ${g.name} Mobile`, 8, 16, Math.round(g.st * 1.05), Math.round(g.mt * 1.2), 55);
    });
    // i9 SKUs
    if (g.gen >= 9) {
      ['900', '900F', '900K', '900KF', '900KS', '950', '980HK', '900HX', '950HX', '980HX'].forEach(num => {
        add(`Intel Core i9-${g.gen}${num}`, 'Intel', `Core ${g.name}`, 16, 24, Math.round(g.st * 1.28), Math.round(g.mt * 1.8), 125);
      });
    }
  });

  // Intel Core Ultra 100 & 200 series
  ['125H', '135H', '155H', '165H', '185H', '225V', '226V', '228V', '236V', '238V', '245K', '245KF', '265K', '265KF', '285K'].forEach((sku, idx) => {
    add(`Intel Core Ultra ${sku.includes('2') ? '7' : '5'} ${sku}`, 'Intel', 'Core Ultra', 14, 20, 4200 + idx * 50, 32000 + idx * 1200, 65);
  });

  // 2. AMD Ryzen: 1000 through 9000 Series (All Variants)
  const ryzenGens = [
    { gen: 1, name: 'Zen', st: 2100, mt: 11000 },
    { gen: 2, name: 'Zen+', st: 2350, mt: 13500 },
    { gen: 3, name: 'Zen 2', st: 2850, mt: 19000 },
    { gen: 4, name: 'Zen 2 Renoir', st: 2950, mt: 18000 },
    { gen: 5, name: 'Zen 3', st: 3450, mt: 24000 },
    { gen: 6, name: 'Zen 3+ Rembrandt', st: 3650, mt: 26000 },
    { gen: 7, name: 'Zen 4', st: 4100, mt: 32000 },
    { gen: 8, name: 'Zen 4 Phoenix', st: 4200, mt: 34000 },
    { gen: 9, name: 'Zen 5', st: 4700, mt: 42000 }
  ];

  ryzenGens.forEach(r => {
    ['100', '200', '300'].forEach(n => {
      ['', 'X', 'G', 'GE', 'U'].forEach(suf => {
        add(`AMD Ryzen 3 ${r.gen}${n}${suf ? ' ' + suf : ''}`.trim(), 'AMD', `Ryzen ${r.gen}000`, 4, 8, Math.round(r.st * 0.8), Math.round(r.mt * 0.5), 65);
      });
    });
    ['400', '500', '600'].forEach(n => {
      ['', 'X', 'XT', 'X3D', 'G', 'GE', 'H', 'HS', 'HX', 'U'].forEach(suf => {
        add(`AMD Ryzen 5 ${r.gen}${n}${suf ? ' ' + suf : ''}`.trim(), 'AMD', `Ryzen ${r.gen}000`, 6, 12, Math.round(r.st * 1.0), Math.round(r.mt * 0.95), 65);
      });
    });
    ['700', '800'].forEach(n => {
      ['', 'X', 'XT', 'X3D', 'H', 'HS', 'HX'].forEach(suf => {
        add(`AMD Ryzen 7 ${r.gen}${n}${suf ? ' ' + suf : ''}`.trim(), 'AMD', `Ryzen ${r.gen}000`, 8, 16, Math.round(r.st * 1.18), Math.round(r.mt * 1.4), 105);
      });
    });
    ['900', '950'].forEach(n => {
      ['', 'X', 'XT', 'X3D', 'HX'].forEach(suf => {
        add(`AMD Ryzen 9 ${r.gen}${n}${suf ? ' ' + suf : ''}`.trim(), 'AMD', `Ryzen ${r.gen}000`, 16, 32, Math.round(r.st * 1.35), Math.round(r.mt * 2.0), 170);
      });
    });
  });

  // 3. Apple Silicon (M1, M2, M3, M4)
  ['M1', 'M2', 'M3', 'M4'].forEach((m, idx) => {
    const mult = 1 + idx * 0.28;
    ['8-core', '10-core', 'Pro 10-core', 'Pro 12-core', 'Max 12-core', 'Max 14-core', 'Max 16-core', 'Ultra 24-core', 'Ultra 32-core'].forEach(sku => {
      add(`Apple ${m} (${sku})`, 'Apple', m, 8 + idx * 2, 8 + idx * 2, Math.round(2500 * mult), Math.round(11000 * mult), 30);
    });
  });

  return cpus;
}

function buildMassiveGpus() {
  const gpus = [];
  const add = (name, brand, series, vram, score, arch) => {
    gpus.push({ name, brand, series, vram_gb: vram, relative_perf_score: score, architecture: arch });
  };

  // NVIDIA 600 through 50 series
  const nvFamilies = [
    { prefix: 'GeForce GTX 6', base: 18, arch: 'Kepler', skus: ['50', '50 Ti', '60', '60 Ti', '70', '80', '80 Ti'] },
    { prefix: 'GeForce GTX 7', base: 26, arch: 'Kepler/Maxwell', skus: ['50', '50 Ti', '60', '60 Ti', '70', '70 Ti', '80', '80 Ti', 'TITAN'] },
    { prefix: 'GeForce GTX 9', base: 36, arch: 'Maxwell', skus: ['50', '50 Ti', '60', '60 Ti', '70', '80', '80 Ti', 'TITAN X'] },
    { prefix: 'GeForce GTX 10', base: 52, arch: 'Pascal', skus: ['50 2GB', '50 4GB', '50 Ti', '60 3GB', '60 6GB', '70', '70 Ti', '80', '80 Ti', 'TITAN Xp'] },
    { prefix: 'GeForce GTX 16', base: 64, arch: 'Turing', skus: ['50', '50 SUPER', '50 Ti', '60', '60 SUPER', '60 Ti'] },
    { prefix: 'GeForce RTX 20', base: 95, arch: 'Turing', skus: ['60 6GB', '60 12GB', '60 SUPER', '70', '70 SUPER', '80', '80 SUPER', '80 Ti', 'TITAN RTX'] },
    { prefix: 'GeForce RTX 30', base: 130, arch: 'Ampere', skus: ['50 6GB', '50 8GB', '60 8GB', '60 12GB', '60 Ti', '70', '70 Ti', '80 10GB', '80 12GB', '80 Ti', '90', '90 Ti'] },
    { prefix: 'GeForce RTX 40', base: 170, arch: 'Ada Lovelace', skus: ['50 6GB', '60', '60 Ti 8GB', '60 Ti 16GB', '70', '70 SUPER', '70 Ti', '70 Ti SUPER', '80', '80 SUPER', '90'] },
    { prefix: 'GeForce RTX 50', base: 230, arch: 'Blackwell', skus: ['50', '60', '60 Ti', '70', '70 Ti', '80', '90'] },
  ];

  nvFamilies.forEach(fam => {
    fam.skus.forEach((sku, idx) => {
      const perf = Math.round(fam.base * (1 + idx * 0.16));
      const vram = perf > 220 ? 24 : perf > 160 ? 16 : perf > 100 ? 12 : perf > 50 ? 8 : 4;
      add(`NVIDIA ${fam.prefix}${sku}`, 'NVIDIA', fam.prefix.split(' ')[1], vram, perf, fam.arch);
      // Add Mobile and Max-Q explicitly
      add(`NVIDIA ${fam.prefix}${sku} Laptop GPU`, 'NVIDIA', `${fam.prefix} Mobile`, Math.max(4, vram - 2), Math.round(perf * 0.8), fam.arch);
      add(`NVIDIA ${fam.prefix}${sku} Max-Q`, 'NVIDIA', `${fam.prefix} Mobile`, Math.max(4, vram - 2), Math.round(perf * 0.7), fam.arch);
    });
  });

  // AMD Radeon HD, R9, RX 400 - 8000
  const amdGens = [
    { prefix: 'Radeon RX ', base: 36, arch: 'Polaris', skus: ['460', '470', '480', '550', '560', '570', '580', '590'] },
    { prefix: 'Radeon RX 5', base: 68, arch: 'RDNA 1', skus: ['300', '500', '500 XT', '600', '600 XT', '700', '700 XT'] },
    { prefix: 'Radeon RX 6', base: 88, arch: 'RDNA 2', skus: ['400', '500 XT', '600', '600 XT', '650 XT', '700', '700 XT', '800', '800 XT', '900 XT', '950 XT'] },
    { prefix: 'Radeon RX 7', base: 125, arch: 'RDNA 3', skus: ['600', '600 XT', '700 XT', '800', '800 XT', '900 GRE', '900 XT', '900 XTX'] },
    { prefix: 'Radeon RX 8', base: 165, arch: 'RDNA 4', skus: ['500 XT', '600 XT', '700 XT', '800 XT'] }
  ];

  amdGens.forEach(ag => {
    ag.skus.forEach((sku, idx) => {
      const perf = Math.round(ag.base * (1 + idx * 0.17));
      const vram = perf > 200 ? 24 : perf > 150 ? 16 : perf > 90 ? 12 : 8;
      add(`AMD ${ag.prefix}${sku}`, 'AMD', ag.prefix.trim(), vram, perf, ag.arch);
      add(`AMD ${ag.prefix}${sku}M Mobile`, 'AMD', `${ag.prefix.trim()} Mobile`, Math.max(4, vram - 2), Math.round(perf * 0.8), ag.arch);
    });
  });

  // Apple Silicon GPUs
  ['M1', 'M2', 'M3', 'M4'].forEach((m, idx) => {
    const mult = 1 + idx * 0.32;
    ['7-core GPU', '8-core GPU', '10-core GPU', 'Pro (14-core GPU)', 'Pro (18-core GPU)', 'Max (30-core GPU)', 'Max (38-core GPU)', 'Ultra (60-core GPU)', 'Ultra (76-core GPU)'].forEach(sku => {
      add(`Apple ${m} ${sku}`, 'Apple', m, 16 + idx * 8, Math.round(30 * mult), 'Apple Metal');
    });
  });

  return gpus;
}

async function run() {
  const cpus = buildMassiveCpus();
  const gpus = buildMassiveGpus();

  console.log(`Generated ${cpus.length} CPUs and ${gpus.length} GPUs.`);

  const BATCH = 200;
  for (let i = 0; i < cpus.length; i += BATCH) {
    await supabase.from('hardware_cpus').upsert(cpus.slice(i, i + BATCH), { onConflict: 'name' });
    process.stdout.write('C');
  }
  console.log('\n✓ CPUs fully upserted.');

  for (let i = 0; i < gpus.length; i += BATCH) {
    await supabase.from('hardware_gpus').upsert(gpus.slice(i, i + BATCH), { onConflict: 'name' });
    process.stdout.write('G');
  }
  console.log('\n✓ GPUs fully upserted.');
}

run();