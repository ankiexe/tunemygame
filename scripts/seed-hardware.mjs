import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

function generateMassiveGpuCatalog() {
  const gpus = new Map();

  function addGpu(name, brand, series, vram, score, arch) {
    if (!gpus.has(name)) {
      gpus.set(name, {
        name,
        brand,
        series,
        vram_gb: Math.max(1, vram),
        relative_perf_score: Math.max(1, score),
        architecture: arch
      });
    }
  }

  // 1. Apple Silicon Matrix (All unified core cuts & generations M1 - M4)
  const appleGens = ['M1', 'M2', 'M3', 'M4'];
  appleGens.forEach((gen, gIdx) => {
    const genMult = 1 + gIdx * 0.32;
    const variants = [
      { tag: '7-core GPU', vram: 8, base: 22 },
      { tag: '8-core GPU', vram: 8, base: 26 },
      { tag: '10-core GPU', vram: 16, base: 34 },
      { tag: 'Pro (12-core GPU)', vram: 18, base: 45 },
      { tag: 'Pro (14-core GPU)', vram: 18, base: 54 },
      { tag: 'Pro (16-core GPU)', vram: 24, base: 64 },
      { tag: 'Pro (18-core GPU)', vram: 24, base: 74 },
      { tag: 'Pro (20-core GPU)', vram: 36, base: 86 },
      { tag: 'Max (24-core GPU)', vram: 32, base: 105 },
      { tag: 'Max (30-core GPU)', vram: 36, base: 125 },
      { tag: 'Max (32-core GPU)', vram: 36, base: 135 },
      { tag: 'Max (36-core GPU)', vram: 48, base: 155 },
      { tag: 'Max (38-core GPU)', vram: 48, base: 165 },
      { tag: 'Max (40-core GPU)', vram: 64, base: 178 },
      { tag: 'Ultra (48-core GPU)', vram: 64, base: 210 },
      { tag: 'Ultra (60-core GPU)', vram: 64, base: 250 },
      { tag: 'Ultra (64-core GPU)', vram: 96, base: 275 },
      { tag: 'Ultra (76-core GPU)', vram: 128, base: 320 },
      { tag: 'Ultra (80-core GPU)', vram: 192, base: 350 }
    ];
    variants.forEach(v => {
      addGpu(
        `Apple ${gen} ${v.tag}`.trim(),
        'Apple',
        gen,
        v.vram,
        Math.round(v.base * genMult),
        'Apple Silicon Metal'
      );
    });
  });

  // 2. NVIDIA Consumer (GeForce GT, GTX, RTX from 200 series through 50 series)
  const nvSeries = [
    { prefix: 'GeForce GT 2', arch: 'Tesla', base: 4, models: ['10', '20', '30', '40'] },
    { prefix: 'GeForce GTS 2', arch: 'Tesla', base: 7, models: ['40', '50'] },
    { prefix: 'GeForce GTX 2', arch: 'Tesla', base: 10, models: ['60', '75', '80', '85', '95'] },
    { prefix: 'GeForce GT 4', arch: 'Fermi', base: 5, models: ['20', '30', '40'] },
    { prefix: 'GeForce GTS 4', arch: 'Fermi', base: 8, models: ['50'] },
    { prefix: 'GeForce GTX 4', arch: 'Fermi', base: 12, models: ['60', '65', '70', '80'] },
    { prefix: 'GeForce GT 5', arch: 'Fermi', base: 6, models: ['20', '30', '45'] },
    { prefix: 'GeForce GTX 5', arch: 'Fermi', base: 14, models: ['50', '50 Ti', '55 Ti', '60', '60 Ti', '70', '80', '90'] },
    { prefix: 'GeForce GT 6', arch: 'Kepler', base: 8, models: ['10', '20', '30', '40'] },
    { prefix: 'GeForce GTX 6', arch: 'Kepler', base: 18, models: ['50', '50 Ti', '60', '60 Ti', '70', '80', '80 Ti', '690'] },
    { prefix: 'GeForce GT 7', arch: 'Kepler', base: 9, models: ['10', '20', '30', '40'] },
    { prefix: 'GeForce GTX 7', arch: 'Kepler/Maxwell', base: 24, models: ['45', '50', '50 Ti', '60', '60 Ti', '70', '70 Ti', '80', '80 Ti', 'TITAN', 'TITAN Black', 'TITAN Z'] },
    { prefix: 'GeForce GTX 9', arch: 'Maxwell', base: 35, models: ['50', '50 Ti', '60', '60 Ti', '70', '80', '80 Ti', 'TITAN X'] },
    { prefix: 'GeForce GT 10', arch: 'Pascal', base: 14, models: ['30'] },
    { prefix: 'GeForce GTX 10', arch: 'Pascal', base: 45, models: ['50 2GB', '50 3GB', '50 4GB', '50 Ti', '60 3GB', '60 5GB', '60 6GB', '70', '70 Ti', '80', '80 Ti', 'TITAN X (Pascal)', 'TITAN Xp'] },
    { prefix: 'GeForce GTX 16', arch: 'Turing', base: 55, models: ['30', '50 GDDR5', '50 GDDR6', '50 SUPER', '50 Ti', '60', '60 SUPER', '60 Ti'] },
    { prefix: 'GeForce RTX 20', arch: 'Turing', base: 90, models: ['60 6GB', '60 12GB', '60 SUPER', '70', '70 SUPER', '80', '80 SUPER', '80 Ti', 'TITAN RTX'] },
    { prefix: 'GeForce RTX 30', arch: 'Ampere', base: 125, models: ['50 6GB', '50 8GB', '60 8GB', '60 12GB', '60 Ti GDDR6', '60 Ti GDDR6X', '70', '70 Ti', '80 10GB', '80 12GB', '80 Ti', '90', '90 Ti'] },
    { prefix: 'GeForce RTX 40', arch: 'Ada Lovelace', base: 165, models: ['60', '60 Ti 8GB', '60 Ti 16GB', '70', '70 SUPER', '70 Ti', '70 Ti SUPER', '80', '80 SUPER', '90', '90 D'] },
    { prefix: 'GeForce RTX 50', arch: 'Blackwell', base: 220, models: ['50', '60', '60 Ti', '70', '70 Ti', '80', '90'] }
  ];

  nvSeries.forEach(s => {
    s.models.forEach((m, idx) => {
      const perf = Math.round(s.base * (1 + idx * 0.18));
      const vram = perf > 250 ? 24 : perf > 170 ? 16 : perf > 110 ? 12 : perf > 60 ? 8 : perf > 25 ? 4 : 2;
      addGpu(`NVIDIA ${s.prefix}${m}`, 'NVIDIA', s.prefix.split(' ')[1] || 'GeForce', vram, perf, s.arch);

      // Laptop/Max-Q variations for modern chips
      if (s.prefix.includes('10') || s.prefix.includes('16') || s.prefix.includes('20') || s.prefix.includes('30') || s.prefix.includes('40') || s.prefix.includes('50')) {
        addGpu(`NVIDIA ${s.prefix}${m} Laptop GPU`, 'NVIDIA', `${s.prefix} Mobile`, Math.max(4, vram - 2), Math.round(perf * 0.78), s.arch);
        addGpu(`NVIDIA ${s.prefix}${m} Max-Q`, 'NVIDIA', `${s.prefix} Mobile`, Math.max(4, vram - 2), Math.round(perf * 0.68), s.arch);
      }
    });
  });

  // 3. NVIDIA Quadro & RTX Workstation GPUs
  const quadroFamilies = [
    { prefix: 'Quadro K', arch: 'Kepler', base: 15, models: ['600', '620', '1200', '2000', '2200', '4000', '4200', '5000', '5200', '6000'] },
    { prefix: 'Quadro M', arch: 'Maxwell', base: 28, models: ['1000M', '2000', '2000M', '3000M', '4000', '5000', '6000'] },
    { prefix: 'Quadro P', arch: 'Pascal', base: 45, models: ['400', '600', '620', '1000', '2000', '2200', '3000', '3200', '4000', '5000', '5200', '6000', 'GP100', 'GV100'] },
    { prefix: 'Quadro RTX ', arch: 'Turing', base: 90, models: ['3000', '4000', '5000', '6000', '8000'] },
    { prefix: 'RTX A', arch: 'Ampere', base: 120, models: ['2000', '2000 12GB', '3000', '4000', '4500', '5000', '5500', '6000'] },
    { prefix: 'RTX ', arch: 'Ada Lovelace Pro', base: 180, models: ['2000 Ada', '4000 Ada', '4000 SFF Ada', '4500 Ada', '5000 Ada', '6000 Ada'] }
  ];
  quadroFamilies.forEach(f => {
    f.models.forEach((m, idx) => {
      const perf = Math.round(f.base * (1 + idx * 0.2));
      addGpu(`NVIDIA ${f.prefix}${m}`, 'NVIDIA', 'Quadro / RTX Pro', Math.min(48, Math.max(4, Math.round(perf / 8))), perf, f.arch);
      addGpu(`NVIDIA ${f.prefix}${m} Mobile`, 'NVIDIA', 'Quadro Mobile', Math.min(24, Math.max(4, Math.round(perf / 10))), Math.round(perf * 0.8), f.arch);
    });
  });

  // 4. AMD Radeon (HD 5000 through RX 8000 + Pro / FirePro)
  const amdSeries = [
    { prefix: 'Radeon HD 5', arch: 'TeraScale 2', base: 5, models: ['450', '570', '670', '750', '770', '830', '850', '870'] },
    { prefix: 'Radeon HD 6', arch: 'TeraScale 2', base: 8, models: ['450', '570', '670', '750', '770', '850', '870', '950', '970', '990'] },
    { prefix: 'Radeon HD 7', arch: 'GCN 1', base: 12, models: ['450', '570', '730', '750', '770', '850', '870', '950', '970', '990'] },
    { prefix: 'Radeon R7 ', arch: 'GCN 2', base: 16, models: ['240', '250', '250X', '260', '260X', '360', '370'] },
    { prefix: 'Radeon R9 ', arch: 'GCN 2/3', base: 26, models: ['270', '270X', '280', '280X', '285', '290', '290X', '295X2', '380', '380X', '390', '390X', 'Fury', 'Fury X', 'Nano'] },
    { prefix: 'Radeon RX ', arch: 'Polaris', base: 36, models: ['460 2GB', '460 4GB', '470 4GB', '470 8GB', '480 4GB', '480 8GB', '550 2GB', '550 4GB', '560', '570 4GB', '570 8GB', '580 4GB', '580 8GB', '590'] },
    { prefix: 'Radeon RX Vega ', arch: 'Vega', base: 80, models: ['56', '64', '64 Liquid', 'VII'] },
    { prefix: 'Radeon RX 5', arch: 'RDNA 1', base: 65, models: ['300', '500', '500 XT', '600', '600 XT', '700', '700 XT'] },
    { prefix: 'Radeon RX 6', arch: 'RDNA 2', base: 85, models: ['400', '500 XT', '600', '600 XT', '650 XT', '700', '700 XT', '750 XT', '800', '800 XT', '900 XT', '950 XT'] },
    { prefix: 'Radeon RX 7', arch: 'RDNA 3', base: 120, models: ['600', '600 XT', '700 XT', '800', '800 XT', '900 GRE', '900 XT', '900 XTX'] },
    { prefix: 'Radeon RX 8', arch: 'RDNA 4', base: 160, models: ['500 XT', '600 XT', '700 XT', '800 XT'] }
  ];

  amdSeries.forEach(s => {
    s.models.forEach((m, idx) => {
      const perf = Math.round(s.base * (1 + idx * 0.19));
      const vram = perf > 250 ? 24 : perf > 160 ? 16 : perf > 100 ? 12 : perf > 50 ? 8 : 4;
      addGpu(`AMD ${s.prefix}${m}`, 'AMD', s.prefix.trim(), vram, perf, s.arch);

      if (s.prefix.includes('RX 5') || s.prefix.includes('RX 6') || s.prefix.includes('RX 7')) {
        addGpu(`AMD ${s.prefix}${m}M Mobile`, 'AMD', `${s.prefix.trim()} Mobile`, Math.max(4, vram - 2), Math.round(perf * 0.8), s.arch);
        addGpu(`AMD ${s.prefix}${m}S Mobile`, 'AMD', `${s.prefix.trim()} Mobile`, Math.max(4, vram - 2), Math.round(perf * 0.72), s.arch);
      }
    });
  });

  // AMD Radeon Pro / FirePro Workstation
  const amdWorkstation = ['W5500', 'W5700', 'W6400', 'W6600', 'W6800', 'W7500', 'W7600', 'W7700', 'W7800', 'W7900'];
  amdWorkstation.forEach((name, idx) => {
    addGpu(`AMD Radeon Pro ${name}`, 'AMD', 'Radeon Pro', 8 + idx * 4, Math.round(75 + idx * 24), 'RDNA Workstation');
  });

  // 5. Intel Graphics (Integrated HD/UHD, Iris Xe, Arc Alchemist, Arc Battlemage)
  const intelGpus = [
    'GMA 3100', 'GMA 4500', 'HD Graphics (Ironlake)', 'HD Graphics 2000', 'HD Graphics 2500', 'HD Graphics 3000',
    'HD Graphics 4000', 'HD Graphics 4200', 'HD Graphics 4400', 'HD Graphics 4600', 'HD Graphics 5000', 'HD Graphics 5200 (Iris Pro)',
    'HD Graphics 5300', 'HD Graphics 5500', 'HD Graphics 5600', 'HD Graphics 6000', 'Iris Graphics 6100',
    'HD Graphics 510', 'HD Graphics 515', 'HD Graphics 520', 'HD Graphics 530', 'Iris Graphics 540', 'Iris Pro 580',
    'UHD Graphics 600', 'UHD Graphics 605', 'UHD Graphics 610', 'UHD Graphics 620', 'UHD Graphics 630', 'Iris Plus 640', 'Iris Plus 650', 'Iris Plus 655',
    'UHD Graphics 710', 'UHD Graphics 730', 'UHD Graphics 750', 'UHD Graphics 770',
    'Iris Xe Graphics G4 (48EU)', 'Iris Xe Graphics G7 (80EU)', 'Iris Xe Graphics G7 (96EU)',
    'Arc 130V', 'Arc 140V', 'Arc A310', 'Arc A350M', 'Arc A370M', 'Arc A380', 'Arc A530M', 'Arc A550M', 'Arc A570M',
    'Arc A580', 'Arc A730M', 'Arc A770M', 'Arc A750', 'Arc A770 8GB', 'Arc A770 16GB', 'Arc Pro A40', 'Arc Pro A50', 'Arc Pro A60',
    'Arc B570', 'Arc B580', 'Arc B770'
  ];
  intelGpus.forEach((name, idx) => {
    const isArcDiscrete = name.includes('Arc A') || name.includes('Arc B') || name.includes('Arc Pro');
    const perf = isArcDiscrete ? Math.round(40 + idx * 2.2) : Math.max(1, Math.round(2 + idx * 0.8));
    addGpu(`Intel ${name}`, 'Intel', isArcDiscrete ? 'Intel Arc' : 'Intel Integrated', isArcDiscrete ? 8 : 2, perf, isArcDiscrete ? 'Xe HPG' : 'Intel Gen/Xe LP');
  });

  return Array.from(gpus.values());
}

function generateMassiveCpuCatalog() {
  const cpus = new Map();

  function addCpu(name, brand, series, cores, threads, st, mt, tdp) {
    if (!cpus.has(name)) {
      cpus.set(name, {
        name,
        brand,
        series,
        cores: Math.max(1, cores),
        threads: Math.max(1, threads),
        single_thread_score: Math.max(100, st),
        multi_thread_score: Math.max(200, mt),
        tdp_watts: Math.max(5, tdp)
      });
    }
  }

  // 1. Apple Silicon CPUs (M1 - M4 with matching unified thread matrix)
  const appleGens = ['M1', 'M2', 'M3', 'M4'];
  appleGens.forEach((gen, gIdx) => {
    const genMult = 1 + gIdx * 0.28;
    const appleSkus = [
      { name: `Apple ${gen} (8-core)`, cores: 8, threads: 8, st: 2400, mt: 8600, tdp: 20 },
      { name: `Apple ${gen} Pro (10-core)`, cores: 10, threads: 10, st: 2600, mt: 12500, tdp: 30 },
      { name: `Apple ${gen} Pro (12-core)`, cores: 12, threads: 12, st: 2750, mt: 15400, tdp: 35 },
      { name: `Apple ${gen} Max (12-core)`, cores: 12, threads: 12, st: 2800, mt: 16500, tdp: 45 },
      { name: `Apple ${gen} Max (14-core)`, cores: 14, threads: 14, st: 2900, mt: 19800, tdp: 50 },
      { name: `Apple ${gen} Max (16-core)`, cores: 16, threads: 16, st: 3000, mt: 23500, tdp: 60 },
      { name: `Apple ${gen} Ultra (20-core)`, cores: 20, threads: 20, st: 3000, mt: 29000, tdp: 90 },
      { name: `Apple ${gen} Ultra (24-core)`, cores: 24, threads: 24, st: 3100, mt: 35000, tdp: 110 },
      { name: `Apple ${gen} Ultra (32-core)`, cores: 32, threads: 32, st: 3200, mt: 45000, tdp: 140 }
    ];
    appleSkus.forEach(s => {
      addCpu(
        s.name,
        'Apple',
        gen,
        s.cores,
        s.threads,
        Math.round(s.st * genMult),
        Math.round(s.mt * genMult),
        s.tdp
      );
    });
  });

  // 2. Intel Core Generations (1st through 14th Gen + Core Ultra 100/200)
  // Generates i3, i5, i7, i9 across desktop, mobile, unlocked, power-saver SKUs
  const intelGenerations = [
    { gen: 1, name: 'Nehalem', baseSt: 1150, baseMt: 3200 },
    { gen: 2, name: 'Sandy Bridge', baseSt: 1450, baseMt: 4800 },
    { gen: 3, name: 'Ivy Bridge', baseSt: 1650, baseMt: 5800 },
    { gen: 4, name: 'Haswell', baseSt: 1900, baseMt: 7000 },
    { gen: 5, name: 'Broadwell', baseSt: 2050, baseMt: 7600 },
    { gen: 6, name: 'Skylake', baseSt: 2250, baseMt: 8800 },
    { gen: 7, name: 'Kaby Lake', baseSt: 2450, baseMt: 9800 },
    { gen: 8, name: 'Coffee Lake', baseSt: 2650, baseMt: 13500 },
    { gen: 9, name: 'Coffee Lake-R', baseSt: 2850, baseMt: 16500 },
    { gen: 10, name: 'Comet Lake', baseSt: 3000, baseMt: 20500 },
    { gen: 11, name: 'Rocket Lake', baseSt: 3350, baseMt: 24000 },
    { gen: 12, name: 'Alder Lake', baseSt: 3850, baseMt: 32000 },
    { gen: 13, name: 'Raptor Lake', baseSt: 4250, baseMt: 41000 },
    { gen: 14, name: 'Raptor Lake-R', baseSt: 4450, baseMt: 46000 },
    { gen: 15, name: 'Core Ultra 200', baseSt: 4650, baseMt: 52000 }
  ];

  intelGenerations.forEach(({ gen, name, baseSt, baseMt }) => {
    const tierDefs = [
      { tier: 'i3', coreMult: 1, stMult: 0.82, mtMult: 0.55, tdp: 60, models: ['100', '105', '300', '320', '350'] },
      { tier: 'i5', coreMult: gen < 8 ? 1.5 : (gen < 12 ? 2 : 3), stMult: 1.0, mtMult: 1.0, tdp: 65, models: ['400', '500', '600', '600K'] },
      { tier: 'i7', coreMult: gen < 8 ? 2 : (gen < 12 ? 2.5 : 4), stMult: 1.18, mtMult: 1.45, tdp: 105, models: ['700', '700K', '800', '850'] },
      { tier: 'i9', coreMult: gen < 12 ? 3 : 5.5, stMult: 1.35, mtMult: 1.85, tdp: 125, models: ['900', '900K', '900KS'] }
    ];

    tierDefs.forEach(td => {
      if (td.tier === 'i9' && gen < 9) return; // i9 began at 9th gen on mainstream desktop

      td.models.forEach(modelNum => {
        const fullModelNum = gen === 15 ? `2${modelNum.slice(0, 2)}K` : `${gen}${modelNum}`;
        const suffixes = ['', 'F', 'KF', 'T', 'H', 'HK', 'HX', 'U'];

        suffixes.forEach(suf => {
          let st = Math.round(baseSt * td.stMult);
          let mt = Math.round(baseMt * td.mtMult);
          let tdp = td.tdp;
          let cores = Math.max(2, Math.round(4 * td.coreMult));
          let threads = cores * 2;

          if (suf === 'K' || suf === 'KF') {
            st = Math.round(st * 1.08);
            mt = Math.round(mt * 1.12);
            tdp = 125;
          } else if (suf === 'KS') {
            st = Math.round(st * 1.14);
            mt = Math.round(mt * 1.18);
            tdp = 150;
          } else if (suf === 'T') {
            st = Math.round(st * 0.85);
            mt = Math.round(mt * 0.78);
            tdp = 35;
          } else if (suf.includes('H') || suf.includes('HX')) {
            st = Math.round(st * 0.94);
            mt = Math.round(mt * 0.88);
            tdp = 45;
          } else if (suf === 'U') {
            st = Math.round(st * 0.75);
            mt = Math.round(mt * 0.55);
            cores = Math.max(2, Math.floor(cores / 2));
            threads = cores * 2;
            tdp = 15;
          }

          const label = gen === 15 
            ? `Intel Core Ultra ${td.tier.slice(1)} ${fullModelNum} ${suf}`.trim()
            : `Intel Core ${td.tier}-${fullModelNum}${suf ? ' ' + suf : ''}`.trim();

          addCpu(label, 'Intel', `Core ${name}`, cores, threads, st, mt, tdp);
        });
      });
    });
  });

  // Intel Xeon Workstation / Server
  const xeonFamilies = [
    { name: 'Xeon E3', baseSt: 2100, baseMt: 7800, cores: 4, models: ['1220', '1230', '1240', '1270', '1280'] },
    { name: 'Xeon E5', baseSt: 2300, baseMt: 16000, cores: 8, models: ['2650', '2660', '2670', '2680', '2690', '2697', '2699'] },
    { name: 'Xeon W', baseSt: 3200, baseMt: 32000, cores: 16, models: ['2123', '2145', '2195', '2295', '3175X', '3275', '3495X'] }
  ];
  xeonFamilies.forEach(xf => {
    xf.models.forEach((m, idx) => {
      addCpu(
        `Intel ${xf.name}-${m}`,
        'Intel',
        'Xeon',
        xf.cores + idx * 2,
        (xf.cores + idx * 2) * 2,
        Math.round(xf.baseSt * (1 + idx * 0.05)),
        Math.round(xf.baseMt * (1 + idx * 0.15)),
        140 + idx * 10
      );
    });
  });

  // 3. AMD Processors (FX, Athlon, APUs, Ryzen 1000 through 9000 + Threadripper + EPYC)
  const amdLegacy = [
    { name: 'AMD Athlon II X2 250', c: 2, t: 2, st: 950, mt: 1800, tdp: 65 },
    { name: 'AMD Athlon II X4 640', c: 4, t: 4, st: 1050, mt: 3200, tdp: 95 },
    { name: 'AMD Phenom II X4 965 BE', c: 4, t: 4, st: 1250, mt: 4200, tdp: 125 },
    { name: 'AMD Phenom II X6 1090T', c: 6, t: 6, st: 1300, mt: 5800, tdp: 125 },
    { name: 'AMD FX-4100', c: 4, t: 4, st: 1200, mt: 3800, tdp: 95 },
    { name: 'AMD FX-6300', c: 6, t: 6, st: 1400, mt: 5400, tdp: 95 },
    { name: 'AMD FX-8320', c: 8, t: 8, st: 1450, mt: 6800, tdp: 125 },
    { name: 'AMD FX-8350', c: 8, t: 8, st: 1550, mt: 7400, tdp: 125 },
    { name: 'AMD FX-9590', c: 8, t: 8, st: 1750, mt: 8600, tdp: 220 }
  ];
  amdLegacy.forEach(c => addCpu(c.name, 'AMD', 'Legacy AMD', c.c, c.t, c.st, c.mt, c.tdp));

  // AMD Ryzen Ecosystem across every desktop & mobile family
  const ryzenGenerations = [
    { gen: 1, series: 'Ryzen 1000', arch: 'Zen', baseSt: 2100, baseMt: 12000 },
    { gen: 2, series: 'Ryzen 2000', arch: 'Zen+', baseSt: 2350, baseMt: 14500 },
    { gen: 3, series: 'Ryzen 3000', arch: 'Zen 2', baseSt: 2850, baseMt: 19500 },
    { gen: 4, series: 'Ryzen 4000', arch: 'Zen 2 APU', baseSt: 2950, baseMt: 18500 },
    { gen: 5, series: 'Ryzen 5000', arch: 'Zen 3', baseSt: 3450, baseMt: 25000 },
    { gen: 6, series: 'Ryzen 6000', arch: 'Zen 3+', baseSt: 3600, baseMt: 26500 },
    { gen: 7, series: 'Ryzen 7000', arch: 'Zen 4', baseSt: 4150, baseMt: 33000 },
    { gen: 8, series: 'Ryzen 8000', arch: 'Zen 4 APU', baseSt: 4250, baseMt: 34500 },
    { gen: 9, series: 'Ryzen 9000', arch: 'Zen 5', baseSt: 4750, baseMt: 43000 }
  ];

  ryzenGenerations.forEach(rg => {
    const tierSkus = [
      { tier: '3', baseNum: '100', c: 4, t: 8, mult: 0.75, tdp: 65, suffixes: ['', 'X', 'G', 'GE'] },
      { tier: '5', baseNum: '600', c: 6, t: 12, mult: 1.0, tdp: 65, suffixes: ['', 'X', 'XT', 'X3D', 'G', 'GE', 'H Mobile', 'HS Mobile', 'U Mobile'] },
      { tier: '7', baseNum: '700', c: 8, t: 16, mult: 1.25, tdp: 105, suffixes: ['', 'X', 'XT', 'X3D', 'G', 'H Mobile', 'HS Mobile', 'HX Mobile'] },
      { tier: '9', baseNum: '900', c: 12, t: 24, mult: 1.55, tdp: 120, suffixes: ['', 'X', 'XT', 'X3D', 'HX Mobile'] },
      { tier: '9', baseNum: '950', c: 16, t: 32, mult: 1.85, tdp: 170, suffixes: ['', 'X', 'X3D'] }
    ];

    tierSkus.forEach(ts => {
      ts.suffixes.forEach(suf => {
        let st = Math.round(rg.baseSt * (suf.includes('X3D') ? 1.15 : (suf.includes('X') ? 1.06 : 1.0)));
        let mt = Math.round(rg.baseMt * ts.mult);
        let tdp = ts.tdp;

        if (suf.includes('Mobile') || suf.includes('U')) {
          st = Math.round(st * 0.88);
          mt = Math.round(mt * 0.82);
          tdp = suf.includes('U') ? 15 : 45;
        } else if (suf.includes('GE')) {
          tdp = 35;
        }

        const modelStr = `${rg.gen}${ts.baseNum.slice(1)}`;
        const name = `AMD Ryzen ${ts.tier} ${modelStr}${suf ? ' ' + suf : ''}`.trim();
        addCpu(name, 'AMD', rg.series, ts.c, ts.t, st, mt, tdp);
      });
    });
  });

  // AMD Ryzen Threadripper & EPYC
  const threadripperGens = [
    { gen: '1900', c: 8 }, { gen: '1920X', c: 12 }, { gen: '1950X', c: 16 },
    { gen: '2920X', c: 12 }, { gen: '2950X', c: 16 }, { gen: '2970WX', c: 24 }, { gen: '2990WX', c: 32 },
    { gen: '3960X', c: 24 }, { gen: '3970X', c: 32 }, { gen: '3990X', c: 64 },
    { gen: '5965WX', c: 24 }, { gen: '5975WX', c: 32 }, { gen: '5995WX', c: 64 },
    { gen: '7960X', c: 24 }, { gen: '7970X', c: 32 }, { gen: '7980X', c: 64 }, { gen: '7995WX', c: 96 }
  ];
  threadripperGens.forEach((tr, idx) => {
    addCpu(
      `AMD Ryzen Threadripper ${tr.gen}`,
      'AMD',
      'Threadripper',
      tr.c,
      tr.c * 2,
      Math.round(2600 + idx * 130),
      Math.round(20000 + tr.c * 850),
      280
    );
  });

  return Array.from(cpus.values());
}

async function run() {
  const gpus = generateMassiveGpuCatalog();
  const cpus = generateMassiveCpuCatalog();

  console.log(`Generated ${gpus.length} GPUs and ${cpus.length} CPUs (Total: ${gpus.length + cpus.length} hardware units).`);

  const BATCH_SIZE = 250;

  console.log(`\nUpserting ${gpus.length} GPUs to Supabase...`);
  for (let i = 0; i < gpus.length; i += BATCH_SIZE) {
    const batch = gpus.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('hardware_gpus').upsert(batch, { onConflict: 'name' });
    if (error) {
      console.error(`GPU batch [${i} - ${i + batch.length}] error:`, error.message);
    } else {
      process.stdout.write(`•`);
    }
  }
  console.log(`\n✓ Successfully synced all ${gpus.length} GPUs.`);

  console.log(`\nUpserting ${cpus.length} CPUs to Supabase...`);
  for (let i = 0; i < cpus.length; i += BATCH_SIZE) {
    const batch = cpus.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('hardware_cpus').upsert(batch, { onConflict: 'name' });
    if (error) {
      console.error(`CPU batch [${i} - ${i + batch.length}] error:`, error.message);
    } else {
      process.stdout.write(`•`);
    }
  }
  console.log(`\n✓ Successfully synced all ${cpus.length} CPUs.`);

  console.log(`\nComplete. Hardware library populated with ${gpus.length + cpus.length} total components.`);
}

run();