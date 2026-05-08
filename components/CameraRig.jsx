'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useArthStore } from '@/lib/store';

// Camera presets per scene. Each entry frames the diorama nicely.
const PRESETS = {
  lobby: {
    pos: [0, 3.6, 10],
    look: [0, 2.4, 0],
    orbit: 0.32,
  },
  booth: {
    pos: [0, 4.2, 12.5],
    look: [0, 2.6, -2],
    orbit: 0.5,
  },
  sojao: {
    pos: [0, 2.4, 10.5],
    look: [0, 2.3, -1.2],
    orbit: 0.32,
  },
  wall: {
    pos: [0, 4.2, 11],
    look: [0, 3.5, -3],
    orbit: 0.35,
  },
  hub: {
    pos: [0, 4.6, 13.5],
    look: [0, 2.6, -1],
    orbit: 0.55,
  },
};

export default function CameraRig() {
  const { camera } = useThree();
  const drag = useRef({ active: false, x: 0, y: 0 });
  const orbit = useRef(0);
  const tilt = useRef(0);
  const t = useRef(0);

  const activeBooth = useArthStore((s) => s.activeBooth);

  // pick a preset based on active scene
  const preset =
    activeBooth === null
      ? PRESETS.lobby
      : activeBooth === 'normalized'
      ? PRESETS.wall
      : activeBooth === 'hub'
      ? PRESETS.hub
      : activeBooth === 'sojao'
      ? PRESETS.sojao
      : PRESETS.booth;

  useEffect(() => {
    const onDown = (e) => {
      drag.current.active = true;
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
    };
    const onUp = () => (drag.current.active = false);
    const onMove = (e) => {
      if (!drag.current.active) return;
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
      orbit.current = THREE.MathUtils.clamp(orbit.current - dx * 0.0035, -preset.orbit, preset.orbit);
      tilt.current = THREE.MathUtils.clamp(tilt.current - dy * 0.002, -0.18, 0.22);
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
    };
  }, [preset.orbit]);

  // Reset orbit on room change
  useEffect(() => {
    orbit.current *= 0;
    tilt.current = 0;
  }, [activeBooth]);

  useFrame((state, delta) => {
    t.current += Math.min(delta, 0.05);
    const drift = Math.sin(t.current * 0.18) * 0.05;

    const base = new THREE.Vector3(...preset.pos);
    const look = new THREE.Vector3(...preset.look);

    // Apply orbit around look-at point
    const offset = base.clone().sub(look);
    const totalAngle = orbit.current + drift;
    const c = Math.cos(totalAngle);
    const s = Math.sin(totalAngle);
    const x = offset.x * c - offset.z * s;
    const z = offset.x * s + offset.z * c;
    const desired = new THREE.Vector3(look.x + x, look.y + offset.y + tilt.current * 1.6, look.z + z);

    camera.position.lerp(desired, Math.min(1, delta * 4));
    camera.lookAt(look);
  });

  return null;
}
