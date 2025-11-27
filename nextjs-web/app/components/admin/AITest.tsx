'use client';

import { useRef, useEffect, useState } from 'react';
import { useQualityCheck } from '@/lib/hooks/useQualityCheck';

export function AITest() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const { quality, isGoodQuality } = useQualityCheck(videoRef, cameraReady);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraReady(true);
        }
      });
  }, []);

  return (
    <div className="p-4">
      <video ref={videoRef} className="w-full max-w-md" autoPlay muted />

      {quality && (
        <div className="mt-4 space-y-2 text-white">
          <div>Overall: {quality.overall}/100</div>
          <div>Blur: {quality.blur.score}/100 {quality.blur.passed ? '✅' : '❌'}</div>
          <div>Stability: {quality.stability.score}/100 {quality.stability.passed ? '✅' : '❌'}</div>
          <div>Exposure: {quality.exposure.score}/100 {quality.exposure.passed ? '✅' : '❌'}</div>
          <div className={isGoodQuality ? 'text-green-500' : 'text-red-500'}>
            {isGoodQuality ? 'Ready to capture!' : 'Adjust camera...'}
          </div>
        </div>
      )}
    </div>
  );
}