'use client';

import { useMemo, useRef, useState } from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { BOOTHS, BOOTH_ORDER, PLAZA_QUOTES } from '@/lib/booths';
import { useArthStore } from '@/lib/store';
import { ArchwayDoor, FloatingQuote, Sparkles, StringLights } from './world/Decor';

export default function Plaza() {
  const setActiveBooth = useArthStore((s) => s.setActiveBooth);
  const setDecoderOpen = useArthStore((s) => s.setDecoderOpen);
  const recommendation = useArthStore((s) => s.recommendation);

  return (
    <group>
      {/* Floor — large rounded medallion */}
      <PlazaFloor />

      {/* Sky dome accent ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[36, 38, 64]} />
        <meshStandardMaterial color="#F08A5D" transparent opacity={0.35} />
      </mesh>

      {/* Hero arch sign */}
      <HeroArch />

      {/* Central installation */}
      <CentralInstallation />

      {/* Body Decoder kiosk */}
      <BodyDecoderKiosk onOpen={() => setDecoderOpen(true)} highlight={!!recommendation} />

      {/* Booth doorways arranged around plaza */}
      {BOOTH_ORDER.map((id) => {
        const b = BOOTHS[id];
        return (
          <ArchwayDoor
            key={id}
            position={b.door.position}
            rotation={b.door.rotation}
            color={b.palette.accent}
            label={b.door.label}
            sub={b.door.sub}
            onClick={(e) => {
              e.stopPropagation();
              setActiveBooth(id);
            }}
            hover={recommendation === id}
          />
        );
      })}

      {/* String lights criss-crossing the plaza */}
      <StringLights from={[-22, 7, -10]} to={[22, 7, -10]} count={16} />
      <StringLights from={[-22, 7, 10]} to={[22, 7, 10]} count={16} color="#F3A6B0" />
      <StringLights from={[-22, 7, -10]} to={[22, 7, 10]} count={14} color="#FFD7A8" />
      <StringLights from={[22, 7, -10]} to={[-22, 7, 10]} count={14} color="#C9B8E0" />

      {/* Floating community quotes around the plaza */}
      {PLAZA_QUOTES.map((q, i) => {
        const a = (i / PLAZA_QUOTES.length) * Math.PI * 2;
        const r = 17;
        return (
          <FloatingQuote
            key={i}
            text={q}
            position={[Math.cos(a) * r, 3.3 + (i % 2) * 0.8, Math.sin(a) * r]}
            color={i % 2 === 0 ? '#5B3A55' : '#F08A5D'}
          />
        );
      })}

      {/* Decorative people clusters */}
      <PeopleCluster position={[10, 0, 6]} />
      <PeopleCluster position={[-12, 0, 4]} flip />
      <PeopleCluster position={[6, 0, -8]} />

      {/* Pink-petal sparkles */}
      <Sparkles count={70} radius={32} color="#F3A6B0" y={[2, 8]} />
    </group>
  );
}

function PlazaFloor() {
  return (
    <group>
      {/* Outer ground ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[80, 64]} />
        <meshStandardMaterial color="#F3DCC4" />
      </mesh>
      {/* Plaza medallion */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[18, 64]} />
        <meshStandardMaterial color="#FBE2C2" />
      </mesh>
      {/* Inner medallion ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[10.6, 11.2, 64]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.013, 0]}>
        <ringGeometry args={[7.8, 8.1, 64]} />
        <meshStandardMaterial color="#F3A6B0" />
      </mesh>
      {/* Floor radial dashes */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 14, 0.014, Math.sin(a) * 14]}
            rotation={[-Math.PI / 2, 0, -a]}
          >
            <planeGeometry args={[1.4, 0.18]} />
            <meshStandardMaterial color="#F08A5D" />
          </mesh>
        );
      })}
    </group>
  );
}

function HeroArch() {
  const ref = useRef();
  useFrame((s) => {
    if (ref.current) ref.current.material.emissiveIntensity = 0.6 + Math.sin(s.clock.elapsedTime * 1.3) * 0.18;
  });
  return (
    <group position={[0, 0, -10]}>
      <mesh position={[-7, 4, 0]}>
        <boxGeometry args={[0.5, 8, 0.5]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      <mesh position={[7, 4, 0]}>
        <boxGeometry args={[0.5, 8, 0.5]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      <mesh position={[0, 8.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[7, 0.5, 14, 32, Math.PI]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      <mesh ref={ref} position={[0, 8.05, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[7, 0.62, 14, 32, Math.PI]} />
        <meshStandardMaterial color="#F08A5D" emissive="#F08A5D" emissiveIntensity={0.7} transparent opacity={0.4} toneMapped={false} />
      </mesh>
      {/* Banner */}
      <group position={[0, 6, 0.32]}>
        <mesh>
          <planeGeometry args={[12, 3.4]} />
          <meshStandardMaterial color="#FBF4EC" />
        </mesh>
        <Text position={[0, 0.55, 0.02]} fontSize={1.5} color="#2A1E2C" anchorX="center" anchorY="middle" letterSpacing={-0.04}>
          ARTH PARTY
        </Text>
        <Text position={[0, -0.55, 0.02]} fontSize={0.32} color="#5B3A55" anchorX="center" anchorY="middle" maxWidth={10}>
          Women’s health, but make it a vibe.
        </Text>
        <Text position={[0, -0.95, 0.02]} fontSize={0.22} color="#F08A5D" anchorX="center" anchorY="middle">
          by Arth · Emcure
        </Text>
      </group>
    </group>
  );
}

function CentralInstallation() {
  const ref = useRef();
  const ringRef = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    if (ringRef.current) ringRef.current.rotation.y = -state.clock.elapsedTime * 0.05;
  });
  return (
    <group position={[0, 0, 0]}>
      {/* base medallion */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 4.6, 48]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      {/* glowing pillar */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 2.4, 24]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      {/* hovering text ring */}
      <group ref={ref} position={[0, 3.6, 0]}>
        {Array.from({ length: 1 }).map((_, i) => (
          <Text
            key={i}
            position={[0, 0, 0]}
            fontSize={0.6}
            color="#F08A5D"
            anchorX="center"
            anchorY="middle"
            maxWidth={6}
            textAlign="center"
            outlineWidth={0.012}
            outlineColor="#FBF4EC"
          >
            {`Your body is not\nbeing dramatic.`}
          </Text>
        ))}
      </group>
      {/* glow ring */}
      <mesh ref={ringRef} position={[0, 3.6, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.2, 0.05, 12, 60]} />
        <meshStandardMaterial color="#F3A6B0" emissive="#F3A6B0" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <mesh position={[0, 3.6, 0]} rotation={[Math.PI / 1.6, 0.6, 0]}>
        <torusGeometry args={[2.5, 0.04, 12, 60]} />
        <meshStandardMaterial color="#C9B8E0" emissive="#C9B8E0" emissiveIntensity={1} toneMapped={false} />
      </mesh>
      <mesh position={[0, 3.6, 0]} rotation={[Math.PI / 1.2, -0.4, 0]}>
        <torusGeometry args={[2.8, 0.04, 12, 60]} />
        <meshStandardMaterial color="#F08A5D" emissive="#F08A5D" emissiveIntensity={1} toneMapped={false} />
      </mesh>
    </group>
  );
}

function BodyDecoderKiosk({ onOpen, highlight }) {
  const [hover, setHover] = useState(false);
  const screenRef = useRef();
  useFrame((state) => {
    if (!screenRef.current) return;
    screenRef.current.material.emissiveIntensity = 0.7 + Math.sin(state.clock.elapsedTime * 1.4) * 0.25;
  });
  return (
    <group
      position={[10, 0, 6]}
      onPointerOver={() => {
        setHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
    >
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.4, 0.8, 1.4]} />
        <meshStandardMaterial color="#FBE2C2" />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 1.6, 16]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      <RoundedBox args={[1.6, 1.1, 0.14]} radius={0.08} position={[0, 2.1, 0]}>
        <meshStandardMaterial color="#2A1E2C" />
      </RoundedBox>
      <mesh ref={screenRef} position={[0, 2.1, 0.08]}>
        <planeGeometry args={[1.4, 0.9]} />
        <meshStandardMaterial color={highlight ? '#FFD7A8' : '#F3A6B0'} emissive={highlight ? '#F08A5D' : '#F3A6B0'} emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
      <Text position={[0, 2.25, 0.09]} fontSize={0.16} color="#2A1E2C" anchorX="center" anchorY="middle" maxWidth={1.2} textAlign="center">
        Body Decoder
      </Text>
      <Text position={[0, 2.0, 0.09]} fontSize={0.11} color="#2A1E2C" anchorX="center" anchorY="middle" maxWidth={1.3} textAlign="center">
        What feels off today?
      </Text>
      {hover && (
        <Text position={[0, 3.0, 0]} fontSize={0.18} color="#5B3A55" anchorX="center" anchorY="middle">
          Click to start
        </Text>
      )}
    </group>
  );
}

function PeopleCluster({ position = [0, 0, 0], flip = false }) {
  const colors = ['#F08A5D', '#C9B8E0', '#F3A6B0', '#BFE3D7', '#FFD7A8'];
  return (
    <group position={position} rotation={[0, flip ? Math.PI : 0, 0]}>
      {colors.slice(0, 3).map((c, i) => (
        <Person key={i} position={[i * 0.9 - 0.9, 0, (i % 2) * 0.4]} color={c} />
      ))}
    </group>
  );
}

function Person({ position, color }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.4 + position[0]) * 0.3;
  });
  return (
    <group ref={ref} position={position}>
      {/* pants */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.6, 12]} />
        <meshStandardMaterial color="#3F2A3A" />
      </mesh>
      {/* dress */}
      <mesh position={[0, 0.85, 0]}>
        <coneGeometry args={[0.32, 0.85, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshStandardMaterial color="#C99077" />
      </mesh>
      {/* hair bun */}
      <mesh position={[0, 1.5, -0.1]}>
        <sphereGeometry args={[0.13, 12, 10]} />
        <meshStandardMaterial color="#241616" />
      </mesh>
    </group>
  );
}
