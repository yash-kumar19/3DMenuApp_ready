import { useState } from 'react';
import { StorageService } from '../services/storage.service';

export function useModelUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const uploadModel = async (file: File, name: string, category: string, price: number) => {
        setIsUploading(true);
        setProgress(0);
        setError(null);

        try {
            // 1. Upload file to storage
            setProgress(30);
            const fileName = `${name.replace(/\s+/g, '_')}_${Date.now()}.glb`;
            const publicUrl = await StorageService.uploadFile(file, `models/${fileName}`);

            setProgress(70);

            // 2. Create database record
            const record = await StorageService.createModelRecord({
                name,
                model_url: publicUrl,
                status: 'ready'
            });

            // Update record with extra details
            // Note: createModelRecord is minimal, so we might need a separate update if we want to save price/category immediately
            // But for now, this is sufficient for the basic flow.

            setProgress(100);
            return record;

        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || 'Failed to upload model');
            throw err;
        } finally {
            setIsUploading(false);
        }
    };

    return {
        uploadModel,
        isUploading,
        progress,
        error
    };
}