'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import BoothShell, { QuoteBubble, ChipRow } from './BoothShell';
import Hotspot from '../Hotspot';
import { BOOTHS } from '@/lib/booths';

export default function IronEnergyBar() {
  const b = BOOTHS.iron;
  return (
    <group>
      <BoothShell {...b} />

      <pointLight position={[0, 5, 1]} intensity={1.4} color="#FFD7A8" distance={20} />
      <pointLight position={[3, 3, 2]} intensity={0.8} color="#F08A5D" distance={10} />

      {/* Bar counter */}
      <BarCounter position={[0, 0, -3.4]} />

      {/* Stools */}
      {[-2, 0, 2].map((x, i) => (
        <Stool key={i} position={[x, 0, -1.5]} color={i === 1 ? '#F3A6B0' : '#F08A5D'} />
      ))}

      {/* Fruit bowl */}
      <FruitBowl position={[-1.8, 1.3, -3.4]} />

      {/* Drink glasses */}
      <Glass position={[1.6, 1.32, -3.4]} color="#FFD7A8" />
      <Glass position={[2.2, 1.32, -3.4]} color="#F08A5D" />
      <Glass position={[1, 1.32, -3.4]} color="#FFB36B" />

      {/* Energy meter */}
      <EnergyMeter position={[-5.5, 2.6, -3]} />

      {/* Big 4PM clock */}
      <BigClock position={[5.5, 3.5, -3]} />

      {/* Sticky notes wall */}
      <StickyWall position={[5.4, 1.6, 1.5]} rotation={[0, -0.7, 0]} />

      {/* Hotspots */}
      <Hotspot position={[-5.5, 1.3, -3]} hotspotId="crash" boothId="iron" color="#F08A5D" icon="📉" label="4 PM Crash Meter" />
      <Hotspot position={[-1.8, 2, -3.4]} hotspotId="pairing" boothId="iron" color="#7FBDA6" icon="🍋" label="Food Pairing" />
      <Hotspot position={[5.4, 2.6, 1.5]} hotspotId="stories" boothId="iron" color="#F3A6B0" icon="📌" label="Fatigue Stories" />
      <Hotspot position={[2, 2.4, -3.4]} hotspotId="feels" boothId="iron" color="#FFB36B" icon="⚡" label="What low energy feels like" />

      {/* Community quotes */}
      <QuoteBubble position={[-5.6, 4.3, 1]} text={b.quotes[0]} color="#5B3A55" rotation={[0, 0.7, 0]} />
      <QuoteBubble position={[-5.6, 5.4, -1]} text={b.quotes[1]} color="#F08A5D" rotation={[0, 0.7, 0]} />
      <QuoteBubble position={[5.6, 4.3, -1]} text={b.quotes[2]} color="#5B3A55" rotation={[0, -0.7, 0]} />
      <QuoteBubble position={[5.6, 5.4, 1]} text={b.quotes[3]} color="#F08A5D" rotation={[0, -0.7, 0]} />

      <ChipRow position={[0, 5.2, -7.55]} chips={b.chips} color="#F08A5D" />
    </group>
  );
}

function BarCounter({ position }) {
  return (
    <group position={position}>
      {/* counter base */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[6, 1.1, 1.2]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      {/* top */}
      <mesh position={[0, 1.18, 0]}>
        <boxGeometry args={[6.2, 0.1, 1.4]} />
        <meshStandardMaterial color="#FBE2C2" />
      </mesh>
      {/* trim */}
      <mesh position={[0, 0.18, 0.62]}>
        <boxGeometry args={[6, 0.1, 0.05]} />
        <meshStandardMaterial color="#FBE2C2" />
      </mesh>
      {/* menu board behind */}
      <group position={[0, 3.1, -0.5]}>
        <mesh>
          <planeGeometry args={[5, 1.6]} />
          <meshStandardMaterial color="#FBE2C2" />
        </mesh>
        <Text position={[0, 0.5, 0.02]} fontSize={0.3} color="#F08A5D" anchorX="center" anchorY="middle">
          ENERGY MENU
        </Text>
        <Text position={[-1.4, 0.05, 0.02]} fontSize={0.16} color="#2A1E2C" anchorX="left" anchorY="middle">
          {`Iron + C  →  Lemon Saag\nIron + C  →  Orange Dal\nSkip chai right after meals`}
        </Text>
        <Text position={[1.4, 0.05, 0.02]} fontSize={0.16} color="#2A1E2C" anchorX="left" anchorY="middle">
          {`Anjeer + Date Bites\nGuava + Beetroot\nMillet Roti, every day`}
        </Text>
      </group>
    </group>
  );
}

function Stool({ position, color }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <meshStandardMaterial color="#FBE2C2" />
      </mesh>
      <mesh position={[0, 0.84, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.12, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function FruitBowl({ position }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.34, 0.18, 0.22, 18]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <mesh position={[-0.12, 0.18, 0]}>
        <sphereGeometry args={[0.12, 14, 12]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      <mesh position={[0.1, 0.16, 0.05]}>
        <sphereGeometry args={[0.13, 14, 12]} />
        <meshStandardMaterial color="#FFD7A8" />
      </mesh>
      <mesh position={[0.05, 0.18, -0.1]}>
        <sphereGeometry args={[0.1, 12, 10]} />
        <meshStandardMaterial color="#F3A6B0" />
      </mesh>
    </group>
  );
}

function Glass({ position, color }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.08, 0.07, 0.3, 14]} />
        <meshStandardMaterial color={color} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 14]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function EnergyMeter({ position }) {
  const needleRef = useRef();
  useFrame((s) => {
    if (!needleRef.current) return;
    const t = s.clock.elapsedTime;
    needleRef.current.rotation.z = -1.0 + Math.sin(t * 0.6) * 0.7;
  });
  return (
    <group position={position}>
      <mesh>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[1, 1.15, 32, 1, Math.PI, Math.PI]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      <Text position={[-0.85, -0.2, 0.02]} fontSize={0.14} color="#F08A5D" anchorX="center">CRASH</Text>
      <Text position={[0, 0.85, 0.02]} fontSize={0.14} color="#F08A5D" anchorX="center">DRAGGING</Text>
      <Text position={[0.85, -0.2, 0.02]} fontSize={0.14} color="#F08A5D" anchorX="center">VIBES</Text>
      <Text position={[0, -0.6, 0.02]} fontSize={0.18} color="#2A1E2C" anchorX="center">4 PM Crash Meter</Text>
      <mesh ref={needleRef} position={[0, 0, 0.03]}>
        <boxGeometry args={[0.06, 0.95, 0.02]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <circleGeometry args={[0.08, 16]} />
        <meshStandardMaterial color="#5B3A55" />
      </mesh>
    </group>
  );
}

function BigClock({ position }) {
  return (
    <group position={position}>
      <mesh>
        <circleGeometry args={[1.1, 32]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[1, 1.1, 32]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      <Text position={[0, 0, 0.02]} fontSize={0.55} color="#2A1E2C" anchorX="center" anchorY="middle">
        4:00
      </Text>
      <Text position={[0, -0.4, 0.02]} fontSize={0.16} color="#F08A5D" anchorX="center">PM</Text>
    </group>
  );
}

function StickyWall({ position, rotation }) {
  const notes = [
    { c: '#FFD7A8', t: 'Did anyone else think they were just lazy?' },
    { c: '#F3A6B0', t: 'Why do I wake up tired?' },
    { c: '#FFB36B', t: '4 pm wall, every day.' },
    { c: '#BFE3D7', t: 'Pair iron with lemon!' },
    { c: '#C9B8E0', t: 'Skip chai after dal.' },
    { c: '#F08A5D', t: 'I cried in a meeting from fatigue.' },
  ];
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[3.6, 2.6]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      {notes.map((n, i) => {
        const x = (i % 3) * 1.05 - 1.05;
        const y = Math.floor(i / 3) * 1 - 0.5;
        return (
          <group key={i} position={[x, y, 0.02]} rotation={[0, 0, (Math.random() - 0.5) * 0.15]}>
            <mesh>
              <planeGeometry args={[0.95, 0.85]} />
              <meshStandardMaterial color={n.c} />
            </mesh>
            <Text position={[0, 0, 0.01]} fontSize={0.085} color="#2A1E2C" anchorX="center" anchorY="middle" maxWidth={0.85} textAlign="center">
              {n.t}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
