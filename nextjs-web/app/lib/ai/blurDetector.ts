export class BlurDetector {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
        } else {
            this.canvas = null as any;
            this.ctx = null;
        }
    }

    /**
     * Detects blur in a video frame
     * Returns a score from 0-100 (higher is sharper)
     */
    async detectBlur(video: HTMLVideoElement): Promise<number> {
        if (!this.ctx || !video.videoWidth) return 0;

        // Resize for performance
        const width = 256;
        const height = 144;

        this.canvas.width = width;
        this.canvas.height = height;

        this.ctx.drawImage(video, 0, 0, width, height);

        const imageData = this.ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Convert to grayscale
        const grayData = new Uint8Array(width * height);
        for (let i = 0; i < data.length; i += 4) {
            // R*0.299 + G*0.587 + B*0.114
            grayData[i / 4] = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        }

        // Calculate Laplacian variance (simplified edge detection)
        // High variance = sharp edges = good quality
        // Low variance = few edges = blurry

        let mean = 0;
        for (let i = 0; i < grayData.length; i++) {
            mean += grayData[i];
        }
        mean /= grayData.length;

        let variance = 0;
        for (let i = 0; i < grayData.length; i++) {
            variance += Math.pow(grayData[i] - mean, 2);
        }
        variance /= grayData.length;

        // Normalize score (approximate)
        // Variance usually ranges 0-1000+ for images
        // We'll cap it at 500 for "perfect" sharpness
        const score = Math.min(100, (variance / 500) * 100);

        return Math.round(score);
    }
}

export const blurDetector = new BlurDetector();