import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial, Sphere, Box, Torus, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

// Floating holographic shapes
function FloatingShapes() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Icosahedron args={[1, 1]} position={[-4, 2, -3]}>
          <meshStandardMaterial 
            color="#00ffff" 
            wireframe 
            emissive="#00ffff"
            emissiveIntensity={0.5}
          />
        </Icosahedron>
      </Float>
      
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5}>
        <Torus args={[0.8, 0.2, 16, 32]} position={[4, 1, -2]} rotation={[Math.PI / 4, 0, 0]}>
          <meshStandardMaterial 
            color="#ff00ff" 
            wireframe 
            emissive="#ff00ff"
            emissiveIntensity={0.5}
          />
        </Torus>
      </Float>
      
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
        <Box args={[0.8, 0.8, 0.8]} position={[3, -1, -4]} rotation={[0.5, 0.5, 0]}>
          <meshStandardMaterial 
            color="#8b00ff" 
            wireframe 
            emissive="#8b00ff"
            emissiveIntensity={0.5}
          />
        </Box>
      </Float>
      
      <Float speed={1.8} rotationIntensity={1} floatIntensity={1.8}>
        <Sphere args={[0.5, 16, 16]} position={[-3, -1.5, -3]}>
          <MeshDistortMaterial 
            color="#39ff14" 
            wireframe 
            emissive="#39ff14"
            emissiveIntensity={0.3}
            distort={0.3}
            speed={2}
          />
        </Sphere>
      </Float>
    </group>
  );
}

// Neon grid floor
function NeonGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 1;
    }
  });

  return (
    <group position={[0, -3, 0]}>
      <gridHelper 
        ref={gridRef}
        args={[100, 100, '#00ffff', '#00ffff']} 
        rotation={[0, 0, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial 
          color="#000510" 
          transparent 
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

// Particle system
function Particles({ count = 500 }) {
  const points = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02;
      points.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#00ffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// Light streaks
function LightStreaks() {
  const streaksRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (streaksRef.current) {
      streaksRef.current.children.forEach((child, i) => {
        child.position.z = ((state.clock.elapsedTime * (2 + i * 0.5)) % 30) - 15;
      });
    }
  });

  return (
    <group ref={streaksRef}>
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[(i - 3) * 4, Math.random() * 4 - 2, -10]}>
          <boxGeometry args={[0.02, 0.02, 3]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#00ffff' : '#ff00ff'} />
        </mesh>
      ))}
    </group>
  );
}

// Main scene component
export default function CyberpunkScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#050510']} />
        <fog attach="fog" args={['#050510', 5, 30]} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} color="#00ffff" intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#ff00ff" intensity={0.5} />
        <spotLight 
          position={[0, 10, 0]} 
          angle={0.3} 
          penumbra={1} 
          color="#8b00ff" 
          intensity={0.8}
        />
        
        <FloatingShapes />
        <NeonGrid />
        <Particles count={300} />
        <LightStreaks />
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}
