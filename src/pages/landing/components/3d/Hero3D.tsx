/// <reference types="@react-three/fiber" />
import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Random float generator for star coordinates
function generateParticles(count: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    arr[i] = (Math.random() - 0.5) * 10;
  }
  return arr;
}

// Particle field components
function Stars() {
  const ref = useRef<THREE.Points>(null);
  const sphere = generateParticles(800);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.02;
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.025}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

// Floating 3D shapes that respond to mouse sways
function FloatingMesh() {
  const meshRef1 = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);
  const meshRef3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const mouseX = state.pointer.x * 1.5;
    const mouseY = state.pointer.y * 1.5;

    // Floating torus knot
    if (meshRef1.current) {
      meshRef1.current.rotation.x = elapsed * 0.2 + mouseY * 0.2;
      meshRef1.current.rotation.y = elapsed * 0.15 + mouseX * 0.2;
      meshRef1.current.position.y = Math.sin(elapsed * 0.5) * 0.3;
    }

    // Floating sphere
    if (meshRef2.current) {
      meshRef2.current.rotation.z = -elapsed * 0.3;
      meshRef2.current.position.x = 2 + Math.cos(elapsed * 0.4) * 0.2 + mouseX * 0.15;
      meshRef2.current.position.y = 1 + Math.sin(elapsed * 0.6) * 0.25 + mouseY * 0.15;
    }

    // Floating Ring
    if (meshRef3.current) {
      meshRef3.current.rotation.x = elapsed * 0.4;
      meshRef3.current.rotation.y = -elapsed * 0.2;
      meshRef3.current.position.x = -2.2 + Math.sin(elapsed * 0.3) * 0.3 + mouseX * 0.1;
      meshRef3.current.position.y = -1.2 + Math.cos(elapsed * 0.5) * 0.2 + mouseY * 0.1;
    }
  });

  return (
    <>
      {/* Central Torus Knot */}
      <mesh ref={meshRef1} position={[0, 0, 0]}>
        <torusKnotGeometry args={[0.8, 0.25, 120, 16]} />
        <meshStandardMaterial
          color="#06b6d4"
          roughness={0.15}
          metalness={0.8}
          wireframe
        />
      </mesh>

      {/* Floating sphere */}
      <mesh ref={meshRef2} position={[2, 1, -1]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#a855f7"
          roughness={0.2}
          metalness={0.6}
          emissive="#a855f7"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Floating ring */}
      <mesh ref={meshRef3} position={[-2.2, -1.2, -0.5]}>
        <torusGeometry args={[0.6, 0.12, 16, 100]} />
        <meshStandardMaterial
          color="#3b82f6"
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>
    </>
  );
}

// Camera control script to interpolate positions smoothly
function CameraController() {
  const { camera } = useThree();

  useFrame((state) => {
    // Lerp camera toward target mouse values
    const targetX = state.pointer.x * 0.8;
    const targetY = state.pointer.y * 0.8;
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY + 0.2, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Hero3D() {
  return (
    <div className="canvas-container absolute inset-0 -z-10 h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        <directionalLight position={[0, 5, 2]} intensity={1} color="#06b6d4" />
        
        <Stars />
        <FloatingMesh />
        <CameraController />
      </Canvas>
    </div>
  );
}
