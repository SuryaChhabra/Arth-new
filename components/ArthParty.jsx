'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

import Avatar from './Avatar';
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

import { useArthStore } from '@/lib/store';
import { BOOTHS } from '@/lib/booths';

export default function ArthParty() {
  const activeBooth = useArthStore((s) => s.activeBooth);
  const overlayColor = useMemo(() => {
    if (!activeBooth) return '#1a0f1c';
    return BOOTHS[activeBooth].palette.base;
  }, [activeBooth]);

  return (
    <main className="relative h-screen w-screen overflow-hidden select-none">
      {/* Ambient background gradient that shifts with active booth */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: activeBooth
            ? `radial-gradient(circle at 50% 60%, ${BOOTHS[activeBooth].palette.glow}cc 0%, ${BOOTHS[activeBooth].palette.base} 70%, #1a0f1c 100%)`
            : 'radial-gradient(circle at 50% 65%, #FBE2C2 0%, #F3A6B0 35%, #5B3A55 80%, #1a0f1c 100%)',
        }}
        transition={{ duration: 1.4 }}
      />

      <Canvas
        shadows
        dpr={[1, 1.6]}
        camera={{ position: [0, 9, 18], fov: 45, near: 0.1, far: 200 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
        <Suspense fallback={null}>
          <SceneLights activeBooth={activeBooth} />
          <fog attach="fog" args={[activeBooth ? BOOTHS[activeBooth].palette.base : '#3b2540', 35, 95]} />

          <Plaza />
          <SoJaoLounge />
          <IronEnergyBar />
          <BrainFogBooth />
          <HotFlashChillRoom />
          <NormalizedWall />
          <CircleHub />

          <Avatar />
          <CameraRig />
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Booth-entry color flash */}
      <BoothEntryFlash />

      {/* UI overlays */}
      <IntroOverlay />
      <HUD />
      <BoothEntryToast />
      <HotspotModal />
      <BodyDecoder />
    </main>
  );
}

function SceneLights({ activeBooth }) {
  return (
    <>
      <ambientLight intensity={activeBooth ? 0.55 : 0.7} />
      <hemisphereLight intensity={0.45} color="#FBE2C2" groundColor="#5B3A55" />
      <directionalLight
        position={[10, 18, 10]}
        intensity={activeBooth ? 0.5 : 1.0}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-12, 14, -8]} intensity={0.35} color="#F3A6B0" />
      <Environment preset={activeBooth ? 'sunset' : 'city'} />
    </>
  );
}

function BoothEntryFlash() {
  const activeBooth = useArthStore((s) => s.activeBooth);
  return (
    <AnimatePresence>
      {activeBooth && (
        <motion.div
          key={activeBooth + '_flash'}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${BOOTHS[activeBooth].palette.glow}aa 0%, transparent 70%)`,
          }}
        />
      )}
    </AnimatePresence>
  );
}
