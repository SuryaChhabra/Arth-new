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
      <Chaise position={[0.45, 0, 0.25]} rotation={0.12} />
      <FloorCushions />
      <FloorTray position={[-0.55, 0.06, 1.55]} />
      <OpenJournal position={[0.55, 0.06, 1.95]} />
      <SideTable position={[2.5, 0, 0.5]} />
      <MoonLamp position={[2.4, 1.04, 0.45]} />
      <SideTableProps position={[2.5, 1.04, 0.5]} />
      <HangingLantern position={[3.6, 0, 0.0]} />
      <SaltLamp position={[-2.6, 0.0, 0.7]} />

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
      <LeafyPlant position={[-5.0, 0, 1.0]} />
      <SleepCircleSign position={[4.6, 0, 2.4]} onClick={() => open('joincircle')} />

      {/* ======= Ambient props ======= */}
      <FloorLamp position={[-6.0, 0, 2.6]} />
      <FloorLamp position={[6.4, 0, 2.4]} />
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

/* ----- Curved asymmetrical chaise lounge -----
 * Local frame:
 *   X: length of the chaise (head end at -1.5, foot end at +1.5)
 *   Y: vertical (floor at 0)
 *   Z: depth front-to-back (front toward camera = +Z, back = -Z)
 *
 * Composition:
 *   - upholstered base shell (curved 2D profile extruded with bevel)
 *   - soft seat cushion on top
 *   - long soft back cushion
 *   - rolled headrest cushion (capsule) at the head end
 *   - small foot armrest
 *   - 4 brass legs
 *   - 7 decorative pillows
 *   - dusty-lavender throw blanket layered on the head end
 */
function Chaise({ position, rotation = 0 }) {
  const profileGeom = useMemo(() => {
    const s = new THREE.Shape();
    // back-bottom-left (head end, back side)
    s.moveTo(-1.55, 0);
    // up the back of the headrest
    s.lineTo(-1.55, 0.95);
    // curl over the top
    s.bezierCurveTo(-1.55, 1.45, -1.2, 1.65, -0.85, 1.55);
    // inside of the curl
    s.bezierCurveTo(-0.55, 1.45, -0.5, 1.15, -0.5, 0.85);
    // back rest dips down to the seat
    s.lineTo(-0.5, 0.55);
    // along the seat top toward foot end
    s.lineTo(1.4, 0.55);
    // small rolled foot edge
    s.bezierCurveTo(1.55, 0.55, 1.62, 0.5, 1.6, 0.38);
    // down the front of the foot end
    s.lineTo(1.6, 0);
    // back along the floor
    s.lineTo(-1.55, 0);
    return new THREE.ExtrudeGeometry(s, {
      depth: 1.3,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 4,
    });
  }, []);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Upholstered curved base shell */}
      <mesh geometry={profileGeom} position={[0, 0, -0.65]} castShadow receiveShadow>
        <meshStandardMaterial color={PALETTE.couchRoseDark} roughness={0.95} />
      </mesh>

      {/* Soft seat cushion (sits on top of the base seat) */}
      <RoundedBox args={[2.5, 0.22, 1.25]} radius={0.12} position={[0.45, 0.7, 0.05]} castShadow>
        <meshStandardMaterial color={PALETTE.couchRose} roughness={0.96} />
      </RoundedBox>

      {/* Soft long back cushion */}
      <RoundedBox args={[2.0, 0.46, 0.35]} radius={0.16} position={[0.5, 0.95, -0.45]} castShadow>
        <meshStandardMaterial color={PALETTE.couchRose} roughness={0.96} />
      </RoundedBox>

      {/* Rolled headrest cushion — soft capsule at the curl */}
      <mesh position={[-1.05, 1.4, 0.0]} rotation={[Math.PI / 2, 0, 0.05]} castShadow>
        <capsuleGeometry args={[0.24, 0.85, 8, 16]} />
        <meshStandardMaterial color={PALETTE.couchRose} roughness={0.96} />
      </mesh>

      {/* Tiny foot armrest curl */}
      <mesh position={[1.5, 0.65, 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.95, 6, 14]} />
        <meshStandardMaterial color={PALETTE.couchRoseDark} roughness={0.95} />
      </mesh>

      {/* 4 short brass legs */}
      {[
        [-1.35, -0.5],
        [-1.35, 0.5],
        [1.4, -0.5],
        [1.4, 0.5],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.07, z]}>
          <cylinderGeometry args={[0.045, 0.035, 0.14, 12]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.35} />
        </mesh>
      ))}

      {/* 7 decorative pillows */}
      {/* 1. Large square in muted lavender */}
      <RoundedBox args={[0.62, 0.62, 0.18]} radius={0.06} position={[-0.55, 1.05, -0.18]} rotation={[0, 0, -0.05]} castShadow>
        <meshStandardMaterial color={PALETTE.cushionLavender} roughness={0.96} />
      </RoundedBox>
      {/* 2. Large square in blush pink */}
      <RoundedBox args={[0.6, 0.6, 0.18]} radius={0.06} position={[0.1, 1.04, -0.2]} rotation={[0, 0, 0.04]} castShadow>
        <meshStandardMaterial color={PALETTE.cushionBlush} roughness={0.96} />
      </RoundedBox>
      {/* 3. Rectangular lumbar in soft peach */}
      <RoundedBox args={[0.78, 0.34, 0.2]} radius={0.07} position={[0.85, 0.92, -0.2]} rotation={[0, 0, -0.06]} castShadow>
        <meshStandardMaterial color={PALETTE.cushionPeach} roughness={0.95} />
      </RoundedBox>
      {/* 4. Round bolster in deeper plum (horizontal log near head end) */}
      <mesh position={[-0.5, 0.86, 0.32]} rotation={[Math.PI / 2, 0, 0.04]} castShadow>
        <capsuleGeometry args={[0.16, 0.7, 6, 14]} />
        <meshStandardMaterial color={PALETTE.cushionPlum} roughness={0.95} />
      </mesh>
      {/* 5. Textured cream cushion */}
      <RoundedBox args={[0.45, 0.45, 0.18]} radius={0.05} position={[1.3, 0.9, -0.18]} rotation={[0, 0, 0.08]} castShadow>
        <meshStandardMaterial color={PALETTE.cushionCream} roughness={1} />
      </RoundedBox>
      {/* tufting stitch */}
      <mesh position={[1.3, 1.0, -0.08]}>
        <sphereGeometry args={[0.025, 10, 8]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.7} roughness={0.4} />
      </mesh>
      {/* 6. Small patterned star pillow (front) */}
      <RoundedBox args={[0.34, 0.34, 0.13]} radius={0.04} position={[0.45, 0.86, 0.4]} rotation={[Math.PI / 2 - 0.1, 0, 0.6]} castShadow>
        <meshStandardMaterial color="#9A7BA9" roughness={0.95} />
      </RoundedBox>
      {/* tiny gold star embossed */}
      <Text position={[0.45, 0.95, 0.41]} rotation={[-0.1, 0, 0.6]} fontSize={0.13} color={PALETTE.gold} anchorX="center" anchorY="middle" outlineWidth={0.005} outlineColor={PALETTE.goldGlow}>
        ✦
      </Text>
      {/* 7. Small extra cushion — mauve-blush blend */}
      <RoundedBox args={[0.32, 0.32, 0.12]} radius={0.04} position={[-0.95, 0.95, 0.4]} rotation={[Math.PI / 2 - 0.05, 0, 0.3]} castShadow>
        <meshStandardMaterial color="#D49AAA" roughness={0.96} />
      </RoundedBox>

      {/* === Throw blanket — folded layered fabric draped on the head end === */}
      <ThrowBlanket />
    </group>
  );
}

function ThrowBlanket() {
  // Multiple layered RoundedBoxes at varied angles to suggest folded knit fabric.
  return (
    <group position={[-1.0, 0, 0]}>
      {/* main fold draped over the seat near head end */}
      <RoundedBox args={[1.1, 0.06, 0.85]} radius={0.05} position={[0, 0.7, 0.18]} rotation={[0.18, 0.05, -0.12]} castShadow>
        <meshStandardMaterial color="#A99CB5" roughness={1} />
      </RoundedBox>
      {/* second layered fold */}
      <RoundedBox args={[0.9, 0.06, 0.7]} radius={0.05} position={[-0.05, 0.79, 0.32]} rotation={[0.34, -0.08, -0.05]} castShadow>
        <meshStandardMaterial color="#B9ACC5" roughness={1} />
      </RoundedBox>
      {/* hanging fold spilling over the front edge */}
      <RoundedBox args={[0.55, 0.06, 0.42]} radius={0.05} position={[0.05, 0.45, 0.62]} rotation={[1.15, 0.05, -0.08]} castShadow>
        <meshStandardMaterial color="#A99CB5" roughness={1} />
      </RoundedBox>
      {/* small bunched fold */}
      <RoundedBox args={[0.42, 0.06, 0.32]} radius={0.04} position={[-0.18, 0.6, 0.45]} rotation={[0.65, 0.18, 0.18]} castShadow>
        <meshStandardMaterial color="#C4B5CC" roughness={1} />
      </RoundedBox>
      {/* fringe hint */}
      <mesh position={[0.1, 0.35, 0.78]} rotation={[1.2, 0.05, -0.08]}>
        <boxGeometry args={[0.55, 0.04, 0.04]} />
        <meshStandardMaterial color="#8E7C9A" roughness={1} />
      </mesh>
    </group>
  );
}

function FloorTray({ position }) {
  return (
    <group position={position}>
      {/* round wooden tray base */}
      <mesh position={[0, 0.025, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.46, 0.46, 0.05, 32]} />
        <meshStandardMaterial color={PALETTE.walnut} roughness={0.65} />
      </mesh>
      {/* tray rim (slight raised edge) */}
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[0.44, 0.018, 8, 32]} />
        <meshStandardMaterial color={PALETTE.walnutDark} roughness={0.7} />
      </mesh>
      {/* tiny brass handles */}
      {[-1, 1].map((s, i) => (
        <mesh key={i} position={[s * 0.46, 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.04, 0.012, 6, 12, Math.PI]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.35} />
        </mesh>
      ))}

      {/* === Glass carafe with water === */}
      <group position={[-0.2, 0.06, 0.0]}>
        {/* body */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.095, 0.105, 0.4, 20]} />
          <meshStandardMaterial color="#E0DDF0" transparent opacity={0.45} roughness={0.12} metalness={0.05} />
        </mesh>
        {/* water level inside */}
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.088, 0.098, 0.28, 20]} />
          <meshStandardMaterial color="#A8C4DE" transparent opacity={0.5} roughness={0.15} />
        </mesh>
        {/* neck */}
        <mesh position={[0, 0.46, 0]}>
          <cylinderGeometry args={[0.045, 0.055, 0.08, 14]} />
          <meshStandardMaterial color="#E0DDF0" transparent opacity={0.55} roughness={0.12} />
        </mesh>
        {/* highlight on side */}
        <mesh position={[-0.08, 0.22, 0.04]}>
          <planeGeometry args={[0.03, 0.18]} />
          <meshStandardMaterial color="#FBF4EC" transparent opacity={0.55} />
        </mesh>
      </group>

      {/* === Short glass === */}
      <group position={[0.05, 0.06, 0.18]}>
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.07, 0.06, 0.2, 18]} />
          <meshStandardMaterial color="#E0DDF0" transparent opacity={0.4} roughness={0.12} metalness={0.05} />
        </mesh>
        {/* water inside */}
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.063, 0.057, 0.14, 18]} />
          <meshStandardMaterial color="#A8C4DE" transparent opacity={0.5} roughness={0.15} />
        </mesh>
        {/* highlight */}
        <mesh position={[-0.058, 0.13, 0.02]}>
          <planeGeometry args={[0.018, 0.1]} />
          <meshStandardMaterial color="#FBF4EC" transparent opacity={0.55} />
        </mesh>
      </group>

      {/* === Tea light in brass cup === */}
      <group position={[0.22, 0.06, -0.1]}>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.06, 16]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.8} roughness={0.35} />
        </mesh>
        {/* wax */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.012, 16]} />
          <meshStandardMaterial color={PALETTE.cushionCream} />
        </mesh>
        <Flame position={[0, 0.13, 0]} />
      </group>

      {/* === Small ceramic bowl === */}
      <group position={[0.05, 0.06, -0.22]}>
        <mesh position={[0, 0.06, 0]}>
          <sphereGeometry args={[0.09, 18, 14, 0, Math.PI * 2, Math.PI * 0.4, Math.PI * 0.6]} />
          <meshStandardMaterial color="#E2D2EE" roughness={0.55} />
        </mesh>
        {/* inner rim */}
        <mesh position={[0, 0.105, 0]}>
          <torusGeometry args={[0.075, 0.008, 6, 18]} />
          <meshStandardMaterial color="#C0AED0" roughness={0.55} />
        </mesh>
        {/* tiny dried flower in the bowl */}
        <mesh position={[0, 0.115, 0]}>
          <coneGeometry args={[0.04, 0.06, 8]} />
          <meshStandardMaterial color="#A480C8" />
        </mesh>
      </group>
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

/* ----- Floor cushions arranged around the rug -----
 * Soft, low, inviting. Placed around the central ritual zone so a
 * visitor could sit on the floor.
 */
function FloorCushions() {
  return (
    <group>
      {/* 1. Round tufted cushion, mauve, front-left */}
      <group position={[-2.0, 0, 2.4]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.32, 32]} />
          <meshStandardMaterial color="#9D7AA0" roughness={1} />
        </mesh>
        {/* tufting stitches forming a soft star */}
        <mesh position={[0, 0.34, 0]}>
          <sphereGeometry args={[0.04, 12, 10]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.7} roughness={0.4} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.28, 0.34, Math.sin(a) * 0.28]}>
              <sphereGeometry args={[0.018, 8, 6]} />
              <meshStandardMaterial color="#7A5C7E" />
            </mesh>
          );
        })}
      </group>

      {/* 2. Oval cushion, blush, front-right */}
      <group position={[2.05, 0, 2.55]} rotation={[0, 0.35, 0]}>
        <mesh position={[0, 0.16, 0]} castShadow scale={[1.5, 1, 1]}>
          <cylinderGeometry args={[0.42, 0.42, 0.3, 32]} />
          <meshStandardMaterial color={PALETTE.cushionBlush} roughness={1} />
        </mesh>
        {/* center seam */}
        <mesh position={[0, 0.32, 0]} scale={[1.3, 1, 1]}>
          <torusGeometry args={[0.32, 0.012, 6, 32]} />
          <meshStandardMaterial color="#C18A93" />
        </mesh>
      </group>

      {/* 3. Folded cushion, plum, right side */}
      <group position={[2.7, 0, 0.8]} rotation={[0, -0.3, 0]}>
        <RoundedBox args={[0.78, 0.18, 0.62]} radius={0.05} position={[0, 0.1, 0]} castShadow>
          <meshStandardMaterial color="#5C3F5E" roughness={0.95} />
        </RoundedBox>
        <RoundedBox args={[0.7, 0.16, 0.55]} radius={0.05} position={[0.04, 0.27, 0.02]} rotation={[0, 0.18, 0]} castShadow>
          <meshStandardMaterial color="#704C72" roughness={0.95} />
        </RoundedBox>
        {/* tassel */}
        <mesh position={[0.36, 0.32, 0.28]}>
          <coneGeometry args={[0.025, 0.08, 6]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.6} roughness={0.5} />
        </mesh>
      </group>

      {/* 4. Small square floor pillow, peach, center-left */}
      <group position={[-1.4, 0, 1.6]} rotation={[0, -0.45, 0]}>
        <RoundedBox args={[0.5, 0.18, 0.5]} radius={0.06} position={[0, 0.1, 0]} castShadow>
          <meshStandardMaterial color={PALETTE.cushionPeach} roughness={0.95} />
        </RoundedBox>
        {/* corner tassel */}
        <mesh position={[0.22, 0.22, 0.22]}>
          <sphereGeometry args={[0.04, 12, 10]} />
          <meshStandardMaterial color="#D89466" />
        </mesh>
      </group>

      {/* 5. Small extra round cushion, lavender, between the rug and the chaise */}
      <group position={[-2.6, 0, 1.4]} rotation={[0, 0.2, 0]}>
        <mesh position={[0, 0.14, 0]} castShadow>
          <cylinderGeometry args={[0.36, 0.36, 0.26, 24]} />
          <meshStandardMaterial color={PALETTE.cushionLavender} roughness={1} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <torusGeometry args={[0.3, 0.012, 6, 28]} />
          <meshStandardMaterial color="#9181A0" />
        </mesh>
      </group>
    </group>
  );
}

function OpenJournal({ position }) {
  return (
    <group position={position}>
      {/* slight book thickness underneath the pages */}
      <RoundedBox args={[0.86, 0.04, 0.6]} radius={0.02} position={[0, -0.005, 0]}>
        <meshStandardMaterial color="#9C7BAE" roughness={0.85} />
      </RoundedBox>
      {/* left page */}
      <mesh rotation={[-Math.PI / 2, 0, 0.06]} position={[-0.21, 0.025, 0]}>
        <planeGeometry args={[0.4, 0.56]} />
        <meshStandardMaterial color="#FBF4EC" roughness={0.85} />
      </mesh>
      {/* right page */}
      <mesh rotation={[-Math.PI / 2, 0, -0.06]} position={[0.21, 0.025, 0]}>
        <planeGeometry args={[0.4, 0.56]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.85} />
      </mesh>
      {/* spine seam */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.027, 0]}>
        <planeGeometry args={[0.04, 0.56]} />
        <meshStandardMaterial color={PALETTE.cushionLavender} roughness={0.9} />
      </mesh>
      {/* faint horizontal lines suggesting unread pages — ultra subtle */}
      {[-0.18, -0.04, 0.1].map((y, i) => (
        <mesh key={`l${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-0.21, 0.028, y]}>
          <planeGeometry args={[0.32, 0.005]} />
          <meshStandardMaterial color="#D6CABF" />
        </mesh>
      ))}

      {/* === Pen lying diagonally across the journal === */}
      <group position={[0.05, 0.04, 0.08]} rotation={[0, 0.65, 0]}>
        {/* barrel */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.42, 14]} />
          <meshStandardMaterial color="#3F2A30" roughness={0.45} />
        </mesh>
        {/* gold cap end */}
        <mesh position={[-0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.014, 0.014, 0.06, 14]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.3} />
        </mesh>
        {/* gold tip */}
        <mesh position={[0.22, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.013, 0.055, 12]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.3} />
        </mesh>
        {/* clip */}
        <mesh position={[-0.12, 0.018, 0]}>
          <boxGeometry args={[0.08, 0.008, 0.012]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

function SideTable({ position }) {
  // Short cylindrical ribbed walnut pedestal.
  return (
    <group position={position}>
      {/* base plinth */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.52, 0.08, 32]} />
        <meshStandardMaterial color={PALETTE.walnutDark} roughness={0.85} />
      </mesh>
      {/* main barrel — slightly tapered */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.48, 0.92, 36]} />
        <meshStandardMaterial color={PALETTE.walnut} roughness={0.85} />
      </mesh>
      {/* vertical ribbing — a ring of darker slats forming grooves */}
      {Array.from({ length: 28 }).map((_, i) => {
        const a = (i / 28) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.46, 0.5, Math.sin(a) * 0.46]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.02, 0.9, 0.025]} />
            <meshStandardMaterial color={PALETTE.walnutDark} roughness={0.9} />
          </mesh>
        );
      })}
      {/* groove highlights — tiny brighter slats between */}
      {Array.from({ length: 28 }).map((_, i) => {
        const a = ((i + 0.5) / 28) * Math.PI * 2;
        return (
          <mesh key={`hl-${i}`} position={[Math.cos(a) * 0.475, 0.5, Math.sin(a) * 0.475]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.006, 0.85, 0.012]} />
            <meshStandardMaterial color="#A0744E" roughness={0.7} />
          </mesh>
        );
      })}
      {/* smooth circular wooden top */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.07, 36]} />
        <meshStandardMaterial color="#A07452" roughness={0.55} metalness={0.05} />
      </mesh>
      {/* subtle gold trim ring on the top edge */}
      <mesh position={[0, 1.04, 0]}>
        <torusGeometry args={[0.495, 0.008, 8, 48]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.3} emissive={PALETTE.gold} emissiveIntensity={0.18} toneMapped={false} />
      </mesh>
      {/* wood grain hint along the top */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} position={[0, 1.041, -0.3 + i * 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.85, 0.005]} />
          <meshStandardMaterial color="#8B5A3C" transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function MoonLamp({ position }) {
  const moonRef = useRef();
  const haloRef = useRef();
  const outerGlowRef = useRef();

  // Crater spots scattered across the moon surface.
  const craters = useMemo(() => {
    const out = [];
    const rng = mulberry32(91);
    for (let i = 0; i < 9; i++) {
      const theta = 0.4 + rng() * (Math.PI - 0.8);
      const phi = rng() * Math.PI * 2;
      const r = 0.428;
      const cx = r * Math.sin(theta) * Math.cos(phi);
      const cy = r * Math.cos(theta);
      const cz = r * Math.sin(theta) * Math.sin(phi);
      const size = 0.035 + rng() * 0.06;
      out.push({ pos: [cx, cy, cz], size });
    }
    return out;
  }, []);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (moonRef.current) {
      moonRef.current.material.emissiveIntensity = 1.15 + Math.sin(t * 0.7) * 0.12;
    }
    if (haloRef.current) {
      haloRef.current.material.opacity = 0.13 + Math.sin(t * 0.9) * 0.04;
    }
    if (outerGlowRef.current) {
      outerGlowRef.current.material.opacity = 0.07 + Math.sin(t * 1.1) * 0.03;
    }
  });

  return (
    <group position={position}>
      {/* small wooden base resting on the table */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.07, 22]} />
        <meshStandardMaterial color={PALETTE.walnutDark} roughness={0.8} />
      </mesh>
      {/* tiny brass ring under the moon */}
      <mesh position={[0, 0.085, 0]}>
        <torusGeometry args={[0.16, 0.01, 8, 24]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.3} />
      </mesh>

      {/* main moon sphere */}
      <mesh ref={moonRef} position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.42, 48, 36]} />
        <meshStandardMaterial color={PALETTE.moon} emissive={PALETTE.moon} emissiveIntensity={1.15} roughness={0.55} toneMapped={false} />
      </mesh>

      {/* subtle moon craters — slightly darker, embossed bumps */}
      {craters.map((c, i) => (
        <mesh key={i} position={[c.pos[0], c.pos[1] + 0.5, c.pos[2]]}>
          <sphereGeometry args={[c.size, 14, 12]} />
          <meshStandardMaterial color="#F0DBA8" emissive="#E8CFA0" emissiveIntensity={0.55} roughness={0.7} transparent opacity={0.85} toneMapped={false} />
        </mesh>
      ))}

      {/* inner glow shell — hugs the surface */}
      <mesh ref={haloRef} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.5, 24, 18]} />
        <meshStandardMaterial color={PALETTE.moon} transparent opacity={0.16} emissive={PALETTE.moon} emissiveIntensity={0.5} toneMapped={false} side={THREE.BackSide} />
      </mesh>
      {/* outer atmospheric glow */}
      <mesh ref={outerGlowRef} position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.65, 24, 18]} />
        <meshStandardMaterial color={PALETTE.moon} transparent opacity={0.08} emissive={PALETTE.moon} emissiveIntensity={0.35} toneMapped={false} side={THREE.BackSide} />
      </mesh>

      {/* halo billboard — soft camera-facing glow */}
      <mesh position={[0, 0.5, 0.42]}>
        <circleGeometry args={[0.95, 32]} />
        <meshStandardMaterial color={PALETTE.moon} transparent opacity={0.12} emissive={PALETTE.moon} emissiveIntensity={0.5} toneMapped={false} depthWrite={false} />
      </mesh>

      {/* strong moon light — actually illuminates chaise + curtains */}
      <pointLight position={[0, 0.5, 0]} intensity={1.55} color={PALETTE.moon} distance={7} decay={1.3} castShadow={false} />
    </group>
  );
}

/* ----- Items resting on the side table top ----- */
function SideTableProps({ position }) {
  const [tx, ty, tz] = position;
  return (
    <group>
      <CeramicIncense position={[tx + 0.28, ty + 0.04, tz + 0.18]} />
      <TinyVase position={[tx - 0.26, ty + 0.04, tz + 0.2]} />
      <StackedBooks position={[tx + 0.22, ty + 0.04, tz - 0.25]} />
    </group>
  );
}

function CeramicIncense({ position }) {
  const steamRef = useRef();
  useFrame((s) => {
    if (!steamRef.current) return;
    const t = s.clock.elapsedTime;
    steamRef.current.position.y = 0.22 + Math.sin(t * 1.2) * 0.04;
    steamRef.current.material.opacity = 0.45 + Math.sin(t * 1.5) * 0.18;
    steamRef.current.scale.setScalar(1 + Math.sin(t * 1.4) * 0.08);
  });
  return (
    <group position={position}>
      {/* small ceramic dish */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.09, 0.04, 20]} />
        <meshStandardMaterial color="#E2D2EE" roughness={0.55} />
      </mesh>
      {/* dome diffuser body */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <sphereGeometry args={[0.085, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#F2DBC7" roughness={0.45} />
      </mesh>
      {/* opening rim */}
      <mesh position={[0, 0.14, 0]}>
        <torusGeometry args={[0.04, 0.005, 6, 18]} />
        <meshStandardMaterial color="#C0AED0" />
      </mesh>
      {/* steam wisp */}
      <mesh ref={steamRef} position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.07, 14, 12]} />
        <meshStandardMaterial color="#E0D6F0" emissive="#E0D6F0" emissiveIntensity={0.4} transparent opacity={0.5} toneMapped={false} depthWrite={false} />
      </mesh>
      {/* secondary smaller wisp */}
      <mesh position={[0.02, 0.32, -0.01]}>
        <sphereGeometry args={[0.05, 12, 10]} />
        <meshStandardMaterial color="#E0D6F0" transparent opacity={0.28} emissive="#E0D6F0" emissiveIntensity={0.3} toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

function TinyVase({ position }) {
  return (
    <group position={position}>
      {/* small ceramic vase body */}
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.06, 0.14, 16]} />
        <meshStandardMaterial color={PALETTE.cushionCream} roughness={0.55} />
      </mesh>
      {/* vase neck rim */}
      <mesh position={[0, 0.145, 0]}>
        <torusGeometry args={[0.045, 0.006, 6, 16]} />
        <meshStandardMaterial color="#D4BFA8" />
      </mesh>
      {/* gold rim ring */}
      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[0.04, 0.004, 6, 16]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.3} />
      </mesh>
      {/* dried lavender / pampas sprigs */}
      {[
        { x: -0.018, z: 0.012, h: 0.28, c: '#A480C8' },
        { x: 0.012, z: -0.014, h: 0.32, c: '#9171B0' },
        { x: 0.022, z: 0.018, h: 0.24, c: '#B89DD4' },
        { x: -0.01, z: -0.022, h: 0.3, c: '#A480C8' },
      ].map((sp, i) => (
        <group key={i} position={[sp.x, 0.16, sp.z]}>
          <mesh position={[0, sp.h / 2, 0]}>
            <cylinderGeometry args={[0.005, 0.005, sp.h, 6]} />
            <meshStandardMaterial color="#3D5C3A" roughness={0.85} />
          </mesh>
          <mesh position={[0, sp.h, 0]}>
            <coneGeometry args={[0.026, 0.1, 7]} />
            <meshStandardMaterial color={sp.c} roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function StackedBooks({ position }) {
  return (
    <group position={position} rotation={[0, 0.18, 0]}>
      {/* book 1 (bottom) */}
      <RoundedBox args={[0.24, 0.05, 0.17]} radius={0.005} position={[0, 0.025, 0]} castShadow>
        <meshStandardMaterial color="#5C3F5E" roughness={0.7} />
      </RoundedBox>
      {/* book 1 page edge */}
      <mesh position={[0, 0.025, 0.087]}>
        <planeGeometry args={[0.23, 0.045]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      {/* book 2 (top, slightly rotated) */}
      <RoundedBox args={[0.22, 0.045, 0.16]} radius={0.005} position={[0.015, 0.072, -0.005]} rotation={[0, 0.16, 0]} castShadow>
        <meshStandardMaterial color="#A0697F" roughness={0.7} />
      </RoundedBox>
      {/* book 2 page edge */}
      <mesh position={[0.015, 0.072, 0.077]} rotation={[0, 0.16, 0]}>
        <planeGeometry args={[0.21, 0.04]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      {/* gold spine bands */}
      <mesh position={[-0.115, 0.025, 0]}>
        <boxGeometry args={[0.005, 0.04, 0.16]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[-0.106, 0.072, -0.005]} rotation={[0, 0.16, 0]}>
        <boxGeometry args={[0.005, 0.035, 0.15]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.7} roughness={0.4} />
      </mesh>
      {/* tiny ribbon bookmark on top book */}
      <mesh position={[0.015, 0.094, 0.07]} rotation={[0, 0.16, 0]}>
        <boxGeometry args={[0.012, 0.005, 0.18]} />
        <meshStandardMaterial color={PALETTE.cushionPeach} />
      </mesh>
    </group>
  );
}

/* ----- Hanging Moroccan-style pendant lantern ----- */
function HangingLantern({ position }) {
  const glowRef = useRef();
  const swayRef = useRef();
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity = 1.0 + Math.sin(t * 1.4) * 0.22;
    }
    if (swayRef.current) {
      swayRef.current.rotation.z = Math.sin(t * 0.6) * 0.018;
    }
  });
  const yLantern = 2.85;
  const yTop = 5.6;
  const chainLen = yTop - yLantern;
  return (
    <group position={position}>
      {/* small ceiling cap */}
      <mesh position={[0, yTop, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.06, 14]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.35} />
      </mesh>
      {/* sway pivot */}
      <group ref={swayRef} position={[0, yTop, 0]}>
        {/* hanging cord */}
        <mesh position={[0, -chainLen / 2, 0]}>
          <cylinderGeometry args={[0.01, 0.01, chainLen, 6]} />
          <meshStandardMaterial color={PALETTE.walnutDark} />
        </mesh>
        {/* chain ring accents */}
        {[0.2, 0.5, 0.8].map((tt, i) => (
          <mesh key={i} position={[0, -chainLen * tt, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.024, 0.005, 6, 14]} />
            <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.4} />
          </mesh>
        ))}
        {/* lantern top cap (cone) */}
        <mesh position={[0, -chainLen + 0.36, 0]}>
          <coneGeometry args={[0.18, 0.18, 12]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.35} />
        </mesh>
        {/* lantern body — perforated metal ball with internal glow */}
        <mesh ref={glowRef} position={[0, -chainLen, 0]}>
          <sphereGeometry args={[0.26, 24, 18]} />
          <meshStandardMaterial color="#3F2A30" emissive={PALETTE.amber} emissiveIntensity={1.15} toneMapped={false} />
        </mesh>
        {/* vertical metal ribs (8 around the ball) */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.262, -chainLen, Math.sin(a) * 0.262]} rotation={[0, -a, 0]}>
              <boxGeometry args={[0.014, 0.4, 0.014]} />
              <meshStandardMaterial color="#2F1F25" metalness={0.4} roughness={0.6} />
            </mesh>
          );
        })}
        {/* horizontal ribs */}
        {[-0.16, 0, 0.16].map((y, i) => (
          <mesh key={i} position={[0, -chainLen + y, 0]}>
            <torusGeometry args={[0.265, 0.012, 6, 28]} />
            <meshStandardMaterial color="#2F1F25" metalness={0.4} roughness={0.6} />
          </mesh>
        ))}
        {/* tiny ornamental cutouts (small bright dots glowing through the metal) */}
        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * Math.PI * 2;
          const yo = (i % 2 === 0 ? -0.07 : 0.07);
          return (
            <mesh key={`p${i}`} position={[Math.cos(a) * 0.272, -chainLen + yo, Math.sin(a) * 0.272]}>
              <sphereGeometry args={[0.018, 8, 6]} />
              <meshStandardMaterial color={PALETTE.amber} emissive={PALETTE.amber} emissiveIntensity={1.2} toneMapped={false} />
            </mesh>
          );
        })}
        {/* bottom finial */}
        <mesh position={[0, -chainLen - 0.36, 0]}>
          <coneGeometry args={[0.045, 0.12, 10]} />
          <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.35} />
        </mesh>
        {/* warm point light */}
        <pointLight position={[0, -chainLen, 0]} intensity={0.95} color={PALETTE.amber} distance={5} decay={1.4} />
      </group>
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

/* ================================================================
 * Phone Parking corner — woven rattan basket with phones + throw
 * ================================================================ */

function PhoneBasket({ position, onClick }) {
  const [hover, setHover] = useState(false);
  const ringRef = useRef();
  useFrame((s) => {
    if (!ringRef.current) return;
    ringRef.current.material.emissiveIntensity = (hover ? 1.2 : 0.7) + Math.sin(s.clock.elapsedTime * 1.5) * 0.18;
  });

  return (
    <group
      position={position}
      rotation={[0, -0.22, 0]}
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
      {/* Soft circular floor glow / hotspot ring */}
      <mesh ref={ringRef} position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.95, 1.1, 36]} />
        <meshStandardMaterial color={PALETTE.amber} emissive={PALETTE.amber} emissiveIntensity={0.7} toneMapped={false} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0.013, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.95, 36]} />
        <meshStandardMaterial color={PALETTE.amber} emissive={PALETTE.amber} emissiveIntensity={0.18} transparent opacity={0.22} toneMapped={false} />
      </mesh>

      {/* Woven basket body */}
      <WovenBasketBody />

      {/* High arched handle */}
      <BasketHandle />

      {/* Folded lavender throw spilling over the right rim toward camera */}
      <BasketThrow />

      {/* Phones inside, peeking at varied angles */}
      <BasketPhones />

      {/* Brass + cream tassel hanging from the handle */}
      <Tassel position={[0.55, 1.55, 0]} />
      <Tassel position={[-0.55, 1.55, 0]} />

      {/* Tiny elegant phone-symbol tag near the rim — minimal text */}
      <group position={[0, 1.18, 0.92]} rotation={[0.2, 0, 0]}>
        <mesh>
          <planeGeometry args={[0.32, 0.18]} />
          <meshStandardMaterial color="#FBF4EC" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[0.3, 0.16]} />
          <meshStandardMaterial color={PALETTE.cushionCream} roughness={0.7} />
        </mesh>
        <Text position={[0, 0, 0.01]} fontSize={0.09} color={PALETTE.walnutDark} anchorX="center" anchorY="middle">
          ⌖
        </Text>
        {/* tiny twine */}
        <mesh position={[0, 0.13, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.06, 6]} />
          <meshStandardMaterial color="#7A5232" />
        </mesh>
      </group>

      {hover && (
        <Html position={[0, 2.05, 0]} center distanceFactor={9} pointerEvents="none">
          <div
            className="px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap pointer-events-none"
            style={{
              background: 'rgba(31,18,40,0.85)',
              color: '#FFE7B8',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(214,168,90,0.5)',
            }}
          >
            Phone Parking
          </div>
        </Html>
      )}
      {hover && (
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.95, 0.75, 0.99, 32]} />
          <meshStandardMaterial color={PALETTE.amber} transparent opacity={0.16} emissive={PALETTE.amber} emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

/* ----- Woven rattan basket body -----
 * Inner solid + 14 vertical staves + 5 horizontal weave bands
 * with alternating in/out segments to suggest over-under weave.
 */
function WovenBasketBody() {
  const rTop = 0.85;
  const rBot = 0.65;
  const height = 0.98;

  const verticals = 14;
  const bandCount = 5;
  const segPerBand = 28;

  return (
    <group position={[0, height / 2 + 0.04, 0]}>
      {/* base flat bottom */}
      <mesh position={[0, -height / 2 + 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[rBot * 0.96, rBot * 0.96, 0.04, 24]} />
        <meshStandardMaterial color="#5C3F2A" roughness={0.9} />
      </mesh>

      {/* inner solid body — warm tan */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[rTop * 0.96, rBot * 0.96, height, 36]} />
        <meshStandardMaterial color="#9F7448" roughness={0.95} />
      </mesh>

      {/* vertical staves (warp) */}
      {Array.from({ length: verticals }).map((_, i) => {
        const a = (i / verticals) * Math.PI * 2;
        // taper offset average
        const r = (rTop + rBot) / 2 * 0.99;
        return (
          <mesh
            key={`v${i}`}
            position={[Math.cos(a) * r, 0, Math.sin(a) * r]}
            rotation={[0, -a, 0]}
          >
            <boxGeometry args={[0.018, height + 0.02, 0.05]} />
            <meshStandardMaterial color="#7A5232" roughness={0.92} />
          </mesh>
        );
      })}

      {/* Horizontal woven bands — alternating in/out segments */}
      {Array.from({ length: bandCount }).map((_, h) => {
        const t = (h + 0.6) / (bandCount + 0.2);
        const y = -height / 2 + t * height;
        const r = THREE.MathUtils.lerp(rBot, rTop, t);
        return (
          <group key={`h${h}`} position={[0, y, 0]}>
            {Array.from({ length: segPerBand }).map((_, i) => {
              const a = ((i + (h % 2 === 0 ? 0 : 0.5)) / segPerBand) * Math.PI * 2;
              const isOuter = i % 2 === 0;
              const rr = r + (isOuter ? 0.025 : -0.005);
              const c = isOuter ? '#B8875B' : '#8B6539';
              return (
                <mesh
                  key={`hs${i}`}
                  position={[Math.cos(a) * rr, 0, Math.sin(a) * rr]}
                  rotation={[0, -a, 0]}
                >
                  <boxGeometry args={[0.012, 0.07, 0.062]} />
                  <meshStandardMaterial color={c} roughness={0.92} />
                </mesh>
              );
            })}
          </group>
        );
      })}

      {/* Top rim — rolled wrap */}
      <mesh position={[0, height / 2 + 0.02, 0]}>
        <torusGeometry args={[rTop, 0.05, 14, 40]} />
        <meshStandardMaterial color="#5C3F2A" roughness={0.85} />
      </mesh>
      <mesh position={[0, height / 2 + 0.06, 0]}>
        <torusGeometry args={[rTop * 0.95, 0.025, 8, 36]} />
        <meshStandardMaterial color="#7A5232" roughness={0.85} />
      </mesh>
      {/* Bottom rim */}
      <mesh position={[0, -height / 2, 0]}>
        <torusGeometry args={[rBot, 0.04, 12, 32]} />
        <meshStandardMaterial color="#5C3F2A" roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ----- Tall arched handle ----- */
function BasketHandle() {
  return (
    <group position={[0, 1.06, 0]}>
      {/* main arched handle — taller, more graceful */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.6, 0.045, 12, 28, Math.PI]} />
        <meshStandardMaterial color="#5C3F2A" roughness={0.85} />
      </mesh>
      {/* twine wrap rings on the handle */}
      {[-0.5, -0.3, 0.0, 0.3, 0.5].map((tt, i) => {
        const a = tt * Math.PI;
        const x = Math.cos(a) * 0.6;
        const y = Math.sin(a) * 0.6 + 0.5;
        return (
          <mesh key={i} position={[x, y, 0]} rotation={[0, 0, a + Math.PI / 2]}>
            <torusGeometry args={[0.05, 0.008, 6, 16]} />
            <meshStandardMaterial color="#B8875B" roughness={0.9} />
          </mesh>
        );
      })}
      {/* handle anchor stubs */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, -0.02, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 0.16, 12]} />
          <meshStandardMaterial color="#5C3F2A" />
        </mesh>
      ))}
    </group>
  );
}

/* ----- Folded lavender throw spilling over the right rim ----- */
function BasketThrow() {
  return (
    <group>
      {/* main folded panel inside the basket */}
      <mesh position={[0.05, 0.95, 0.0]} rotation={[0.05, 0.0, -0.04]} castShadow>
        <boxGeometry args={[1.0, 0.05, 0.85]} />
        <meshStandardMaterial color={PALETTE.cushionLavender} roughness={1} />
      </mesh>
      {/* second softer fold layered */}
      <mesh position={[0.18, 0.99, -0.08]} rotation={[-0.05, 0.1, -0.08]} castShadow>
        <boxGeometry args={[0.85, 0.05, 0.7]} />
        <meshStandardMaterial color="#B9ACC5" roughness={1} />
      </mesh>
      {/* spilling fold cascading over the right rim toward the camera */}
      <mesh position={[0.55, 0.65, 0.55]} rotation={[0.55, -0.18, -0.6]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.7]} />
        <meshStandardMaterial color={PALETTE.cushionLavender} roughness={1} />
      </mesh>
      {/* longer spill over the front with knit fringe */}
      <mesh position={[0.7, 0.35, 0.7]} rotation={[1.1, -0.15, -0.5]} castShadow>
        <boxGeometry args={[0.42, 0.05, 0.5]} />
        <meshStandardMaterial color="#A99CB5" roughness={1} />
      </mesh>
      {/* fringe edge */}
      <mesh position={[0.78, 0.18, 0.78]} rotation={[1.18, -0.15, -0.5]}>
        <boxGeometry args={[0.4, 0.03, 0.04]} />
        <meshStandardMaterial color="#8E7C9A" roughness={1} />
      </mesh>
    </group>
  );
}

/* ----- 6 phones inside the basket, varied angles ----- */
function BasketPhones() {
  const phones = [
    { x: -0.42, y: 1.18, z: 0.05, rot: [-0.4, 0.2, -0.05], screen: '#7BA8C8', sticker: '☾', stickerC: PALETTE.gold },
    { x: -0.18, y: 1.22, z: 0.12, rot: [-0.55, -0.05, 0.0], screen: '#F3A6B0', sticker: null },
    { x: 0.10, y: 1.26, z: 0.08, rot: [-0.5, 0.1, 0.04], screen: '#C9B8E0', sticker: '✦', stickerC: PALETTE.gold },
    { x: 0.34, y: 1.20, z: 0.0, rot: [-0.45, -0.15, -0.06], screen: '#1F1828', sticker: null },
    { x: -0.10, y: 1.16, z: -0.18, rot: [-0.3, 0.3, 0.1], screen: '#E2D2EE', sticker: '☾', stickerC: PALETTE.cushionPlum },
    { x: 0.22, y: 1.14, z: -0.25, rot: [-0.25, -0.25, -0.05], screen: '#FBE2C2', sticker: null },
  ];
  return (
    <group>
      {phones.map((p, i) => (
        <PhoneCard key={i} {...p} />
      ))}
    </group>
  );
}

function PhoneCard({ x, y, z, rot, screen, sticker, stickerC }) {
  return (
    <group position={[x, y, z]} rotation={rot}>
      {/* phone body */}
      <RoundedBox args={[0.24, 0.46, 0.028]} radius={0.026} smoothness={4}>
        <meshStandardMaterial color="#0F0A14" roughness={0.45} metalness={0.25} />
      </RoundedBox>
      {/* dim screen */}
      <mesh position={[0, 0.01, 0.016]}>
        <planeGeometry args={[0.2, 0.4]} />
        <meshStandardMaterial color={screen} emissive={screen} emissiveIntensity={0.3} toneMapped={false} />
      </mesh>
      {/* tiny notch / camera dot */}
      <mesh position={[0, 0.2, 0.018]}>
        <circleGeometry args={[0.012, 12]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* sticker */}
      {sticker && (
        <Text position={[-0.06, -0.13, 0.018]} fontSize={0.06} color={stickerC} anchorX="center" anchorY="middle">
          {sticker}
        </Text>
      )}
    </group>
  );
}

/* ----- Tassel detail (knot + dangling strings) ----- */
function Tassel({ position }) {
  return (
    <group position={position}>
      {/* twine attaching to handle */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.24, 6]} />
        <meshStandardMaterial color="#7A5232" />
      </mesh>
      {/* gold cap bead */}
      <mesh position={[0, 0.0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.05, 14]} />
        <meshStandardMaterial color={PALETTE.gold} metalness={0.85} roughness={0.35} />
      </mesh>
      {/* knot ball */}
      <mesh position={[0, -0.05, 0]}>
        <sphereGeometry args={[0.04, 14, 12]} />
        <meshStandardMaterial color="#D4A878" roughness={0.85} />
      </mesh>
      {/* dangling strings */}
      {[-0.022, -0.008, 0.005, 0.018].map((x, i) => (
        <mesh key={i} position={[x, -0.18, ((i % 2) - 0.5) * 0.012]}>
          <cylinderGeometry args={[0.005, 0.005, 0.22, 6]} />
          <meshStandardMaterial
            color={['#D4A878', '#E2C09B', '#C49A6F', '#D4A878'][i]}
            roughness={0.85}
          />
        </mesh>
      ))}
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

/* ----- Tall leafy plant (deep green, large oval leaves) -----
 * Used behind the phone parking basket to add lush depth.
 */
function LeafyPlant({ position }) {
  const leaves = useMemo(
    () => [
      { x: 0.0,  z: 0.0,  h: 1.5, ax: 0.0,  az: -0.55, scale: 1.0,  c: '#2D5A38' },
      { x: 0.05, z: 0.05, h: 1.2, ax: -0.4, az: 0.25,  scale: 0.85, c: '#3D6A48' },
      { x: -0.05,z: 0.05, h: 1.4, ax: 0.45, az: 0.4,   scale: 0.95, c: '#2D5A38' },
      { x: 0.0,  z: -0.08,h: 1.1, ax: -0.3, az: -0.65, scale: 0.8,  c: '#4D7A58' },
      { x: 0.08, z: -0.04,h: 1.5, ax: -0.6, az: -0.1,  scale: 0.95, c: '#3D6A48' },
      { x: -0.08,z: -0.04,h: 1.0, ax: 0.55, az: 0.0,   scale: 0.78, c: '#2D5A38' },
      { x: 0.0,  z: 0.08, h: 1.6, ax: 0.0,  az: 0.7,   scale: 1.05, c: '#3D6A48' },
      { x: 0.06, z: 0.0,  h: 1.0, ax: -0.25,az: 0.5,   scale: 0.7,  c: '#558A60' },
    ],
    []
  );
  return (
    <group position={position}>
      {/* terracotta pot */}
      <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.42, 0.64, 24]} />
        <meshStandardMaterial color="#7A4F38" roughness={0.85} />
      </mesh>
      {/* darker rim */}
      <mesh position={[0, 0.66, 0]}>
        <cylinderGeometry args={[0.34, 0.32, 0.06, 24]} />
        <meshStandardMaterial color="#5C3F2A" roughness={0.85} />
      </mesh>
      {/* soil */}
      <mesh position={[0, 0.69, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.02, 24]} />
        <meshStandardMaterial color="#231310" roughness={1} />
      </mesh>
      {/* large leaves */}
      {leaves.map((leaf, i) => (
        <group key={i} position={[leaf.x, 0.7, leaf.z]} rotation={[leaf.ax, 0, leaf.az]}>
          <mesh position={[0, leaf.h / 2, 0]}>
            <cylinderGeometry args={[0.014, 0.014, leaf.h, 6]} />
            <meshStandardMaterial color="#2A4A28" roughness={0.85} />
          </mesh>
          <mesh
            position={[0, leaf.h + 0.34, 0]}
            scale={[leaf.scale * 1.7, leaf.scale * 0.05, leaf.scale * 1.05]}
            castShadow
          >
            <sphereGeometry args={[0.32, 16, 10]} />
            <meshStandardMaterial color={leaf.c} roughness={0.85} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
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
