'use client';

import { useMemo, useRef, useState } from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BOOTHS, BOOTH_ORDER } from '@/lib/booths';
import { useArthStore } from '@/lib/store';
import Guide from './Guide';

const PORTAL_LAYOUT = [
  { id: 'sojao',     x: -4.4, z:  1.4, ry:  0.32 },
  { id: 'iron',      x: -2.3, z:  0.4, ry:  0.18 },
  { id: 'brainfog',  x:  0,   z:  0.0, ry:  0 },
  { id: 'hotflash',  x:  2.3, z:  0.4, ry: -0.18 },
  { id: 'normalized',x:  4.4, z:  1.4, ry: -0.32 },
];

export default function Plaza() {
  const setActiveBooth = useArthStore((s) => s.setActiveBooth);
  const setDecoderOpen = useArthStore((s) => s.setDecoderOpen);
  const recommendation = useArthStore((s) => s.recommendation);

  return (
    <group>
      {/* Lobby lights */}
      <ambientLight intensity={0.55} />
      <pointLight position={[0, 7, 4]} intensity={1.4} color="#FFD7A8" distance={28} />
      <pointLight position={[-7, 5, 4]} intensity={0.9} color="#F3A6B0" distance={20} />
      <pointLight position={[7, 5, 4]} intensity={0.9} color="#F3A6B0" distance={20} />
      <pointLight position={[0, 4, -6]} intensity={1.0} color="#FFB36B" distance={18} />

      <LobbyShell />
      <HeroBackdrop />
      <CentralInstallation position={[0, 0.05, -2.5]} />

      {/* Welcome desk + guide */}
      <WelcomeDesk position={[-4.6, 0, 3.4]} rotation={0.55} />
      <Guide position={[-4.0, 0, 2.6]} rotation={0.55} scale={1.05} wave />
      <DeskAttendantSign position={[-4.6, 1.85, 3.4]} rotation={0.55} />

      {/* Portal arches arranged in an arc, plus circle hub portal in front */}
      {PORTAL_LAYOUT.map((slot) => {
        const b = BOOTHS[slot.id];
        return (
          <PortalArch
            key={slot.id}
            position={[slot.x, 0, slot.z]}
            rotation={slot.ry}
            booth={b}
            onClick={() => setActiveBooth(slot.id)}
            recommended={recommendation === slot.id}
          />
        );
      })}
      {/* Hub portal — front center, the gentle final destination */}
      <HubPortal
        position={[0, 0, 3.6]}
        booth={BOOTHS.hub}
        onClick={() => setActiveBooth('hub')}
        recommended={recommendation === 'hub'}
      />

      {/* Hanging string lights */}
      <CeilingLights />
      <Garland />

      {/* Ground rug medallion */}
      <FloorMedallion />

      {/* Planters left + right of camera */}
      <Planter position={[-6.0, 0, 4.0]} color="#5B3A55" />
      <Planter position={[6.0, 0, 4.0]} color="#5B3A55" />
      <Planter position={[-6.2, 0, -1.4]} color="#3A2750" tall />
      <Planter position={[6.2, 0, -1.4]} color="#3A2750" tall />

      {/* Ribbon banners with quotes */}
      <RibbonQuote position={[-4.4, 4.4, -0.6]} text="Same, sis." color="#F08A5D" />
      <RibbonQuote position={[4.4, 4.4, -0.6]} text="You’re not alone." color="#F3A6B0" />
      <RibbonQuote position={[-2.4, 5.0, -2.2]} text="I thought it was just me." color="#C9B8E0" />
      <RibbonQuote position={[2.4, 5.0, -2.2]} text="Sending this to mom." color="#FFD7A8" />

      {/* Body Decoder kiosk on right */}
      <BodyDecoderKiosk position={[4.8, 0, 3.4]} rotation={-0.55} onOpen={() => setDecoderOpen(true)} />

      {/* Soft floor cushions and side props */}
      <FloorCushion position={[-2.0, 0, 3.2]} color="#F3A6B0" />
      <FloorCushion position={[2.0, 0, 3.2]} color="#FFD7A8" />
    </group>
  );
}

/* ---------------- Lobby shell ---------------- */

function LobbyShell() {
  // A wide curved back wall + side wing walls, all in cream/peach.
  return (
    <group>
      {/* main floor (large oval) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[9, 64]} />
        <meshStandardMaterial color="#F4E0CC" roughness={0.95} />
      </mesh>

      {/* curved back wall */}
      <mesh position={[0, 3.4, -5]}>
        <cylinderGeometry args={[8, 8, 6.8, 64, 1, true, -Math.PI * 0.42, Math.PI * 0.84]} />
        <meshStandardMaterial color="#FBE2C2" side={THREE.DoubleSide} roughness={0.92} />
      </mesh>

      {/* warm wash on the wall */}
      <mesh position={[0, 3.4, -4.99]}>
        <cylinderGeometry args={[7.96, 7.96, 6.8, 64, 1, true, -Math.PI * 0.32, Math.PI * 0.64]} />
        <meshStandardMaterial color="#FFD7BD" side={THREE.DoubleSide} transparent opacity={0.55} roughness={0.9} />
      </mesh>

      {/* skirting boards */}
      <mesh position={[0, 0.18, -4.99]}>
        <torusGeometry args={[8, 0.07, 8, 64, Math.PI * 0.84]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>

      {/* ceiling band */}
      <mesh position={[0, 6.8, -4.99]}>
        <torusGeometry args={[8, 0.07, 8, 64, Math.PI * 0.84]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>

      {/* front floor border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[8.7, 9, 64]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
    </group>
  );
}

function HeroBackdrop() {
  // Arched ARTH PARTY signage embedded in the back wall.
  return (
    <group position={[0, 4.8, -4.9]}>
      {/* arch frame */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.6, 0.18, 16, 48, Math.PI]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      <mesh position={[-3.6, -1.0, 0]}>
        <boxGeometry args={[0.26, 2.0, 0.26]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      <mesh position={[3.6, -1.0, 0]}>
        <boxGeometry args={[0.26, 2.0, 0.26]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      {/* banner */}
      <group position={[0, -0.4, 0.05]}>
        <mesh>
          <planeGeometry args={[6.8, 1.7]} />
          <meshStandardMaterial color="#FBF4EC" />
        </mesh>
        <Text position={[0, 0.32, 0.02]} fontSize={0.92} color="#2A1E2C" anchorX="center" anchorY="middle" letterSpacing={-0.04}>
          ARTH PARTY
        </Text>
        <Text position={[0, -0.32, 0.02]} fontSize={0.2} color="#5B3A55" anchorX="center" anchorY="middle" maxWidth={6.2}>
          Women’s health, but make it a vibe.
        </Text>
        <Text position={[0, -0.6, 0.02]} fontSize={0.13} color="#F08A5D" anchorX="center" anchorY="middle">
          by Arth · Emcure
        </Text>
      </group>
    </group>
  );
}

function CentralInstallation({ position }) {
  const ringA = useRef();
  const ringB = useRef();
  const ringC = useRef();
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (ringA.current) ringA.current.rotation.z = t * 0.18;
    if (ringB.current) ringB.current.rotation.y = -t * 0.15;
    if (ringC.current) ringC.current.rotation.x = t * 0.12;
  });
  return (
    <group position={position}>
      {/* base medallion */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[2.2, 48]} />
        <meshStandardMaterial color="#F3A6B0" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.7, 1.85, 48]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      {/* glow plinth */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.65, 1, 24]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      {/* hovering glow orb */}
      <mesh position={[0, 1.95, 0]}>
        <sphereGeometry args={[0.55, 32, 24]} />
        <meshStandardMaterial color="#F3A6B0" emissive="#F3A6B0" emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
      {/* orbiting glow rings */}
      <mesh ref={ringA} position={[0, 1.95, 0]}>
        <torusGeometry args={[1, 0.04, 12, 64]} />
        <meshStandardMaterial color="#F08A5D" emissive="#F08A5D" emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
      <mesh ref={ringB} position={[0, 1.95, 0]}>
        <torusGeometry args={[1.15, 0.035, 12, 64]} />
        <meshStandardMaterial color="#C9B8E0" emissive="#C9B8E0" emissiveIntensity={1.0} toneMapped={false} />
      </mesh>
      <mesh ref={ringC} position={[0, 1.95, 0]}>
        <torusGeometry args={[1.32, 0.03, 12, 64]} />
        <meshStandardMaterial color="#FBE2C2" emissive="#FFD7A8" emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      {/* hovering text card */}
      <group position={[0, 3.2, 0.05]}>
        <mesh>
          <planeGeometry args={[4.4, 1.2]} />
          <meshStandardMaterial color="#FBF4EC" />
        </mesh>
        <Text position={[0, 0.05, 0.02]} fontSize={0.34} color="#F08A5D" anchorX="center" anchorY="middle" maxWidth={4} textAlign="center" letterSpacing={-0.02}>
          Your body is not being dramatic.
        </Text>
      </group>
    </group>
  );
}

/* ---------------- Portals ---------------- */

function PortalArch({ position, rotation, booth, onClick, recommended }) {
  const [hover, setHover] = useState(false);
  const glowRef = useRef();
  useFrame((s) => {
    if (!glowRef.current) return;
    const t = s.clock.elapsedTime;
    glowRef.current.material.emissiveIntensity =
      (hover || recommended ? 1.4 : 0.7) + Math.sin(t * 1.6) * 0.18;
  });
  const accent = booth.palette.accent;
  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* stage base */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[1.55, 1.7, 0.12, 32]} />
        <meshStandardMaterial color="#FBE2C2" />
      </mesh>
      <mesh ref={glowRef} position={[0, 0.13, 0]}>
        <ringGeometry args={[1.35, 1.55, 32]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      {/* arch frame */}
      <mesh position={[-1.1, 1.4, 0]}>
        <boxGeometry args={[0.22, 2.8, 0.4]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[1.1, 1.4, 0]}>
        <boxGeometry args={[0.22, 2.8, 0.4]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0, 2.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.2, 14, 32, Math.PI]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      {/* fabric drape inside portal — colored by booth palette */}
      <mesh position={[0, 1.4, 0.02]}>
        <planeGeometry args={[1.95, 2.6]} />
        <meshStandardMaterial color={booth.palette.glow} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.4, -0.02]}>
        <planeGeometry args={[1.85, 2.5]} />
        <meshStandardMaterial color={booth.palette.base} side={THREE.DoubleSide} />
      </mesh>
      {/* booth icon hovering */}
      <BoothIcon booth={booth} position={[0, 1.7, 0.05]} />

      {/* Title plaque */}
      <group position={[0, 3.4, 0]}>
        <mesh>
          <planeGeometry args={[2.6, 0.85]} />
          <meshStandardMaterial color="#FBF4EC" />
        </mesh>
        <Text position={[0, 0.15, 0.02]} fontSize={0.2} color={accent} anchorX="center" anchorY="middle" maxWidth={2.4} textAlign="center" letterSpacing={-0.01}>
          {booth.title}
        </Text>
        <Text position={[0, -0.18, 0.02]} fontSize={0.1} color="#5B3A55" anchorX="center" anchorY="middle" maxWidth={2.4}>
          {booth.door.sub}
        </Text>
      </group>

      {/* hover glow puff */}
      {(hover || recommended) && (
        <mesh position={[0, 1.6, -0.5]}>
          <sphereGeometry args={[1.6, 24, 16]} />
          <meshStandardMaterial color={accent} transparent opacity={0.18} emissive={accent} emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

function HubPortal({ position, booth, onClick, recommended }) {
  const [hover, setHover] = useState(false);
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.3) * 0.06;
  });
  return (
    <group
      ref={ref}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <RoundedBox args={[3.4, 0.4, 1.8]} radius={0.12} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#FBE2C2" />
      </RoundedBox>
      <RoundedBox args={[3.1, 0.06, 1.5]} radius={0.08} position={[0, 0.43, 0]}>
        <meshStandardMaterial color={hover || recommended ? '#F08A5D' : '#F3A6B0'} emissive="#F3A6B0" emissiveIntensity={0.4} toneMapped={false} />
      </RoundedBox>
      <Text position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.28} color="#5B3A55" anchorX="center" anchorY="middle">
        Find your circle →
      </Text>
      <Text position={[0, 0.51, 0.4]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.13} color="#F08A5D" anchorX="center" anchorY="middle">
        Circle Hub · Community Café
      </Text>
    </group>
  );
}

function BoothIcon({ booth, position }) {
  const map = {
    sojao: '🌙',
    iron: '⚡',
    brainfog: '🧠',
    hotflash: '🌬️',
    normalized: '📌',
    hub: '💗',
  };
  return (
    <Text position={position} fontSize={0.7} anchorX="center" anchorY="middle">
      {map[booth.id] || '✨'}
    </Text>
  );
}

/* ---------------- Welcome desk + decoder ---------------- */

function WelcomeDesk({ position, rotation }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RoundedBox args={[2.6, 1.05, 0.9]} radius={0.1} position={[0, 0.55, 0]}>
        <meshStandardMaterial color="#F08A5D" />
      </RoundedBox>
      <RoundedBox args={[2.8, 0.08, 1.1]} radius={0.08} position={[0, 1.1, 0]}>
        <meshStandardMaterial color="#FBE2C2" />
      </RoundedBox>
      {/* lamp */}
      <mesh position={[-1, 1.5, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.7, 12]} />
        <meshStandardMaterial color="#5B3A55" />
      </mesh>
      <mesh position={[-1, 1.95, 0]}>
        <coneGeometry args={[0.22, 0.32, 18]} />
        <meshStandardMaterial color="#FFD7A8" emissive="#FFD7A8" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      {/* iPad */}
      <mesh position={[0.6, 1.16, 0]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.7, 0.04, 0.5]} />
        <meshStandardMaterial color="#2A1E2C" />
      </mesh>
      <mesh position={[0.6, 1.18, 0]} rotation={[-0.4, 0, 0]}>
        <planeGeometry args={[0.6, 0.42]} />
        <meshStandardMaterial color="#F3A6B0" emissive="#F3A6B0" emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
      {/* small flowers */}
      <mesh position={[0.9, 1.25, 0.35]}>
        <cylinderGeometry args={[0.07, 0.09, 0.24, 14]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <mesh position={[0.9, 1.45, 0.35]}>
        <sphereGeometry args={[0.08, 12, 10]} />
        <meshStandardMaterial color="#F3A6B0" />
      </mesh>
      <mesh position={[0.85, 1.45, 0.4]}>
        <sphereGeometry args={[0.07, 12, 10]} />
        <meshStandardMaterial color="#FFD7A8" />
      </mesh>
    </group>
  );
}

function DeskAttendantSign({ position, rotation }) {
  return (
    <group position={[position[0], position[1], position[2]]} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.4, 0.45]}>
        <planeGeometry args={[2, 0.7]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <Text position={[0, 1.55, 0.46]} fontSize={0.16} color="#F08A5D" anchorX="center" anchorY="middle">
        Welcome to Arth Party
      </Text>
      <Text position={[0, 1.32, 0.46]} fontSize={0.1} color="#5B3A55" anchorX="center" anchorY="middle" maxWidth={1.85} textAlign="center">
        Hi, I’m Maya — pick any room to start.
      </Text>
    </group>
  );
}

function BodyDecoderKiosk({ position, rotation, onOpen }) {
  const [hover, setHover] = useState(false);
  const screenRef = useRef();
  useFrame((s) => {
    if (!screenRef.current) return;
    screenRef.current.material.emissiveIntensity = 0.6 + Math.sin(s.clock.elapsedTime * 1.3) * 0.25;
  });
  return (
    <group
      position={position}
      rotation={[0, rotation, 0]}
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
      <RoundedBox args={[1.4, 0.7, 1.4]} radius={0.1} position={[0, 0.35, 0]}>
        <meshStandardMaterial color="#FBE2C2" />
      </RoundedBox>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 1.5, 16]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      <RoundedBox args={[1.5, 1.2, 0.16]} radius={0.08} position={[0, 2.1, 0]}>
        <meshStandardMaterial color="#2A1E2C" />
      </RoundedBox>
      <mesh ref={screenRef} position={[0, 2.1, 0.09]}>
        <planeGeometry args={[1.32, 1]} />
        <meshStandardMaterial color="#F3A6B0" emissive="#F3A6B0" emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
      <Text position={[0, 2.3, 0.1]} fontSize={0.16} color="#2A1E2C" anchorX="center" anchorY="middle" maxWidth={1.2} textAlign="center">
        Body Decoder
      </Text>
      <Text position={[0, 2.05, 0.1]} fontSize={0.1} color="#2A1E2C" anchorX="center" anchorY="middle" maxWidth={1.3} textAlign="center">
        What feels off today?
      </Text>
      {hover && (
        <Text position={[0, 3, 0.1]} fontSize={0.14} color="#5B3A55" anchorX="center" anchorY="middle">
          Click to start →
        </Text>
      )}
    </group>
  );
}

/* ---------------- Decor ---------------- */

function CeilingLights() {
  // Two strands of bulbs hanging across the lobby ceiling.
  const A = [-6.5, 6.4, -2.5];
  const B = [6.5, 6.4, -2.5];
  const C = [-6.5, 6.4, 3.6];
  const D = [6.5, 6.4, 3.6];
  return (
    <group>
      <Strand from={A} to={B} count={14} color="#FFD7A8" />
      <Strand from={C} to={D} count={14} color="#F3A6B0" />
      <Strand from={A} to={D} count={12} color="#FBE2C2" />
      <Strand from={B} to={C} count={12} color="#FFD7A8" />
    </group>
  );
}

function Strand({ from, to, count, color }) {
  const positions = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const out = [];
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      const p = new THREE.Vector3().lerpVectors(a, b, t);
      p.y -= Math.sin(t * Math.PI) * 0.7;
      out.push(p);
    }
    return out;
  }, [from, to, count]);
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.children.forEach((m, i) => {
      m.material.emissiveIntensity = 0.7 + Math.sin(t * 2 + i * 0.6) * 0.25;
    });
  });
  return (
    <group ref={ref}>
      {positions.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.12, 12, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Garland() {
  // A gently waving garland of folded flags over the back wall
  return (
    <group position={[0, 6.0, -4.6]}>
      {Array.from({ length: 12 }).map((_, i) => {
        const x = (i - 5.5) * 1.05;
        const y = -Math.cos(((i - 5.5) / 6) * Math.PI) * 0.45;
        const c = ['#F08A5D', '#F3A6B0', '#FFD7A8', '#C9B8E0', '#BFE3D7'][i % 5];
        return (
          <group key={i} position={[x, y, 0]}>
            <mesh>
              <planeGeometry args={[0.42, 0.65]} />
              <meshStandardMaterial color={c} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function FloorMedallion() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.013, 0.4]}>
        <ringGeometry args={[3.8, 4.05, 64]} />
        <meshStandardMaterial color="#F08A5D" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0.4]}>
        <ringGeometry args={[2.6, 2.75, 64]} />
        <meshStandardMaterial color="#F3A6B0" />
      </mesh>
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2;
        const x = Math.cos(a) * 3.4;
        const z = Math.sin(a) * 3.4 + 0.4;
        return (
          <mesh key={i} position={[x, 0.015, z]} rotation={[-Math.PI / 2, 0, -a]}>
            <planeGeometry args={[0.5, 0.1]} />
            <meshStandardMaterial color="#F08A5D" />
          </mesh>
        );
      })}
    </group>
  );
}

function Planter({ position, color, tall = false }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.8, 18]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.42, 0.4, 0.06, 20]} />
        <meshStandardMaterial color="#3F2A3A" />
      </mesh>
      {/* stems */}
      {Array.from({ length: tall ? 6 : 4 }).map((_, i) => {
        const a = (i / (tall ? 6 : 4)) * Math.PI * 2;
        const r = 0.18;
        return (
          <group key={i} position={[Math.cos(a) * r, 0.85, Math.sin(a) * r]}>
            <mesh position={[0, tall ? 0.9 : 0.6, 0]}>
              <cylinderGeometry args={[0.04, 0.04, tall ? 1.8 : 1.2, 8]} />
              <meshStandardMaterial color="#3D5C3A" />
            </mesh>
            <mesh position={[0, tall ? 1.85 : 1.25, 0]}>
              <sphereGeometry args={[0.32, 16, 12]} />
              <meshStandardMaterial color="#5C8A5C" />
            </mesh>
            <mesh position={[0.2, tall ? 1.7 : 1.1, 0.05]}>
              <sphereGeometry args={[0.22, 14, 10]} />
              <meshStandardMaterial color="#7AAB7A" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function RibbonQuote({ position, text, color }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.rotation.z = Math.sin(t * 0.6 + position[0]) * 0.05;
  });
  return (
    <group ref={ref} position={position}>
      {/* ribbon string */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 3, 6]} />
        <meshStandardMaterial color="#5B3A55" />
      </mesh>
      <mesh>
        <planeGeometry args={[2.6, 0.7]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[2.7, 0.78]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={[0, 0, 0.02]} fontSize={0.2} color="#2A1E2C" anchorX="center" anchorY="middle" maxWidth={2.3} textAlign="center">
        {text}
      </Text>
    </group>
  );
}

function FloorCushion({ position, color }) {
  return (
    <RoundedBox args={[1, 0.3, 1]} radius={0.1} position={[position[0], 0.15, position[2]]}>
      <meshStandardMaterial color={color} roughness={0.95} />
    </RoundedBox>
  );
}
