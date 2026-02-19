'use client';

import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function CityCluster() {
  const group = useRef<THREE.Group>(null);
  const blocks = useMemo(() => {
    return Array.from({ length: 56 }).map((_, i) => {
      const x = (i % 8) * 1.4 - 5;
      const z = Math.floor(i / 8) * 1.4 - 4;
      const y = 0.3 + ((i * 17) % 9) * 0.25;
      return { x, z, y };
    });
  }, []);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={group}>
      {blocks.map((b, idx) => (
        <mesh key={idx} position={[b.x, b.y / 2, b.z]} castShadow receiveShadow>
          <boxGeometry args={[1, b.y, 1]} />
          <meshStandardMaterial
            color={idx % 4 === 0 ? '#3EE7FF' : '#3B82F6'}
            emissive={idx % 5 === 0 ? '#0b3040' : '#081422'}
            roughness={0.25}
            metalness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

export function HeroPreview() {
  return (
    <div className="h-[320px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-glow">
      <Canvas camera={{ position: [11, 8, 13], fov: 42 }} shadows dpr={[1, 1.75]}>
        <fog attach="fog" args={['#070B14', 14, 40]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[8, 14, 6]} intensity={1.25} castShadow />
        <Stars radius={80} count={1200} factor={4} saturation={0} fade speed={0.2} />
        <CityCluster />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#091226" roughness={1} metalness={0} />
        </mesh>
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.75} maxPolarAngle={1.15} />
      </Canvas>
    </div>
  );
}
