'use client';

import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import { RepoSnapshot } from '@/lib/types';

const languageColors: Record<string, string> = {
  JavaScript: '#3EE7FF',
  TypeScript: '#3B82F6',
  Python: '#9DFF6B',
  Go: '#F7C948',
  Rust: '#EAF2FF',
};

function colorForLanguage(language: string) {
  return languageColors[language] || '#8CA2CC';
}

function CameraRig({ selectedRepo, reducedMotion }: { selectedRepo?: RepoSnapshot; reducedMotion: boolean }) {
  const { camera } = useThree();

  useFrame(() => {
    if (!selectedRepo) {
      return;
    }
    const targetPos = new THREE.Vector3(selectedRepo.pos_x + 6, Math.max(7, selectedRepo.pos_y + 4), selectedRepo.pos_z + 8);
    if (reducedMotion) {
      camera.position.copy(targetPos);
      camera.lookAt(selectedRepo.pos_x, selectedRepo.pos_y * 0.4, selectedRepo.pos_z);
      return;
    }
    camera.position.lerp(targetPos, 0.06);
    camera.lookAt(selectedRepo.pos_x, selectedRepo.pos_y * 0.4, selectedRepo.pos_z);
  });

  return null;
}

function ForestPoints({ repos }: { repos: RepoSnapshot[] }) {
  const positions = useMemo(() => {
    const points: number[] = [];
    repos.forEach((repo) => {
      const trees = Math.min(30, Math.max(0, Math.round(repo.commits_30d / 2)));
      for (let i = 0; i < trees; i += 1) {
        points.push(
          repo.pos_x + (Math.random() - 0.5) * 2.5,
          0.2 + Math.random() * 0.8,
          repo.pos_z + (Math.random() - 0.5) * 2.5,
        );
      }
    });
    return new Float32Array(points);
  }, [repos]);

  if (!positions.length) {
    return null;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#9DFF6B" size={0.12} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

function StarParticles({ repos }: { repos: RepoSnapshot[] }) {
  const positions = useMemo(() => {
    const points: number[] = [];
    repos.forEach((repo) => {
      const stars = Math.min(60, Math.round(repo.stars / 10));
      for (let i = 0; i < stars; i += 1) {
        points.push(
          repo.pos_x + (Math.random() - 0.5) * 3.5,
          Math.max(2.5, repo.pos_y + Math.random() * 2.2),
          repo.pos_z + (Math.random() - 0.5) * 3.5,
        );
      }
    });
    return new Float32Array(points);
  }, [repos]);

  if (!positions.length) {
    return null;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#F7C948" size={0.1} sizeAttenuation transparent opacity={0.9} />
    </points>
  );
}

interface WorldCanvasProps {
  repos: RepoSnapshot[];
  selectedRepoId: number | null;
  onSelectRepo: (repo: RepoSnapshot) => void;
  forestMode: boolean;
  reducedMotion: boolean;
}

export function WorldCanvas({ repos, selectedRepoId, onSelectRepo, forestMode, reducedMotion }: WorldCanvasProps) {
  const selectedRepo = repos.find((repo) => repo.repo_id === selectedRepoId);

  return (
    <div className="h-[60vh] min-h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-bg800/40 md:h-[74vh]">
      <Canvas shadows dpr={[1, 1.6]}>
        <PerspectiveCamera makeDefault position={[18, 14, 22]} fov={48} />
        <fog attach="fog" args={['#070B14', 30, 80]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[14, 18, 6]} intensity={1.2} castShadow />
        <pointLight position={[0, 16, 0]} intensity={0.35} color="#3EE7FF" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[220, 220]} />
          <meshStandardMaterial color="#081223" roughness={0.95} metalness={0.02} />
        </mesh>

        {repos.map((repo) => {
          const isActive = selectedRepoId === repo.repo_id;
          const height = Math.max(1, repo.pos_y);
          return (
            <group key={repo.repo_id}>
              <mesh
                position={[repo.pos_x, height / 2, repo.pos_z]}
                castShadow
                receiveShadow
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectRepo(repo);
                }}
              >
                <boxGeometry args={[1.1, height, 1.1]} />
                <meshStandardMaterial
                  color={colorForLanguage(repo.primary_language)}
                  emissive={isActive ? '#174266' : '#0b152b'}
                  emissiveIntensity={isActive ? 0.8 : 0.32}
                  metalness={0.6}
                  roughness={0.3}
                />
              </mesh>
              {isActive ? (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[repo.pos_x, 0.06, repo.pos_z]}>
                  <ringGeometry args={[1.1, 1.5, 32]} />
                  <meshBasicMaterial color="#3EE7FF" transparent opacity={0.8} />
                </mesh>
              ) : null}
            </group>
          );
        })}

        {forestMode ? <ForestPoints repos={repos} /> : null}
        <StarParticles repos={repos} />
        <CameraRig selectedRepo={selectedRepo} reducedMotion={reducedMotion} />

        <OrbitControls
          enablePan={false}
          minDistance={8}
          maxDistance={50}
          minPolarAngle={0.5}
          maxPolarAngle={1.45}
          dampingFactor={0.08}
          enableDamping={!reducedMotion}
        />
      </Canvas>
    </div>
  );
}
