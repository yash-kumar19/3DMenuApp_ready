import { useState, useEffect, useRef, RefObject } from 'react';
import { blurDetector } from '../ai/blurDetector';

export function useBlurDetector(
    videoRef: RefObject<HTMLVideoElement | null>,
    enabled: boolean = true
) {
    const [isBlurred, setIsBlurred] = useState(false);
    const [blurScore, setBlurScore] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!enabled || !videoRef.current) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        // Check every 500ms (less frequent than quality check)
        intervalRef.current = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
                const score = await blurDetector.detectBlur(videoRef.current);
                setBlurScore(score);
                setIsBlurred(score < 60); // Threshold for blur
            }
        }, 500);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [enabled, videoRef]);

    return { isBlurred, blurScore };
}