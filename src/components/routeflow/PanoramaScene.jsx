'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const RADIUS = 6.2;
const GAP = 0.14; // fraction of each slot left empty between panels

// One curved screenshot on the inside of a cylinder. Seen from inside, cylinder UVs run
// right-to-left, so the texture is mirrored back with repeat.x = -1.
function Panel({ url, index, count, height }) {
  const texture = useLoader(THREE.TextureLoader, url);
  const gl = useThree((s) => s.gl);
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.repeat.x = -1;
    texture.offset.x = 1;
    texture.needsUpdate = true;
  }, [texture, gl]);

  const slot = (Math.PI * 2) / count;
  const length = slot * (1 - GAP);
  // Panel i is centred on angle PI (straight ahead, -z) when the ring rotation is i * slot.
  const thetaStart = Math.PI - length / 2 - index * slot;

  return (
    <group>
      <mesh userData={{ index }}>
        <cylinderGeometry args={[RADIUS, RADIUS, height, 32, 1, true, thetaStart, length]} />
        <meshStandardMaterial
          map={texture}
          side={THREE.BackSide}
          emissive="#ffffff"
          emissiveMap={texture}
          emissiveIntensity={0.55}
          roughness={0.55}
          metalness={0.1}
          toneMapped={false}
        />
      </mesh>
      {/* Thin glowing rails above and below each panel. */}
      {[height / 2 + 0.06, -height / 2 - 0.06].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[RADIUS - 0.01, RADIUS - 0.01, 0.012, 32, 1, true, thetaStart, length]} />
          <meshBasicMaterial color="#60a5fa" side={THREE.BackSide} transparent opacity={0.55} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Dust() {
  const ref = useRef();
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 420;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 1.5 + Math.random() * 4.2;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.sin(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = Math.cos(a) * r;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  // Soft round sprite so particles aren't drawn as squares.
  const sprite = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 32;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(c);
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.012;
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        map={sprite}
        alphaMap={sprite}
        color="#9cc3ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Ring rotation = scroll progress + drag offset, eased every frame. Camera sways with the pointer
// for parallax. Reports which panel faces the camera so the HTML overlay can name it.
// Adaptive quality: after a warm-up, drop the pixel ratio if frames are slow; if the device
// still can't hold ~24 fps at 1×, hand over to the 2D strip.
function useFrameBudget(onSlow) {
  const acc = useRef({ t: 0, n: 0, warm: 1.5, degraded: false });
  useFrame((state, dt) => {
    const a = acc.current;
    if (dt > 0.25) return; // tab was hidden or the page was busy loading: not a rendering cost
    if (a.warm > 0) {
      a.warm -= dt;
      return;
    }
    a.t += dt;
    a.n += 1;
    if (a.t < 2) return;
    const avg = a.t / a.n;
    a.t = 0;
    a.n = 0;
    if (avg > 1 / 40 && !a.degraded) {
      a.degraded = true;
      state.setDpr(1);
      a.warm = 0.5;
    } else if (avg > 1 / 24 && a.degraded) {
      onSlow?.();
    }
  });
}

function Ring({ shots, control, onActive, onReady, onSlow }) {
  const ring = useRef();
  useFrameBudget(onSlow);
  // Rendered only after every texture resolved (Suspense), so this means "ready to show".
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  const current = useRef(0);
  const lastActive = useRef(-1);

  const count = shots.length;
  const slot = (Math.PI * 2) / count;
  const height = Math.min(3.35, (RADIUS * slot * (1 - GAP) * 3) / 4);

  useFrame((state, dt) => {
    const c = control.current;
    const target = c.scroll * slot * (count - 1) + c.drag;
    current.current = THREE.MathUtils.damp(current.current, target, 4.5, dt);
    if (ring.current) ring.current.rotation.y = current.current;

    const active = ((Math.round(current.current / slot) % count) + count) % count;
    if (active !== lastActive.current) {
      lastActive.current = active;
      onActive(active);
    }

    // Frame the front panel: pull the camera back until it fits 82% of the width / 66% of the height.
    const cam = state.camera;
    const tan = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const panelW = RADIUS * slot * (1 - GAP);
    const dist = Math.max(panelW / (0.82 * 2 * tan * (state.size.width / state.size.height)), height / (0.66 * 2 * tan));
    cam.position.z = THREE.MathUtils.clamp(-RADIUS + dist, -1.6, 3);

    // Parallax: camera drifts toward the pointer, ring tilts slightly with scroll velocity.
    cam.position.x = THREE.MathUtils.damp(cam.position.x, c.pointer.x * 0.35, 3, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, 0.15 + c.pointer.y * 0.2, 3, dt);
    cam.lookAt(0, 0, -RADIUS);
    if (ring.current) {
      const vel = target - current.current;
      ring.current.rotation.z = THREE.MathUtils.damp(ring.current.rotation.z, THREE.MathUtils.clamp(vel * 0.04, -0.05, 0.05), 3, dt);
    }
  });

  return (
    <group ref={ring}>
      {shots.map((s, i) => (
        <Panel key={s.url} url={s.url} index={i} count={count} height={height} />
      ))}
    </group>
  );
}

export default function PanoramaScene({ shots, control, onActive, active, onReady, onSlow }) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0.15, -1], fov: 52, near: 0.1, far: 30 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor('#0a0a0b');
        scene.fog = new THREE.Fog('#0a0a0b', 5.5, 12);
      }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.35} />
      {/* Cool key light in front of the viewer, warm rim from behind: depth on the curved panels. */}
      <pointLight position={[0, 1.5, -2]} intensity={14} distance={9} color="#9cc3ff" />
      <pointLight position={[0, -2, 3]} intensity={10} distance={10} color="#ff2d55" />
      <Suspense fallback={null}>
        <Ring shots={shots} control={control} onActive={onActive} onReady={onReady} onSlow={onSlow} />
      </Suspense>
      <Dust />
    </Canvas>
  );
}
