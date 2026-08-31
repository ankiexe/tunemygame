import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zfqorzpdljrwdnpnwvsw.supabase.co';
// Your Supabase Anon or Service Role key
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcW9yenBkbGpyd2RucG53dnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNjU1MzMsImV4cCI6MjEwMzc0MTUzM30.0QucSbGN3wJ_FNluvNAqQbC7p1jrtqyZ9nkhXczobB0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const GPU_DATABASE = [
  // NVIDIA RTX 50 & 40 Series
  { id: 'rtx_5090', name: 'NVIDIA GeForce RTX 5090', vram: 32, power_score: 130, architecture: 'Blackwell' },
  { id: 'rtx_5080', name: 'NVIDIA GeForce RTX 5080', vram: 16, power_score: 110, architecture: 'Blackwell' },
  { id: 'rtx_5070_ti', name: 'NVIDIA GeForce RTX 5070 Ti', vram: 16, power_score: 95, architecture: 'Blackwell' },
  { id: 'rtx_5070', name: 'NVIDIA GeForce RTX 5070', vram: 12, power_score: 85, architecture: 'Blackwell' },
  { id: 'rtx_4090', name: 'NVIDIA GeForce RTX 4090', vram: 24, power_score: 100, architecture: 'Ada Lovelace' },
  { id: 'rtx_4080_super', name: 'NVIDIA GeForce RTX 4080 Super', vram: 16, power_score: 92, architecture: 'Ada Lovelace' },
  { id: 'rtx_4080', name: 'NVIDIA GeForce RTX 4080', vram: 16, power_score: 90, architecture: 'Ada Lovelace' },
  { id: 'rtx_4070_ti_super', name: 'NVIDIA GeForce RTX 4070 Ti Super', vram: 16, power_score: 86, architecture: 'Ada Lovelace' },
  { id: 'rtx_4070_ti', name: 'NVIDIA GeForce RTX 4070 Ti', vram: 12, power_score: 82, architecture: 'Ada Lovelace' },
  { id: 'rtx_4070_super', name: 'NVIDIA GeForce RTX 4070 Super', vram: 12, power_score: 79, architecture: 'Ada Lovelace' },
  { id: 'rtx_4070', name: 'NVIDIA GeForce RTX 4070', vram: 12, power_score: 75, architecture: 'Ada Lovelace' },
  { id: 'rtx_4060_ti_16gb', name: 'NVIDIA GeForce RTX 4060 Ti (16GB)', vram: 16, power_score: 66, architecture: 'Ada Lovelace' },
  { id: 'rtx_4060_ti_8gb', name: 'NVIDIA GeForce RTX 4060 Ti (8GB)', vram: 8, power_score: 65, architecture: 'Ada Lovelace' },
  { id: 'rtx_4060', name: 'NVIDIA GeForce RTX 4060', vram: 8, power_score: 58, architecture: 'Ada Lovelace' },
  { id: 'rtx_4050_mobile', name: 'NVIDIA GeForce RTX 4050 Laptop', vram: 6, power_score: 46, architecture: 'Ada Lovelace' },

  // NVIDIA RTX 30 & 20 Series
  { id: 'rtx_3090_ti', name: 'NVIDIA GeForce RTX 3090 Ti', vram: 24, power_score: 88, architecture: 'Ampere' },
  { id: 'rtx_3090', name: 'NVIDIA GeForce RTX 3090', vram: 24, power_score: 85, architecture: 'Ampere' },
  { id: 'rtx_3080_ti', name: 'NVIDIA GeForce RTX 3080 Ti', vram: 12, power_score: 82, architecture: 'Ampere' },
  { id: 'rtx_3080_12gb', name: 'NVIDIA GeForce RTX 3080 (12GB)', vram: 12, power_score: 80, architecture: 'Ampere' },
  { id: 'rtx_3080_10gb', name: 'NVIDIA GeForce RTX 3080 (10GB)', vram: 10, power_score: 78, architecture: 'Ampere' },
  { id: 'rtx_3070_ti', name: 'NVIDIA GeForce RTX 3070 Ti', vram: 8, power_score: 70, architecture: 'Ampere' },
  { id: 'rtx_3070', name: 'NVIDIA GeForce RTX 3070', vram: 8, power_score: 66, architecture: 'Ampere' },
  { id: 'rtx_3060_ti', name: 'NVIDIA GeForce RTX 3060 Ti', vram: 8, power_score: 60, architecture: 'Ampere' },
  { id: 'rtx_3060_12gb', name: 'NVIDIA GeForce RTX 3060 (12GB)', vram: 12, power_score: 50, architecture: 'Ampere' },
  { id: 'rtx_3050_8gb', name: 'NVIDIA GeForce RTX 3050 (8GB)', vram: 8, power_score: 38, architecture: 'Ampere' },
  { id: 'rtx_2080_ti', name: 'NVIDIA GeForce RTX 2080 Ti', vram: 11, power_score: 68, architecture: 'Turing' },
  { id: 'rtx_2080_super', name: 'NVIDIA GeForce RTX 2080 Super', vram: 8, power_score: 62, architecture: 'Turing' },
  { id: 'rtx_2070_super', name: 'NVIDIA GeForce RTX 2070 Super', vram: 8, power_score: 54, architecture: 'Turing' },
  { id: 'rtx_2060_super', name: 'NVIDIA GeForce RTX 2060 Super', vram: 8, power_score: 48, architecture: 'Turing' },
  { id: 'rtx_2060_6gb', name: 'NVIDIA GeForce RTX 2060 (6GB)', vram: 6, power_score: 40, architecture: 'Turing' },

  // NVIDIA GTX Legacy
  { id: 'gtx_1660_ti', name: 'NVIDIA GeForce GTX 1660 Ti', vram: 6, power_score: 37, architecture: 'Turing' },
  { id: 'gtx_1660_super', name: 'NVIDIA GeForce GTX 1660 Super', vram: 6, power_score: 35, architecture: 'Turing' },
  { id: 'gtx_1650_super', name: 'NVIDIA GeForce GTX 1650 Super', vram: 4, power_score: 30, architecture: 'Turing' },
  { id: 'gtx_1650', name: 'NVIDIA GeForce GTX 1650', vram: 4, power_score: 22, architecture: 'Turing' },
  { id: 'gtx_1080_ti', name: 'NVIDIA GeForce GTX 1080 Ti', vram: 11, power_score: 56, architecture: 'Pascal' },
  { id: 'gtx_1080', name: 'NVIDIA GeForce GTX 1080', vram: 8, power_score: 48, architecture: 'Pascal' },
  { id: 'gtx_1070', name: 'NVIDIA GeForce GTX 1070', vram: 8, power_score: 38, architecture: 'Pascal' },
  { id: 'gtx_1060_6gb', name: 'NVIDIA GeForce GTX 1060 (6GB)', vram: 6, power_score: 28, architecture: 'Pascal' },
  { id: 'gtx_1050_ti', name: 'NVIDIA GeForce GTX 1050 Ti', vram: 4, power_score: 18, architecture: 'Pascal' },
  { id: 'gtx_750_ti', name: 'NVIDIA GeForce GTX 750 Ti', vram: 2, power_score: 12, architecture: 'Maxwell' },

  // AMD Radeon RX 7000, 6000 & Legacy
  { id: 'rx_7900_xtx', name: 'AMD Radeon RX 7900 XTX', vram: 24, power_score: 95, architecture: 'RDNA 3' },
  { id: 'rx_7900_xt', name: 'AMD Radeon RX 7900 XT', vram: 20, power_score: 88, architecture: 'RDNA 3' },
  { id: 'rx_7800_xt', name: 'AMD Radeon RX 7800 XT', vram: 16, power_score: 77, architecture: 'RDNA 3' },
  { id: 'rx_7700_xt', name: 'AMD Radeon RX 7700 XT', vram: 12, power_score: 68, architecture: 'RDNA 3' },
  { id: 'rx_7600', name: 'AMD Radeon RX 7600', vram: 8, power_score: 52, architecture: 'RDNA 3' },
  { id: 'rx_6800_xt', name: 'AMD Radeon RX 6800 XT', vram: 16, power_score: 72, architecture: 'RDNA 2' },
  { id: 'rx_6700_xt', name: 'AMD Radeon RX 6700 XT', vram: 12, power_score: 58, architecture: 'RDNA 2' },
  { id: 'rx_6600', name: 'AMD Radeon RX 6600', vram: 8, power_score: 46, architecture: 'RDNA 2' },
  { id: 'rx_580_8gb', name: 'AMD Radeon RX 580 (8GB)', vram: 8, power_score: 25, architecture: 'Polaris' },
  { id: 'rx_570_4gb', name: 'AMD Radeon RX 570 (4GB)', vram: 4, power_score: 20, architecture: 'Polaris' },

  // Intel Arc & Integrated GPUs
  { id: 'intel_arc_a770', name: 'Intel Arc A770 (16GB)', vram: 16, power_score: 56, architecture: 'Alchemist' },
  { id: 'intel_arc_a750', name: 'Intel Arc A750 (8GB)', vram: 8, power_score: 52, architecture: 'Alchemist' },
  { id: 'intel_arc_a580', name: 'Intel Arc A580 (8GB)', vram: 8, power_score: 44, architecture: 'Alchemist' },
  { id: 'intel_arc_a380', name: 'Intel Arc A380 (6GB)', vram: 6, power_score: 22, architecture: 'Alchemist' },
  { id: 'radeon_780m', name: 'AMD Radeon 780M (Integrated)', vram: 4, power_score: 26, architecture: 'RDNA 3 iGPU' },
  { id: 'intel_iris_xe_96', name: 'Intel Iris Xe Graphics (80/96 EU)', vram: 2, power_score: 16, architecture: 'Iris Xe' },
  { id: 'intel_uhd_770', name: 'Intel UHD Graphics 770', vram: 2, power_score: 11, architecture: 'Intel Xe' },
  { id: 'intel_hd_4000', name: 'Intel HD Graphics 4000', vram: 1, power_score: 3, architecture: 'Intel Legacy' },

  // Apple Silicon Chips
  { id: 'apple_m4_max', name: 'Apple M4 Max (40-core GPU)', vram: 36, power_score: 88, architecture: 'Apple Silicon' },
  { id: 'apple_m4_pro', name: 'Apple M4 Pro (20-core GPU)', vram: 24, power_score: 68, architecture: 'Apple Silicon' },
  { id: 'apple_m4_base', name: 'Apple M4 (10-core GPU)', vram: 16, power_score: 42, architecture: 'Apple Silicon' },
  { id: 'apple_m3_max', name: 'Apple M3 Max (40-core GPU)', vram: 36, power_score: 82, architecture: 'Apple Silicon' },
  { id: 'apple_m3_pro', name: 'Apple M3 Pro (18-core GPU)', vram: 18, power_score: 62, architecture: 'Apple Silicon' },
  { id: 'apple_m3_base', name: 'Apple M3 (10-core GPU)', vram: 16, power_score: 36, architecture: 'Apple Silicon' },
  { id: 'apple_m2_ultra', name: 'Apple M2 Ultra (76-core GPU)', vram: 64, power_score: 94, architecture: 'Apple Silicon' },
  { id: 'apple_m2_max', name: 'Apple M2 Max (38-core GPU)', vram: 32, power_score: 70, architecture: 'Apple Silicon' },
  { id: 'apple_m2_pro', name: 'Apple M2 Pro (19-core GPU)', vram: 16, power_score: 52, architecture: 'Apple Silicon' },
  { id: 'apple_m2_base', name: 'Apple M2 (10-core GPU)', vram: 16, power_score: 32, architecture: 'Apple Silicon' },
  { id: 'apple_m1_max', name: 'Apple M1 Max (32-core GPU)', vram: 32, power_score: 60, architecture: 'Apple Silicon' },
  { id: 'apple_m1_pro', name: 'Apple M1 Pro (16-core GPU)', vram: 16, power_score: 45, architecture: 'Apple Silicon' },
  { id: 'apple_m1_base', name: 'Apple M1 (8-core GPU)', vram: 8, power_score: 28, architecture: 'Apple Silicon' }
];

const CPU_DATABASE = [
  // Intel Core
  { id: 'i9_14900ks', name: 'Intel Core i9-14900KS', cores: 24, power_score: 102, tier: 'Flagship' },
  { id: 'i9_14900k', name: 'Intel Core i9-14900K', cores: 24, power_score: 100, tier: 'Flagship' },
  { id: 'i7_14700k', name: 'Intel Core i7-14700K', cores: 20, power_score: 93, tier: 'High-End' },
  { id: 'i5_14600k', name: 'Intel Core i5-14600K', cores: 14, power_score: 84, tier: 'Mid-Range' },
  { id: 'i5_14400f', name: 'Intel Core i5-14400F', cores: 10, power_score: 72, tier: 'Budget Mid' },
  { id: 'i9_13900k', name: 'Intel Core i9-13900K', cores: 24, power_score: 97, tier: 'Flagship' },
  { id: 'i7_13700k', name: 'Intel Core i7-13700K', cores: 16, power_score: 90, tier: 'High-End' },
  { id: 'i5_13600k', name: 'Intel Core i5-13600K', cores: 14, power_score: 82, tier: 'Mid-Range' },
  { id: 'i5_13400f', name: 'Intel Core i5-13400F', cores: 10, power_score: 68, tier: 'Budget Mid' },
  { id: 'i9_12900k', name: 'Intel Core i9-12900K', cores: 16, power_score: 88, tier: 'High-End' },
  { id: 'i7_12700k', name: 'Intel Core i7-12700K', cores: 12, power_score: 80, tier: 'Mid-Range' },
  { id: 'i5_12400f', name: 'Intel Core i5-12400F', cores: 6, power_score: 64, tier: 'Budget Mid' },
  { id: 'i3_12100f', name: 'Intel Core i3-12100F', cores: 4, power_score: 48, tier: 'Budget' },
  { id: 'i3_1215u', name: 'Intel Core i3-1215U / 1215U (Laptop)', cores: 6, power_score: 40, tier: 'Laptop' },
  { id: 'i7_10700k', name: 'Intel Core i7-10700K', cores: 8, power_score: 62, tier: 'Legacy High' },
  { id: 'i5_10400f', name: 'Intel Core i5-10400F', cores: 6, power_score: 50, tier: 'Legacy Mid' },
  { id: 'i5_4590', name: 'Intel Core i5-4590', cores: 4, power_score: 22, tier: 'Potato' },

  // AMD Ryzen
  { id: 'r7_9800x3d', name: 'AMD Ryzen 7 9800X3D', cores: 8, power_score: 105, tier: 'Flagship Gaming' },
  { id: 'r9_7950x3d', name: 'AMD Ryzen 9 7950X3D', cores: 16, power_score: 100, tier: 'Flagship' },
  { id: 'r7_7800x3d', name: 'AMD Ryzen 7 7800X3D', cores: 8, power_score: 98, tier: 'Gaming King' },
  { id: 'r9_7900x', name: 'AMD Ryzen 9 7900X', cores: 12, power_score: 94, tier: 'High-End' },
  { id: 'r7_7700x', name: 'AMD Ryzen 7 7700X', cores: 8, power_score: 86, tier: 'Mid-Range' },
  { id: 'r5_7600x', name: 'AMD Ryzen 5 7600X', cores: 6, power_score: 80, tier: 'Mid-Range' },
  { id: 'r5_7500f', name: 'AMD Ryzen 5 7500F', cores: 6, power_score: 75, tier: 'Budget Mid' },
  { id: 'r7_5800x3d', name: 'AMD Ryzen 7 5800X3D', cores: 8, power_score: 84, tier: 'High-End AM4' },
  { id: 'r7_5700x3d', name: 'AMD Ryzen 7 5700X3D', cores: 8, power_score: 78, tier: 'Gaming AM4' },
  { id: 'r5_5600x', name: 'AMD Ryzen 5 5600X', cores: 6, power_score: 62, tier: 'Budget King' },
  { id: 'r5_3600', name: 'AMD Ryzen 5 3600', cores: 6, power_score: 45, tier: 'Legacy AM4' },
  { id: 'fx_8350', name: 'AMD FX-8350', cores: 8, power_score: 18, tier: 'Potato' }
];

async function syncHardware() {
  console.log('Ingesting GPUs into Supabase...');
  const { error: gpuErr } = await supabase.from('gpus').upsert(GPU_DATABASE, { onConflict: 'id' });
  if (gpuErr) console.error('GPU Sync Error:', gpuErr.message);
  else console.log(`Successfully synced ${GPU_DATABASE.length} GPUs/Apple Chips.`);

  console.log('Ingesting CPUs into Supabase...');
  const { error: cpuErr } = await supabase.from('cpus').upsert(CPU_DATABASE, { onConflict: 'id' });
  if (cpuErr) console.error('CPU Sync Error:', cpuErr.message);
  else console.log(`Successfully synced ${CPU_DATABASE.length} CPUs.`);

  console.log('Hardware sync finished!');
}

syncHardware();