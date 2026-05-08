'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useArthStore } from '@/lib/store';

/* ================================================================
 * SO JAO LOUNGE
 * Architectural design bible:
 *   - Deep plum #3B2446 main walls, soft mauve #7B5A8C side panels
 *   - Sheer drapes #C8A6C9 / #E7B8C7 in gathered swags
 *   - Dusty-rose chaise #C58AA0 with cushions in lavender / blush /
 *     plum / peach / cream
 *   - Smoky lavender rug #A17A9B with warm-amber LED border
 *   - Warm amber lighting #FFB86B, moon-cream accents #FFF1CC,
 *     walnut wood #8B5A3C, brushed-gold trim #D6A85A
 *   - Curved header arch with thickness + bevel + glowing gold inner edge
 *   - Layered drapes, tiny fairy lights, hanging stars at varied heights
 *   - Polished plum floor with subtle reflection
 *   - Almost no visible text inside the room — meaning lives in
 *     furniture, lighting, props, materials, icons, and hotspots.
 * ================================================================ */

const PALETTE = {
  wallDeep:        '#3B2446',
  wallMauve:       '#7B5A8C',
  drapeLavender:   '#C8A6C9',
  drapeBlush:      '#E7B8C7',
  couchRose:       '#C58AA0',
  couchRoseDark:   '#A0697F',
  rug:             '#A17A9B',
  rugDark:         '#7E5C7A',
  amber:           '#FFB86B',
  moon:            '#FFF1CC',
  walnut:          '#8B5A3C',
  walnutDark:      '#5A3A26',
  gold:            '#D6A85A',
  goldGlow:        '#F2C77F',
  ink:             '#1F1228',
  cushionLavender: '#B8A0C9',
  cushionBlush:    '#E2A6B0',
  cushionPlum:     '#5C3F5E',
  cushionPeach:    '#F0BC8C',
  cushionCream:    '#F2DBC7',
};

const MOOD_TINTS = {
  warm:      { fill: '#FFB86B', wash: '#FFE7B8', intensity: 1.05 },
  rain:      { fill: '#7A6FA8', wash: '#A8B6CF', intensity: 0.85 },
  moonlight: { fill: '#7B86C0', wash: '#C9D5F0', intensity: 0.85 },
  calm:      { fill: '#9D8FB8', wash: '#C9B8E0', intensity: 0.9 },
  focus:     { fill: '#C9B8E0', wash: '#FBF4EC', intensity: 0.85 },
};

/* ---------- shape helpers ---------- */

function buildArchFrameShape(W, H, T) {
  const arO = W / 2;
  const innerW = W - T * 2;
  const innerH = H - T;
  const arI = innerW / 2;

  const shape = new THREE.Shape();
  shape.moveTo(-W / 2, 0);
  shape.lineTo(-W / 2, H - arO);
  shape.absarc(0, H - arO, arO, Math.PI, 0, false);
  shape.lineTo(W / 2, 0);
  shape.lineTo(-W / 2, 0);

  const hole = new THREE.Path();
  hole.moveTo(-innerW / 2, 0);
  hole.lineTo(-innerW / 2, innerH - arI);
  hole.absarc(0, innerH - arI, arI, Math.PI, 0, false);
  hole.lineTo(innerW / 2, 0);
  hole.lineTo(-innerW / 2, 0);
  shape.holes.push(hole);
  return shape;
}

function buildArchSolidShape(W, H) {
  const ar = W / 2;
  const s = new THREE.Shape();
  s.moveTo(-W / 2, 0);
  s.lineTo(-W / 2, H - ar);
  s.absarc(0, H - ar, ar, Math.PI, 0, false);
  s.lineTo(W / 2, 0);
  s.lineTo(-W / 2, 0);
  return s;
}

function buildSwagShape(W, H, dip) {
  const s = new THREE.Shape();
  s.moveTo(-W / 2, H);
  s.lineTo(W / 2, H);
  s.lineTo(W / 2, 0);
  s.bezierCurveTo(W / 4, -dip, -W / 4, -dip, -W / 2, 0);
  s.lineTo(-W / 2, H);
  return s;
}

/* =====================================================
 * ROOT
 * ===================================================== */
export default function SoJaoLounge() {
  const setOpenHotspot = useArthStore((s) => s.setOpenHotspot);
  const selectedMood = useArthStore((s) => s.selectedMood) || 'warm';
  const setSelectedMood = useArthStore((s) => s.setSelectedMood);
  const tint = MOOD_TINTS[selectedMood] || MOOD_TINTS.warm;
  const open = (id) => setOpenHotspot({ boothId: 'sojao', hotspotId: id });

  return (
    <group>
      <Lighting tint={tint} />

      {/* ======= Architecture (booth shell) ======= */}
      <PolishedFloor />
      <BackWall />
      <SideWall side="left" />
      <SideWall side="right" />
      <DrapeSwags />
      <FairyLightField />
      <HangingStars />
      <BackLotusEmblem />
      <HeaderArchFrame />

      {/* ======= Center installation ======= */}
      <RugAndLED />
      <Chaise position={[0, 0, 0.4]} />
      <CushionGroup />
      <ThrowBlanket />
      <FloorTray position={[-0.3, 0.06, 1.55]} />
      <OpenJournal position={[0.55, 0.06, 1.85]} />
      <SideTable position={[2.2, 0, 0.35]} />
      <MoonLamp position={[2.2, 1.05, 0.35]} />
      <SaltLamp position={[-2.4, 0.0, 0.6]} />

      {/* ======= Stations (mounted in front of side walls) ======= */}
      <PinboardKiosk position={[-5.2, 0, -1.9]} onClick={() => open('whatkeepsyouawake')} />
      <RitualKiosk position={[-3.4, 0, -2.05]} onPick={(id) => open(`ritual_${id}`)} />
      <MoodKiosk
        position={[3.4, 0, -2.05]}
        selectedMood={selectedMood}
        onPick={(id) => {
          setSelectedMood(id);
          open(`mood_${id}`);
        }}
      />
      <SupportKiosk position={[5.2, 0, -1.9]} onClick={() => open('sleepsupport')} />

      {/* ======= Foreground props ======= */}
      <PhoneBasket position={[-4.1, 0, 2.4]} onClick={() => open('phoneparking')} />
      <SleepCircleSign position={[4.6, 0, 2.4]} onClick={() => open('joincircle')} />

      {/* ======= Ambient props ======= */}
      <FloorLamp position={[-6.4, 0, 2.4]} />
      <FloorLamp position={[6.4, 0, 2.4]} />
      <Planter position={[-6.6, 0, -0.4]} />
      <Planter position={[6.6, 0, -0.4]} />
    </group>
  );
}

/* =====================================================
 * LIGHTING (mood-tintable)
 * ===================================================== */
function Lighting({ tint }) {
  const fillRef = useRef();
  const accentRef = useRef();
  useFrame(() => {
    if (fillRef.current) {
      fillRef.current.color.set(tint.fill);
      fillRef.current.intensity = tint.intensity;
    }
    if (accentRef.current) accentRef.current.color.set(tint.wash);
  });
  return (
    <>
      <ambientLight intensity={0.32} color="#5B3A78" />
      <hemisphereLight intensity={0.28} color="#FFE7B8" groundColor="#1F1228" />

      {/* warm key, hidden inside header arch */}
      <pointLight ref={fillRef} position={[0, 5.4, 1.5]} intensity={1.05} color={tint.fill} distance={20} castShadow />

      {/* moon-side cool accent */}
      <pointLight ref={accentRef} position={[2.4, 2.2, 1]} intensity={1.2} color={tint.wash} distance={9} />

      {/* salt lamp warm wash */}
      <pointLight position={[-2.4, 1.0, 0.8]} intensity={0.95} color="#FFA162" distance={7} />

      {/* footlights */}
      <pointLight position={[-4.1, 0.4, 2.6]} intensity={0.55} color={PALETTE.amber} distance={5} />
      <pointLight position={[4.6, 0.5, 2.6]} intensity={0.55} color="#F3A6B0" distance={5} />

      {/* soft fill behind drapes */}
      <pointLight position={[0, 3.0, -3.0]} intensity={0.75} color="#FFD8A3" distance={9} />
      <pointLight position={[-3.6, 2.8, -2.9]} intensity={0.45} color="#E2A6E0" distance={6} />
      <pointLight position={[3.6, 2.8, -2.9]} intensity={0.45} color="#E2A6E0" distance={6} />
    </>
  );
}

/* =====================================================
 * BOOTH SHELL — floor / walls / drapes / arch
 * ===================================================== */

function PolishedFloor() {
  return (
    <group>
      {/* Defined booth floor — polished plum tile */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[14.4, 8.6]} />
        <meshStandardMaterial color="#2D1A38" roughness={0.42} metalness={0.25} />
      </mesh>
      {/* slightly lighter inner panel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[13, 7.4]} />
        <meshStandardMaterial color="#3D2658" roughness={0.4} metalness={0.32} />
      </mesh>
      {/* radial highlight under the central rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.007, 0.4]}>
        <circleGeometry args={[3.6, 64]} />
        <meshStandardMaterial color="#4A2F62" roughness={0.4} metalness={0.2} transparent opacity={0.55} />
      </mesh>
      {/* subtle warm rim along the floor's front edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 3.6]}>
        <planeGeometry args={[12.6, 0.06]} />
        <meshStandardMaterial color={PALETTE.amber} emissive={PALETTE.amber} emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
    </group>
  );
}

function BackWall() {
  return (
    <group position={[0, 3.4, -3.5]}>
      {/* Solid plum back wall */}
      <mesh receiveShadow>
        <planeGeometry args={[14.4, 6.8]} />
        <meshStandardMaterial color={PALETTE.wallDeep} roughness={0.95} />
      </mesh>
      {/* very subtle inner panel */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[12.5, 5.6]} />
        <meshStandardMaterial color="#321D3D" roughness={0.95} />
      </mesh>
    </group>
  );
}

function SideWall({ side }) {
  // Tall rounded mauve wall, with a thin gold trim on the inward-facing edge.
  const x = side === 'left' ? -7.0 : 7.0;
  const trimX = side === 'left' ? 0.18 : -0.18;
  return (
    <group position={[x, 0, -1.6]}>
      <RoundedBox args={[0.6, 5.8, 3.6]} radius={0.5} smoothness={4} position={[0, 2.9, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={PALETTE.wallMauve} roughness={0.92} />
      </RoundedBox>
      {/* thin gold trim along the inside vertical edge */}
      <mesh position={[trimX, 2.6, 1.78]}>
        <boxGeometry args={[0.04, 5.0, 0.06]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.7} roughness={0.35} emissive={PALETTE.gold} emissiveIntensity={0.4} toneMapped={false} />
      </mesh>
      {/* matching trim along the back edge */}
      <mesh position={[trimX, 2.6, -1.78]}>
        <boxGeometry args={[0.04, 5.0, 0.06]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.7} roughness={0.35} emissive={PALETTE.gold} emissiveIntensity={0.3} toneMapped={false} />
      </mesh>
    </group>
  );
}

function HeaderArchFrame() {
  // Curved portal arch with thickness + bevel + glowing gold inner trim.
  const W = 14.4;
  const H = 7.4;
  const T = 0.7;

  const frameGeom = useMemo(
    () =>
      new THREE.ExtrudeGeometry(buildArchFrameShape(W, H, T), {
        depth: 0.85,
        bevelEnabled: true,
        bevelThickness: 0.09,
        bevelSize: 0.09,
        bevelSegments: 4,
      }),
    []
  );

  // A slightly inner gold trim — outline of the inner arch
  const trimGeom = useMemo(() => {
    const innerW = W - T * 2 - 0.04;
    const innerH = H - T - 0.02;
    const arI = innerW / 2;
    const innerWP = innerW + 0.18;
    const innerHP = innerH + 0.09;
    const arIP = innerWP / 2;
    const s = new THREE.Shape();
    s.moveTo(-innerWP / 2, 0);
    s.lineTo(-innerWP / 2, innerHP - arIP);
    s.absarc(0, innerHP - arIP, arIP, Math.PI, 0, false);
    s.lineTo(innerWP / 2, 0);
    s.lineTo(-innerWP / 2, 0);
    const hole = new THREE.Path();
    hole.moveTo(-innerW / 2, 0);
    hole.lineTo(-innerW / 2, innerH - arI);
    hole.absarc(0, innerH - arI, arI, Math.PI, 0, false);
    hole.lineTo(innerW / 2, 0);
    hole.lineTo(-innerW / 2, 0);
    s.holes.push(hole);
    return new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: false });
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* main plum frame */}
      <mesh geometry={frameGeom} castShadow receiveShadow>
        <meshStandardMaterial color={PALETTE.wallDeep} roughness={0.85} />
      </mesh>
      {/* glowing inner gold trim */}
      <mesh geometry={trimGeom} position={[0, 0, 0.92]}>
        <meshStandardMaterial color={PALETTE.gold} metalness={0.8} roughness={0.32} emissive={PALETTE.goldGlow} emissiveIntensity={0.55} toneMapped={false} />
      </mesh>

      {/* tiny gold lotus + tiny stars at the top of the arch */}
      <Text position={[0, H - 0.55, 0.95]} fontSize={0.32} color={PALETTE.gold} anchorX="center" anchorY="middle">
        ❋
      </Text>
      <Text position={[-0.85, H - 0.5, 0.95]} fontSize={0.16} color={PALETTE.goldGlow} anchorX="center" anchorY="middle">✦</Text>
      <Text position={[0.85, H - 0.5, 0.95]} fontSize={0.16} color={PALETTE.goldGlow} anchorX="center" anchorY="middle">✦</Text>

      {/* small elegant booth title — minimal text */}
      <Text position={[0, H - 1.05, 0.95]} fontSize={0.36} color={PALETTE.moon} anchorX="center" anchorY="middle" letterSpacing={-0.02}>
        So Jao Lounge
      </Text>
      <Text position={[0, H - 1.4, 0.95]} fontSize={0.15} color={PALETTE.gold} anchorX="center" anchorY="middle" letterSpacing={0.02}>
        sleep ritual sanctuary
      </Text>
    </group>
  );
}

/* =====================================================
 * Drapes, fairy lights, hanging stars, back lotus
 * ===================================================== */

function DrapeSwags() {
  // Top swag pelmet (4 bunches) + vertical sheer falls behind.
  const swag = (x, w, dip, c, opacity = 0.78) => {
    const geom = new THREE.ExtrudeGeometry(buildSwagShape(w, 1.4, dip), { depth: 0.06, bevelEnabled: false });
    return (
      <mesh key={`swag-${x}`} geometry={geom} position={[x, 5.2, -3.32]}>
        <meshStandardMaterial color={c} side={THREE.DoubleSide} transparent opacity={opacity} roughness={0.92} />
      </mesh>
    );
  };

  // Vertical fall — a sheer panel hanging from the swag down to floor
  const fall = (x, w, c, opacity = 0.55, height = 5.2, zOffset = 0) => (
    <mesh key={`fall-${x}`} position={[x, height / 2 + 0.05, -3.28 + zOffset]}>
      <planeGeometry args={[w, height]} />
      <meshStandardMaterial color={c} side={THREE.DoubleSide} transparent opacity={opacity} roughness={0.92} />
    </mesh>
  );

  return (
    <group>
      {/* Top horizontal swags */}
      {swag(-4.5, 3.2, 0.85, PALETTE.drapeBlush, 0.85)}
      {swag(-1.5, 3.2, 0.95, PALETTE.drapeLavender, 0.85)}
      {swag(1.5, 3.2, 0.95, PALETTE.drapeLavender, 0.85)}
      {swag(4.5, 3.2, 0.85, PALETTE.drapeBlush, 0.85)}

      {/* Vertical falls behind the chaise area */}
      {fall(-5.2, 1.6, PALETTE.drapeLavender, 0.5, 5.2, -0.05)}
      {fall(-3.5, 1.4, PALETTE.drapeBlush, 0.55, 5.2, -0.02)}
      {fall(-2.0, 1.4, PALETTE.drapeLavender, 0.5, 5.2, 0)}
      {fall(-0.7, 1.5, PALETTE.drapeBlush, 0.45, 5.2, -0.04)}
      {fall(0.7, 1.5, PALETTE.drapeBlush, 0.45, 5.2, -0.04)}
      {fall(2.0, 1.4, PALETTE.drapeLavender, 0.5, 5.2, 0)}
      {fall(3.5, 1.4, PALETTE.drapeBlush, 0.55, 5.2, -0.02)}
      {fall(5.2, 1.6, PALETTE.drapeLavender, 0.5, 5.2, -0.05)}
    </group>
  );
}

function FairyLightField() {
  // Many tiny warm dots scattered behind/inside the curtains.
  const dots = useMemo(() => {
    const out = [];
    const rng = mulberry32(8123);
    for (let i = 0; i < 110; i++) {
      const x = (rng() - 0.5) * 11;
      const y = 0.5 + rng() * 4.6;
      const z = -3.36 + (rng() - 0.5) * 0.16;
      const phase = rng() * Math.PI * 2;
      out.push({ x, y, z, phase });
    }
    return out;
  }, []);

  const groupRef = useRef();
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((m, i) => {
      m.material.emissiveIntensity = 0.65 + Math.sin(t * 1.6 + dots[i].phase) * 0.32;
    });
  });

  return (
    <group ref={groupRef}>
      {dots.map((d, i) => (
        <mesh key={i} position={[d.x, d.y, d.z]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color={PALETTE.moon} emissive={PALETTE.amber} emissiveIntensity={0.85} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function HangingStars() {
  const stars = useMemo(() => {
    const rng = mulberry32(4421);
    const out = [];
    for (let i = 0; i < 11; i++) {
      const x = (rng() - 0.5) * 10;
      const y = 1.6 + rng() * 3.2;
      out.push({ x, y, drop: y + 0.2, phase: rng() * Math.PI * 2 });
    }
    return out;
  }, []);
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.children.forEach((g, i) => {
      g.position.y = stars[i].y + Math.sin(t * 0.6 + stars[i].phase) * 0.07;
      g.rotation.z = Math.sin(t * 0.4 + stars[i].phase) * 0.15;
    });
  });
  return (
    <group ref={ref}>
      {stars.map((p, i) => (
        <group key={i} position={[p.x, p.y, -3.18]}>
          {/* hanging string */}
          <mesh position={[0, (5.6 - p.y) / 2, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 5.6 - p.y, 4]} />
            <meshStandardMaterial color="#5C4060" />
          </mesh>
          {/* star ornament */}
          <Text fontSize={0.32} color={PALETTE.gold} anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor={PALETTE.goldGlow}>
            ✦
          </Text>
        </group>
      ))}
    </group>
  );
}

function BackLotusEmblem() {
  // Faint gold lotus on the back wall, between the drapes
  return (
    <group position={[0, 2.5, -3.46]}>
      <Text fontSize={1.3} color={PALETTE.gold} anchorX="center" anchorY="middle" outlineWidth={0.018} outlineColor={PALETTE.goldGlow}>
        ❋
      </Text>
    </group>
  );
}

/* =====================================================
 * RUG + GLOWING LED STRIP
 * ===================================================== */
function RugAndLED() {
  const ledRef = useRef();
  useFrame((s) => {
    if (!ledRef.current) return;
    ledRef.current.material.emissiveIntensity = 1.1 + Math.sin(s.clock.elapsedTime * 1.2) * 0.18;
  });
  return (
    <group position={[0, 0, 0.6]}>
      {/* Plush rug — circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.013, 0]} receiveShadow>
        <circleGeometry args={[3.0, 64]} />
        <meshStandardMaterial color={PALETTE.rug} roughness={1} />
      </mesh>
      {/* darker inner ring for plush layering */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, 0]}>
        <ringGeometry args={[2.55, 2.7, 64]} />
        <meshStandardMaterial color={PALETTE.rugDark} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[1.4, 1.5, 64]} />
        <meshStandardMaterial color={PALETTE.rugDark} roughness={1} />
      </mesh>
      {/* Warm LED border */}
      <mesh ref={ledRef} position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.05, 3.18, 96]} />
        <meshStandardMaterial color={PALETTE.amber} emissive={PALETTE.amber} emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
      {/* Extra tiny LED bumps along the strip for sparkle */}
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 3.12, 0.02, Math.sin(a) * 3.12]}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshStandardMaterial color={PALETTE.moon} emissive={PALETTE.moon} emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

/* =====================================================
 * Center furniture — chaise, cushions, throw, side props
 * ===================================================== */

function Chaise({ position }) {
  return (
    <group position={position}>
      {/* short walnut legs */}
      {[-1.05, 0, 1.05].map((x, i) => (
        <mesh key={i} position={[x, 0.13, 0]}>
          <cylinderGeometry args={[0.06, 0.05, 0.26, 12]} />
          <meshStandardMaterial color={PALETTE.walnutDark} />
        </mesh>
      ))}
      {/* base seat */}
      <RoundedBox args={[3.0, 0.55, 1.5]} radius={0.18} position={[0, 0.55, 0]} castShadow>
        <meshStandardMaterial color={PALETTE.couchRose} roughness={0.95} />
      </RoundedBox>
      {/* head bolster (left) */}
      <RoundedBox args={[1.05, 1.15, 1.5]} radius={0.22} position={[-0.95, 1.25, -0.1]} castShadow>
        <meshStandardMaterial color={PALETTE.couchRose} roughness={0.95} />
      </RoundedBox>
      {/* low back rest (right) */}
      <RoundedBox args={[2.0, 0.5, 1.4]} radius={0.18} position={[0.55, 0.95, -0.45]} castShadow>
        <meshStandardMaterial color={PALETTE.couchRoseDark} roughness={0.95} />
      </RoundedBox>
      {/* tiny foot lights under the chaise */}
      <mesh position={[0, 0.04, 0.6]}>
        <boxGeometry args={[2.6, 0.02, 0.06]} />
        <meshStandardMaterial color={PALETTE.amber} emissive={PALETTE.amber} emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
    </group>
  );
}

function CushionGroup() {
  const cs = [
    { p: [-0.85, 1.12, 0.0], s: 0.55, c: PALETTE.cushionBlush },
    { p: [-0.2, 1.05, 0.05], s: 0.5, c: PALETTE.cushionLavender },
    { p: [0.4, 1.05, 0.0], s: 0.48, c: PALETTE.cushionPlum },
    { p: [0.95, 1.05, 0.05], s: 0.46, c: PALETTE.cushionPeach },
    { p: [0.0, 1.0, 0.5], s: 0.36, c: PALETTE.cushionCream },
  ];
  return (
    <group position={[0, 0, 0.4]}>
      {cs.map((c, i) => (
        <RoundedBox key={i} args={[c.s, c.s * 0.7, c.s]} radius={0.06} position={c.p} castShadow>
          <meshStandardMaterial color={c.c} roughness={0.95} />
        </RoundedBox>
      ))}
    </group>
  );
}

function ThrowBlanket() {
  // Simple folded blanket draped over the right end of the chaise
  return (
    <group position={[1.2, 0, 0.4]}>
      <mesh position={[0, 0.85, 0.45]} rotation={[0.2, 0, -0.18]}>
        <boxGeometry args={[1.2, 0.05, 1.8]} />
        <meshStandardMaterial color={PALETTE.cushionLavender} roughness={0.95} />
      </mesh>
      <mesh position={[0.4, 0.55, 0.65]} rotation={[0.6, 0, -0.1]}>
        <boxGeometry args={[0.46, 0.05, 1.6]} />
        <meshStandardMaterial color={PALETTE.cushionLavender} roughness={0.95} />
      </mesh>
    </group>
  );
}

function FloorTray({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.8, 0.04, 0.5]} />
        <meshStandardMaterial color={PALETTE.walnut} roughness={0.7} />
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
        <meshStandardMaterial color={PALETTE.cushionCream} />
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
      <meshStandardMaterial color={PALETTE.moon} emissive={PALETTE.amber} emissiveIntensity={1.4} toneMapped={false} />
    </mesh>
  );
}

function OpenJournal({ position }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0.18]} position={[-0.18, 0, 0]}>
        <planeGeometry args={[0.42, 0.55]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, -0.18]} position={[0.18, 0, 0]}>
        <planeGeometry args={[0.42, 0.55]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[0.04, 0.55]} />
        <meshStandardMaterial color={PALETTE.cushionLavender} />
      </mesh>
    </group>
  );
}

function SideTable({ position }) {
  return (
    <group position={position}>
      {/* slatted walnut barrel */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.45, 0.5, 1.0, 24]} />
        <meshStandardMaterial color={PALETTE.walnut} roughness={0.85} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.51, 0.5, Math.sin(a) * 0.51]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.02, 0.95, 0.02]} />
            <meshStandardMaterial color={PALETTE.walnutDark} />
          </mesh>
        );
      })}
      <mesh position={[0, 1.02, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.06, 24]} />
        <meshStandardMaterial color={PALETTE.cushionCream} roughness={0.8} />
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
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.08, 18]} />
        <meshStandardMaterial color={PALETTE.walnutDark} />
      </mesh>
      <mesh ref={ref} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.42, 32, 24]} />
        <meshStandardMaterial color={PALETTE.moon} emissive={PALETTE.moon} emissiveIntensity={1.05} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={0.65} color={PALETTE.moon} distance={4.5} />
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
      {/* small wooden stool */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.6, 0.5]} />
        <meshStandardMaterial color={PALETTE.walnut} />
      </mesh>
      {/* base */}
      <mesh position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.08, 16]} />
        <meshStandardMaterial color={PALETTE.walnutDark} />
      </mesh>
      <mesh ref={ref} position={[0, 0.95, 0]}>
        <dodecahedronGeometry args={[0.28, 0]} />
        <meshStandardMaterial color="#FFA86B" emissive="#FF9650" emissiveIntensity={1.0} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0.95, 0]} intensity={0.45} color="#FFA162" distance={3} />
    </group>
  );
}

/* =====================================================
 * STATIONS — minimal text, hover-tooltip discoverability
 * ===================================================== */

function StationFrame({
  width,
  height,
  depth = 0.18,
  color = PALETTE.wallMauve,
  trimColor = PALETTE.gold,
  iconChar,
  position,
  children,
  onClick,
  hoverLabel,
}) {
  const [hover, setHover] = useState(false);
  const geom = useMemo(
    () => new THREE.ExtrudeGeometry(buildArchSolidShape(width, height), { depth, bevelEnabled: false }),
    [width, height, depth]
  );
  const trimGeom = useMemo(
    () =>
      new THREE.ExtrudeGeometry(buildArchSolidShape(width + 0.08, height + 0.06), {
        depth: depth * 0.4,
        bevelEnabled: false,
      }),
    [width, height, depth]
  );
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
      onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}
    >
      {/* trim outline */}
      <mesh geometry={trimGeom} position={[-0.04, -0.03, -0.02]}>
        <meshStandardMaterial color={trimColor} metalness={0.6} roughness={0.4} emissive={trimColor} emissiveIntensity={hover ? 0.6 : 0.18} toneMapped={false} />
      </mesh>
      {/* panel */}
      <mesh geometry={geom} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.92} />
      </mesh>
      {/* small gold icon at the very top */}
      {iconChar && (
        <Text position={[0, height - 0.4, depth + 0.01]} fontSize={0.32} color={PALETTE.gold} anchorX="center" anchorY="middle" outlineWidth={0.008} outlineColor={PALETTE.goldGlow}>
          {iconChar}
        </Text>
      )}
      {children}
      {/* hover tooltip via HTML — only minimal label */}
      {hover && hoverLabel && (
        <Html position={[0, height + 0.35, depth]} center distanceFactor={9} pointerEvents="none">
          <div className="px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap pointer-events-none"
            style={{ background: 'rgba(31,18,40,0.85)', color: '#FFE7B8', backdropFilter: 'blur(6px)', border: '1px solid rgba(214,168,90,0.5)' }}>
            {hoverLabel}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ----- Pinboard kiosk (no header text — just board + notes) ----- */
function PinboardKiosk({ position, onClick }) {
  return (
    <StationFrame
      position={position}
      width={2.9}
      height={4.6}
      iconChar="☾"
      hoverLabel="What keeps you awake?"
      onClick={onClick}
      color={PALETTE.wallMauve}
    >
      {/* corkboard */}
      <mesh position={[0, 2.1, 0.2]}>
        <planeGeometry args={[2.4, 2.4]} />
        <meshStandardMaterial color="#7A5841" roughness={1} />
      </mesh>
      {/* sticky notes — short fragments like a real pinboard */}
      {[
        { x: -0.78, y: 2.95, c: '#FBE2C2', t: 'one more reel…', r: -0.06 },
        { x: 0.0, y: 3.0, c: '#F3A6B0', t: 'overthinking', r: 0.04 },
        { x: 0.78, y: 2.92, c: '#C9B8E0', t: 'work stress', r: -0.03 },
        { x: -0.55, y: 2.2, c: '#F3A6B0', t: 'can’t switch off', r: 0.05 },
        { x: 0.55, y: 2.18, c: '#FBE2C2', t: '1 am brain', r: -0.06 },
        { x: 0.0, y: 1.45, c: '#C9B8E0', t: 'sleepy all day', r: 0.04 },
      ].map((n, i) => (
        <group key={i} position={[n.x, n.y, 0.21]} rotation={[0, 0, n.r]}>
          <mesh>
            <planeGeometry args={[0.66, 0.5]} />
            <meshStandardMaterial color={n.c} roughness={0.85} />
          </mesh>
          {/* pin */}
          <mesh position={[0, 0.21, 0.02]}>
            <sphereGeometry args={[0.025, 10, 8]} />
            <meshStandardMaterial color={PALETTE.gold} metalness={0.7} />
          </mesh>
          <Text position={[0, 0, 0.01]} fontSize={0.075} color={PALETTE.ink} anchorX="center" anchorY="middle" maxWidth={0.6} textAlign="center">
            {n.t}
          </Text>
        </group>
      ))}
      {/* tiny reaction chips */}
      {['❤', '✦', '◐'].map((g, i) => (
        <mesh key={i} position={[(i - 1) * 0.5, 0.7, 0.21]}>
          <circleGeometry args={[0.18, 24]} />
          <meshStandardMaterial color={i === 1 ? PALETTE.amber : '#9D8FB8'} emissive={i === 1 ? PALETTE.amber : '#9D8FB8'} emissiveIntensity={0.45} toneMapped={false} />
        </mesh>
      ))}
      {['❤', '✦', '◐'].map((g, i) => (
        <Text key={`g${i}`} position={[(i - 1) * 0.5, 0.7, 0.23]} fontSize={0.18} color="#FBF4EC" anchorX="center" anchorY="middle">
          {g}
        </Text>
      ))}
    </StationFrame>
  );
}

/* ----- Pick a ritual (5 wooden medallions) ----- */
function RitualKiosk({ position, onPick }) {
  const items = [
    { id: 'breathe', icon: '∿', label: 'Breathe' },
    { id: 'journal', icon: '✎', label: 'Journal' },
    { id: 'stretch', icon: '✦', label: 'Stretch' },
    { id: 'sip',     icon: '☕', label: 'Sip' },
    { id: 'dim',     icon: '☾', label: 'Dim' },
  ];
  return (
    <StationFrame
      position={position}
      width={1.55}
      height={4.6}
      iconChar="❋"
      hoverLabel="Pick a ritual"
      color="#34204A"
    >
      {items.map((it, i) => (
        <RitualMedallion
          key={it.id}
          y={3.55 - i * 0.65}
          icon={it.icon}
          label={it.label}
          onClick={() => onPick(it.id)}
        />
      ))}
      <LavenderSprig position={[0, 0.42, 0.21]} />
    </StationFrame>
  );
}

function RitualMedallion({ y, icon, label, onClick }) {
  const [hover, setHover] = useState(false);
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.material.emissiveIntensity = (hover ? 1.3 : 0.5) + Math.sin(s.clock.elapsedTime * 1.3 + y) * 0.18;
  });
  return (
    <group
      position={[0, y, 0.22]}
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
      {/* wooden disc */}
      <mesh>
        <cylinderGeometry args={[0.28, 0.28, 0.05, 32]} />
        <meshStandardMaterial color={PALETTE.walnut} roughness={0.7} />
      </mesh>
      {/* gold ring */}
      <mesh ref={ref} position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.27, 32]} />
        <meshStandardMaterial color={PALETTE.gold} emissive={PALETTE.goldGlow} emissiveIntensity={hover ? 1.2 : 0.5} toneMapped={false} />
      </mesh>
      {/* icon */}
      <Text position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.24} color={PALETTE.goldGlow} anchorX="center" anchorY="middle">
        {icon}
      </Text>
      {hover && (
        <Html position={[0.7, 0, 0]} center distanceFactor={9} pointerEvents="none">
          <div className="px-3 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap pointer-events-none"
            style={{ background: 'rgba(31,18,40,0.85)', color: '#FFE7B8', backdropFilter: 'blur(6px)', border: '1px solid rgba(214,168,90,0.5)' }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

function LavenderSprig({ position }) {
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

/* ----- Mood / Sleep Sounds (5 circular buttons) ----- */
function MoodKiosk({ position, selectedMood, onPick }) {
  const moods = [
    { id: 'rain', icon: '☂', label: 'Rain', color: '#7BA8C8' },
    { id: 'moonlight', icon: '☾', label: 'Moonlight', color: '#9C8FC8' },
    { id: 'warm', icon: '✿', label: 'Warm hush', color: '#F3A6B0' },
    { id: 'calm', icon: '◉', label: 'Deep calm', color: '#C9B8E0' },
    { id: 'focus', icon: '∿', label: 'Quiet focus', color: '#BFE3D7' },
  ];
  return (
    <StationFrame
      position={position}
      width={1.55}
      height={4.6}
      iconChar="♪"
      hoverLabel="Mood / Sleep Sounds"
      color="#34204A"
    >
      {moods.map((m, i) => (
        <MoodButton
          key={m.id}
          y={3.55 - i * 0.65}
          icon={m.icon}
          label={m.label}
          color={m.color}
          isSelected={selectedMood === m.id}
          onSelect={() => onPick(m.id)}
        />
      ))}
    </StationFrame>
  );
}

function MoodButton({ y, icon, label, color, isSelected, onSelect }) {
  const [hover, setHover] = useState(false);
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.material.emissiveIntensity = (isSelected ? 1.4 : hover ? 1.0 : 0.5) + Math.sin(s.clock.elapsedTime * 1.4 + y) * 0.15;
  });
  return (
    <group
      position={[0, y, 0.22]}
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
      <mesh>
        <circleGeometry args={[0.27, 28]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isSelected ? 1.0 : 0.32} toneMapped={false} transparent opacity={0.95} />
      </mesh>
      <mesh ref={ref} position={[0, 0, 0.005]}>
        <ringGeometry args={[0.29, 0.33, 28]} />
        <meshStandardMaterial color={isSelected ? PALETTE.gold : color} emissive={isSelected ? PALETTE.goldGlow : color} emissiveIntensity={isSelected ? 1.4 : 0.5} toneMapped={false} />
      </mesh>
      <Text position={[0, 0, 0.02]} fontSize={0.22} color={isSelected ? PALETTE.gold : '#FBF4EC'} anchorX="center" anchorY="middle">
        {icon}
      </Text>
      {hover && (
        <Html position={[0.7, 0, 0]} center distanceFactor={9} pointerEvents="none">
          <div className="px-3 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap pointer-events-none"
            style={{ background: 'rgba(31,18,40,0.85)', color: '#FFE7B8', backdropFilter: 'blur(6px)', border: '1px solid rgba(214,168,90,0.5)' }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ----- Sleep Support shelf ----- */
function SupportKiosk({ position, onClick }) {
  return (
    <StationFrame
      position={position}
      width={2.9}
      height={4.6}
      iconChar="❋"
      hoverLabel="Sleep Support"
      onClick={onClick}
    >
      {/* two wooden shelves */}
      <Shelf y={2.65} />
      <Shelf y={1.4} />
      {/* top shelf items */}
      <Diffuser position={[-0.85, 2.78, 0.22]} />
      <Bottle position={[-0.15, 2.78, 0.22]} color={PALETTE.cushionCream} cap={PALETTE.walnutDark} />
      <Bottle position={[0.32, 2.78, 0.22]} color="#FBF4EC" cap={PALETTE.walnutDark} />
      <Bottle position={[0.82, 2.78, 0.22]} color="#E2D2EE" cap={PALETTE.walnutDark} />
      <LavenderSprig position={[1.05, 2.74, 0.22]} />
      {/* bottom shelf items */}
      <Bottle position={[-0.95, 1.55, 0.22]} color={PALETTE.cushionCream} cap={PALETTE.walnutDark} small />
      <Candle position={[-0.4, 1.5, 0.22]} />
      <Bottle position={[0.18, 1.55, 0.22]} color="#FBF4EC" cap={PALETTE.walnutDark} small />
      <Candle position={[0.7, 1.5, 0.22]} />
      <LavenderSprig position={[1.0, 1.46, 0.22]} />
    </StationFrame>
  );
}

function Shelf({ y }) {
  return (
    <mesh position={[0, y, 0.21]}>
      <boxGeometry args={[2.2, 0.07, 0.5]} />
      <meshStandardMaterial color={PALETTE.walnut} roughness={0.7} />
    </mesh>
  );
}

function Bottle({ position, color, cap, small = false }) {
  const h = small ? 0.42 : 0.54;
  const r = small ? 0.07 : 0.09;
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[r, r, h, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, h + 0.05, 0]}>
        <cylinderGeometry args={[r * 0.55, r * 0.6, 0.1, 12]} />
        <meshStandardMaterial color={cap} />
      </mesh>
    </group>
  );
}

function Diffuser({ position }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.material.emissiveIntensity = 0.6 + Math.sin(s.clock.elapsedTime * 1.4) * 0.25;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.22, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        <meshStandardMaterial color={PALETTE.cushionCream} roughness={0.5} />
      </mesh>
      <mesh ref={ref} position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.16, 16, 12]} />
        <meshStandardMaterial color="#E0D6F0" emissive="#E0D6F0" emissiveIntensity={0.6} transparent opacity={0.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Candle({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.24, 16]} />
        <meshStandardMaterial color={PALETTE.cushionCream} />
      </mesh>
      <Flame position={[0, 0.3, 0]} />
    </group>
  );
}

/* =====================================================
 * Foreground props: phone basket + Sleep Circle sign
 * ===================================================== */

function PhoneBasket({ position, onClick }) {
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
      {/* basket body */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.65, 0.95, 32]} />
        <meshStandardMaterial color="#7A5841" roughness={0.95} />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[0, 0.18 + i * 0.13, 0]}>
          <torusGeometry args={[0.78 - i * 0.025, 0.02, 8, 32]} />
          <meshStandardMaterial color="#5B3A2A" roughness={0.9} />
        </mesh>
      ))}
      {/* handle */}
      <mesh position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.05, 10, 28, Math.PI]} />
        <meshStandardMaterial color="#5B3A2A" />
      </mesh>
      {/* draped throw */}
      <mesh position={[0, 0.95, 0.6]} rotation={[0.5, 0, 0]}>
        <planeGeometry args={[1.4, 0.7]} />
        <meshStandardMaterial color={PALETTE.cushionLavender} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* phones peeking out */}
      <Phone position={[-0.28, 1.2, 0.05]} screen="#7BA8C8" />
      <Phone position={[0, 1.25, 0.1]} screen="#F3A6B0" />
      <Phone position={[0.3, 1.2, 0.05]} screen="#C9B8E0" />
      {/* tiny phone icon glyph above to disambiguate without a label */}
      <Text position={[0, 1.6, 0.05]} fontSize={0.2} color={PALETTE.gold} anchorX="center" anchorY="middle" outlineWidth={0.005} outlineColor={PALETTE.goldGlow}>
        📱
      </Text>
      {hover && (
        <Html position={[0, 1.95, 0]} center distanceFactor={9} pointerEvents="none">
          <div className="px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap pointer-events-none"
            style={{ background: 'rgba(31,18,40,0.85)', color: '#FFE7B8', backdropFilter: 'blur(6px)', border: '1px solid rgba(214,168,90,0.5)' }}>
            Phone Parking
          </div>
        </Html>
      )}
      {hover && (
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.92, 0.72, 0.97, 32]} />
          <meshStandardMaterial color={PALETTE.amber} transparent opacity={0.18} emissive={PALETTE.amber} emissiveIntensity={0.7} />
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

function SleepCircleSign({ position, onClick }) {
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
        <meshStandardMaterial color={PALETTE.walnutDark} />
      </mesh>
      {/* back disc */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.08, 48]} />
        <meshStandardMaterial color="#34204A" roughness={0.7} />
      </mesh>
      {/* neon ring */}
      <mesh ref={ringRef} position={[0, 1.6, 0.05]}>
        <torusGeometry args={[0.85, 0.05, 14, 64]} />
        <meshStandardMaterial color={PALETTE.gold} emissive={PALETTE.goldGlow} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      {/* inner soft fill */}
      <mesh position={[0, 1.6, 0.04]}>
        <circleGeometry args={[0.85, 48]} />
        <meshStandardMaterial color="#5B3A78" emissive={PALETTE.gold} emissiveIntensity={0.18} toneMapped={false} />
      </mesh>
      {/* group icon */}
      <Text position={[0, 1.85, 0.06]} fontSize={0.22} color={PALETTE.goldGlow} anchorX="center" anchorY="middle">
        ❀❀❀
      </Text>
      {/* CTA text — kept because it's a sign */}
      <Text position={[0, 1.6, 0.06]} fontSize={0.2} color={PALETTE.moon} anchorX="center" anchorY="middle">
        Sleep Circle
      </Text>
      <Text position={[0, 1.32, 0.06]} fontSize={0.13} color={PALETTE.gold} anchorX="center" anchorY="middle">
        join the circle
      </Text>
      <Text position={[0, 1.08, 0.06]} fontSize={0.4} color={PALETTE.gold} anchorX="center" anchorY="middle">
        ❋
      </Text>
    </group>
  );
}

/* =====================================================
 * Floor lamps + planters
 * ===================================================== */
function FloorLamp({ position }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.material.emissiveIntensity = 0.85 + Math.sin(s.clock.elapsedTime * 0.9) * 0.18;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.1, 18]} />
        <meshStandardMaterial color={PALETTE.walnutDark} />
      </mesh>
      <mesh ref={ref} position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.32, 0.42, 1.2, 18]} />
        <meshStandardMaterial color="#8E5A3C" emissive={PALETTE.amber} emissiveIntensity={0.85} toneMapped={false} />
      </mesh>
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.43, 0.7, Math.sin(a) * 0.43]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.02, 1.18, 0.02]} />
            <meshStandardMaterial color={PALETTE.walnutDark} />
          </mesh>
        );
      })}
      <pointLight position={[0, 0.7, 0]} intensity={0.65} color={PALETTE.amber} distance={4.5} />
    </group>
  );
}

function Planter({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.8, 18]} />
        <meshStandardMaterial color="#3A2750" />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2;
        const lean = 0.4 + (i % 2) * 0.25;
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

/* =====================================================
 * tiny utils
 * ===================================================== */
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
