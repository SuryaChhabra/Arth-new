'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useArthStore } from '@/lib/store';
import { BOOTHS, BOOTH_ORDER } from '@/lib/booths';

const SKIN = '#C99077';
const SKIN_DARK = '#A56F58';
const HAIR = '#241616';
const HAIR_HIGHLIGHT = '#3A1E1E';
const KURTA = '#F08A5D';      // warm coral
const KURTA_TRIM = '#FBE2C2'; // cream
const PANTS = '#3F2A3A';      // muted plum
const SHOE = '#5B3A55';
const BINDI = '#B33A4F';
const DUPATTA = '#F3A6B0';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// Simple 2D circle vs circle collision against booth doorways used to
// detect entry. Booth doors are roughly 4 units wide.
function findBoothByPosition(x, z) {
  for (const id of BOOTH_ORDER) {
    const b = BOOTHS[id];
    const [dx, , dz] = b.door.position;
    const distance = Math.hypot(x - dx, z - dz);
    if (distance < 3.2) return id;
  }
  return null;
}

export default function Avatar() {
  const groupRef = useRef();
  const innerRef = useRef();
  const headRef = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  const leftLeg = useRef();
  const rightLeg = useRef();
  const dupattaRef = useRef();

  const keys = useRef({ w: false, a: false, s: false, d: false, shift: false });
  const facing = useRef(0);
  const speed = useRef(0);
  const setActiveBooth = useArthStore((s) => s.setActiveBooth);
  const activeBooth = useArthStore((s) => s.activeBooth);
  const setAvatarPos = useArthStore((s) => s.setAvatarPos);
  const decoderOpen = useArthStore((s) => s.decoderOpen);
  const openHotspot = useArthStore((s) => s.openHotspot);
  const mapOpen = useArthStore((s) => s.mapOpen);

  useEffect(() => {
    const down = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') keys.current.w = true;
      if (k === 'arrowleft' || k === 'a') keys.current.a = true;
      if (k === 'arrowdown' || k === 's') keys.current.s = true;
      if (k === 'arrowright' || k === 'd') keys.current.d = true;
      if (k === 'shift') keys.current.shift = true;
    };
    const up = (e) => {
      const k = e.key.toLowerCase();
      if (k === 'arrowup' || k === 'w') keys.current.w = false;
      if (k === 'arrowleft' || k === 'a') keys.current.a = false;
      if (k === 'arrowdown' || k === 's') keys.current.s = false;
      if (k === 'arrowright' || k === 'd') keys.current.d = false;
      if (k === 'shift') keys.current.shift = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // When entering a booth, snap the avatar to a polite spot inside the booth room.
  useEffect(() => {
    if (!groupRef.current) return;
    if (activeBooth) {
      const b = BOOTHS[activeBooth];
      const [rx, , rz] = b.room.position;
      // Place avatar a couple of units in front of the room center, facing in.
      const fx = rx - Math.sin(b.room.rotation) * 4;
      const fz = rz + Math.cos(b.room.rotation) * 4;
      groupRef.current.position.set(fx, 0, fz);
      facing.current = b.room.rotation + Math.PI;
    } else {
      // Returning to plaza: place near central plaza
      groupRef.current.position.set(0, 0, 8);
      facing.current = Math.PI;
    }
  }, [activeBooth]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const dt = Math.min(delta, 0.05);

    const blocked = decoderOpen || !!openHotspot || mapOpen;
    let inputX = 0;
    let inputZ = 0;
    if (!blocked) {
      if (keys.current.w) inputZ -= 1;
      if (keys.current.s) inputZ += 1;
      if (keys.current.a) inputX -= 1;
      if (keys.current.d) inputX += 1;
    }
    const len = Math.hypot(inputX, inputZ);
    if (len > 0) {
      inputX /= len;
      inputZ /= len;
    }
    const moveSpeed = (keys.current.shift ? 9 : 5.5) * dt;
    const target = new THREE.Vector3(inputX, 0, inputZ);
    const isMoving = len > 0.01;

    speed.current = THREE.MathUtils.lerp(speed.current, isMoving ? 1 : 0, 0.18);

    // Move
    const pos = groupRef.current.position;
    const nx = pos.x + target.x * moveSpeed;
    const nz = pos.z + target.z * moveSpeed;

    // World bounds — different bounds when inside a booth (a tight room) vs plaza
    if (activeBooth) {
      const b = BOOTHS[activeBooth];
      const [rx, , rz] = b.room.position;
      const dx = nx - rx;
      const dz = nz - rz;
      const r = Math.hypot(dx, dz);
      const maxR = 7;
      if (r < maxR) {
        pos.x = nx;
        pos.z = nz;
      } else {
        // glide along the wall
        const ang = Math.atan2(dz, dx);
        pos.x = rx + Math.cos(ang) * maxR;
        pos.z = rz + Math.sin(ang) * maxR;
      }
    } else {
      // Plaza: stay within a generous square
      pos.x = clamp(nx, -38, 38);
      pos.z = clamp(nz, -34, 34);

      // Auto-enter booth when overlapping doorway trigger
      const detected = findBoothByPosition(pos.x, pos.z);
      if (detected) {
        setActiveBooth(detected);
      }
    }

    // Rotate body to face movement
    if (isMoving) {
      const desired = Math.atan2(target.x, target.z) + Math.PI;
      const diff = ((desired - facing.current + Math.PI) % (Math.PI * 2)) - Math.PI;
      facing.current += diff * Math.min(1, dt * 8);
    }
    if (innerRef.current) innerRef.current.rotation.y = facing.current;

    // Animation: walk cycle / idle bob
    const t = state.clock.elapsedTime;
    const walkPhase = t * 6;
    const walkAmp = speed.current;
    const idleBob = Math.sin(t * 1.6) * 0.02;

    if (leftArm.current) leftArm.current.rotation.x = Math.sin(walkPhase) * 0.7 * walkAmp + Math.sin(t * 1.5) * 0.04;
    if (rightArm.current) rightArm.current.rotation.x = -Math.sin(walkPhase) * 0.7 * walkAmp - Math.sin(t * 1.5) * 0.04;
    if (leftLeg.current) leftLeg.current.rotation.x = -Math.sin(walkPhase) * 0.55 * walkAmp;
    if (rightLeg.current) rightLeg.current.rotation.x = Math.sin(walkPhase) * 0.55 * walkAmp;
    if (innerRef.current) innerRef.current.position.y = idleBob + Math.abs(Math.sin(walkPhase)) * 0.06 * walkAmp;
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.7) * 0.15 * (1 - walkAmp) + Math.sin(walkPhase * 0.5) * 0.05 * walkAmp;
      headRef.current.rotation.x = Math.sin(t * 0.9) * 0.04;
    }
    if (dupattaRef.current) {
      dupattaRef.current.rotation.z = Math.sin(t * 1.3) * 0.06 + Math.sin(walkPhase) * 0.05 * walkAmp;
    }

    // Sync position into store every few frames
    setAvatarPos([pos.x, pos.y, pos.z]);
  });

  return (
    <group ref={groupRef} position={[0, 0, 8]}>
      <group ref={innerRef}>
        <Body
          headRef={headRef}
          leftArm={leftArm}
          rightArm={rightArm}
          leftLeg={leftLeg}
          rightLeg={rightLeg}
          dupattaRef={dupattaRef}
        />
      </group>
    </group>
  );
}

function Body({ headRef, leftArm, rightArm, leftLeg, rightLeg, dupattaRef }) {
  const skin = useMemo(() => new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.85, metalness: 0 }), []);
  const skinDark = useMemo(() => new THREE.MeshStandardMaterial({ color: SKIN_DARK, roughness: 0.9 }), []);
  const hair = useMemo(() => new THREE.MeshStandardMaterial({ color: HAIR, roughness: 0.45 }), []);
  const hairHi = useMemo(() => new THREE.MeshStandardMaterial({ color: HAIR_HIGHLIGHT, roughness: 0.6 }), []);
  const kurta = useMemo(() => new THREE.MeshStandardMaterial({ color: KURTA, roughness: 0.7 }), []);
  const kurtaTrim = useMemo(() => new THREE.MeshStandardMaterial({ color: KURTA_TRIM, roughness: 0.6 }), []);
  const pants = useMemo(() => new THREE.MeshStandardMaterial({ color: PANTS, roughness: 0.85 }), []);
  const shoe = useMemo(() => new THREE.MeshStandardMaterial({ color: SHOE, roughness: 0.6 }), []);
  const dupatta = useMemo(() => new THREE.MeshStandardMaterial({ color: DUPATTA, roughness: 0.55, side: THREE.DoubleSide }), []);

  return (
    <group>
      {/* legs (pants) */}
      <group ref={leftLeg} position={[-0.18, 0.85, 0]}>
        <mesh material={pants} position={[0, -0.42, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.86, 16]} />
        </mesh>
        <mesh material={shoe} position={[0, -0.92, 0.05]} castShadow>
          <boxGeometry args={[0.22, 0.1, 0.32]} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.18, 0.85, 0]}>
        <mesh material={pants} position={[0, -0.42, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.86, 16]} />
        </mesh>
        <mesh material={shoe} position={[0, -0.92, 0.05]} castShadow>
          <boxGeometry args={[0.22, 0.1, 0.32]} />
        </mesh>
      </group>

      {/* hips/kurta lower */}
      <mesh material={kurta} position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.42, 0.55, 24]} />
      </mesh>
      <mesh material={kurtaTrim} position={[0, 0.66, 0]}>
        <torusGeometry args={[0.42, 0.025, 8, 32]} />
      </mesh>

      {/* torso/kurta top */}
      <mesh material={kurta} position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.34, 0.55, 24]} />
      </mesh>
      {/* neckline trim */}
      <mesh material={kurtaTrim} position={[0, 1.65, 0.0]}>
        <torusGeometry args={[0.18, 0.018, 8, 24, Math.PI]} />
      </mesh>

      {/* dupatta sash across shoulder */}
      <group ref={dupattaRef} position={[0, 1.5, 0]}>
        <mesh material={dupatta} position={[0.1, -0.15, 0]} rotation={[0, 0, -0.45]}>
          <boxGeometry args={[0.12, 0.9, 0.04]} />
        </mesh>
      </group>

      {/* arms (sleeves + hands) */}
      <group ref={leftArm} position={[-0.42, 1.65, 0]}>
        <mesh material={kurta} position={[0, -0.32, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.7, 14]} />
        </mesh>
        <mesh material={skin} position={[0, -0.7, 0]} castShadow>
          <sphereGeometry args={[0.085, 16, 12]} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.42, 1.65, 0]}>
        <mesh material={kurta} position={[0, -0.32, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.08, 0.7, 14]} />
        </mesh>
        <mesh material={skin} position={[0, -0.7, 0]} castShadow>
          <sphereGeometry args={[0.085, 16, 12]} />
        </mesh>
      </group>

      {/* shoulders fill */}
      <mesh material={skin} position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.18, 16, 12]} />
      </mesh>

      {/* neck */}
      <mesh material={skinDark} position={[0, 1.82, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.12, 12]} />
      </mesh>

      {/* head group */}
      <group ref={headRef} position={[0, 1.92, 0]}>
        {/* head */}
        <mesh material={skin} castShadow>
          <sphereGeometry args={[0.21, 24, 20]} />
        </mesh>
        {/* hair cap (back bun) */}
        <mesh material={hair} position={[0, 0.04, -0.02]}>
          <sphereGeometry args={[0.225, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        </mesh>
        {/* hair side panels framing face */}
        <mesh material={hair} position={[-0.12, -0.05, 0.05]} rotation={[0, 0, 0.3]}>
          <sphereGeometry args={[0.08, 16, 12]} />
        </mesh>
        <mesh material={hair} position={[0.12, -0.05, 0.05]} rotation={[0, 0, -0.3]}>
          <sphereGeometry args={[0.08, 16, 12]} />
        </mesh>
        {/* low bun */}
        <mesh material={hairHi} position={[0, -0.02, -0.22]}>
          <sphereGeometry args={[0.11, 16, 14]} />
        </mesh>
        {/* small hair parting line */}
        <mesh material={hairHi} position={[0, 0.18, 0.01]}>
          <boxGeometry args={[0.01, 0.04, 0.18]} />
        </mesh>
        {/* eyes */}
        <mesh position={[-0.07, 0.01, 0.18]}>
          <sphereGeometry args={[0.018, 10, 8]} />
          <meshStandardMaterial color="#1a0f12" />
        </mesh>
        <mesh position={[0.07, 0.01, 0.18]}>
          <sphereGeometry args={[0.018, 10, 8]} />
          <meshStandardMaterial color="#1a0f12" />
        </mesh>
        {/* lashes */}
        <mesh position={[-0.07, 0.025, 0.187]}>
          <boxGeometry args={[0.05, 0.005, 0.005]} />
          <meshStandardMaterial color="#1a0f12" />
        </mesh>
        <mesh position={[0.07, 0.025, 0.187]}>
          <boxGeometry args={[0.05, 0.005, 0.005]} />
          <meshStandardMaterial color="#1a0f12" />
        </mesh>
        {/* gentle smile */}
        <mesh position={[0, -0.07, 0.19]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.035, 0.006, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#9a3a3a" />
        </mesh>
        {/* bindi */}
        <mesh position={[0, 0.13, 0.205]}>
          <circleGeometry args={[0.018, 16]} />
          <meshStandardMaterial color={BINDI} />
        </mesh>
        {/* earrings */}
        <mesh position={[-0.205, -0.02, 0]}>
          <sphereGeometry args={[0.022, 12, 10]} />
          <meshStandardMaterial color="#E2B36F" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0.205, -0.02, 0]}>
          <sphereGeometry args={[0.022, 12, 10]} />
          <meshStandardMaterial color="#E2B36F" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
