'use client';

import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import { RepoSnapshot } from '@/lib/types';

const languageColors: Record<string, string> = {
  JavaScript: '#F2C46D',
  TypeScript: '#7DBB6F',
  Python: '#5DD6A0',
  Go: '#CF7A58',
  Rust: '#DCC9A3',
};

function colorForLanguage(language: string) {
  return languageColors[language] || '#8A8578';
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

type TreeTransform = {
  x: number;
  z: number;
  scaleX: number;
  scaleY: number;
  rotationY: number;
};

function ForestClusters({ repos }: { repos: RepoSnapshot[] }) {
  const foliageRef = useRef<THREE.InstancedMesh>(null);
  const trunkRef = useRef<THREE.InstancedMesh>(null);

  const transforms = useMemo<TreeTransform[]>(() => {
    const trees: TreeTransform[] = [];
    repos.forEach((repo) => {
      const treeCount = Math.min(12, Math.max(0, Math.round(repo.commits_30d / 4)));
      for (let i = 0; i < treeCount; i += 1) {
        trees.push({
          x: repo.pos_x + (Math.random() - 0.5) * 2.4,
          z: repo.pos_z + (Math.random() - 0.5) * 2.4,
          scaleX: 0.85 + Math.random() * 0.45,
          scaleY: 0.85 + Math.random() * 0.5,
          rotationY: Math.random() * Math.PI * 2,
        });
      }
      if (trees.length > 2400) {
        return;
      }
    });
    return trees.slice(0, 2400);
  }, [repos]);

  useEffect(() => {
    if (!foliageRef.current || !trunkRef.current || !transforms.length) {
      return;
    }

    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();

    transforms.forEach((tree, idx) => {
      quaternion.setFromEuler(new THREE.Euler(0, tree.rotationY, 0));

      matrix.compose(
        new THREE.Vector3(tree.x, 0.19 + tree.scaleY * 0.14, tree.z),
        quaternion,
        new THREE.Vector3(0.12 * tree.scaleX, 0.34 * tree.scaleY, 0.12 * tree.scaleX),
      );
      trunkRef.current!.setMatrixAt(idx, matrix);

      matrix.compose(
        new THREE.Vector3(tree.x, 0.44 + tree.scaleY * 0.22, tree.z),
        quaternion,
        new THREE.Vector3(0.42 * tree.scaleX, 0.78 * tree.scaleY, 0.42 * tree.scaleX),
      );
      foliageRef.current!.setMatrixAt(idx, matrix);
    });

    trunkRef.current.instanceMatrix.needsUpdate = true;
    foliageRef.current.instanceMatrix.needsUpdate = true;
  }, [transforms]);

  if (!transforms.length) {
    return null;
  }

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, transforms.length]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.6, 1, 6]} />
        <meshStandardMaterial color="#644A34" roughness={0.9} metalness={0.05} />
      </instancedMesh>
      <instancedMesh ref={foliageRef} args={[undefined, undefined, transforms.length]} castShadow receiveShadow>
        <coneGeometry args={[0.9, 1.8, 7]} />
        <meshStandardMaterial color="#5B8F56" roughness={0.75} metalness={0.08} />
      </instancedMesh>
    </group>
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
      <pointsMaterial color="#F7DEB3" size={0.09} sizeAttenuation transparent opacity={0.75} />
    </points>
  );
}

function RoadLoops() {
  const loops = [8, 12, 16, 20, 24];

  return (
    <group>
      {loops.map((radius) => (
        <mesh key={radius} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <torusGeometry args={[radius, 0.06, 6, 96]} />
          <meshStandardMaterial color="#34312A" roughness={0.95} metalness={0.05} />
        </mesh>
      ))}
    </group>
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
        <fog attach="fog" args={['#101215', 30, 80]} />
        <ambientLight intensity={0.24} />
        <hemisphereLight args={['#6F7F73', '#1A1A18', 0.45]} />
        <directionalLight position={[14, 18, 6]} intensity={1.15} castShadow />
        <pointLight position={[0, 16, 0]} intensity={0.3} color="#F2C46D" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[220, 220]} />
          <meshStandardMaterial color="#1A1E1F" roughness={0.95} metalness={0.02} />
        </mesh>
        <RoadLoops />

        {repos.map((repo) => {
          const isActive = selectedRepoId === repo.repo_id;
          const height = Math.max(1, repo.pos_y);
          return (
            <group key={repo.repo_id}>
              <mesh position={[repo.pos_x, 0.06, repo.pos_z]} receiveShadow>
                <boxGeometry args={[1.4, 0.12, 1.4]} />
                <meshStandardMaterial color="#2A2D2A" roughness={0.9} metalness={0.08} />
              </mesh>
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
                  emissive={isActive ? '#3B372A' : '#1D231F'}
                  emissiveIntensity={isActive ? 0.65 : 0.26}
                  metalness={0.35}
                  roughness={0.45}
                />
              </mesh>
              {isActive ? (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[repo.pos_x, 0.06, repo.pos_z]}>
                  <ringGeometry args={[1.1, 1.5, 32]} />
                  <meshBasicMaterial color="#F2C46D" transparent opacity={0.85} />
                </mesh>
              ) : null}
            </group>
          );
        })}

        {forestMode ? <ForestClusters repos={repos} /> : null}
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
