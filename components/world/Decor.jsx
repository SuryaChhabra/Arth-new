'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export function StringLights({ from = [-20, 6, -20], to = [20, 6, 20], count = 14, color = '#FFD7A8' }) {
  const positions = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const out = [];
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const p = new THREE.Vector3().lerpVectors(a, b, t);
      const sag = Math.sin(t * Math.PI) * 0.7;
      p.y -= sag;
      out.push(p);
    }
    return out;
  }, [from, to, count]);

  const groupRef = useRef();
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((mesh, i) => {
      const t = state.clock.elapsedTime + i * 0.4;
      mesh.material.emissiveIntensity = 0.7 + Math.sin(t * 2) * 0.25;
    });
  });

  return (
    <group ref={groupRef}>
      {positions.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.12, 12, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export function FloatingQuote({ text, position, color = '#5B3A55', maxWidth = 4 }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.15;
    ref.current.rotation.y = Math.sin(t * 0.3) * 0.1;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <planeGeometry args={[maxWidth + 0.4, 0.9]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[maxWidth + 0.3, 0.78]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <Text
        position={[0, 0, 0.05]}
        fontSize={0.22}
        maxWidth={maxWidth}
        color={color}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {text}
      </Text>
    </group>
  );
}

export function Sparkles({ count = 60, radius = 25, color = '#F3A6B0', y = [1, 6] }) {
  const ref = useRef();
  const seeds = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        a: Math.random() * Math.PI * 2,
        r: Math.random() * radius,
        h: y[0] + Math.random() * (y[1] - y[0]),
        s: 0.5 + Math.random() * 1.5,
        p: Math.random() * Math.PI * 2,
      })),
    [count, radius, y]
  );
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((mesh, i) => {
      const seed = seeds[i];
      mesh.position.set(
        Math.cos(seed.a + t * 0.05) * seed.r,
        seed.h + Math.sin(t * seed.s + seed.p) * 0.4,
        Math.sin(seed.a + t * 0.05) * seed.r
      );
      mesh.material.opacity = 0.5 + Math.sin(t * seed.s + seed.p) * 0.4;
    });
  });
  return (
    <group ref={ref}>
      {seeds.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export function ArchwayDoor({ position = [0, 0, 0], rotation = 0, color = '#F08A5D', width = 4, height = 5, label, sub, onClick, hover }) {
  return (
    <group position={position} rotation={[0, rotation, 0]} onClick={onClick}>
      {/* arch frame */}
      <mesh position={[-width / 2 + 0.18, height / 2, 0]}>
        <boxGeometry args={[0.36, height, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[width / 2 - 0.18, height / 2, 0]}>
        <boxGeometry args={[0.36, height, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0, height + 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[width / 2 - 0.18, 0.32, 12, 24, Math.PI]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* curtain hint */}
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width - 0.6, height - 0.4]} />
        <meshStandardMaterial color="#FBF4EC" transparent opacity={0.18} side={2} />
      </mesh>
      {/* signage */}
      {label && (
        <group position={[0, height + 0.65, 0.32]}>
          <mesh>
            <planeGeometry args={[width + 1.4, 1.1]} />
            <meshStandardMaterial color="#FBF4EC" />
          </mesh>
          <Text position={[0, 0.18, 0.02]} fontSize={0.32} color="#2A1E2C" anchorX="center" anchorY="middle">
            {label}
          </Text>
          {sub && (
            <Text position={[0, -0.22, 0.02]} fontSize={0.18} color="#5B3A55" anchorX="center" anchorY="middle">
              {sub}
            </Text>
          )}
        </group>
      )}
      {/* glow ring on the floor */}
      <mesh position={[0, 0.02, 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.7, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hover ? 1.2 : 0.6} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}
