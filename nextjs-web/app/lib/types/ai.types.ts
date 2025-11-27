/**
 * AI detection results
 */
export interface BlurDetectionResult {
    score: number;            // 0-100 (higher = sharper)
    passed: boolean;
    confidence: number;       // 0-1
    variance: number;         // Laplacian variance
}
export interface StabilityDetectionResult {
    score: number;            // 0-100
    passed: boolean;
    isStable: boolean;
    motionLevel: 'low' | 'medium' | 'high';
    timeStable: number;       // ms stable
}
export interface QualityCheckResult {
    blur: BlurDetectionResult;
    stability: StabilityDetectionResult;
    exposure: { score: number; passed: boolean };
    centering: { score: number; passed: boolean };
    overall: number;
}
export interface AIDetectorConfig {
    blurThreshold: number;
    stabilityThreshold: number;
    autoCaptureDuration: number;
    minQualityScore: number;
}