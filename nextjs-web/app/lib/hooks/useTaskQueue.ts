import { useState, useEffect, useRef, useCallback } from 'react';
import { GenerationTask } from '../types/task.types';
import { KiriService } from '../services/kiri.service';
import { StorageService } from '../services/storage.service';
import { BlenderService } from '../services/blender.service';

export function useTaskQueue() {
    const [tasks, setTasks] = useState<GenerationTask[]>([]);
    const workerRef = useRef<Worker | null>(null);

    // Initialize worker
    useEffect(() => {
        if (typeof window !== 'undefined') {
            workerRef.current = new Worker('/workers/kiri-worker.js');

            // Listen for messages from worker
            workerRef.current.onmessage = (event) => {
                const { type, payload } = event.data;

                switch (type) {
                    case 'PROGRESS':
                        updateTaskProgress(payload.taskId, {
                            status: 'processing',
                            progress: payload.progress,
                            message: payload.message,
                        });
                        break;

                    case 'COMPLETE':
                        handleTaskComplete(payload.taskId, payload.modelUrl);
                        break;

                    case 'ERROR':
                        updateTaskProgress(payload.taskId, {
                            status: 'failed',
                            progress: 0,
                            message: payload.message,
                            error: payload.error,
                            completedAt: Date.now(),
                        });
                        break;
                }
            };
        }

        // Load tasks from localStorage
        const savedTasks = localStorage.getItem('generationTasks');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }

        // Cleanup
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, []);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        if (tasks.length > 0) {
            localStorage.setItem('generationTasks', JSON.stringify(tasks));
        }
    }, [tasks]);

    // Update task progress
    const updateTaskProgress = useCallback((taskId: string, updates: Partial<GenerationTask>) => {
        setTasks(prev => prev.map(task =>
            task.kiriTaskId === taskId ? { ...task, ...updates } : task
        ));
    }, []);

    // Handle task completion
    const handleTaskComplete = useCallback(async (kiriTaskId: string, kiriModelUrl: string) => {
        const task = tasks.find(t => t.kiriTaskId === kiriTaskId);
        if (!task) return;

        try {
            // Update to post-processing
            updateTaskProgress(kiriTaskId, {
                progress: 80,
                message: 'Processing model...',
            });

            // Download and process model
            const cleanupResult = await BlenderService.cleanupModel(kiriModelUrl);
            const modelBlob = await StorageService.downloadModelAsBlob(cleanupResult.cleanedModelUrl);

            const fileName = `${task.modelName.replace(/\s+/g, '_')}_${Date.now()}.glb`;
            const publicUrl = await StorageService.uploadModel(modelBlob, fileName);

            // Create database record
            await StorageService.createModelRecord({
                name: task.modelName,
                model_url: publicUrl,
                status: 'ready',
            });

            // Mark as complete
            updateTaskProgress(kiriTaskId, {
                status: 'complete',
                progress: 100,
                message: 'Model ready!',
                modelUrl: publicUrl,
                completedAt: Date.now(),
            });

        } catch (error: any) {
            updateTaskProgress(kiriTaskId, {
                status: 'failed',
                message: 'Failed to process model',
                error: error.message,
                completedAt: Date.now(),
            });
        }
    }, [tasks, updateTaskProgress]);

    // Add new task
    const addTask = useCallback(async (modelName: string, files: File[]) => {
        const taskId = `task_${Date.now()}`;

        // Create initial task
        const newTask: GenerationTask = {
            id: taskId,
            modelName,
            status: 'uploading',
            progress: 0,
            message: 'Uploading images...',
            createdAt: Date.now(),
        };

        setTasks(prev => [newTask, ...prev]);

        try {
            // Upload to Kiri
            const uploadResult = await KiriService.uploadImages(files);

            // Update with Kiri task ID
            setTasks(prev => prev.map(task =>
                task.id === taskId ? { ...task, kiriTaskId: uploadResult.taskId } : task
            ));

            // Start background polling
            if (workerRef.current) {
                workerRef.current.postMessage({
                    type: 'START_POLLING',
                    payload: {
                        taskId: uploadResult.taskId,
                        modelName,
                        pollInterval: 5000,
                    },
                });
            }

        } catch (error: any) {
            setTasks(prev => prev.map(task =>
                task.id === taskId ? {
                    ...task,
                    status: 'failed',
                    message: 'Upload failed',
                    error: error.message,
                    completedAt: Date.now(),
                } : task
            ));
        }
    }, []);

    // Remove task
    const removeTask = useCallback((taskId: string) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));

        // Also remove from localStorage
        const savedTasks = localStorage.getItem('generationTasks');
        if (savedTasks) {
            const parsed = JSON.parse(savedTasks);
            const filtered = parsed.filter((t: GenerationTask) => t.id !== taskId);
            localStorage.setItem('generationTasks', JSON.stringify(filtered));
        }
    }, []);

    // Clear all completed tasks
    const clearCompleted = useCallback(() => {
        setTasks(prev => prev.filter(task => task.status !== 'complete'));
    }, []);

    return {
        tasks,
        addTask,
        removeTask,
        clearCompleted,
        activeCount: tasks.filter(t => t.status === 'uploading' || t.status === 'processing').length,
    };
}
