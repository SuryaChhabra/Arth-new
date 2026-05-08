'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useArthStore } from '@/lib/store';

export default function Hotspot({ position, color = '#F08A5D', label, hotspotId, boothId, scale = 1, icon = '✨' }) {
  const ringRef = useRef();
  const [hover, setHover] = useState(false);
  const setOpenHotspot = useArthStore((s) => s.setOpenHotspot);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.6;
      const s = 1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.08;
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh
        ref={ringRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpenHotspot({ boothId, hotspotId });
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = 'default';
        }}
      >
        <torusGeometry args={[0.42, 0.06, 12, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hover ? 0.9 : 0.55} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.32, 32]} />
        <meshStandardMaterial color={color} transparent opacity={hover ? 0.55 : 0.35} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <Html distanceFactor={8} center position={[0, 0, 0.05]}>
        <div className="pointer-events-none select-none flex items-center justify-center w-9 h-9 rounded-full text-lg">
          <span style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}>{icon}</span>
        </div>
      </Html>
      {label && hover && (
        <Html distanceFactor={10} center position={[0, 1.1, 0]}>
          <div className="pointer-events-none whitespace-nowrap rounded-full bg-arth-ink/85 text-arth-cream px-3 py-1 text-xs font-medium tracking-wide">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}
