'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import BoothShell, { QuoteBubble, ChipRow } from './BoothShell';
import Hotspot from '../Hotspot';
import { BOOTHS } from '@/lib/booths';

export default function SoJaoLounge() {
  const b = BOOTHS.sojao;
  return (
    <group position={b.room.position} rotation={[0, b.room.rotation, 0]}>
      <BoothShell {...b} />

      {/* Moonlight: dim cool key + a cool moon disc */}
      <pointLight position={[0, 5.2, 2]} intensity={1.2} color="#C9B8E0" distance={20} />
      <pointLight position={[-3, 2, 2]} intensity={0.9} color="#F3A6B0" distance={10} />
      <Moon position={[-5.5, 5.5, -5]} />

      {/* Plush rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 1]}>
        <circleGeometry args={[3.4, 36]} />
        <meshStandardMaterial color="#5B3A55" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 1]}>
        <ringGeometry args={[2.6, 2.9, 36]} />
        <meshStandardMaterial color="#C9B8E0" />
      </mesh>

      {/* Floor cushions */}
      <Cushion position={[-2.4, 0, 0]} color="#C9B8E0" />
      <Cushion position={[2.4, 0, 0]} color="#F3A6B0" />
      <Cushion position={[0, 0, 2.6]} color="#FBE2C2" />

      {/* Day bed / lounge */}
      <Daybed position={[0, 0, -2.5]} />

      {/* Canopy */}
      <Canopy position={[0, 4.8, -2.5]} />

      {/* Bedside table with phone parking, lamp */}
      <BedsideTable position={[3.2, 0, -3.2]} />

      {/* Wind-down ritual table */}
      <RitualTable position={[-3.4, 0, -2.4]} />

      {/* Hanging stars */}
      {Array.from({ length: 9 }).map((_, i) => (
        <FloatingStar key={i} seed={i} />
      ))}

      {/* Hotspots */}
      <Hotspot position={[3.4, 1.2, -3.2]} hotspotId="doomscroll" boothId="sojao" color="#F3A6B0" icon="📱" label="Doomscrolling Trap" />
      <Hotspot position={[-3.4, 1.2, -2.4]} hotspotId="ritual" boothId="sojao" color="#C9B8E0" icon="🕯️" label="Wind-down Ritual" />
      <Hotspot position={[0, 2.4, -7]} hotspotId="voices" boothId="sojao" color="#FBE2C2" icon="💬" label="What women say at night" />
      <Hotspot position={[-5.5, 1.7, 2]} hotspotId="myth" boothId="sojao" color="#F08A5D" icon="🌙" label="Sleep Myth Corner" />

      {/* Community quote cluster */}
      <QuoteBubble position={[5.6, 3.2, 1]} text={b.quotes[0]} color="#5B3A55" rotation={[0, -0.7, 0]} />
      <QuoteBubble position={[5.6, 4.4, -1.5]} text={b.quotes[1]} color="#F08A5D" rotation={[0, -0.7, 0]} />
      <QuoteBubble position={[-5.6, 3.2, -1]} text={b.quotes[2]} color="#5B3A55" rotation={[0, 0.7, 0]} />
      <QuoteBubble position={[-5.6, 4.4, 1.5]} text={b.quotes[3]} color="#F08A5D" rotation={[0, 0.7, 0]} />

      <ChipRow position={[0, 5.2, -7.55]} chips={b.chips} color="#C9B8E0" />
    </group>
  );
}

function Moon({ position }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.material.emissiveIntensity = 0.7 + Math.sin(s.clock.elapsedTime * 0.6) * 0.1;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 24, 18]} />
      <meshStandardMaterial color="#FBF4EC" emissive="#C9B8E0" emissiveIntensity={0.8} toneMapped={false} />
    </mesh>
  );
}

function Cushion({ position, color }) {
  return (
    <RoundedBox args={[1.4, 0.35, 1.4]} radius={0.12} position={[position[0], 0.18, position[2]]}>
      <meshStandardMaterial color={color} roughness={0.95} />
    </RoundedBox>
  );
}

function Daybed({ position }) {
  return (
    <group position={position}>
      <RoundedBox args={[3.8, 0.5, 1.6]} radius={0.18} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#3A2750" />
      </RoundedBox>
      <RoundedBox args={[3.6, 0.25, 1.4]} radius={0.12} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#F3A6B0" />
      </RoundedBox>
      <RoundedBox args={[1.1, 0.5, 1.2]} radius={0.18} position={[-1.1, 0.95, 0]}>
        <meshStandardMaterial color="#FBE2C2" />
      </RoundedBox>
      <RoundedBox args={[1.1, 0.5, 1.2]} radius={0.18} position={[1.1, 0.95, 0]}>
        <meshStandardMaterial color="#C9B8E0" />
      </RoundedBox>
    </group>
  );
}

function Canopy({ position }) {
  return (
    <group position={position}>
      <mesh>
        <coneGeometry args={[2.6, 1.2, 24]} />
        <meshStandardMaterial color="#3A2750" transparent opacity={0.6} />
      </mesh>
      {Array.from({ length: 4 }).map((_, i) => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.2, -1.6, Math.sin(a) * 2.2]}>
            <planeGeometry args={[0.7, 3.2]} />
            <meshStandardMaterial color="#C9B8E0" transparent opacity={0.4} side={2} />
          </mesh>
        );
      })}
    </group>
  );
}

function BedsideTable({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.9, 0.8, 0.7]} />
        <meshStandardMaterial color="#FBE2C2" />
      </mesh>
      {/* phone parking basket */}
      <RoundedBox args={[0.45, 0.16, 0.32]} radius={0.06} position={[0.18, 0.86, 0]}>
        <meshStandardMaterial color="#F3A6B0" />
      </RoundedBox>
      {/* phone */}
      <mesh position={[0.18, 0.95, 0]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.18, 0.02, 0.34]} />
        <meshStandardMaterial color="#2A1E2C" />
      </mesh>
      {/* lamp */}
      <mesh position={[-0.22, 0.86, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.4, 12]} />
        <meshStandardMaterial color="#5B3A55" />
      </mesh>
      <mesh position={[-0.22, 1.18, 0]}>
        <cylinderGeometry args={[0.18, 0.13, 0.22, 16]} />
        <meshStandardMaterial color="#FFD7A8" emissive="#FFD7A8" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

function RitualTable({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.7, 18]} />
        <meshStandardMaterial color="#5B3A55" />
      </mesh>
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.05, 24]} />
        <meshStandardMaterial color="#FBE2C2" />
      </mesh>
      {/* glass of water */}
      <mesh position={[0.3, 0.95, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.25, 16]} />
        <meshStandardMaterial color="#C9B8E0" transparent opacity={0.7} />
      </mesh>
      {/* journal */}
      <mesh position={[-0.18, 0.78, 0.18]}>
        <boxGeometry args={[0.36, 0.06, 0.28]} />
        <meshStandardMaterial color="#F3A6B0" />
      </mesh>
      {/* candle */}
      <mesh position={[-0.25, 0.92, -0.15]}>
        <cylinderGeometry args={[0.08, 0.08, 0.18, 16]} />
        <meshStandardMaterial color="#FBE2C2" />
      </mesh>
      <mesh position={[-0.25, 1.05, -0.15]}>
        <sphereGeometry args={[0.05, 12, 10]} />
        <meshStandardMaterial color="#FFD7A8" emissive="#F08A5D" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* small supplement bottle */}
      <mesh position={[0.05, 0.93, -0.2]}>
        <cylinderGeometry args={[0.07, 0.08, 0.22, 14]} />
        <meshStandardMaterial color="#C9B8E0" />
      </mesh>
    </group>
  );
}

function FloatingStar({ seed }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.material.emissiveIntensity = 0.6 + Math.sin(t * (1 + seed * 0.2) + seed) * 0.4;
    ref.current.position.y = ref.current.userData.baseY + Math.sin(t * 0.7 + seed) * 0.18;
  });
  const a = (seed / 9) * Math.PI * 2;
  const r = 4 + (seed % 3);
  const baseY = 4.6 + (seed % 3) * 0.4;
  return (
    <mesh ref={ref} position={[Math.cos(a) * r, baseY, Math.sin(a) * r]} userData={{ baseY }}>
      <octahedronGeometry args={[0.18, 0]} />
      <meshStandardMaterial color="#FBE2C2" emissive="#FBE2C2" emissiveIntensity={0.8} toneMapped={false} />
    </mesh>
  );
}
