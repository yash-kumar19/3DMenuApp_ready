export class BlenderService {
    private static SERVICE_URL = process.env.BLENDER_SERVICE_URL || 'http://localhost:8080';

    /**
     * Sends a model to the Blender service for cleanup
     */
    static async cleanupModel(glbUrl: string, targetFaces: number = 50000): Promise<Blob> {
        try {
            console.log(`[BlenderService] Starting cleanup for: ${glbUrl}`);

            const response = await fetch(`${this.SERVICE_URL}/cleanup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    glb_url: glbUrl,
                    target_faces: targetFaces
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Blender service failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            // Return the cleaned GLB file as a Blob
            return await response.blob();

        } catch (error) {
            console.error('[BlenderService] Cleanup error:', error);
            throw error;
        }
    }

    /**
     * Checks if the Blender service is healthy
     */
    static async checkHealth(): Promise<boolean> {
        try {
            const response = await fetch(`${this.SERVICE_URL}/health`);
            return response.ok;
        } catch (error) {
            console.error('[BlenderService] Health check failed:', error);
            return false;
        }
    }
}