'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useArthStore } from '@/lib/store';
import { BOOTHS } from '@/lib/booths';

const PLAZA_OFFSET = new THREE.Vector3(0, 5.5, 11);
const BOOTH_OFFSET_DIST = 8;
const BOOTH_HEIGHT = 4.2;

export default function CameraRig() {
  const { camera } = useThree();
  const orbit = useRef(0); // rotation around avatar (player-controlled)
  const tilt = useRef(0.32);
  const zoom = useRef(1);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  const activeBooth = useArthStore((s) => s.activeBooth);
  const avatarPos = useArthStore((s) => s.avatarPos);

  useEffect(() => {
    const onDown = (e) => {
      if (e.button !== 0 && e.button !== 2) return;
      dragging.current = true;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
    };
    const onUp = () => {
      dragging.current = false;
    };
    const onMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      const dy = e.clientY - lastY.current;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      orbit.current -= dx * 0.005;
      tilt.current = THREE.MathUtils.clamp(tilt.current - dy * 0.003, 0.1, 0.85);
    };
    const onWheel = (e) => {
      zoom.current = THREE.MathUtils.clamp(zoom.current + e.deltaY * 0.001, 0.7, 1.6);
    };
    const onContext = (e) => e.preventDefault();

    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('contextmenu', onContext);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('contextmenu', onContext);
    };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const target = new THREE.Vector3();
    const desiredPos = new THREE.Vector3();

    if (activeBooth) {
      const b = BOOTHS[activeBooth];
      const [rx, , rz] = b.room.position;
      // Camera circles slowly around the booth center, weighted toward avatar pos
      target.set(
        rx * 0.6 + avatarPos[0] * 0.4,
        1.4,
        rz * 0.6 + avatarPos[2] * 0.4
      );
      const dist = BOOTH_OFFSET_DIST * zoom.current;
      const angle = orbit.current + b.room.rotation + Math.PI;
      desiredPos.set(
        target.x + Math.sin(angle) * dist,
        target.y + BOOTH_HEIGHT * (0.6 + tilt.current * 0.8),
        target.z + Math.cos(angle) * dist
      );
    } else {
      target.set(avatarPos[0], 1.4, avatarPos[2]);
      const dist = (PLAZA_OFFSET.length()) * zoom.current;
      const angle = orbit.current;
      desiredPos.set(
        target.x + Math.sin(angle) * dist * 0.9,
        target.y + 4.5 + tilt.current * 4.5,
        target.z + Math.cos(angle) * dist * 0.9
      );
    }

    camera.position.lerp(desiredPos, Math.min(1, dt * 4));
    const lookAt = new THREE.Vector3().lerpVectors(
      camera.position.clone().add(new THREE.Vector3(0, -1, 0)),
      target,
      1
    );
    camera.lookAt(lookAt);
  });

  return null;
}
