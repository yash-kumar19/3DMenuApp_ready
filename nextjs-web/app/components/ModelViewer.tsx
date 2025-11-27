"use client";

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

interface ModelViewerProps {
    modelUrl: string;
}

function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={2} />;
}

export function ModelViewer({ modelUrl }: ModelViewerProps) {
    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <Suspense fallback={null}>
                    <Model url={modelUrl} />
                    <Environment preset="studio" />
                </Suspense>
                <OrbitControls enableZoom={true} enablePan={false} />
            </Canvas>
        </div>
    );
}
