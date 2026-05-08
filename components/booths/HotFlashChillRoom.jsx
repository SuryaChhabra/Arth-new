'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import BoothShell, { QuoteBubble, ChipRow } from './BoothShell';
import Hotspot from '../Hotspot';
import { BOOTHS } from '@/lib/booths';

export default function HotFlashChillRoom() {
  const b = BOOTHS.hotflash;
  return (
    <group position={b.room.position} rotation={[0, b.room.rotation, 0]}>
      <BoothShell {...b} />

      <pointLight position={[0, 5, 1]} intensity={1.2} color="#BFE3D7" distance={20} />
      <pointLight position={[3, 3, 2]} intensity={0.8} color="#F08A8A" distance={10} />

      {/* Big spinning fan */}
      <CeilingFan position={[0, 5.4, 0]} />

      {/* Mom-Daughter conversation seating */}
      <ConversationCorner position={[0, 0, -3.4]} />

      {/* Mist effect */}
      <Mist />

      {/* Mother daughter visual frame */}
      <PortraitFrame position={[5.4, 3.6, -2]} rotation={[0, -0.6, 0]} />

      {/* Reframe wall */}
      <ReframeWall position={[-5.4, 2.6, -2]} rotation={[0, 0.6, 0]} />

      {/* Hotspots */}
      <Hotspot position={[3.4, 2.4, -2.2]} hotspotId="flash" boothId="hotflash" color="#F08A8A" icon="🌡️" label="Hot Flashes" />
      <Hotspot position={[0, 1.4, -2.4]} hotspotId="momtalk" boothId="hotflash" color="#BFE3D7" icon="💗" label="Mom–Daughter Corner" />
      <Hotspot position={[-3.4, 2.4, -2.2]} hotspotId="sweats" boothId="hotflash" color="#F3A6B0" icon="🌙" label="Night Sweats" />
      <Hotspot position={[-5.4, 1.6, -2]} hotspotId="said" boothId="hotflash" color="#F08A5D" icon="🗣️" label="What families say" />

      <QuoteBubble position={[5.6, 4.6, 1.5]} text={b.quotes[0]} color="#5B3A55" rotation={[0, -0.7, 0]} />
      <QuoteBubble position={[-5.6, 4.6, 1.5]} text={b.quotes[1]} color="#F08A5D" rotation={[0, 0.7, 0]} />
      <QuoteBubble position={[5.6, 5.5, -0.5]} text={b.quotes[2]} color="#5B3A55" rotation={[0, -0.7, 0]} />
      <QuoteBubble position={[-5.6, 5.5, -0.5]} text={b.quotes[3]} color="#F08A5D" rotation={[0, 0.7, 0]} />

      <ChipRow position={[0, 5.2, -7.55]} chips={b.chips} color="#F08A8A" />
    </group>
  );
}

function CeilingFan({ position }) {
  const ref = useRef();
  useFrame((s, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 4;
  });
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.18, 0.18, 0.4, 16]} />
        <meshStandardMaterial color="#5B3A55" />
      </mesh>
      <group ref={ref}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, (i / 4) * Math.PI * 2, 0]} position={[1.4, -0.1, 0]}>
            <boxGeometry args={[2.6, 0.06, 0.45]} />
            <meshStandardMaterial color="#FBE2C2" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function ConversationCorner({ position }) {
  return (
    <group position={position}>
      {/* Two soft armchairs facing slightly inward */}
      <Armchair position={[-1.4, 0, 0]} rotation={0.45} color="#F3A6B0" />
      <Armchair position={[1.4, 0, 0]} rotation={-0.45} color="#FFD7A8" />
      {/* Side table with water and tissues */}
      <mesh position={[0, 0.45, -0.6]}>
        <cylinderGeometry args={[0.34, 0.34, 0.06, 18]} />
        <meshStandardMaterial color="#FBE2C2" />
      </mesh>
      <mesh position={[0, 0.25, -0.6]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 12]} />
        <meshStandardMaterial color="#5B3A55" />
      </mesh>
      <mesh position={[0.05, 0.6, -0.6]}>
        <cylinderGeometry args={[0.08, 0.08, 0.24, 14]} />
        <meshStandardMaterial color="#BFE3D7" transparent opacity={0.7} />
      </mesh>
      {/* small handheld fan */}
      <mesh position={[-0.18, 0.55, -0.6]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.12, 0.18, 0.04]} />
        <meshStandardMaterial color="#F08A8A" />
      </mesh>
    </group>
  );
}

function Armchair({ position, rotation, color }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RoundedBox args={[1.1, 0.5, 1]} radius={0.12} position={[0, 0.3, 0]}>
        <meshStandardMaterial color={color} />
      </RoundedBox>
      <RoundedBox args={[1.1, 1, 0.25]} radius={0.12} position={[0, 0.85, -0.4]}>
        <meshStandardMaterial color={color} />
      </RoundedBox>
      <RoundedBox args={[0.2, 0.4, 1]} radius={0.08} position={[-0.55, 0.55, 0]}>
        <meshStandardMaterial color={color} />
      </RoundedBox>
      <RoundedBox args={[0.2, 0.4, 1]} radius={0.08} position={[0.55, 0.55, 0]}>
        <meshStandardMaterial color={color} />
      </RoundedBox>
    </group>
  );
}

function Mist() {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.children.forEach((m, i) => {
      const t = s.clock.elapsedTime;
      m.material.opacity = 0.08 + Math.sin(t * 0.4 + i) * 0.04;
      m.position.y = m.userData.baseY + Math.sin(t * 0.3 + i) * 0.4;
    });
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 5.5, 1, Math.sin(a) * 5.5]} userData={{ baseY: 1 + (i % 3) * 0.4 }}>
            <sphereGeometry args={[1.6, 16, 12]} />
            <meshStandardMaterial color="#BFE3D7" transparent opacity={0.1} />
          </mesh>
        );
      })}
    </group>
  );
}

function PortraitFrame({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[2.4, 1.6]} />
        <meshStandardMaterial color="#5B3A55" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2.2, 1.4]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      {/* Two stylized faces */}
      <mesh position={[-0.45, 0, 0.02]}>
        <circleGeometry args={[0.4, 32]} />
        <meshStandardMaterial color="#C99077" />
      </mesh>
      <mesh position={[-0.45, 0.32, 0.025]}>
        <circleGeometry args={[0.42, 32, 0, Math.PI]} />
        <meshStandardMaterial color="#A0938E" />
      </mesh>
      <mesh position={[0.45, -0.05, 0.02]}>
        <circleGeometry args={[0.36, 32]} />
        <meshStandardMaterial color="#C99077" />
      </mesh>
      <mesh position={[0.45, 0.25, 0.025]}>
        <circleGeometry args={[0.38, 32, 0, Math.PI]} />
        <meshStandardMaterial color="#241616" />
      </mesh>
      <Text position={[0, -0.55, 0.02]} fontSize={0.13} color="#5B3A55" anchorX="center" anchorY="middle" maxWidth={2}>
        Mom + me
      </Text>
    </group>
  );
}

function ReframeWall({ position, rotation }) {
  const reframes = [
    { said: 'She’s being dramatic.', then: 'She’s under-explained.' },
    { said: 'It’s just mood swings.', then: 'It’s hormonal weather.' },
    { said: 'She’s overreacting.', then: 'She’s overheating, literally.' },
  ];
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[3.4, 2.4]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <Text position={[0, 0.95, 0.01]} fontSize={0.18} color="#F08A8A" anchorX="center">What we hear → What it means</Text>
      {reframes.map((r, i) => (
        <group key={i} position={[0, 0.4 - i * 0.55, 0.01]}>
          <mesh position={[-0.7, 0, 0]}>
            <planeGeometry args={[1.5, 0.4]} />
            <meshStandardMaterial color="#FFCDBE" />
          </mesh>
          <Text position={[-0.7, 0, 0.01]} fontSize={0.1} color="#2A1E2C" anchorX="center" anchorY="middle" maxWidth={1.4}>{r.said}</Text>
          <Text position={[0.05, 0, 0.01]} fontSize={0.18} color="#F08A8A" anchorX="center" anchorY="middle">→</Text>
          <mesh position={[0.85, 0, 0]}>
            <planeGeometry args={[1.5, 0.4]} />
            <meshStandardMaterial color="#BFE3D7" />
          </mesh>
          <Text position={[0.85, 0, 0.01]} fontSize={0.1} color="#2A1E2C" anchorX="center" anchorY="middle" maxWidth={1.4}>{r.then}</Text>
        </group>
      ))}
    </group>
  );
}
