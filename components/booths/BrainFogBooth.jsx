'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import BoothShell, { QuoteBubble, ChipRow } from './BoothShell';
import Hotspot from '../Hotspot';
import { BOOTHS } from '@/lib/booths';

export default function BrainFogBooth() {
  const b = BOOTHS.brainfog;
  return (
    <group position={b.room.position} rotation={[0, b.room.rotation, 0]}>
      <BoothShell {...b} />

      <pointLight position={[0, 5, 1]} intensity={1.2} color="#BFE3D7" distance={20} />
      <pointLight position={[2, 3, -1]} intensity={0.7} color="#C9B8E0" distance={10} />

      {/* Desk corner */}
      <Desk position={[0, 0, -3.2]} />

      {/* Fridge corner */}
      <Fridge position={[-5, 0, 1]} />

      {/* Floating sticky notes */}
      {Array.from({ length: 12 }).map((_, i) => (
        <FloatingNote key={i} seed={i} />
      ))}

      {/* Loading bar buffering brain */}
      <BufferingBrain position={[5, 3.4, -2]} />

      {/* Tabs panel */}
      <TabsPanel position={[-5, 3, -3]} rotation={[0, 0.5, 0]} />

      {/* Open notebook */}
      <Notebook position={[1.4, 0.92, -2.7]} />

      {/* Hotspots */}
      <Hotspot position={[-5, 1.2, 1]} hotspotId="fridge" boothId="brainfog" color="#7FBDA6" icon="🥶" label="Forgot why I opened the fridge" />
      <Hotspot position={[-5, 2.4, -3]} hotspotId="tabs" boothId="brainfog" color="#C9B8E0" icon="🗂️" label="Too Many Tabs" />
      <Hotspot position={[1.4, 1.6, -2.7]} hotspotId="reread" boothId="brainfog" color="#F3A6B0" icon="📖" label="Re-read the same line" />
      <Hotspot position={[5, 2.4, -2]} hotspotId="buffer" boothId="brainfog" color="#FFD7A8" icon="⏳" label="Buffering brain" />

      <QuoteBubble position={[-5.6, 4.6, 2]} text={b.quotes[0]} color="#5B3A55" rotation={[0, 0.7, 0]} />
      <QuoteBubble position={[5.6, 4.6, 2]} text={b.quotes[1]} color="#F08A5D" rotation={[0, -0.7, 0]} />
      <QuoteBubble position={[-5.6, 5.5, -1]} text={b.quotes[2]} color="#5B3A55" rotation={[0, 0.7, 0]} />
      <QuoteBubble position={[5.6, 5.5, -1]} text={b.quotes[3]} color="#F08A5D" rotation={[0, -0.7, 0]} />

      <ChipRow position={[0, 5.2, -7.55]} chips={b.chips} color="#7FBDA6" />
    </group>
  );
}

function Desk({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[3, 0.1, 1.2]} />
        <meshStandardMaterial color="#FBE2C2" />
      </mesh>
      <mesh position={[-1.3, 0.22, 0]}>
        <boxGeometry args={[0.08, 0.45, 1.0]} />
        <meshStandardMaterial color="#7FBDA6" />
      </mesh>
      <mesh position={[1.3, 0.22, 0]}>
        <boxGeometry args={[0.08, 0.45, 1.0]} />
        <meshStandardMaterial color="#7FBDA6" />
      </mesh>
      {/* laptop base */}
      <mesh position={[0, 0.55, 0.1]}>
        <boxGeometry args={[1.0, 0.04, 0.7]} />
        <meshStandardMaterial color="#5B3A55" />
      </mesh>
      {/* laptop screen */}
      <mesh position={[0, 0.95, -0.22]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[1.0, 0.7, 0.04]} />
        <meshStandardMaterial color="#5B3A55" />
      </mesh>
      <mesh position={[0, 0.95, -0.21]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[0.92, 0.62]} />
        <meshStandardMaterial color="#BFE3D7" emissive="#BFE3D7" emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
      {/* mug */}
      <mesh position={[0.7, 0.65, 0.2]}>
        <cylinderGeometry args={[0.13, 0.12, 0.2, 16]} />
        <meshStandardMaterial color="#F3A6B0" />
      </mesh>
    </group>
  );
}

function Fridge({ position }) {
  return (
    <group position={position} rotation={[0, 0.5, 0]}>
      <RoundedBox args={[1.6, 3.4, 1]} radius={0.1} position={[0, 1.7, 0]}>
        <meshStandardMaterial color="#FBF4EC" />
      </RoundedBox>
      {/* doors split */}
      <mesh position={[0, 2.4, 0.51]}>
        <planeGeometry args={[1.4, 1.6]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <mesh position={[0, 0.7, 0.51]}>
        <planeGeometry args={[1.4, 1.6]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <mesh position={[0, 1.55, 0.51]}>
        <boxGeometry args={[1.4, 0.04, 0.02]} />
        <meshStandardMaterial color="#7FBDA6" />
      </mesh>
      {/* magnets / sticky notes */}
      <NotePoster pos={[-0.3, 2.7, 0.52]} c="#FFD7A8" t="Forgot why" />
      <NotePoster pos={[0.3, 2.6, 0.52]} c="#C9B8E0" t="I came here for…" />
      <NotePoster pos={[0, 2.2, 0.52]} c="#F3A6B0" t="?" big />
    </group>
  );
}

function NotePoster({ pos, c, t, big = false }) {
  return (
    <group position={pos}>
      <mesh>
        <planeGeometry args={[big ? 0.4 : 0.5, big ? 0.4 : 0.4]} />
        <meshStandardMaterial color={c} />
      </mesh>
      <Text position={[0, 0, 0.01]} fontSize={big ? 0.3 : 0.08} color="#2A1E2C" anchorX="center" anchorY="middle" maxWidth={0.45} textAlign="center">
        {t}
      </Text>
    </group>
  );
}

function FloatingNote({ seed }) {
  const ref = useRef();
  const data = useMemo(() => {
    const a = (seed / 12) * Math.PI * 2;
    const r = 5.5 + (seed % 3);
    return { a, r, baseY: 1.5 + (seed % 4) * 0.9, color: ['#FFD7A8', '#C9B8E0', '#F3A6B0', '#BFE3D7'][seed % 4], text: ['?', '!', '...', 'wait'][seed % 4] };
  }, [seed]);
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.position.set(
      Math.cos(data.a + t * 0.05) * data.r,
      data.baseY + Math.sin(t + seed) * 0.25,
      Math.sin(data.a + t * 0.05) * data.r
    );
    ref.current.rotation.z = Math.sin(t * 0.4 + seed) * 0.15;
    ref.current.lookAt(0, data.baseY, 0);
  });
  return (
    <group ref={ref}>
      <mesh>
        <planeGeometry args={[0.55, 0.55]} />
        <meshStandardMaterial color={data.color} />
      </mesh>
      <Text position={[0, 0, 0.01]} fontSize={0.22} color="#2A1E2C" anchorX="center" anchorY="middle">
        {data.text}
      </Text>
    </group>
  );
}

function BufferingBrain({ position }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.scale.x = 0.2 + (Math.sin(s.clock.elapsedTime * 1.5) + 1) * 0.4;
  });
  return (
    <group position={position} rotation={[0, -0.6, 0]}>
      <mesh>
        <planeGeometry args={[2, 1.4]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <Text position={[0, 0.4, 0.01]} fontSize={0.2} color="#2A1E2C" anchorX="center" anchorY="middle">
        Brain… buffering
      </Text>
      <mesh position={[0, -0.05, 0.01]}>
        <planeGeometry args={[1.4, 0.18]} />
        <meshStandardMaterial color="#DDF1E6" />
      </mesh>
      <mesh ref={ref} position={[-0.7, -0.05, 0.02]}>
        <planeGeometry args={[1.4, 0.18]} />
        <meshStandardMaterial color="#7FBDA6" />
      </mesh>
      <Text position={[0, -0.45, 0.01]} fontSize={0.12} color="#5B3A55" anchorX="center" anchorY="middle" maxWidth={1.8} textAlign="center">
        You’re not slow. You’re processing twelve things at once.
      </Text>
    </group>
  );
}

function TabsPanel({ position, rotation }) {
  const tabs = ['symptoms', 'work', 'mom', 'sleep', 'period', 'reels', 'wfh', 'why-tired'];
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[3.4, 2]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <Text position={[0, 0.85, 0.01]} fontSize={0.18} color="#7FBDA6" anchorX="center">{tabs.length} tabs open</Text>
      {tabs.map((t, i) => {
        const x = (i % 4) * 0.8 - 1.2;
        const y = Math.floor(i / 4) * 0.5 - 0.05;
        return (
          <group key={i} position={[x, y, 0.01]}>
            <mesh>
              <planeGeometry args={[0.74, 0.4]} />
              <meshStandardMaterial color="#DDF1E6" />
            </mesh>
            <Text position={[0, 0, 0.01]} fontSize={0.11} color="#2A1E2C" anchorX="center" anchorY="middle" maxWidth={0.65}>
              {t}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

function Notebook({ position }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2.05, 0, 0.2]}>
        <planeGeometry args={[0.6, 0.8]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2.05, 0, 0.2]}>
        <planeGeometry args={[0.55, 0.75]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}
