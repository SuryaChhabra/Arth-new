'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Html } from '@react-three/drei';
import BoothShell, { QuoteBubble } from './BoothShell';
import { BOOTHS } from '@/lib/booths';
import { useArthStore } from '@/lib/store';

export default function CircleHub() {
  const b = BOOTHS.hub;
  const joinedCircles = useArthStore((s) => s.joinedCircles);
  const joinCircle = useArthStore((s) => s.joinCircle);
  return (
    <group position={b.room.position} rotation={[0, b.room.rotation, 0]}>
      <BoothShell {...b} />

      <pointLight position={[0, 5, 1]} intensity={1.4} color="#FFD7A8" distance={20} />
      <pointLight position={[3, 3, -2]} intensity={0.7} color="#F3A6B0" distance={10} />
      <pointLight position={[-3, 3, -2]} intensity={0.7} color="#C9B8E0" distance={10} />

      {/* Circle tables arranged in arc */}
      {b.circles.map((c, i) => {
        const a = (i / b.circles.length) * Math.PI * 1.1 - Math.PI * 0.55;
        const r = 5;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r * 0.55 - 2.5;
        return (
          <CircleTable
            key={c.id}
            circle={c}
            position={[x, 0, z]}
            joined={joinedCircles.includes(c.name)}
            onJoin={() => joinCircle(c.name)}
          />
        );
      })}

      {/* Notice board */}
      <NoticeBoard position={[0, 3.4, -7.05]} />

      <QuoteBubble position={[5.6, 4.8, 1]} text={b.quotes[0]} color="#5B3A55" rotation={[0, -0.7, 0]} />
      <QuoteBubble position={[-5.6, 4.8, 1]} text={b.quotes[1]} color="#F08A5D" rotation={[0, 0.7, 0]} />
      <QuoteBubble position={[0, 5.5, -7.5]} text={b.quotes[2]} color="#5B3A55" />
    </group>
  );
}

function CircleTable({ circle, position, joined, onJoin }) {
  const ref = useRef();
  const [hover, setHover] = useState(false);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.3) * 0.08;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.06, 24]} />
        <meshStandardMaterial color="#FBE2C2" />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.45, 12]} />
        <meshStandardMaterial color="#5B3A55" />
      </mesh>
      <group ref={ref} position={[0, 0.85, 0]}>
        <mesh>
          <cylinderGeometry args={[0.55, 0.55, 0.04, 24]} />
          <meshStandardMaterial color={circle.color} />
        </mesh>
        <Text position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.32} color="#FBF4EC" anchorX="center" anchorY="middle">
          {circle.icon}
        </Text>
      </group>
      <group position={[0, 1.7, 0]}>
        <mesh>
          <planeGeometry args={[1.8, 0.9]} />
          <meshStandardMaterial color="#FBF4EC" />
        </mesh>
        <Text position={[0, 0.25, 0.01]} fontSize={0.14} color={circle.color} anchorX="center" anchorY="middle">
          {circle.name}
        </Text>
        <Text position={[0, 0, 0.01]} fontSize={0.085} color="#2A1E2C" anchorX="center" anchorY="middle" maxWidth={1.7} textAlign="center">
          “{circle.quote}”
        </Text>
        <Html center position={[0, -0.28, 0.02]}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onJoin();
            }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition ${
              joined
                ? 'bg-arth-mint text-arth-plum'
                : 'bg-arth-coral text-white hover:bg-arth-orange'
            }`}
          >
            {joined ? '✓ Joined' : 'Join Circle'}
          </button>
        </Html>
      </group>
    </group>
  );
}

function NoticeBoard({ position }) {
  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#FBE2C2" />
      </mesh>
      <Text position={[0, 1.9, 0.02]} fontSize={0.7} color="#F08A5D" anchorX="center" anchorY="middle" letterSpacing={-0.02}>
        Find Your Circle
      </Text>
      <Text position={[0, 1.4, 0.02]} fontSize={0.18} color="#5B3A55" anchorX="center" anchorY="middle">
        Real women. Real talks. Real support.
      </Text>
      <Text position={[0, 0.4, 0.02]} fontSize={0.2} color="#2A1E2C" anchorX="center" anchorY="middle" maxWidth={10} textAlign="center">
        Each Arth Circle is a small group call space —
        no perfect questions, no judgement.
        Just women who get it.
      </Text>
      <Text position={[0, -0.6, 0.02]} fontSize={0.14} color="#5B3A55" anchorX="center" anchorY="middle">
        scan the QR at the table to confirm — for now, click Join 💌
      </Text>
      {/* QR placeholder */}
      <mesh position={[5, -1.6, 0.02]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <mesh position={[5, -1.6, 0.03]}>
        <planeGeometry args={[0.85, 0.85]} />
        <meshStandardMaterial color="#2A1E2C" />
      </mesh>
      {Array.from({ length: 36 }).map((_, i) => {
        const x = (i % 6) * 0.13 - 0.32;
        const y = Math.floor(i / 6) * 0.13 - 0.32;
        const fill = (i * 7 + 3) % 5 < 3;
        if (!fill) return null;
        return (
          <mesh key={i} position={[5 + x, -1.6 + y, 0.04]}>
            <planeGeometry args={[0.1, 0.1]} />
            <meshStandardMaterial color="#FBF4EC" />
          </mesh>
        );
      })}
      <Text position={[-5, -1.6, 0.02]} fontSize={0.14} color="#5B3A55" anchorX="center" anchorY="middle" maxWidth={3.5} textAlign="center">
        Comfort deserves conversation.
      </Text>
    </group>
  );
}
