'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

import CameraRig from './CameraRig';
import Plaza from './Plaza';
import SoJaoLounge from './booths/SoJaoLounge';
import IronEnergyBar from './booths/IronEnergyBar';
import BrainFogBooth from './booths/BrainFogBooth';
import HotFlashChillRoom from './booths/HotFlashChillRoom';
import NormalizedWall from './booths/NormalizedWall';
import CircleHub from './booths/CircleHub';

import IntroOverlay from './ui/IntroOverlay';
import HUD from './ui/HUD';
import HotspotModal from './ui/HotspotModal';
import BodyDecoder from './ui/BodyDecoder';
import BoothEntryToast from './ui/BoothEntryToast';
import BottomInfoBar from './ui/BottomInfoBar';

import { useArthStore } from '@/lib/store';
import { BOOTHS } from '@/lib/booths';

const SCENES = {
  null: Plaza,
  sojao: SoJaoLounge,
  iron: IronEnergyBar,
  brainfog: BrainFogBooth,
  hotflash: HotFlashChillRoom,
  normalized: NormalizedWall,
  hub: CircleHub,
};

export default function ArthParty() {
  const activeBooth = useArthStore((s) => s.activeBooth);
  const Scene = SCENES[activeBooth] || Plaza;

  const bgGradient = useMemo(() => {
    if (!activeBooth) {
      return 'radial-gradient(circle at 50% 60%, #FBE2C2 0%, #F3A6B0 38%, #5B3A55 78%, #1a0f1c 100%)';
    }
    const p = BOOTHS[activeBooth].palette;
    return `radial-gradient(circle at 50% 55%, ${p.glow}cc 0%, ${p.base} 65%, #2a1828 100%)`;
  }, [activeBooth]);

  return (
    <main className="relative h-screen w-screen overflow-hidden select-none">
      {/* Ambient background gradient */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ background: bgGradient }}
        transition={{ duration: 1.1 }}
      />

      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: [0, 3.6, 10], fov: 42, near: 0.1, far: 120 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
        {/* Environment is isolated so a failed HDR load can't blank the scene */}
        <Suspense fallback={null}>
          <SceneEnvironment activeBooth={activeBooth} />
        </Suspense>

        <Suspense fallback={null}>
          <SceneLights activeBooth={activeBooth} />

          <SceneFader sceneKey={activeBooth || 'lobby'}>
            <Scene />
          </SceneFader>

          <ContactShadows
            position={[0, 0.005, 0]}
            opacity={0.45}
            scale={20}
            blur={2.4}
            far={6}
            color="#3a1f33"
          />

          <CameraRig />
        </Suspense>
      </Canvas>

      {/* UI overlays */}
      <BoothEntryFlash />
      <IntroOverlay />
      <HUD />
      <BoothEntryToast />
      <BottomInfoBar />
      <HotspotModal />
      <BodyDecoder />
    </main>
  );
}

function SceneFader({ sceneKey, children }) {
  // Simple swap on key change. Could be expanded into proper fade.
  return <group key={sceneKey}>{children}</group>;
}

function SceneLights({ activeBooth }) {
  const palette = activeBooth ? BOOTHS[activeBooth].palette : null;
  return (
    <>
      <ambientLight intensity={0.6} />
      <hemisphereLight intensity={0.45} color="#FBE2C2" groundColor="#5B3A55" />
      <directionalLight
        position={[6, 14, 8]}
        intensity={0.95}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <directionalLight position={[-8, 10, -4]} intensity={0.45} color={palette ? palette.accent : '#F3A6B0'} />
    </>
  );
}

function SceneEnvironment({ activeBooth }) {
  // kept separate so a failed HDR fetch can't take the rest of the scene down
  return <Environment preset="apartment" />;
}

function BoothEntryFlash() {
  const activeBooth = useArthStore((s) => s.activeBooth);
  return (
    <AnimatePresence>
      {activeBooth && (
        <motion.div
          key={activeBooth + '_flash'}
          initial={{ opacity: 0.55 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${BOOTHS[activeBooth].palette.glow}99 0%, transparent 70%)`,
          }}
        />
      )}
    </AnimatePresence>
  );
}
