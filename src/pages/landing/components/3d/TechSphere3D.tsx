/// <reference types="@react-three/fiber" />
import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';

const techTags = [
  'React', 'Node.js', 'Express', 'MongoDB', 
  'TypeScript', 'Tailwind', 'JavaScript', 
  'PostgreSQL', 'Socket.io', 'Git', 'GitHub', 
  'Docker', 'AWS', 'Redis', 'GraphQL', 'Next.js'
];

interface TagProps {
  text: string;
  position: THREE.Vector3;
}

function Tag({ text, position }: TagProps) {
  const textRef = useRef<any>(null);

  // Dynamic hover color state
  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer';
    if (textRef.current) {
      textRef.current.color = '#06b6d4'; // Glowing Cyan
    }
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
    if (textRef.current) {
      textRef.current.color = '#ffffff'; // Reset to White
    }
  };

  return (
    <Billboard position={position}>
      <Text
        ref={textRef}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {text}
      </Text>
    </Billboard>
  );
}

function TagSphere() {
  const groupRef = useRef<THREE.Group>(null);

  // Distribute tags evenly on a sphere shell using Fibonacci sphere algorithm
  const tags = useMemo(() => {
    const temp: Array<{ text: string; pos: THREE.Vector3 }> = [];
    const count = techTags.length;
    const radius = 2.8;

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      temp.push({
        text: techTags[i],
        pos: new THREE.Vector3(x, y, z)
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle constant rotation
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {tags.map((tag, idx) => (
        <Tag key={idx} text={tag.text} position={tag.pos} />
      ))}
    </group>
  );
}

export default function TechSphere3D() {
  return (
    <div className="h-[300px] w-full md:h-[450px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#3b82f6" />
        <Suspense fallback={null}>
          <TagSphere />
        </Suspense>
      </Canvas>
    </div>
  );
}
