'use client';

import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const CITY_PALETTE = ['#4D544A', '#6B5A46', '#5A6258', '#7A6C59'];

function CityCluster() {
  const group = useRef<THREE.Group>(null);
  const blocks = useMemo(() => {
    return Array.from({ length: 56 }).map((_, i) => {
      const x = (i % 8) * 1.4 - 5;
      const z = Math.floor(i / 8) * 1.4 - 4;
      const y = 0.35 + ((i * 17) % 9) * 0.25;
      return { x, z, y, color: CITY_PALETTE[i % CITY_PALETTE.length] };
    });
  }, []);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.045;
    }
  });

  return (
    <group ref={group}>
      {blocks.map((b, idx) => (
        <mesh key={idx} position={[b.x, b.y / 2, b.z]} castShadow receiveShadow>
          <boxGeometry args={[1, b.y, 1]} />
          <meshStandardMaterial
            color={b.color}
            emissive={idx % 5 === 0 ? '#25322A' : '#1D2320'}
            roughness={0.45}
            metalness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

export function HeroPreview() {
  return (
    <div className="h-[320px] w-full overflow-hidden rounded-3xl border border-mint/30 shadow-glow">
      <Canvas camera={{ position: [11, 8, 13], fov: 42 }} shadows dpr={[1, 1.75]}>
        <fog attach="fog" args={['#101215', 14, 40]} />
        <ambientLight intensity={0.28} />
        <hemisphereLight args={['#6F7F73', '#171A1B', 0.5]} />
        <directionalLight position={[8, 14, 6]} intensity={1.1} castShadow />
        <pointLight position={[-5, 5, 3]} intensity={0.3} color="#F2C46D" />
        <Stars radius={80} count={900} factor={2.5} saturation={0} fade speed={0.15} />
        <CityCluster />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#1A1E1F" roughness={1} metalness={0.03} />
        </mesh>
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.75} maxPolarAngle={1.15} />
      </Canvas>
    </div>
  );
}
