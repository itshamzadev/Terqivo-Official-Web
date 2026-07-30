import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

const SceneFallback = () => null;

class HeroErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return reducedMotion;
};

const WirePacket = ({ curve, speed, color, reducedMotion }: { curve: THREE.CatmullRomCurve3, speed: number, color: string, reducedMotion: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [progress] = useState(() => Math.random());
  const speedRef = useRef(speed * (0.5 + Math.random() * 0.8));
  
  useFrame((state, delta) => {
    if (!meshRef.current || reducedMotion) return;
    let nextProgress = (meshRef.current.userData.progress || progress) + delta * speedRef.current;
    if (nextProgress > 1) nextProgress = 0;
    meshRef.current.userData.progress = nextProgress;
    const point = curve.getPointAt(nextProgress);
    meshRef.current.position.copy(point);
  });
  
  // Set initial position for static reduced motion
  useEffect(() => {
    if (reducedMotion && meshRef.current) {
       const point = curve.getPointAt(progress);
       meshRef.current.position.copy(point);
    }
  }, [reducedMotion, curve, progress]);

  return (
    <group>
      {/* The main fiber optic line */}
      <Line points={curve.getPoints(80)} color={color} transparent opacity={0.08} lineWidth={1.5} />
      
      {/* The moving data packet (static if reduced motion) */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
        <mesh scale={3.5}>
           <sphereGeometry args={[0.025, 8, 8]} />
           <meshBasicMaterial color={color} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </mesh>
    </group>
  );
}

const DataWires = ({ config, reducedMotion }: { config: any, reducedMotion: boolean }) => {
  const { viewport } = useThree();
  const curves = useMemo(() => {
    const arr = [];
    const isMobile = viewport.width < 5;
    const count = isMobile ? 6 : 12;
    for (let i = 0; i < count; i++) {
      const points = [];
      const zOffset = -8 - Math.random() * 6; 
      
      // Enter from top-left, through center, exit bottom-right.
      const startY = 8 + (Math.random() - 0.5) * 10;
      const midY1 = 4 + (Math.random() - 0.5) * 8;
      const midY2 = -2 + (Math.random() - 0.5) * 8;
      const endY = -8 + (Math.random() - 0.5) * 10;
      
      const midX1 = -viewport.width / 4 + (Math.random() - 0.5) * 5;
      const midX2 = viewport.width / 4 + (Math.random() - 0.5) * 8;

      points.push(new THREE.Vector3(-viewport.width, startY, zOffset));
      points.push(new THREE.Vector3(midX1, midY1, zOffset + 2));
      points.push(new THREE.Vector3(midX2, midY2, zOffset + 1));
      points.push(new THREE.Vector3(viewport.width, endY, zOffset - 2));
      
      arr.push(new THREE.CatmullRomCurve3(points));
    }
    return arr;
  }, [viewport.width]);

  return (
    <group>
      {curves.map((curve, i) => {
        // 70% dark-blue/cyan, 20% cyan, 10% purple accent
        let color = config.coreColor; // Cyan by default
        const rand = Math.random();
        if (rand > 0.9) color = '#ffffff';
        else if (rand > 0.68) color = '#ef4444';
        else color = '#dc2626';

        return <WirePacket key={i} curve={curve} speed={config.flowSpeed * 0.06} color={color} reducedMotion={reducedMotion} />
      })}
    </group>
  );
}

const BackgroundGlow = ({ config }: { config: any }) => {
  return (
    <group>
      <mesh position={[4, 0, -10]} scale={20}>
        <planeGeometry />
        <meshBasicMaterial color={config.coreColor} transparent opacity={0.04} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[6, -4, -12]} scale={15}>
        <planeGeometry />
        <meshBasicMaterial color="#dc2626" transparent opacity={0.02} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};

const Scene = ({ config, reducedMotion }: { config: any, reducedMotion: boolean }) => {
  const { camera } = useThree();
  
  useFrame((state) => {
    if (reducedMotion) return;
    // Very subtle camera drift to give the scene a bit of life without large parallax
    const targetX = (state.pointer.x * 0.5);
    const targetY = (state.pointer.y * 0.5);
    camera.position.x += (targetX - camera.position.x) * 0.01;
    camera.position.y += (targetY - camera.position.y) * 0.01;
    camera.lookAt(0, 0, 0);
  });
  
  return (
    <>
      <BackgroundGlow config={config} />
      <DataWires config={config} reducedMotion={reducedMotion} />
    </>
  );
};

export const HeroScene = () => {
  const reducedMotion = useReducedMotion();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpacity(1), 500);
    return () => window.clearTimeout(timer);
  }, []);

  const config = {
    particleAmount: 25,
    wireBrightness: 1.0,
    flowSpeed: 0.6,
    coreColor: '#dc2626',
    wireColor: '#7f1d1d'
  };

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ease-in-out"
      style={{ opacity }}
      aria-hidden="true"
    >
      <HeroErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 35, near: 0.1, far: 100 }}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={<SceneFallback />}>
            <Scene config={config} reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      </HeroErrorBoundary>
    </div>
  );
};
