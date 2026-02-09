"use client";

import React, { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  PerspectiveCamera, 
  MeshReflectorMaterial, 
  Float, 
  Text,
  useCursor
} from "@react-three/drei";
import { 
  Physics, 
  RigidBody, 
  CuboidCollider, 
  RapierRigidBody 
} from "@react-three/rapier";
import { 
  EffectComposer, 
  Bloom, 
  Noise, 
  Vignette 
} from "@react-three/postprocessing";
import * as THREE from "three";

// --- CONFIGURATION ---
const NEON_BLUE = "#00f3ff";
const NEON_PINK = "#ff00aa";
const GOLD = "#ffd700";

export default function UltimateRoom() {
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden select-none">
      {/* UI OVERLAY */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
          DREAM CHAMBER
        </h1>
        <p className="text-white/50 text-xs tracking-[0.5em] mt-2 font-mono">
          INTERACTIVE PHYSICS • REALTIME REFLECTIONS
        </p>
      </div>
      
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none text-white/40 text-xs font-mono">
        <p>Instructions:</p>
        <p>• Click objects to launch them</p>
        <p>• Rotate to explore</p>
      </div>

      {/* 3D CANVAS */}
      <Canvas shadows dpr={[1, 2]} className="w-full h-full">
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 10, 50]} />

        <PerspectiveCamera makeDefault position={[-10, 10, 10]} fov={35} />
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />

        {/* --- PHYSICS WORLD --- */}
        <Physics gravity={[0, -9.81, 0]}>
          <SceneContent />
        </Physics>

        {/* --- POST PROCESSING (The "Cinema" Look) --- */}
        {/* FIXED: Removed disableNormalPass which caused the crash */}
        <EffectComposer>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.6} />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

function SceneContent() {
  return (
    <>
      {/* LIGHTING */}
      <ambientLight intensity={0.2} />
      <pointLight position={[-5, 5, -5]} intensity={2} color={NEON_BLUE} distance={20} />
      <pointLight position={[5, 5, 5]} intensity={2} color={NEON_PINK} distance={20} />
      <spotLight position={[0, 10, 0]} angle={0.5} penumbra={1} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />

      {/* --- THE ROOM (STATIC PHYSICS) --- */}
      <RigidBody type="fixed" friction={2}>
        {/* REFLECTIVE FLOOR */}
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={60} // Strength of reflections
            roughness={0.5}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#101010"
            metalness={0.8}
            mirror={0} 
          />
        </mesh>
        
        {/* Invisible Walls to keep objects in */}
        <CuboidCollider position={[0, 5, 6]} args={[10, 5, 0.5]} />
        <CuboidCollider position={[0, 5, -6]} args={[10, 5, 0.5]} />
        <CuboidCollider position={[6, 5, 0]} args={[0.5, 5, 10]} />
        <CuboidCollider position={[-6, 5, 0]} args={[0.5, 5, 10]} />
      </RigidBody>

      {/* --- FURNITURE (STATIC) --- */}
      <RigidBody type="fixed" colliders="cuboid">
        {/* Bed Base */}
        <mesh position={[-3, 0.25, -2]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.5, 4]} />
          <meshStandardMaterial color="#222" roughness={0.2} />
        </mesh>
        {/* Glowing Bed Frame */}
        <mesh position={[-3, 0, -2]}>
           <boxGeometry args={[3.1, 0.1, 4.1]} />
           <meshBasicMaterial color={NEON_BLUE} toneMapped={false} />
        </mesh>
      </RigidBody>

      {/* --- INTERACTIVE OBJECTS (DYNAMIC PHYSICS) --- */}
      {/* 20 Cubes falling from sky */}
      <InteractiveCubes />
      
      {/* A Giant Sphere you can push */}
      <RigidBody position={[2, 5, 2]} colliders="ball" restitution={0.7}>
        <mesh castShadow>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.1} />
        </mesh>
      </RigidBody>

      {/* Floating Holographic Text */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 3, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          FOR TANYA
          <meshBasicMaterial color={NEON_PINK} toneMapped={false} />
        </Text>
      </Float>

      {/* Ambient Floating Dust */}
      <Particles />
    </>
  );
}

// --- INTERACTIVE CUBES ---
function InteractiveCubes() {
  // Generate random positions once
  const cubes = useMemo(() => {
    return new Array(20).fill(0).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 4, 
        5 + Math.random() * 5, 
        (Math.random() - 0.5) * 4
      ] as [number, number, number],
      color: Math.random() > 0.5 ? NEON_BLUE : NEON_PINK
    }));
  }, []);

  return (
    <>
      {cubes.map((data, i) => (
        <ClickableCube key={i} position={data.position} color={data.color} />
      ))}
    </>
  );
}

function ClickableCube({ position, color }: { position: [number, number, number], color: string }) {
  const rigidBody = useRef<RapierRigidBody>(null);
  const [hovered, setHover] = useState(false);
  useCursor(hovered);

  const impulse = () => {
    // Apply a random upward force when clicked
    rigidBody.current?.applyImpulse({ 
        x: (Math.random() - 0.5) * 5, 
        y: 10, 
        z: (Math.random() - 0.5) * 5 
    }, true);
    
    // Add random torque (spin)
    rigidBody.current?.applyTorqueImpulse({
        x: Math.random(), 
        y: Math.random(), 
        z: Math.random()
    }, true);
  };

  return (
    <RigidBody ref={rigidBody} position={position} colliders="cuboid" restitution={0.5} friction={1}>
      <mesh 
        onClick={impulse} 
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        castShadow
      >
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial 
            color={hovered ? "white" : "#333"} 
            emissive={color}
            emissiveIntensity={hovered ? 4 : 2}
            toneMapped={false}
        />
      </mesh>
    </RigidBody>
  );
}

// --- ATMOSPHERE PARTICLES ---
function Particles() {
  const count = 200;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const [dummy] = useState(() => new THREE.Object3D());
  
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      t: Math.random() * 100,
      factor: 20 + Math.random() * 100,
      speed: 0.01 + Math.random() / 200,
      xFactor: -5 + Math.random() * 10,
      yFactor: -5 + Math.random() * 10,
      zFactor: -5 + Math.random() * 10,
    }));
  }, []);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10),
        (particle.yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10),
        (particle.zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10)
      );
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.02, 0]} />
      <meshBasicMaterial color={NEON_BLUE} transparent opacity={0.6} />
    </instancedMesh>
  );
}