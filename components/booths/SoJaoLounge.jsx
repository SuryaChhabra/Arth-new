'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useArthStore } from '@/lib/store';
import { BOOTHS } from '@/lib/booths';

/* =============================================================
 * SO JAO LOUNGE — Arth Party booth diorama
 *
 * A symmetrical, frontal "event-booth" composition: arched header
 * with the booth title, deep mauve curtain backdrop, blush chaise
 * with cushions and a moon lamp, plus five stations (left → right):
 *   1. "What keeps you awake?" pinboard (arched panel)
 *   2. "Pick a ritual" vertical menu (5 ritual items)
 *   3. Center lounge zone with chaise + drapes + fairy lights
 *   4. "Mood / Sleep Sounds" panel (5 circular buttons)
 *   5. "Sleep Support" arched shelf (bottles + diffuser + lavender)
 * Plus foreground: Phone Parking basket and round neon "Join Sleep
 * Circle" sign. Ambient mood is tintable from the mood panel.
 * ============================================================= */

const PALETTE = {
  base:        '#3B2750',
  panel:       '#4A2F62',
  panelDeep:   '#34204A',
  panelTrim:   '#C9B8E0',
  drape:       '#5B3A78',
  drapeLight:  '#8669A8',
  blush:       '#E2A6B0',
  blushDark:   '#B96E80',
  cream:       '#F2DBC7',
  amber:       '#F5C285',
  amberWarm:   '#FFD8A3',
  moonGlow:    '#FFE7C2',
  star:        '#FFE7B8',
  text:        '#FBF4EC',
  inkText:     '#2A1827',
  glowPink:    '#F3A6B0',
  glowAmber:   '#FFB36B',
  rugDeep:     '#7A4F6E',
  rugLight:    '#B07A92',
  wood:        '#3F2A30',
};

// Mood tints applied to ambient lighting + accent washes
const MOOD_TINTS = {
  warm:      { fill: '#FFB36B', wash: '#FFD8A3', intensity: 1.15 },
  rain:      { fill: '#7A6FA8', wash: '#A8B6CF', intensity: 0.9 },
  moonlight: { fill: '#7B86C0', wash: '#C9D5F0', intensity: 0.85 },
  calm:      { fill: '#9D8FB8', wash: '#C9B8E0', intensity: 0.9 },
  focus:     { fill: '#C9B8E0', wash: '#FBF4EC', intensity: 0.8 },
};

/* ---------- Arched panel helper (used for the side stations) -- */
function archShape(width, height) {
  const ar = width / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, 0);
  shape.lineTo(-width / 2, height - ar);
  shape.absarc(0, height - ar, ar, Math.PI, 0, false);
  shape.lineTo(width / 2, 0);
  shape.lineTo(-width / 2, 0);
  return shape;
}

function ArchedPanel({
  width,
  height,
  depth = 0.22,
  color = PALETTE.panel,
  trimColor = PALETTE.panelTrim,
  trim = 0.08,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onClick,
  onPointerOver,
  onPointerOut,
  children,
}) {
  const geom = useMemo(
    () => new THREE.ExtrudeGeometry(archShape(width, height), { depth, bevelEnabled: false }),
    [width, height, depth]
  );
  const trimGeom = useMemo(
    () =>
      new THREE.ExtrudeGeometry(archShape(width + trim * 2, height + trim * 1.4), {
        depth: depth * 0.55,
        bevelEnabled: false,
      }),
    [width, height, depth, trim]
  );
  return (
    <group position={position} rotation={rotation} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <mesh geometry={trimGeom} position={[-trim, -trim * 0.7, -0.02]} castShadow receiveShadow>
        <meshStandardMaterial color={trimColor} roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh geometry={geom} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {children}
    </group>
  );
}

/* ============================================================ */

export default function SoJaoLounge() {
  const setOpenHotspot = useArthStore((s) => s.setOpenHotspot);
  const selectedMood = useArthStore((s) => s.selectedMood) || 'warm';
  const setSelectedMood = useArthStore((s) => s.setSelectedMood);
  const tint = MOOD_TINTS[selectedMood] || MOOD_TINTS.warm;

  const open = (id) => setOpenHotspot({ boothId: 'sojao', hotspotId: id });

  return (
    <group>
      {/* === Lighting === */}
      <Lighting tint={tint} />

      {/* === Floor + glowing edge === */}
      <BoothFloor />

      {/* === Backdrop curtain wall === */}
      <BoothBackdrop />

      {/* === Header arch w/ title === */}
      <BoothHeader />

      {/* === Center lounge === */}
      <CenterRug />
      <CenterDrapes />
      <FairyCascade />
      <Chaise position={[0, 0, -0.2]} />
      <CushionGroup />
      <FloorTray position={[-0.3, 0.05, 1.7]} />
      <OpenJournal position={[0.4, 0.06, 1.85]} />
      <SideTable position={[2.6, 0, -0.15]} />
      <MoonLamp position={[2.6, 1.05, -0.15]} />
      <SaltLamp position={[-2.5, 0.75, 0.4]} />

      {/* === Stations === */}
      <WhatKeepsYouAwake position={[-6.3, 0, -2.0]} onClick={() => open('whatkeepsyouawake')} />
      <PickARitualShelf position={[-3.7, 0, -2.1]} onPick={(id) => open(`ritual_${id}`)} />
      <MoodSoundsPanel
        position={[3.7, 0, -2.1]}
        selectedMood={selectedMood}
        onPick={(id) => {
          setSelectedMood(id);
          open(`mood_${id}`);
        }}
      />
      <SleepSupportShelf position={[6.3, 0, -2.0]} onClick={() => open('sleepsupport')} />

      {/* === Foreground props === */}
      <PhoneParkingBasket position={[-4.6, 0, 3.3]} onClick={() => open('phoneparking')} />
      <JoinCircleSign position={[5.6, 0, 3.3]} onClick={() => open('joincircle')} />

      {/* === Floor lamps + planters === */}
      <WovenFloorLamp position={[-8.1, 0, 3.0]} />
      <WovenFloorLamp position={[8.1, 0, 3.0]} />
      <Planter position={[-9.4, 0, 0.4]} />
      <Planter position={[9.4, 0, 0.4]} />

      {/* === Subtle lotus on back curtain === */}
      <BackLotus position={[0, 2.7, -3.55]} />

      {/* === Floor cushions front === */}
      <FloorPouf position={[-1.6, 0, 2.5]} color={PALETTE.blushDark} r={0.55} />
      <FloorPouf position={[1.8, 0, 2.6]} color="#74527A" r={0.55} />
    </group>
  );
}

/* ============================================================
 * Lighting
 * ============================================================ */
function Lighting({ tint }) {
  const fillRef = useRef();
  const accentRef = useRef();
  useFrame((state) => {
    if (!fillRef.current) return;
    fillRef.current.color.set(tint.fill);
    fillRef.current.intensity = tint.intensity;
    if (accentRef.current) accentRef.current.color.set(tint.wash);
  });
  return (
    <>
      <ambientLight intensity={0.42} color="#5B3A78" />
      <hemisphereLight intensity={0.32} color="#FFD8A3" groundColor="#2A1B3D" />
      {/* warm key light overhead */}
      <pointLight ref={fillRef} position={[0, 6, 4]} intensity={1.15} color={tint.fill} distance={28} />
      {/* moon-side cool wash */}
      <pointLight ref={accentRef} position={[2.6, 2.4, 1]} intensity={1.4} color={tint.wash} distance={10} />
      {/* salt-lamp warm wash on the other side */}
      <pointLight position={[-2.5, 1.4, 0.6]} intensity={1.0} color="#FFA162" distance={8} />
      {/* footlights */}
      <pointLight position={[-5, 0.4, 3.5]} intensity={0.7} color="#FFC58A" distance={6} />
      <pointLight position={[5, 0.4, 3.5]} intensity={0.7} color="#F3A6B0" distance={6} />
      {/* fairy-cascade warm wash */}
      <pointLight position={[0, 4.2, -2.6]} intensity={0.9} color="#FFD7A8" distance={12} />
    </>
  );
}

/* ============================================================
 * Booth shell — floor, backdrop, header
 * ============================================================ */

function BoothFloor() {
  return (
    <group>
      {/* Big base floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 14]} />
        <meshStandardMaterial color="#231435" roughness={0.95} />
      </mesh>
      {/* Lighter inner stage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0.5]} receiveShadow>
        <planeGeometry args={[18, 9]} />
        <meshStandardMaterial color="#2D1A40" roughness={0.9} />
      </mesh>
      {/* Polished tile shimmer */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0.5]}>
        <planeGeometry args={[16, 7.5]} />
        <meshStandardMaterial color="#3D2658" metalness={0.3} roughness={0.55} />
      </mesh>
      {/* Glowing edge ring around the lounge zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0.8]}>
        <ringGeometry args={[3.4, 3.55, 64]} />
        <meshStandardMaterial color={PALETTE.glowAmber} emissive={PALETTE.glowAmber} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
    </group>
  );
}

function BoothBackdrop() {
  // Layered sheer drapes behind the chaise area, with a deep mauve back wall.
  return (
    <group position={[0, 0, -3.5]}>
      {/* Solid back wall */}
      <mesh position={[0, 4.2, 0]}>
        <planeGeometry args={[20, 8.4]} />
        <meshStandardMaterial color={PALETTE.base} roughness={0.92} />
      </mesh>
      {/* Vertical curtain ribbing — stylized */}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = (i - 8.5) * 1.1;
        return (
          <mesh key={i} position={[x, 4.2, 0.04]}>
            <planeGeometry args={[0.9, 8.0]} />
            <meshStandardMaterial color={PALETTE.drape} side={THREE.DoubleSide} roughness={0.95} />
          </mesh>
        );
      })}
      {/* Soft warm wash centered behind chaise */}
      <mesh position={[0, 3.6, 0.06]}>
        <planeGeometry args={[10, 6]} />
        <meshStandardMaterial color={PALETTE.drapeLight} transparent opacity={0.55} side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
    </group>
  );
}

function CenterDrapes() {
  // Four sheer vertical fabric strips cascading from above the chaise.
  const strips = [
    { x: -2.4, w: 1.2, c: 0.45 },
    { x: -0.8, w: 1.2, c: 0.55 },
    { x: 0.8, w: 1.2, c: 0.55 },
    { x: 2.4, w: 1.2, c: 0.45 },
  ];
  return (
    <group position={[0, 0, -2.85]}>
      {strips.map((s, i) => (
        <mesh key={i} position={[s.x, 3.0, 0]}>
          <planeGeometry args={[s.w, 6.0]} />
          <meshStandardMaterial color="#D5B7E0" transparent opacity={s.c} side={THREE.DoubleSide} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function BoothHeader() {
  // Big arched signboard with title + subtitle hanging above center
  const w = 8.6;
  const h = 4.2;
  const geom = useMemo(
    () => new THREE.ExtrudeGeometry(archShape(w, h), { depth: 0.28, bevelEnabled: false }),
    [w, h]
  );
  const innerGeom = useMemo(
    () => new THREE.ExtrudeGeometry(archShape(w - 0.5, h - 0.4), { depth: 0.18, bevelEnabled: false }),
    [w, h]
  );
  return (
    <group position={[0, 4.2, -3.0]}>
      {/* outer copper trim */}
      <mesh geometry={geom} castShadow>
        <meshStandardMaterial color="#9F7A52" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* inner panel */}
      <mesh geometry={innerGeom} position={[0.25, 0.2, 0.12]}>
        <meshStandardMaterial color={PALETTE.panelDeep} roughness={0.85} />
      </mesh>
      {/* tiny lotus + stars above title */}
      <Text position={[0, 2.55, 0.32]} fontSize={0.45} color={PALETTE.amberWarm} anchorX="center" anchorY="middle">
        ❋
      </Text>
      <Text position={[-0.85, 2.7, 0.32]} fontSize={0.18} color={PALETTE.star} anchorX="center" anchorY="middle">✦</Text>
      <Text position={[0.95, 2.7, 0.32]} fontSize={0.18} color={PALETTE.star} anchorX="center" anchorY="middle">✦</Text>
      <Text position={[-1.6, 2.4, 0.32]} fontSize={0.12} color={PALETTE.star} anchorX="center" anchorY="middle">✦</Text>
      <Text position={[1.7, 2.4, 0.32]} fontSize={0.12} color={PALETTE.star} anchorX="center" anchorY="middle">✦</Text>

      {/* title */}
      <Text
        position={[0.25, 1.55, 0.32]}
        fontSize={0.85}
        color={PALETTE.amberWarm}
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.02}
        outlineWidth={0.012}
        outlineColor="#5B3A78"
      >
        So Jao Lounge
      </Text>

      {/* subtitle */}
      <Text
        position={[0.25, 0.95, 0.32]}
        fontSize={0.26}
        color={PALETTE.cream}
        anchorX="center"
        anchorY="middle"
        maxWidth={6.5}
        textAlign="center"
      >
        Sleep ko lecture nahi, ritual banao.
      </Text>

      {/* tiny brand line */}
      <Text position={[0.25, 0.5, 0.32]} fontSize={0.13} color={PALETTE.glowPink} anchorX="center" anchorY="middle">
        Arth Party
      </Text>
    </group>
  );
}

function BackLotus({ position }) {
  return (
    <group position={position}>
      <Text fontSize={1.2} color={PALETTE.amber} anchorX="center" anchorY="middle">
        ❋
      </Text>
      <Text position={[0, -0.6, 0]} fontSize={0.15} color={PALETTE.amberWarm} anchorX="center" anchorY="middle" letterSpacing={0.4}>
        ✦  ✦  ✦
      </Text>
    </group>
  );
}

/* ============================================================
 * Center lounge: rug, chaise, cushions, tray, journal, side table
 * ============================================================ */

function CenterRug() {
  return (
    <group position={[0, 0, 1]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.013, 0]} receiveShadow>
        <circleGeometry args={[3.3, 64]} />
        <meshStandardMaterial color={PALETTE.rugLight} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0]}>
        <ringGeometry args={[2.8, 3.1, 64]} />
        <meshStandardMaterial color={PALETTE.rugDeep} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[1.6, 1.7, 64]} />
        <meshStandardMaterial color={PALETTE.rugDeep} roughness={1} />
      </mesh>
    </group>
  );
}

function Chaise({ position }) {
  return (
    <group position={position}>
      {/* Wooden short legs */}
      {[-1.1, 0, 1.1].map((x, i) => (
        <mesh key={i} position={[x, 0.12, 0.0]}>
          <cylinderGeometry args={[0.06, 0.04, 0.24, 10]} />
          <meshStandardMaterial color={PALETTE.wood} />
        </mesh>
      ))}
      {/* Base seat (long) */}
      <RoundedBox args={[3.0, 0.55, 1.4]} radius={0.16} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color={PALETTE.blush} roughness={0.95} />
      </RoundedBox>
      {/* Back rest — slanted on left side (head end) */}
      <RoundedBox args={[1.1, 1.05, 1.4]} radius={0.18} position={[-0.95, 1.18, -0.08]} castShadow>
        <meshStandardMaterial color={PALETTE.blush} roughness={0.95} />
      </RoundedBox>
      {/* Low back rest */}
      <RoundedBox args={[1.9, 0.45, 1.3]} radius={0.16} position={[0.55, 0.92, -0.4]} castShadow>
        <meshStandardMaterial color={PALETTE.blushDark} roughness={0.95} />
      </RoundedBox>
      {/* Throw blanket draped over right end */}
      <mesh position={[1.05, 0.85, 0.4]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[0.9, 0.04, 1.6]} />
        <meshStandardMaterial color="#9C7BAE" roughness={0.95} />
      </mesh>
      <mesh position={[1.42, 0.6, 0.42]} rotation={[0.4, 0, -0.15]}>
        <boxGeometry args={[0.32, 0.04, 1.4]} />
        <meshStandardMaterial color="#9C7BAE" roughness={0.95} />
      </mesh>
    </group>
  );
}

function CushionGroup() {
  const cs = [
    { p: [-0.9, 1.05, 0.05], s: 0.5, c: '#B96E80' },
    { p: [-0.25, 1.0, 0.1], s: 0.46, c: '#74527A' },
    { p: [0.35, 1.0, 0.05], s: 0.45, c: '#C9B8E0' },
    { p: [0.95, 1.02, 0.05], s: 0.42, c: '#9C7BAE' },
    { p: [-0.1, 0.95, 0.4], s: 0.32, c: '#E2A6B0' },
  ];
  return (
    <group>
      {cs.map((c, i) => (
        <RoundedBox key={i} args={[c.s, c.s * 0.7, c.s]} radius={0.06} position={c.p}>
          <meshStandardMaterial color={c.c} roughness={0.95} />
        </RoundedBox>
      ))}
    </group>
  );
}

function FloorTray({ position }) {
  return (
    <group position={position}>
      {/* tray */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.8, 0.04, 0.5]} />
        <meshStandardMaterial color={PALETTE.wood} roughness={0.7} />
      </mesh>
      {/* glass */}
      <mesh position={[-0.22, 0.18, 0]}>
        <cylinderGeometry args={[0.07, 0.06, 0.28, 16]} />
        <meshStandardMaterial color="#E0DDF0" transparent opacity={0.55} roughness={0.2} />
      </mesh>
      {/* carafe */}
      <mesh position={[0.05, 0.22, 0]}>
        <cylinderGeometry args={[0.09, 0.1, 0.36, 16]} />
        <meshStandardMaterial color="#E0DDF0" transparent opacity={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0.05, 0.42, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.06, 12]} />
        <meshStandardMaterial color="#E0DDF0" transparent opacity={0.6} roughness={0.2} />
      </mesh>
      {/* candle */}
      <mesh position={[0.28, 0.07, -0.05]}>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 14]} />
        <meshStandardMaterial color={PALETTE.cream} />
      </mesh>
      <Flame position={[0.28, 0.18, -0.05]} />
    </group>
  );
}

function Flame({ position }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.material.emissiveIntensity = 1.3 + Math.sin(t * 6) * 0.4;
    ref.current.scale.y = 1 + Math.sin(t * 7) * 0.15;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.04, 12, 10]} />
      <meshStandardMaterial color="#FFE2A8" emissive={PALETTE.glowAmber} emissiveIntensity={1.4} toneMapped={false} />
    </mesh>
  );
}

function OpenJournal({ position }) {
  return (
    <group position={position}>
      {/* left page */}
      <mesh rotation={[-Math.PI / 2, 0, 0.18]} position={[-0.18, 0, 0]}>
        <planeGeometry args={[0.42, 0.55]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      {/* right page */}
      <mesh rotation={[-Math.PI / 2, 0, -0.18]} position={[0.18, 0, 0]}>
        <planeGeometry args={[0.42, 0.55]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {/* spine line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[0.04, 0.55]} />
        <meshStandardMaterial color="#C9B8E0" />
      </mesh>
    </group>
  );
}

function SideTable({ position }) {
  return (
    <group position={position}>
      {/* slatted wooden side table */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.45, 0.5, 1.0, 24]} />
        <meshStandardMaterial color={PALETTE.wood} roughness={0.85} />
      </mesh>
      {/* slat lines */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.51, 0.5, Math.sin(a) * 0.51]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.02, 0.95, 0.02]} />
            <meshStandardMaterial color="#5B3F46" />
          </mesh>
        );
      })}
      {/* tabletop */}
      <mesh position={[0, 1.02, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.06, 24]} />
        <meshStandardMaterial color={PALETTE.cream} roughness={0.8} />
      </mesh>
    </group>
  );
}

function MoonLamp({ position }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.material.emissiveIntensity = 1.0 + Math.sin(s.clock.elapsedTime * 0.7) * 0.12;
  });
  return (
    <group position={position}>
      {/* small wooden base */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.08, 18]} />
        <meshStandardMaterial color={PALETTE.wood} />
      </mesh>
      {/* moon */}
      <mesh ref={ref} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.42, 32, 24]} />
        <meshStandardMaterial color={PALETTE.moonGlow} emissive={PALETTE.moonGlow} emissiveIntensity={1.05} toneMapped={false} />
      </mesh>
      {/* tiny pointlight inside the moon */}
      <pointLight position={[0, 0.5, 0]} intensity={0.65} color="#FFE7C2" distance={4} />
    </group>
  );
}

function SaltLamp({ position }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.material.emissiveIntensity = 1.0 + Math.sin(s.clock.elapsedTime * 1.1) * 0.18;
  });
  return (
    <group position={position}>
      {/* base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.1, 16]} />
        <meshStandardMaterial color={PALETTE.wood} />
      </mesh>
      {/* salt rock */}
      <mesh ref={ref} position={[0, 0.32, 0]}>
        <dodecahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial color="#FFA86B" emissive="#FF9650" emissiveIntensity={1.0} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.32, 0]} intensity={0.5} color="#FFA162" distance={3} />
    </group>
  );
}

/* ============================================================
 * Fairy lights cascading from above the chaise
 * ============================================================ */
function FairyCascade() {
  // Generate several strands cascading from a top central point
  const strands = useMemo(() => {
    const out = [];
    for (let s = 0; s < 9; s++) {
      const a = (s / 9) * Math.PI - Math.PI / 2; // -90 to +90 deg
      const startX = Math.sin(a) * 3.2;
      const endX = Math.sin(a) * 4.5;
      const points = [];
      for (let i = 0; i < 12; i++) {
        const t = i / 11;
        const x = THREE.MathUtils.lerp(startX, endX, t);
        const y = THREE.MathUtils.lerp(5.5, 0.4, t) - Math.sin(t * Math.PI) * 0.2;
        const z = THREE.MathUtils.lerp(-2.9, -2.3, t) + Math.sin(t * Math.PI) * 0.3;
        points.push([x, y, z]);
      }
      out.push(points);
    }
    return out;
  }, []);

  const groupRef = useRef();
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    let idx = 0;
    groupRef.current.children.forEach((mesh) => {
      mesh.material.emissiveIntensity = 0.7 + Math.sin(t * 2 + idx * 0.4) * 0.35;
      idx++;
    });
  });

  return (
    <group ref={groupRef}>
      {strands.flatMap((strand, si) =>
        strand.map((p, i) => (
          <mesh key={`${si}-${i}`} position={p}>
            <sphereGeometry args={[0.07, 10, 8]} />
            <meshStandardMaterial color={PALETTE.amberWarm} emissive={PALETTE.amberWarm} emissiveIntensity={0.9} toneMapped={false} />
          </mesh>
        ))
      )}
    </group>
  );
}

/* ============================================================
 * Station 1 — What keeps you awake?
 * ============================================================ */
function WhatKeepsYouAwake({ position, onClick }) {
  const [hover, setHover] = useState(false);
  const W = 3.3;
  const H = 5.3;
  const handlers = {
    onPointerOver: (e) => {
      e.stopPropagation();
      setHover(true);
      document.body.style.cursor = 'pointer';
    },
    onPointerOut: () => {
      setHover(false);
      document.body.style.cursor = 'default';
    },
  };
  return (
    <group position={position} {...handlers} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <ArchedPanel
        width={W}
        height={H}
        color={PALETTE.panel}
        trimColor={hover ? PALETTE.glowPink : PALETTE.panelTrim}
      >
        {/* Crescent moon icon at top */}
        <Text position={[0, 4.7, 0.25]} fontSize={0.55} color={PALETTE.amberWarm} anchorX="center" anchorY="middle">
          ☾
        </Text>
        {/* Title */}
        <Text position={[0, 4.0, 0.25]} fontSize={0.22} color={PALETTE.cream} anchorX="center" anchorY="middle" maxWidth={W - 0.3} textAlign="center">
          What keeps you awake?
        </Text>
        {/* Pinboard */}
        <mesh position={[0, 2.3, 0.25]}>
          <planeGeometry args={[W - 0.5, 2.4]} />
          <meshStandardMaterial color="#7A5B6F" roughness={0.95} />
        </mesh>
        {/* Sticky notes */}
        {[
          { x: -0.85, y: 3.05, c: '#FBE2C2', t: 'One more reel…', r: -0.06 },
          { x: 0, y: 3.1, c: '#F3A6B0', t: 'Overthinking', r: 0.04 },
          { x: 0.85, y: 3.0, c: '#C9B8E0', t: 'Work stress', r: -0.03 },
          { x: -0.7, y: 2.3, c: '#F3A6B0', t: 'Can’t switch off', r: 0.05 },
          { x: 0.55, y: 2.25, c: '#FBE2C2', t: 'Awake at 1 am', r: -0.06 },
          { x: -0.3, y: 1.55, c: '#C9B8E0', t: 'Sleepy all day', r: 0.04 },
        ].map((n, i) => (
          <group key={i} position={[n.x, n.y, 0.27]} rotation={[0, 0, n.r]}>
            <mesh>
              <planeGeometry args={[0.7, 0.55]} />
              <meshStandardMaterial color={n.c} />
            </mesh>
            <Text position={[0, 0, 0.01]} fontSize={0.085} color={PALETTE.inkText} anchorX="center" anchorY="middle" maxWidth={0.6} textAlign="center">
              {n.t}
            </Text>
          </group>
        ))}
        {/* Reaction chips at bottom */}
        {['Same, sis', 'So real', 'Me tonight'].map((t, i) => (
          <group key={i} position={[(i - 1) * 0.95, 0.7, 0.26]}>
            <mesh>
              <planeGeometry args={[0.85, 0.32]} />
              <meshStandardMaterial color={i === 1 ? PALETTE.glowPink : '#9D8FB8'} />
            </mesh>
            <Text position={[0, 0, 0.01]} fontSize={0.1} color={PALETTE.text} anchorX="center" anchorY="middle">
              {t}
            </Text>
          </group>
        ))}
        {/* Mini overhead lamp clip */}
        <mesh position={[0, 5.2, 0.35]}>
          <coneGeometry args={[0.18, 0.22, 16]} />
          <meshStandardMaterial color={PALETTE.amber} emissive={PALETTE.amberWarm} emissiveIntensity={0.5} />
        </mesh>
      </ArchedPanel>
    </group>
  );
}

/* ============================================================
 * Station 2 — Pick a Ritual
 * ============================================================ */
function PickARitualShelf({ position, onPick }) {
  const W = 1.7;
  const H = 5.3;
  const items = [
    { id: 'breathe', label: 'Breathe', icon: '∿' },
    { id: 'journal', label: 'Journal', icon: '✎' },
    { id: 'stretch', label: 'Stretch', icon: '✦' },
    { id: 'sip', label: 'Sip', icon: '☕' },
    { id: 'dim', label: 'Dim', icon: '☾' },
  ];
  return (
    <group position={position}>
      <ArchedPanel width={W} height={H} color={PALETTE.panelDeep} trimColor={PALETTE.amberWarm}>
        {/* Header */}
        <Text position={[0, 4.6, 0.25]} fontSize={0.18} color={PALETTE.cream} anchorX="center" anchorY="middle">
          Pick a ritual
        </Text>
        {/* Items */}
        {items.map((it, i) => (
          <RitualItem
            key={it.id}
            y={3.95 - i * 0.7}
            label={it.label}
            icon={it.icon}
            onClick={() => onPick(it.id)}
          />
        ))}
        {/* small lavender sprig at base */}
        <Lavender position={[0, 0.45, 0.27]} />
      </ArchedPanel>
    </group>
  );
}

function RitualItem({ y, label, icon, onClick }) {
  const [hover, setHover] = useState(false);
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.material.emissiveIntensity = (hover ? 1.2 : 0.6) + Math.sin(s.clock.elapsedTime * 1.5 + y) * 0.15;
  });
  return (
    <group
      position={[0, y, 0.26]}
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
      {/* glowing pill */}
      <mesh ref={ref}>
        <planeGeometry args={[1.45, 0.55]} />
        <meshStandardMaterial color="#5B3A78" emissive={PALETTE.amberWarm} emissiveIntensity={0.6} toneMapped={false} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[1.55, 0.65]} />
        <meshStandardMaterial color={hover ? PALETTE.glowAmber : PALETTE.amber} transparent opacity={0.35} />
      </mesh>
      {/* icon */}
      <Text position={[-0.5, 0, 0.01]} fontSize={0.22} color={PALETTE.amberWarm} anchorX="center" anchorY="middle">
        {icon}
      </Text>
      {/* label */}
      <Text position={[0.15, 0, 0.01]} fontSize={0.18} color={PALETTE.cream} anchorX="center" anchorY="middle" letterSpacing={-0.01}>
        {label}
      </Text>
    </group>
  );
}

function Lavender({ position }) {
  return (
    <group position={position}>
      {[-0.12, 0, 0.12].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.36, 6]} />
            <meshStandardMaterial color="#3D5C3A" />
          </mesh>
          <mesh position={[0, 0.42, 0]}>
            <coneGeometry args={[0.05, 0.18, 8]} />
            <meshStandardMaterial color="#A480C8" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ============================================================
 * Station 3 — Mood / Sleep Sounds
 * ============================================================ */
function MoodSoundsPanel({ position, selectedMood, onPick }) {
  const W = 1.7;
  const H = 5.3;
  const moods = [
    { id: 'rain', label: 'Rain', icon: '☂' },
    { id: 'moonlight', label: 'Moonlight', icon: '☾' },
    { id: 'warm', label: 'Warm hush', icon: '✿' },
    { id: 'calm', label: 'Deep calm', icon: '◉' },
    { id: 'focus', label: 'Quiet focus', icon: '∿' },
  ];
  return (
    <group position={position}>
      <ArchedPanel width={W} height={H} color={PALETTE.panelDeep} trimColor={PALETTE.glowPink}>
        <Text position={[0, 4.65, 0.25]} fontSize={0.18} color={PALETTE.cream} anchorX="center" anchorY="middle" maxWidth={W - 0.2} textAlign="center">
          Mood / Sleep Sounds
        </Text>
        {moods.map((m, i) => (
          <MoodButton
            key={m.id}
            y={3.95 - i * 0.7}
            label={m.label}
            icon={m.icon}
            mood={m.id}
            isSelected={selectedMood === m.id}
            onSelect={() => onPick(m.id)}
          />
        ))}
      </ArchedPanel>
    </group>
  );
}

function MoodButton({ y, label, icon, mood, isSelected, onSelect }) {
  const [hover, setHover] = useState(false);
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.material.emissiveIntensity = (isSelected ? 1.5 : hover ? 1.0 : 0.6) + Math.sin(s.clock.elapsedTime * 1.3 + y) * 0.15;
  });
  const colorMap = {
    rain: '#7BA8C8',
    moonlight: '#9C8FC8',
    warm: '#F3A6B0',
    calm: '#C9B8E0',
    focus: '#BFE3D7',
  };
  return (
    <group
      position={[0, y, 0.26]}
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
        onSelect();
      }}
    >
      {/* circular glow chip */}
      <mesh position={[-0.45, 0, 0]}>
        <circleGeometry args={[0.28, 28]} />
        <meshStandardMaterial color={colorMap[mood]} emissive={colorMap[mood]} emissiveIntensity={isSelected ? 1.2 : 0.4} transparent opacity={0.9} toneMapped={false} />
      </mesh>
      <mesh ref={ref} position={[-0.45, 0, 0.005]}>
        <ringGeometry args={[0.3, 0.34, 28]} />
        <meshStandardMaterial color={isSelected ? PALETTE.amberWarm : colorMap[mood]} emissive={isSelected ? PALETTE.amberWarm : colorMap[mood]} emissiveIntensity={isSelected ? 1.5 : 0.6} toneMapped={false} />
      </mesh>
      <Text position={[-0.45, 0, 0.02]} fontSize={0.22} color={PALETTE.text} anchorX="center" anchorY="middle">
        {icon}
      </Text>
      <Text position={[0.18, 0, 0.02]} fontSize={0.13} color={isSelected ? PALETTE.amberWarm : PALETTE.cream} anchorX="center" anchorY="middle" maxWidth={1} textAlign="center">
        {label}
      </Text>
    </group>
  );
}

/* ============================================================
 * Station 4 — Sleep Support shelf
 * ============================================================ */
function SleepSupportShelf({ position, onClick }) {
  const [hover, setHover] = useState(false);
  const W = 3.3;
  const H = 5.3;
  return (
    <group
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
      <ArchedPanel
        width={W}
        height={H}
        color={PALETTE.panel}
        trimColor={hover ? PALETTE.amberWarm : PALETTE.panelTrim}
      >
        {/* small overhead lamp */}
        <mesh position={[0, 5.2, 0.35]}>
          <coneGeometry args={[0.18, 0.22, 16]} />
          <meshStandardMaterial color={PALETTE.amber} emissive={PALETTE.amberWarm} emissiveIntensity={0.6} />
        </mesh>
        {/* lotus icon */}
        <Text position={[0, 4.7, 0.25]} fontSize={0.5} color={PALETTE.amberWarm} anchorX="center" anchorY="middle">
          ❋
        </Text>
        <Text position={[0, 4.05, 0.25]} fontSize={0.22} color={PALETTE.cream} anchorX="center" anchorY="middle" maxWidth={W - 0.4}>
          Sleep Support
        </Text>
        {/* Two shelves */}
        <Shelf y={2.85} />
        <Shelf y={1.45} />
        {/* Top shelf items */}
        <Diffuser position={[-0.85, 3.0, 0.32]} />
        <Bottle position={[-0.15, 3.0, 0.32]} color="#FBE2C2" capColor="#5B3A55" />
        <Bottle position={[0.32, 3.0, 0.32]} color="#FBF4EC" capColor="#5B3A55" />
        <Bottle position={[0.82, 3.0, 0.32]} color="#E2D2EE" capColor="#5B3A55" />
        <Lavender position={[1.15, 2.96, 0.32]} />
        {/* Bottom shelf items */}
        <Bottle position={[-1.0, 1.62, 0.32]} color="#FBE2C2" capColor="#5B3A55" small />
        <Candle position={[-0.4, 1.55, 0.32]} color="#FBF4EC" />
        <Bottle position={[0.18, 1.62, 0.32]} color="#FBF4EC" capColor="#5B3A55" small />
        <Candle position={[0.7, 1.55, 0.32]} color={PALETTE.cream} />
        <Lavender position={[1.1, 1.5, 0.32]} />
        {/* tiny tag */}
        <mesh position={[0, 0.65, 0.27]}>
          <planeGeometry args={[2.2, 0.42]} />
          <meshStandardMaterial color="#5B3A78" />
        </mesh>
        <Text position={[0, 0.65, 0.28]} fontSize={0.13} color={PALETTE.amberWarm} anchorX="center" anchorY="middle">
          A gentle next step
        </Text>
      </ArchedPanel>
    </group>
  );
}

function Shelf({ y }) {
  return (
    <mesh position={[0, y, 0.27]}>
      <boxGeometry args={[2.4, 0.07, 0.55]} />
      <meshStandardMaterial color="#FBE2C2" roughness={0.7} />
    </mesh>
  );
}

function Bottle({ position, color, capColor, small = false }) {
  const h = small ? 0.4 : 0.5;
  const r = small ? 0.07 : 0.09;
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[r, r, h, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, h + 0.05, 0]}>
        <cylinderGeometry args={[r * 0.55, r * 0.6, 0.1, 12]} />
        <meshStandardMaterial color={capColor} />
      </mesh>
    </group>
  );
}

function Diffuser({ position }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.material.emissiveIntensity = 0.7 + Math.sin(s.clock.elapsedTime * 1.4) * 0.25;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.22, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        <meshStandardMaterial color={PALETTE.cream} roughness={0.5} />
      </mesh>
      {/* steam orb */}
      <mesh ref={ref} position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshStandardMaterial color="#E0D6F0" emissive="#E0D6F0" emissiveIntensity={0.7} transparent opacity={0.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Candle({ position, color }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.24, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Flame position={[0, 0.3, 0]} />
    </group>
  );
}

/* ============================================================
 * Foreground — Phone Parking basket
 * ============================================================ */
function PhoneParkingBasket({ position, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <group
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
      {/* basket body — woven look approximated by stripes */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.65, 0.95, 32]} />
        <meshStandardMaterial color="#7A5841" roughness={0.95} />
      </mesh>
      {/* horizontal weave stripes */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[0, 0.18 + i * 0.13, 0]}>
          <torusGeometry args={[0.78 - i * 0.025, 0.02, 8, 32]} />
          <meshStandardMaterial color="#5B3A2A" roughness={0.9} />
        </mesh>
      ))}
      {/* basket handle */}
      <mesh position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.05, 10, 28, Math.PI]} />
        <meshStandardMaterial color="#5B3A2A" />
      </mesh>
      {/* purple blanket draped over front rim */}
      <mesh position={[0, 0.95, 0.6]} rotation={[0.5, 0, 0]}>
        <planeGeometry args={[1.4, 0.7]} />
        <meshStandardMaterial color="#9C7BAE" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* phones peeking out */}
      <Phone position={[-0.28, 1.2, 0.05]} screen="#7BA8C8" />
      <Phone position={[0, 1.25, 0.1]} screen="#F3A6B0" />
      <Phone position={[0.3, 1.2, 0.05]} screen="#C9B8E0" />
      {/* small label sign in front */}
      <group position={[0, 1.45, 0.55]} rotation={[0.15, 0, 0]}>
        <mesh>
          <planeGeometry args={[1.1, 0.4]} />
          <meshStandardMaterial color={PALETTE.cream} />
        </mesh>
        <Text position={[0, 0.07, 0.01]} fontSize={0.16} color="#6A3A55" anchorX="center" anchorY="middle">
          📱 Phone Parking
        </Text>
        <Text position={[0, -0.13, 0.01]} fontSize={0.08} color={PALETTE.inkText} anchorX="center" anchorY="middle">
          Park the scroll, soften the night
        </Text>
      </group>
      {hover && (
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.92, 0.72, 0.97, 32]} />
          <meshStandardMaterial color={PALETTE.glowPink} transparent opacity={0.18} emissive={PALETTE.glowPink} emissiveIntensity={0.7} />
        </mesh>
      )}
    </group>
  );
}

function Phone({ position, screen }) {
  return (
    <group position={position} rotation={[-0.45, 0, 0]}>
      <mesh>
        <boxGeometry args={[0.22, 0.42, 0.025]} />
        <meshStandardMaterial color="#1a0f12" />
      </mesh>
      <mesh position={[0, 0, 0.014]}>
        <planeGeometry args={[0.18, 0.36]} />
        <meshStandardMaterial color={screen} emissive={screen} emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ============================================================
 * Foreground — Join Sleep Circle round neon sign
 * ============================================================ */
function JoinCircleSign({ position, onClick }) {
  const [hover, setHover] = useState(false);
  const ringRef = useRef();
  useFrame((s) => {
    if (!ringRef.current) return;
    ringRef.current.material.emissiveIntensity = (hover ? 1.6 : 1.0) + Math.sin(s.clock.elapsedTime * 1.6) * 0.2;
  });
  return (
    <group
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
      {/* base post */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.8, 12]} />
        <meshStandardMaterial color="#5B3A55" />
      </mesh>
      {/* back disc */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.08, 48]} />
        <meshStandardMaterial color={PALETTE.panelDeep} roughness={0.7} />
      </mesh>
      {/* neon ring */}
      <mesh ref={ringRef} position={[0, 1.6, 0.05]}>
        <torusGeometry args={[0.85, 0.05, 14, 64]} />
        <meshStandardMaterial color={PALETTE.glowPink} emissive={PALETTE.glowPink} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      {/* inner glow */}
      <mesh position={[0, 1.6, 0.04]}>
        <circleGeometry args={[0.85, 48]} />
        <meshStandardMaterial color="#5B3A78" emissive={PALETTE.glowPink} emissiveIntensity={0.25} toneMapped={false} />
      </mesh>
      {/* group icon */}
      <Text position={[0, 1.85, 0.06]} fontSize={0.22} color={PALETTE.amberWarm} anchorX="center" anchorY="middle">
        ❀❀❀
      </Text>
      <Text position={[0, 1.65, 0.06]} fontSize={0.18} color={PALETTE.cream} anchorX="center" anchorY="middle">
        Join
      </Text>
      <Text position={[0, 1.4, 0.06]} fontSize={0.18} color={PALETTE.amberWarm} anchorX="center" anchorY="middle" letterSpacing={-0.01}>
        Sleep Circle
      </Text>
      <Text position={[0, 1.18, 0.06]} fontSize={0.4} color={PALETTE.amberWarm} anchorX="center" anchorY="middle">
        ❋
      </Text>
    </group>
  );
}

/* ============================================================
 * Decor — Floor lamps + planters + floor cushions
 * ============================================================ */

function WovenFloorLamp({ position }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.material.emissiveIntensity = 0.9 + Math.sin(s.clock.elapsedTime * 0.9) * 0.2;
  });
  return (
    <group position={position}>
      {/* base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.1, 18]} />
        <meshStandardMaterial color={PALETTE.wood} />
      </mesh>
      {/* woven bulb shade — vertical stripes */}
      <mesh ref={ref} position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.32, 0.42, 1.2, 18]} />
        <meshStandardMaterial color="#8E5A3C" emissive={PALETTE.amberWarm} emissiveIntensity={0.95} toneMapped={false} />
      </mesh>
      {/* weave pattern */}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.43, 0.7, Math.sin(a) * 0.43]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.02, 1.18, 0.02]} />
            <meshStandardMaterial color="#3F2A1F" />
          </mesh>
        );
      })}
      <pointLight position={[0, 0.7, 0]} intensity={0.9} color={PALETTE.amberWarm} distance={5} />
    </group>
  );
}

function Planter({ position }) {
  return (
    <group position={position}>
      {/* pot */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.8, 18]} />
        <meshStandardMaterial color="#4A2F62" />
      </mesh>
      {/* leaves — six fronds */}
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2;
        const lean = 0.4 + (i % 2) * 0.2;
        return (
          <group key={i} position={[Math.cos(a) * 0.18, 0.85, Math.sin(a) * 0.18]} rotation={[Math.cos(a) * lean, 0, Math.sin(a) * lean]}>
            <mesh position={[0, 0.6, 0]}>
              <coneGeometry args={[0.2, 1.4, 6]} />
              <meshStandardMaterial color="#3D5C3A" />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.5, 18, 14]} />
        <meshStandardMaterial color="#4F7A4A" />
      </mesh>
    </group>
  );
}

function FloorPouf({ position, color, r = 0.55 }) {
  return (
    <RoundedBox args={[r * 1.5, 0.32, r * 1.5]} radius={0.16} position={[position[0], 0.16, position[2]]} castShadow>
      <meshStandardMaterial color={color} roughness={0.95} />
    </RoundedBox>
  );
}
