import { useState } from 'react';
import { useKiriGenerator } from './useKiriGenerator';
import { useModelUpload } from './useModelUpload';

export function useCaptureWorkflow() {
    const { generateModel, isGenerating, progress: genProgress, error: genError } = useKiriGenerator();
    const { uploadModel, isUploading, progress: uploadProgress, error: uploadError } = useModelUpload();

    const [workflowStatus, setWorkflowStatus] = useState<'idle' | 'generating' | 'uploading' | 'complete' | 'failed'>('idle');

    const processAndUpload = async (photos: File[], name: string) => {
        setWorkflowStatus('generating');

        try {
            // 1. Generate 3D Model via Kiri Engine
            const modelUrl = await generateModel(name, photos);

            if (!modelUrl) {
                throw new Error('Failed to generate model URL');
            }

            // 2. Upload to our storage (if needed, or just save the URL)
            // For this workflow, we might want to download the result and re-upload to our bucket
            // so we own the file.

            setWorkflowStatus('uploading');

            // Download the model from Kiri (mocked URL in this case)
            const response = await fetch(modelUrl);
            const blob = await response.blob();
            const file = new File([blob], `${name}.glb`, { type: 'model/gltf-binary' });

            // Upload to our system
            await uploadModel(file, name, 'Uncategorized', 0);

            setWorkflowStatus('complete');
            return true;

        } catch (error) {
            console.error('Workflow failed:', error);
            setWorkflowStatus('failed');
            throw error;
        }
    };

    return {
        processAndUpload,
        isProcessing: isGenerating || isUploading,
        progress: (genProgress + uploadProgress) / 2,
        status: workflowStatus,
        error: genError || uploadError
    };
}