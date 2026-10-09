export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Rough "can this device afford a WebGL scene" check: no WebGL, coarse pointer on a small
// screen, few cores, low memory, or data saver all fall back to the 2D version.
export function canRunHeavy3D() {
  if (typeof window === 'undefined') return false;
  if (prefersReducedMotion()) return false;
  const nav = window.navigator;
  if (nav.connection?.saveData) return false;
  if ((nav.hardwareConcurrency ?? 8) < 4) return false;
  if ((nav.deviceMemory ?? 8) < 4) return false;
  if (window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 900) return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    return false;
  }
  return true;
}
