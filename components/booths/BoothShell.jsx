'use client';

import { useMemo, useRef } from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Shared booth shell: a curved wall, floor, ceiling, and signage.
// Booths place their props inside this shell, centered around (0,0,0).
export default function BoothShell({
  palette,
  title,
  tagline,
  productLabel,
  productCopy,
  withCeiling = true,
  shape = 'circle',
}) {
  const wallColor = palette.base;
  const accent = palette.accent;
  const floor = palette.floor;

  return (
    <group>
      {/* Floor — round room */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <circleGeometry args={[8.5, 48]} />
        <meshStandardMaterial color={floor} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[7.6, 7.85, 48]} />
        <meshStandardMaterial color={accent} />
      </mesh>

      {/* Curved wall */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[8.5, 8.5, 6, 48, 1, true, -Math.PI * 0.85, Math.PI * 1.7]} />
        <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} roughness={0.85} />
      </mesh>

      {/* Skirting board / floor trim */}
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[8.5, 0.06, 8, 48, Math.PI * 1.7]} />
        <meshStandardMaterial color={accent} />
      </mesh>

      {/* Ceiling cap */}
      {withCeiling && (
        <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0, 8.5, 48]} />
          <meshStandardMaterial color={wallColor} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Big internal signage on the back wall */}
      <BackSign title={title} tagline={tagline} accent={accent} />

      {/* Soft accent moldings */}
      <mesh position={[0, 5.4, 0]}>
        <torusGeometry args={[8.45, 0.07, 8, 48, Math.PI * 1.7]} />
        <meshStandardMaterial color={accent} />
      </mesh>

      {/* Product Bridge: small wellness shelf */}
      <ProductShelf label={productLabel} copy={productCopy} accent={accent} base={wallColor} />
    </group>
  );
}

function BackSign({ title, tagline, accent }) {
  const back = new THREE.Vector3(0, 4, -7.6);
  return (
    <group position={back}>
      <mesh>
        <planeGeometry args={[8, 2.6]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <Text position={[0, 0.5, 0.02]} fontSize={0.7} color={accent} anchorX="center" anchorY="middle" letterSpacing={-0.02} maxWidth={7.6} textAlign="center">
        {title}
      </Text>
      <Text position={[0, -0.55, 0.02]} fontSize={0.27} color="#2A1E2C" anchorX="center" anchorY="middle" maxWidth={7} textAlign="center">
        {tagline}
      </Text>
    </group>
  );
}

function ProductShelf({ label, copy, accent, base }) {
  if (!label) return null;
  return (
    <group position={[6.5, 0.3, -1.4]} rotation={[0, -0.6, 0]}>
      {/* shelf platform */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.6, 0.06, 0.6]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.4, 0.4, 0.5]} />
        <meshStandardMaterial color={base} />
      </mesh>
      {/* product (a stylized bottle) */}
      <mesh position={[-0.3, 0.85, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.7, 18]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[-0.3, 1.2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.18, 16]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <mesh position={[-0.3, 0.85, 0.22]}>
        <planeGeometry args={[0.26, 0.32]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      {/* small box product */}
      <RoundedBox args={[0.5, 0.7, 0.3]} radius={0.05} position={[0.3, 0.85, 0]}>
        <meshStandardMaterial color="#FBF4EC" />
      </RoundedBox>
      <Text position={[0.3, 0.85, 0.16]} fontSize={0.07} color={accent} anchorX="center" anchorY="middle" maxWidth={0.45} textAlign="center">
        {label}
      </Text>
      {/* label panel */}
      <group position={[0, 1.7, 0]}>
        <mesh>
          <planeGeometry args={[2, 0.7]} />
          <meshStandardMaterial color="#FBF4EC" />
        </mesh>
        <Text position={[0, 0.15, 0.01]} fontSize={0.16} color={accent} anchorX="center" anchorY="middle">
          {label}
        </Text>
        <Text position={[0, -0.13, 0.01]} fontSize={0.1} color="#2A1E2C" anchorX="center" anchorY="middle" maxWidth={1.85} textAlign="center">
          {copy}
        </Text>
      </group>
    </group>
  );
}

export function QuoteBubble({ position, text, color = '#5B3A55', width = 2.8, rotation = [0, 0, 0] }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * 0.7 + position[0]) * 0.08;
  });
  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[width, 0.78]} />
        <meshStandardMaterial color="#FBF4EC" />
      </mesh>
      <Text position={[0, 0, 0.02]} fontSize={0.18} color={color} anchorX="center" anchorY="middle" maxWidth={width - 0.3} textAlign="center">
        {text}
      </Text>
    </group>
  );
}

export function ChipRow({ position, chips, color = '#F08A5D', rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {chips.map((c, i) => (
        <group key={i} position={[(i - (chips.length - 1) / 2) * 1.6, 0, 0]}>
          <mesh>
            <planeGeometry args={[1.4, 0.36]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <Text position={[0, 0, 0.02]} fontSize={0.14} color="#FBF4EC" anchorX="center" anchorY="middle" maxWidth={1.3}>
            {`${c}`}
          </Text>
        </group>
      ))}
    </group>
  );
}
