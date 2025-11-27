/**
 * Kiri Engine & Blender API types
 */
export interface KiriUploadResponse {
    taskId: string;
    status: 'queued' | 'processing';
    message?: string;
}
export interface KiriTaskStatus {
    taskId: string;
    status: 'queued' | 'processing' | 'complete' | 'failed';
    progress?: number;
    modelUrl?: string;
    errorMessage?: string;
}
export interface BlenderCleanupPayload {
    modelUrl: string;
    options?: {
        decimateRatio?: number;
        removeNoise?: boolean;
    };
}
export interface BlenderCleanupResponse {
    cleanedModelUrl: string;
    stats?: {
        vertices: number;
        faces: number;
    };
}