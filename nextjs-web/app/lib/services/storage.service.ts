import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export class StorageService {
    private static BUCKET_NAME = '3d-models';

    /**
     * Uploads a file to Supabase Storage
     */
    static async uploadFile(file: File | Blob, path: string): Promise<string> {
        try {
            const { data, error } = await supabase.storage
                .from(this.BUCKET_NAME)
                .upload(path, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (error) {
                throw error;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(this.BUCKET_NAME)
                .getPublicUrl(path);

            return publicUrl;
        } catch (error) {
            console.error('Storage upload error:', error);
            throw new Error('Failed to upload file to storage');
        }
    }

    /**
     * Uploads a model file from a URL (e.g. from Kiri Engine)
     */
    static async uploadFromUrl(url: string, filename: string): Promise<string> {
        try {
            // Fetch the file
            const response = await fetch(url);
            const blob = await response.blob();

            // Upload to Supabase
            return await this.uploadFile(blob, filename);
        } catch (error) {
            console.error('Upload from URL error:', error);
            throw new Error(`Failed to upload from URL: ${url}`);
        }
    }

    /**
     * Deletes a file from storage
     */
    static async deleteFile(path: string): Promise<void> {
        const { error } = await supabase.storage
            .from(this.BUCKET_NAME)
            .remove([path]);

        if (error) {
            throw error;
        }
    }

    /**
     * Downloads a model from a URL as a Blob
     */
    static async downloadModelAsBlob(url: string): Promise<Blob> {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to download model');
        return await response.blob();
    }

    /**
     * Uploads a model blob to storage and returns the public URL
     */
    static async uploadModel(blob: Blob, fileName: string): Promise<string> {
        return await this.uploadFile(blob, `models/${fileName}`);
    }

    /**
     * Creates a record in the dishes table
     */
    static async createModelRecord(data: { name: string; model_url: string; status: string }): Promise<any> {
        const { data: record, error } = await supabase
            .from('dishes')
            .insert([
                {
                    name: data.name,
                    model_url: data.model_url,
                    price: 0, // Default
                    category: 'Uncategorized', // Default
                    generation_status: data.status,
                    is_active: false
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return record;
    }
}