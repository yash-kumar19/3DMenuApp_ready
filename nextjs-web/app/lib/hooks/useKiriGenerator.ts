import { useState } from 'react';
import { KiriService } from '../services/kiri.service';
import { KiriTaskResponse } from '../types/task.types';

export function useKiriGenerator() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<string>('idle');
    const [error, setError] = useState<string | null>(null);

    const generateModel = async (modelName: string, photos: File[]) => {
        setIsGenerating(true);
        setProgress(0);
        setStatus('uploading');
        setError(null);

        try {
            // 1. Upload images
            const { taskId: uploadTaskId } = await KiriService.uploadImages(photos);
            setProgress(30);
            setStatus('processing');

            // 2. Start generation (using the upload task ID or similar)
            // In this mock flow, we just use the upload ID to simulate the process
            const generationTaskId = await KiriService.initiateGeneration(modelName, [uploadTaskId]);

            // 3. Poll for completion
            const result = await KiriService.waitForCompletion(generationTaskId);

            setProgress(100);
            setStatus('complete');

            return result.result?.modelUrl;

        } catch (err: any) {
            console.error('Generation failed:', err);
            setError(err.message || 'Failed to generate model');
            setStatus('failed');
            throw err;
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        generateModel,
        isGenerating,
        progress,
        status,
        error
    };
}