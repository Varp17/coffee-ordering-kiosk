import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshTransmissionMaterial, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { getLiquidColor } from '@/utils/coffeeBuilder';
import './CoffeeCupVisualizer.css';

// Inner liquid fill mesh
function LiquidFill({ color, fillLevel = 0.6 }) {
  const meshRef = useRef();
  const targetColor = new THREE.Color(color || '#3b1f13');

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.material.color.lerp(targetColor, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -0.3 + fillLevel * 0.6, 0]}>
      <cylinderGeometry args={[0.55, 0.42, fillLevel * 1.2, 32]} />
      <meshStandardMaterial
        color={color || '#3b1f13'}
        roughness={0.1}
        metalness={0.02}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

// Cup body
function CupBody() {
  return (
    <group>
      {/* Outer cup */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.45, 1.4, 32, 1, true]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.15}
          roughness={0.05}
          transmission={0.85}
          ior={1.4}
          chromaticAberration={0.02}
          color="#fefefe"
        />
      </mesh>

      {/* Bottom disc */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.04, 32]} />
        <meshStandardMaterial color="#f5f3f0" roughness={0.3} />
      </mesh>

      {/* Cup rim */}
      <mesh position={[0, 0.7, 0]}>
        <torusGeometry args={[0.6, 0.04, 16, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Handle */}
      <mesh position={[0.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.28, 0.055, 12, 32, Math.PI]} />
        <meshStandardMaterial color="#f0ede9" roughness={0.3} />
      </mesh>
    </group>
  );
}

// Steam particles
function Steam({ show }) {
  const ref1 = useRef();
  const ref2 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref1.current) {
      ref1.current.position.y = 0.9 + ((t * 0.4) % 1.0);
      ref1.current.material.opacity = Math.max(0, 0.4 - ((t * 0.4) % 1.0) * 0.5);
    }
    if (ref2.current) {
      ref2.current.position.y = 0.9 + ((t * 0.4 + 0.5) % 1.0);
      ref2.current.material.opacity = Math.max(0, 0.4 - ((t * 0.4 + 0.5) % 1.0) * 0.5);
    }
  });

  if (!show) return null;

  return (
    <>
      <mesh ref={ref1} position={[-0.1, 1.0, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ref2} position={[0.1, 1.0, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>
    </>
  );
}

// Saucer
function Saucer() {
  return (
    <mesh position={[0, -0.82, 0]}>
      <cylinderGeometry args={[0.85, 0.8, 0.08, 32]} />
      <meshStandardMaterial color="#f5f3f0" roughness={0.3} metalness={0.05} />
    </mesh>
  );
}

// Main scene
function CupScene({ concentrateId, milkId, fillLevel, hasLiquid }) {
  const liquidColor = getLiquidColor(concentrateId, milkId);
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.3}>
      <group ref={groupRef}>
        <CupBody />
        {hasLiquid && <LiquidFill color={liquidColor} fillLevel={fillLevel} />}
        <Steam show={hasLiquid} />
        <Saucer />
      </group>
    </Float>
  );
}

export default function CoffeeCupVisualizer({ concentrate, milk, topping, fillLevel = 0 }) {
  const hasLiquid = !!concentrate;

  return (
    <div className="cup-visualizer">
      <div className="cup-visualizer__label">
        {hasLiquid ? 'Your Brew' : 'Select ingredients →'}
      </div>
      <Canvas
        camera={{ position: [0, 0.5, 3.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 3]} intensity={1.2} castShadow />
        <pointLight position={[-2, 2, 2]} intensity={0.4} color="#E5A764" />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <CupScene
            concentrateId={concentrate?.id}
            milkId={milk?.id}
            fillLevel={fillLevel}
            hasLiquid={hasLiquid}
          />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.8}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>

      {/* Ingredient tags */}
      {hasLiquid && (
        <div className="cup-visualizer__tags">
          {concentrate && <span className="viz-tag">{concentrate.name}</span>}
          {milk        && milk.id !== 'none' && <span className="viz-tag">{milk.name}</span>}
          {topping     && topping.id !== 'none' && <span className="viz-tag">{topping.name}</span>}
        </div>
      )}
    </div>
  );
}
