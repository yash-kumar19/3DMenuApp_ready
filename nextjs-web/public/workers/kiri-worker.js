/**
 * Kiri Engine Polling Worker
 * Runs in background thread to poll Kiri API
 * Supports multiple simultaneous tasks
 */

// Message types
const MSG_TYPE = {
    START_POLLING: 'START_POLLING',
    PROGRESS: 'PROGRESS',
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR',
    STOP: 'STOP'
};

// Active polling tasks
const activeTasks = new Map();

// Listen for messages from main thread
self.addEventListener('message', async (event) => {
    const { type, payload } = event.data;

    switch (type) {
        case MSG_TYPE.START_POLLING:
            startPolling(payload.taskId, payload.modelName, payload.pollInterval || 5000);
            break;

        case MSG_TYPE.STOP:
            stopPolling(payload.taskId);
            break;
    }
});

/**
 * Start polling Kiri API for task status
 */
function startPolling(taskId, modelName, interval) {
    // Don't start if already polling this task
    if (activeTasks.has(taskId)) {
        return;
    }

    let attempts = 0;
    const maxAttempts = 60; // 5 min total (60 * 5s)

    // Send initial progress
    sendMessage(MSG_TYPE.PROGRESS, {
        taskId,
        modelName,
        status: 'processing',
        progress: 0,
        message: 'Starting 3D generation...'
    });

    // Poll function
    const poll = async () => {
        try {
            attempts++;

            // Call Kiri API
            const response = await fetch(`/api/kiri/poll?taskId=${taskId}`);

            if (!response.ok) {
                throw new Error(`Polling failed: ${response.statusText}`);
            }

            const data = await response.json();

            // Calculate progress
            const progress = data.progress || (attempts / maxAttempts) * 100;

            // Send progress update
            sendMessage(MSG_TYPE.PROGRESS, {
                taskId,
                modelName,
                status: data.status,
                progress: Math.min(progress, 99),
                message: getStatusMessage(data.status, progress)
            });

            // Check if complete
            if (data.status === 'complete') {
                stopPolling(taskId);
                sendMessage(MSG_TYPE.COMPLETE, {
                    taskId,
                    modelName,
                    modelUrl: data.modelUrl,
                    message: '3D model ready!'
                });
                return;
            }

            // Check if failed
            if (data.status === 'failed') {
                stopPolling(taskId);
                sendMessage(MSG_TYPE.ERROR, {
                    taskId,
                    modelName,
                    error: data.errorMessage || 'Generation failed',
                    message: 'Failed to generate 3D model'
                });
                return;
            }

            // Check timeout
            if (attempts >= maxAttempts) {
                stopPolling(taskId);
                sendMessage(MSG_TYPE.ERROR, {
                    taskId,
                    modelName,
                    error: 'Timeout exceeded',
                    message: 'Generation took too long'
                });
                return;
            }

        } catch (error) {
            stopPolling(taskId);
            sendMessage(MSG_TYPE.ERROR, {
                taskId,
                modelName,
                error: error.message,
                message: 'Error during generation'
            });
        }
    };

    // Initial poll
    poll();

    // Set up interval polling
    const intervalId = setInterval(poll, interval);
    activeTasks.set(taskId, intervalId);
}

/**
 * Stop polling for a specific task
 */
function stopPolling(taskId) {
    const intervalId = activeTasks.get(taskId);
    if (intervalId) {
        clearInterval(intervalId);
        activeTasks.delete(taskId);
    }
}

/**
 * Send message to main thread
 */
function sendMessage(type, payload) {
    self.postMessage({ type, payload });
}

/**
 * Get user-friendly status message
 */
function getStatusMessage(status, progress) {
    if (status === 'queued') return 'Waiting in queue...';
    if (status === 'processing') {
        if (progress < 30) return 'Analyzing images...';
        if (progress < 60) return 'Building 3D mesh...';
        if (progress < 90) return 'Optimizing model...';
        return 'Finalizing...';
    }
    return 'Processing...';
}
