import { StabilityDetectionResult } from '../types/ai.types';

export class StabilityDetector {
    private lastX: number = 0;
    private lastY: number = 0;
    private lastZ: number = 0;
    private lastTime: number = 0;
    private motionHistory: number[] = [];
    private isListening: boolean = false;

    constructor() {
        if (typeof window !== 'undefined') {
            this.startListening();
        }
    }

    private startListening() {
        if (this.isListening) return;

        if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', this.handleMotion);
            this.isListening = true;
        }
    }

    public stopListening() {
        if (!this.isListening) return;

        if (typeof window !== 'undefined') {
            window.removeEventListener('devicemotion', this.handleMotion);
            this.isListening = false;
        }
    }

    private handleMotion = (event: DeviceMotionEvent) => {
        const { x, y, z } = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
        const now = Date.now();

        if (this.lastTime > 0) {
            const deltaX = Math.abs((x || 0) - this.lastX);
            const deltaY = Math.abs((y || 0) - this.lastY);
            const deltaZ = Math.abs((z || 0) - this.lastZ);

            const totalMotion = deltaX + deltaY + deltaZ;

            this.motionHistory.push(totalMotion);
            if (this.motionHistory.length > 10) {
                this.motionHistory.shift();
            }
        }

        this.lastX = x || 0;
        this.lastY = y || 0;
        this.lastZ = z || 0;
        this.lastTime = now;
    };

    /**
     * Checks current stability
     */
    checkStability(): StabilityDetectionResult {
        // If no motion data available (desktop), assume stable
        if (this.motionHistory.length === 0) {
            return {
                score: 100,
                passed: true,
                isStable: true,
                motionLevel: 'low',
                timeStable: 1000
            };
        }

        const avgMotion = this.motionHistory.reduce((a, b) => a + b, 0) / this.motionHistory.length;

        // Thresholds need tuning based on device
        const isStable = avgMotion < 1.5;
        const score = Math.max(0, 100 - (avgMotion * 20));

        return {
            score: Math.round(score),
            passed: isStable,
            isStable,
            motionLevel: avgMotion < 1.5 ? 'low' : avgMotion < 4 ? 'medium' : 'high',
            timeStable: isStable ? 1000 : 0 // Mock time stable
        };
    }
}

export const stabilityDetector = new StabilityDetector();