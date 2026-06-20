---
name: 3d-and-motion-frontend
description: |
  Comprehensive guidelines for creating high-fidelity, high-performance 3D and motion effects on the web.
  Use this skill to implement:
  - Three.js & React Three Fiber (R3F) scenes, Canvas setup, lighting, and camera positioning.
  - GLTF models loading, animations (useFrame), and materials (physical, standard, custom shaders).
  - Framer Motion page transitions, gesture animations, list exits/entrances, and scroll-linked micro-interactions.
  - WebGL performance tuning: asset compression (GLTF pipeline), canvas resize, frame-rate throttling, and memory cleanup (dispose).
  - Modern CSS-only motion (Scroll-driven animations, View Transitions, starting styles, Popover and Anchor Positioning).
---

# 🌌 3D & Motion Frontend Development

This guide contains production-ready implementation patterns for integrating WebGL 3D views (Three.js, React Three Fiber) and fluid animations (Framer Motion, CSS Scroll-driven animations) in modern web frontends.

---

## 🛠️ 1. React Three Fiber (R3F) Scene Setup

When building 3D layouts, configure the Canvas with responsive settings, performance defaults, and orbit constraints.

### Standard R3F Canvas Boilerplate
```jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Center } from '@react-three/drei';
import { Physics } from '@react-three/rapier';

export function VisualizerCanvas({ children, size = 'standard' }) {
  // Cap device pixel ratio at [1, 2] to prevent performance drops on 4K/retina screens
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', position: 'relative' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        camera={{ position: [0, 2, 5], fov: 45 }}
      >
        <color attach="background" args={['#fafaf8']} />
        
        {/* Lights */}
        <ambientLight intensity={0.7} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        
        {/* Helper Stage for instant professional environment reflections */}
        <Stage environment="city" intensity={0.5} adjustCamera={false}>
          <Suspense fallback={null}>
            <Center>
              <Physics gravity={[0, -9.81, 0]}>
                {children}
              </Physics>
            </Center>
          </Suspense>
        </Stage>

        {/* Orbit Controls (constrained to prevent looking under the floor or zooming infinitely) */}
        <OrbitControls 
          enableZoom={false} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 2} 
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}
```

---

## 🧪 2. Materials & Custom Shaders

For complex procedural simulations (liquids, glow effects, custom texturing), avoid loading massive images. Instead, write custom fragment and vertex shaders using Drei's `shaderMaterial`.

### Creating a Custom Liquid Shader Material
```javascript
import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import React, { useRef } from 'react';

// Define the shader material with initial uniforms
const FluidMaterial = shaderMaterial(
  {
    uTime: 0,
    uLiquidLevel: 0.5,
    uBaseColor: new THREE.Color('#3b1f13'), // Caramel Espresso
    uMilkColor: new THREE.Color('#fcfaf2'), // Oat Milk
    uMixRatio: 0.0,
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform float uLiquidLevel;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Compute subtle surface waves near the fluid level
      if (pos.y > (uLiquidLevel - 0.05) && uLiquidLevel > 0.01) {
        pos.y += sin(pos.x * 8.0 + uTime * 3.0) * 0.015 * cos(pos.z * 8.0 + uTime * 3.0);
      }
      
      vPosition = pos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform vec3 uBaseColor;
    uniform vec3 uMilkColor;
    uniform float uLiquidLevel;
    uniform float uMixRatio;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      // Discard fragments above the animated fill height
      if (vPosition.y > uLiquidLevel) {
        discard;
      }

      // Smooth vertical blend for milk mixing
      float blendFactor = smoothstep(-0.5, uLiquidLevel, vPosition.y) * uMixRatio;
      vec3 color = mix(uBaseColor, uMilkColor, blendFactor);
      
      gl_FragColor = vec4(color, 0.95);
    }
  `
);

// Register the custom shader material under camelCase tag
extend({ FluidMaterial });

export function LiquidVolume({ baseType, milkType }) {
  const materialRef = useRef();

  // Color mappings
  const baseColors = {
    'Espresso': '#3b1f13',
    'Matcha': '#4c6e3b',
    'Chai': '#a8733b',
  };

  const targetLevel = baseType !== 'None' ? (milkType !== 'None' ? 0.8 : 0.5) : 0.0;
  const targetMix = milkType !== 'None' ? 0.75 : 0.0;

  useFrame((state) => {
    if (materialRef.current) {
      // 1. Update uTime for surface wave dynamics
      materialRef.current.uTime = state.clock.getElapsedTime();

      // 2. Smoothly lerp fill levels and mixes to avoid sudden jumps
      materialRef.current.uLiquidLevel = THREE.MathUtils.lerp(
        materialRef.current.uLiquidLevel, 
        targetLevel, 
        0.05
      );
      materialRef.current.uMixRatio = THREE.MathUtils.lerp(
        materialRef.current.uMixRatio, 
        targetMix, 
        0.03
      );

      // 3. Interpolate the base color
      const baseHex = baseColors[baseType] || '#3b1f13';
      const targetColor = new THREE.Color(baseHex);
      materialRef.current.uBaseColor.lerp(targetColor, 0.05);
    }
  });

  return (
    <mesh position={[0, -0.2, 0]}>
      <cylinderGeometry args={[0.39, 0.39, 1.0, 32]} />
      <fluidMaterial ref={materialRef} transparent depthWrite />
    </mesh>
  );
}
```

---

## ⚡ 3. WebGL Performance Optimization

WebGL code can easily freeze browser interfaces if resources are not handled responsibly.

### Rule A: Cap Resolution (DPR)
Avoid setting `dpr={window.devicePixelRatio}`. High-DPI screens (Retina, 4K) will try to render 4x the pixel density, lagging the GPU. Use:
```jsx
<Canvas dpr={[1, 2]}>
```

### Rule B: Clean Up Unused Resources (Memory Leak Prevention)
R3F disposes geometries and materials automatically in standard hooks. However, when dynamically generating or swapping materials manually, clean up manually:
```javascript
useEffect(() => {
  return () => {
    // Manually clean up textures, materials, and geometries
    texture.dispose();
    geometry.dispose();
    material.dispose();
  };
}, []);
```

### Rule C: Throttle Render Loop when Offscreen
If a 3D Canvas sits down the page, pause the GPU render loop when it is out of the viewport.
```javascript
import React, { useRef, useState, useEffect } from 'react';

export function LazyCanvas({ children }) {
  const containerRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '400px' }}>
      {isVisible && (
        <Canvas>
          {children}
        </Canvas>
      )}
    </div>
  );
}
```

---

## 🎬 4. Framer Motion Orchestration

Use Framer Motion to animate page entries, list element updates, layouts, and gesture inputs.

### Custom 3D Tilt Card (Mouse Interaction)
```jsx
import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export function TiltCard({ children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map mouse positions to degrees of tilt
  const rotateX = useTransform(y, [-150, 150], [15, -15]);
  const rotateY = useTransform(x, [-150, 150], [-15, 15]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="tilt-card-wrapper"
    >
      {children}
    </motion.div>
  );
}
```

### Morphing Layouts with `layoutId`
When transitioning a product card in a catalog to a detailed product modal, use the same `layoutId` to animate the transition seamlessly:
```jsx
// Thumbnail view
<motion.div layoutId={`product-${product.id}`} onClick={onSelect}>
  <motion.img src={product.image} layoutId={`product-image-${product.id}`} />
  <motion.h3 layoutId={`product-name-${product.id}`}>{product.name}</motion.h3>
</motion.div>

// Detailed view (in AnimatePresence modal)
<motion.div layoutId={`product-${product.id}`}>
  <motion.img src={product.image} layoutId={`product-image-${product.id}`} />
  <motion.h3 layoutId={`product-name-${product.id}`}>{product.name}</motion.h3>
  <p>Detailed formulation specs and region price controls.</p>
</motion.div>
```

---

## 🧭 5. Native CSS & Web Motion

Use native web APIs for motion instead of heavy JS-driven timelines to improve Interaction to Next Paint (INP).

### A. CSS Scroll-Driven Progress Bar
```css
/* Scroll-driven linear progress indicator */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: var(--color-primary);
  transform-origin: 0 50%;
  animation: grow-progress auto linear;
  animation-timeline: scroll(root block);
}

@keyframes grow-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

### B. View Transitions API (Vite SPA Navigation)
When routing client-side inside the Single Page Application, wrap the navigation path in `document.startViewTransition`:
```javascript
import { useNavigate } from 'react-router-dom';

export function useViewTransitionNavigate() {
  const navigate = useNavigate();

  return (to) => {
    if (!document.startViewTransition) {
      return navigate(to);
    }
    document.startViewTransition(() => {
      navigate(to);
    });
  };
}
```
In your CSS, pair it with transition selectors:
```css
::view-transition-old(root) {
  animation: 250ms ease-out both fade-out;
}
::view-transition-new(root) {
  animation: 350ms ease-in both slide-in-from-right;
}
```

### C. `@starting-style` for Dialog Entrances
Animate elements transitioning to and from `display: none` or the HTML5 top layer natively:
```css
dialog {
  transition: opacity 0.4s ease, display 0.4s allow-discrete;
  opacity: 1;
}

/* Before opening */
@starting-style {
  dialog[open] {
    opacity: 0;
  }
}
```
