'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import BoothShell, { ChipRow } from './BoothShell';
import Hotspot from '../Hotspot';
import { BOOTHS } from '@/lib/booths';

export default function NormalizedWall() {
  const b = BOOTHS.normalized;
  return (
    <group>
      <BoothShell {...b} />

      <pointLight position={[0, 5, 1]} intensity={1.4} color="#F3A6B0" distance={20} />
      <pointLight position={[-3, 3, 0]} intensity={0.7} color="#C9B8E0" distance={10} />
      <pointLight position={[3, 3, 0]} intensity={0.7} color="#F08A5D" distance={10} />

      {/* Big wall installation */}
      <BigWall position={[0, 3.4, -7.0]} />

      {/* Floor cluster of confessional cards */}
      {b.hotspots.map((h, i) => {
        const a = (i / b.hotspots.length) * Math.PI - Math.PI / 2;
        const r = 4.5;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r * 0.5;
        return (
          <Hotspot
            key={h.id}
            position={[x, 1.2, z]}
            hotspotId={h.id}
            boothId="normalized"
            color={['#F08A5D', '#C9B8E0', '#F3A6B0', '#FFD7A8', '#BFE3D7', '#F08A8A'][i % 6]}
            icon="📌"
            label={h.title}
          />
        );
      })}

      {/* Floating layered quotes */}
      {b.quotes.map((q, i) => {
        const a = (i / b.quotes.length) * Math.PI * 2;
        return (
          <FloatingPaperQuote
            key={i}
            text={q}
            position={[Math.cos(a) * 6, 4 + (i % 2), Math.sin(a) * 5.5]}
            rotation={[0, -a + Math.PI, 0]}
          />
        );
      })}

      <ChipRow position={[0, 1, 5]} chips={b.chips.slice(0, 3)} color="#F08A5D" />
    </group>
  );
}

function BigWall({ position }) {
  const cards = [
    { c: '#FFD7A8', t: 'Being tired all the time.' },
    { c: '#F3A6B0', t: 'Brain fog before my period.' },
    { c: '#C9B8E0', t: 'My mom not sleeping.' },
    { c: '#FFB36B', t: 'Mood swings people joke about.' },
    { c: '#F08A8A', t: 'Intimate discomfort I never ask about.' },
    { c: '#BFE3D7', t: 'Feeling “off” and saying nothing.' },
    { c: '#FFD7A8', t: 'Cramps that broke the day.' },
    { c: '#F3A6B0', t: 'Hair fall I blamed on shampoo.' },
    { c: '#C9B8E0', t: 'Anxiety pre-period nobody named.' },
    { c: '#FFB36B', t: 'Dragging at the gym.' },
    { c: '#F08A8A', t: 'Skipped check-ups for years.' },
    { c: '#BFE3D7', t: 'Said “I’m fine” for a decade.' },
  ];
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.children.forEach((c, i) => {
      c.rotation.z = Math.sin(s.clock.elapsedTime * 0.4 + i) * 0.06;
    });
  });
  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <Text position={[0, 1.9, 0.02]} fontSize={0.7} color="#F08A5D" anchorX="center" anchorY="middle" letterSpacing={-0.02}>
        Normal? Ya Normalized?
      </Text>
      <Text position={[0, 1.4, 0.02]} fontSize={0.18} color="#5B3A55" anchorX="center" anchorY="middle">
        the wall of things women were told to live with.
      </Text>
      <group ref={ref} position={[0, -0.4, 0.02]}>
        {cards.map((card, i) => {
          const x = (i % 4) * 2.6 - 3.9;
          const y = -Math.floor(i / 4) * 1 + 0.8;
          return (
            <group key={i} position={[x, y, 0.02 + (i % 3) * 0.01]}>
              <mesh>
                <planeGeometry args={[2.3, 0.85]} />
                <meshStandardMaterial color={card.c} />
              </mesh>
              <Text position={[0, 0, 0.01]} fontSize={0.12} color="#2A1E2C" anchorX="center" anchorY="middle" maxWidth={2.1} textAlign="center">
                {card.t}
              </Text>
            </group>
          );
        })}
      </group>
    </group>
  );
}

function FloatingPaperQuote({ text, position, rotation }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.18;
    ref.current.rotation.z = Math.sin(t * 0.3 + position[0]) * 0.08;
  });
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[3.4, 0.95]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <Text position={[0, 0, 0.02]} fontSize={0.2} color="#5B3A55" anchorX="center" anchorY="middle" maxWidth={3.1} textAlign="center">
        {text}
      </Text>
    </group>
  );
}
