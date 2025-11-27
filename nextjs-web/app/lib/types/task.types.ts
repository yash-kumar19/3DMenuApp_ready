export interface GenerationTask {
    id: string;
    modelName: string;
    status: 'uploading' | 'processing' | 'complete' | 'failed';
    progress: number;
    message: string;
    kiriTaskId?: string;
    modelUrl?: string;
    error?: string;
    createdAt: number;
    completedAt?: number;
}

export interface TaskQueueState {
    tasks: GenerationTask[];
    activeCount: number;
}

export type KiriTaskStatus = 'uploading' | 'processing' | 'succeeded' | 'failed';

export interface KiriTaskResponse {
    taskId: string;
    status: KiriTaskStatus;
    progress: number;
    result?: {
        modelUrl: string;
        thumbnailUrl: string;
    };
}
