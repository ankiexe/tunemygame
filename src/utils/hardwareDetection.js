export async function detectSystemRig(supabaseGpus = [], supabaseCpus = []) {
  const result = {
    gpuName: '',
    cpuCores: navigator.hardwareConcurrency || 4,
    ramGB: navigator.deviceMemory || 8,
    platform: 'pc',
    isAppleSilicon: false,
    confidence: 'medium'
  };

  // 1. Detect GPU via WebGL unmasked renderer extension
  let detectedGpuString = '';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        detectedGpuString = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
      }
    }
  } catch {
    detectedGpuString = '';
  }

  // 2. OS & Architecture Detection
  const userAgent = navigator.userAgent.toLowerCase();
  const isMac = /macintosh|mac os x/.test(userAgent);

  // Apple Silicon detection (Apple M-series)
  if (isMac) {
    result.platform = 'mac';
    if (detectedGpuString.includes('Apple') || !detectedGpuString.includes('Intel')) {
      result.isAppleSilicon = true;
      // Heuristic Apple Chip mapping based on thread count & WebGL strings
      if (result.cpuCores >= 14) result.gpuName = 'Apple M3 Max';
      else if (result.cpuCores >= 11) result.gpuName = 'Apple M3 Pro';
      else if (result.cpuCores >= 10) result.gpuName = 'Apple M2 Pro';
      else result.gpuName = 'Apple M2';
    }
  }

  // 3. Exact Matching Against Supabase GPU Database
  if (!result.isAppleSilicon && detectedGpuString) {
    const cleanGpuString = detectedGpuString
      .replace(/angle\s*\(/i, '')
      .replace(/direct3d.*vs_.*ps_.*/i, '')
      .replace(/\)/g, '')
      .trim();

    // Look for exact/partial model match in ingested database
    const matchedGpu = supabaseGpus.find((gpu) => {
      const dbName = gpu.name.toLowerCase().replace(/nvidia|geforce|amd|radeon|intel/g, '').trim();
      return cleanGpuString.toLowerCase().includes(dbName);
    });

    if (matchedGpu) {
      result.gpuName = matchedGpu.name;
      result.confidence = 'high';
    } else {
      result.gpuName = cleanGpuString || 'NVIDIA GeForce RTX 3060';
    }
  }

  // 4. Infer Matching CPU Profile based on Core Count
  let matchedCpu = null;
  if (supabaseCpus.length > 0) {
    if (result.cpuCores >= 16) {
      matchedCpu = supabaseCpus.find((c) => c.name.includes('i9-14900K') || c.name.includes('7950X') || c.name.includes('9950X'));
    } else if (result.cpuCores >= 12) {
      matchedCpu = supabaseCpus.find((c) => c.name.includes('i7-14700K') || c.name.includes('7800X3D') || c.name.includes('9800X3D'));
    } else if (result.cpuCores >= 8) {
      matchedCpu = supabaseCpus.find((c) => c.name.includes('i5-13600K') || c.name.includes('Ryzen 5 7600'));
    } else {
      matchedCpu = supabaseCpus.find((c) => c.name.includes('i5-10400') || c.name.includes('Ryzen 3'));
    }
  }

  return {
    gpuName: result.gpuName || (result.isAppleSilicon ? 'Apple M2' : 'NVIDIA GeForce RTX 3060'),
    cpuName: matchedCpu?.name || 'AMD Ryzen 5 7600',
    ramGB: result.ramGB >= 16 ? 16 : (result.ramGB >= 8 ? 16 : 8),
    platform: result.platform,
    rawRenderer: detectedGpuString
  };
}