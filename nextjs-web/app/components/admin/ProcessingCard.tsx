'use client';

import { GenerationTask } from '@/lib/types/task.types';
import { Loader2, Check, X, Download, Trash2 } from 'lucide-react';

interface ProcessingCardProps {
    task: GenerationTask;
    onRemove?: () => void;
}

export function ProcessingCard({ task, onRemove }: ProcessingCardProps) {
    const getStatusColor = () => {
        switch (task.status) {
            case 'complete': return 'bg-green-500';
            case 'failed': return 'bg-red-500';
            case 'uploading': return 'bg-blue-500';
            case 'processing': return 'bg-purple-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusIcon = () => {
        switch (task.status) {
            case 'complete': return <Check className="w-5 h-5" />;
            case 'failed': return <X className="w-5 h-5" />;
            default: return <Loader2 className="w-5 h-5 animate-spin" />;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{task.modelName}</h3>
                    <p className="text-sm text-gray-500 mt-1">{task.message}</p>
                </div>

                <div className={`${getStatusColor()} text-white p-2 rounded-lg`}>
                    {getStatusIcon()}
                </div>
            </div>

            {/* Progress Bar */}
            {(task.status === 'uploading' || task.status === 'processing') && (
                <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{task.status === 'uploading' ? 'Uploading' : 'Processing'}</span>
                        <span>{Math.round(task.progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${getStatusColor()} transition-all duration-300`}
                            style={{ width: `${task.progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4">
                {task.status === 'complete' && task.modelUrl && (
                    <a
                        href={task.modelUrl}
                        download
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Download Model
                    </a>
                )}

                {task.status === 'failed' && task.error && (
                    <div className="text-sm text-red-600 flex-1">
                        Error: {task.error}
                    </div>
                )}

                {(task.status === 'complete' || task.status === 'failed') && onRemove && (
                    <button
                        onClick={onRemove}
                        className="ml-auto p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Timestamp */}
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                {task.completedAt ? (
                    <span>Completed {new Date(task.completedAt).toLocaleTimeString()}</span>
                ) : (
                    <span>Started {new Date(task.createdAt).toLocaleTimeString()}</span>
                )}
            </div>
        </div>
    );
}
