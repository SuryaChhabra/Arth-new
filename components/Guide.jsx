'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// A non-walking, mid-40s Indian-coded guide woman in coral kurta + dupatta.
// Used as a static greeter inside the lobby (and optionally inside booths).
// Subtle idle breathing + gentle head turn + slight hand wave.

const SKIN = '#C99077';
const SKIN_DARK = '#A56F58';
const HAIR = '#241616';
const HAIR_HIGHLIGHT = '#3A1E1E';
const KURTA = '#F08A5D';
const KURTA_TRIM = '#FBE2C2';
const PANTS = '#3F2A3A';
const SHOE = '#5B3A55';
const BINDI = '#B33A4F';
const DUPATTA = '#F3A6B0';

export default function Guide({ position = [0, 0, 0], rotation = 0, scale = 1.15, wave = false }) {
  const headRef = useRef();
  const torsoRef = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  const dupattaRef = useRef();

  const skin = useMemo(() => new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.85 }), []);
  const skinDark = useMemo(() => new THREE.MeshStandardMaterial({ color: SKIN_DARK, roughness: 0.9 }), []);
  const hair = useMemo(() => new THREE.MeshStandardMaterial({ color: HAIR, roughness: 0.45 }), []);
  const hairHi = useMemo(() => new THREE.MeshStandardMaterial({ color: HAIR_HIGHLIGHT, roughness: 0.6 }), []);
  const kurta = useMemo(() => new THREE.MeshStandardMaterial({ color: KURTA, roughness: 0.7 }), []);
  const kurtaTrim = useMemo(() => new THREE.MeshStandardMaterial({ color: KURTA_TRIM, roughness: 0.6 }), []);
  const pants = useMemo(() => new THREE.MeshStandardMaterial({ color: PANTS, roughness: 0.85 }), []);
  const shoe = useMemo(() => new THREE.MeshStandardMaterial({ color: SHOE, roughness: 0.6 }), []);
  const dupatta = useMemo(
    () => new THREE.MeshStandardMaterial({ color: DUPATTA, roughness: 0.55, side: THREE.DoubleSide }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (torsoRef.current) torsoRef.current.position.y = Math.sin(t * 1.4) * 0.018;
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.18;
      headRef.current.rotation.x = Math.sin(t * 0.7) * 0.04;
    }
    if (rightArm.current) {
      if (wave) {
        rightArm.current.rotation.z = -0.6 + Math.sin(t * 4) * 0.25;
        rightArm.current.rotation.x = -1.4;
      } else {
        rightArm.current.rotation.x = Math.sin(t * 0.9) * 0.07;
      }
    }
    if (leftArm.current) leftArm.current.rotation.x = Math.sin(t * 0.8) * 0.06;
    if (dupattaRef.current) dupattaRef.current.rotation.z = Math.sin(t * 1.1) * 0.05;
  });

  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <group ref={torsoRef}>
        {/* legs */}
        <group position={[-0.18, 0.85, 0]}>
          <mesh material={pants} position={[0, -0.42, 0]} castShadow>
            <cylinderGeometry args={[0.13, 0.13, 0.86, 16]} />
          </mesh>
          <mesh material={shoe} position={[0, -0.92, 0.05]} castShadow>
            <boxGeometry args={[0.22, 0.1, 0.32]} />
          </mesh>
        </group>
        <group position={[0.18, 0.85, 0]}>
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

        {/* torso */}
        <mesh material={kurta} position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.34, 0.55, 24]} />
        </mesh>
        <mesh material={kurtaTrim} position={[0, 1.65, 0]}>
          <torusGeometry args={[0.18, 0.018, 8, 24, Math.PI]} />
        </mesh>

        {/* dupatta */}
        <group ref={dupattaRef} position={[0, 1.5, 0]}>
          <mesh material={dupatta} position={[0.1, -0.15, 0]} rotation={[0, 0, -0.45]}>
            <boxGeometry args={[0.12, 0.9, 0.04]} />
          </mesh>
        </group>

        {/* arms */}
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

        {/* shoulders fill + neck */}
        <mesh material={skin} position={[0, 1.7, 0]}>
          <sphereGeometry args={[0.18, 16, 12]} />
        </mesh>
        <mesh material={skinDark} position={[0, 1.82, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.12, 12]} />
        </mesh>

        {/* head */}
        <group ref={headRef} position={[0, 1.92, 0]}>
          <mesh material={skin} castShadow>
            <sphereGeometry args={[0.21, 24, 20]} />
          </mesh>
          <mesh material={hair} position={[0, 0.04, -0.02]}>
            <sphereGeometry args={[0.225, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          </mesh>
          <mesh material={hair} position={[-0.12, -0.05, 0.05]} rotation={[0, 0, 0.3]}>
            <sphereGeometry args={[0.08, 16, 12]} />
          </mesh>
          <mesh material={hair} position={[0.12, -0.05, 0.05]} rotation={[0, 0, -0.3]}>
            <sphereGeometry args={[0.08, 16, 12]} />
          </mesh>
          <mesh material={hairHi} position={[0, -0.02, -0.22]}>
            <sphereGeometry args={[0.11, 16, 14]} />
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
          <mesh position={[0, -0.07, 0.19]}>
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
    </group>
  );
}
