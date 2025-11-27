import { useState, useEffect, useRef, RefObject } from 'react';
import { qualityClassifier } from '../ai/qualityClassifier';
import { QualityCheckResult } from '../types/ai.types';

export function useQualityCheck(
    videoRef: RefObject<HTMLVideoElement | null>,
    enabled: boolean = true
) {
    const [quality, setQuality] = useState<QualityCheckResult | null>(null);
    const [isGoodQuality, setIsGoodQuality] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!enabled || !videoRef.current) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        // Check every 300ms for responsive feedback
        intervalRef.current = setInterval(() => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
                const result = qualityClassifier.analyzeFrame(videoRef.current);
                setQuality(result);
                setIsGoodQuality(result.overall >= 70);
            }
        }, 300);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [enabled, videoRef]);

    return { quality, isGoodQuality };
}
