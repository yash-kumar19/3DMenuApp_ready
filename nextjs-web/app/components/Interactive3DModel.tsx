"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { Move, RotateCw } from "lucide-react";

// ======================= MODEL =======================
function Model({ dragRotation, returning }) {
  const group = useRef<any>();
  const { scene } = useGLTF("/models/dish.glb");

  useFrame(() => {
    if (!group.current) return;

    const rot = dragRotation.current;

    // Apply rotation
    group.current.rotation.y = rot.y;
    group.current.rotation.x = rot.x;

    // Smooth return animation
    if (returning) {
      rot.y *= 0.92;
      rot.x *= 0.85;
    }

    // Auto-spin when not dragging or returning
    if (!returning) {
      rot.y += 0.0012; // slower, premium spin
    }
  });

  return <primitive object={scene} scale={25} ref={group} />;
}

// ======================= MAIN COMPONENT =======================
export default function Interactive3DModel() {
  const dragRotation = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0 });

  const [dragging, setDragging] = useState(false);
  const [returning, setReturning] = useState(false);

  // MOUSE DOWN
  const onDown = (e) => {
    setDragging(true);
    setReturning(false);
    last.current = { x: e.clientX, y: e.clientY };
  };

  // MOUSE MOVE
  const onMove = (e) => {
    if (!dragging) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    dragRotation.current.y += dx * 0.01;
    dragRotation.current.x += dy * 0.01;
    dragRotation.current.x = Math.min(0.4, Math.max(-0.4, dragRotation.current.x));

    last.current = { x: e.clientX, y: e.clientY };
  };

  // MOUSE UP — return to original + resume spin smoothly
  const onUp = () => {
    if (!dragging) return;

    setDragging(false);
    setReturning(true);

    const interval = setInterval(() => {
      dragRotation.current.y *= 0.90;
      dragRotation.current.x *= 0.85;

      const done =
        Math.abs(dragRotation.current.y) < 0.01 &&
        Math.abs(dragRotation.current.x) < 0.01;

      if (done) {
        dragRotation.current.y = 0;
        dragRotation.current.x = 0;

        clearInterval(interval);

        // resume auto rotation
        setReturning(false);
      }
    }, 16);
  };

  return (
    <div
      className="relative w-full h-[380px] lg:h-[480px]"
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
    >
      {/* 3D CANVAS */}
      <Canvas
        camera={{ position: [0, 1.5, 7], fov: 50 }}
        className="w-full h-full"
      >
        {/* Premium lighting */}
        <ambientLight intensity={2.0} />
        <directionalLight position={[5, 5, 5]} intensity={2.2} />
        <Environment preset="sunset" />

        <Suspense fallback={null}>
          <Model dragRotation={dragRotation} returning={returning} />
        </Suspense>
      </Canvas>

      {/* Buttons */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-4">
        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-xl">
          <Move className="w-4 h-4 text-blue-300" />
          <span className="text-sm text-blue-200">Drag to Rotate</span>
        </div>

        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-xl">
          <RotateCw
            className="w-4 h-4 text-blue-300 animate-spin"
            style={{ animationDuration: "5s" }}
          />
          <span className="text-sm text-blue-200">Auto Rotating</span>
        </div>
      </div>
    </div>
  );
}
