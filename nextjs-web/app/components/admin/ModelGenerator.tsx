"use client";

import { useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, Wand2, Eye, Plus, X, Loader2, Check, AlertCircle, ChevronRight, Trash2, Download, Video, RotateCw, ZoomIn, Lightbulb, Settings as SettingsIcon, ChevronDown, Save, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Guided3DCapture } from './Guided3DCapture';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { useTaskQueue } from '@/lib/hooks/useTaskQueue';
import { ProcessingCard } from './ProcessingCard';

interface GeneratedModel {
    id: number;
    name: string;
    thumbnail: string;
    modelUrl: string;
    status: 'ready' | 'error' | 'processing';
    timestamp: Date;
    category?: string;
}

export function ModelGenerator() {
    const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
    const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
    const [detailLevel, setDetailLevel] = useState([75]);
    const [lightingStyle, setLightingStyle] = useState('Studio');
    const [outputFormat, setOutputFormat] = useState<string[]>(['.glb']);
    const [autoCleanup, setAutoCleanup] = useState(true);
    const [textureEnhancement, setTextureEnhancement] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState('');
    const [logs, setLogs] = useState<string[]>([]);
    const [generatedModel, setGeneratedModel] = useState<string | null>(null);
    const [showGuidedCapture, setShowGuidedCapture] = useState(false);

    // Generated Models Library State
    const [generatedModels, setGeneratedModels] = useState<GeneratedModel[]>([
        {
            id: 1,
            name: 'Gourmet Burger Supreme',
            thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
            modelUrl: '/models/burger.glb',
            status: 'ready',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
            id: 2,
            name: 'Margherita Pizza Classic',
            thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
            modelUrl: '/models/pizza.glb',
            status: 'ready',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        },
        {
            id: 3,
            name: 'Grilled Atlantic Salmon',
            thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
            modelUrl: '/models/salmon.glb',
            status: 'processing',
            timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
        },
        {
            id: 4,
            name: 'Caesar Salad Bowl',
            thumbnail: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
            modelUrl: '/models/salad.glb',
            status: 'ready',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
            id: 5,
            name: 'Chocolate Lava Cake',
            thumbnail: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
            modelUrl: '/models/cake.glb',
            status: 'error',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
    ]);

    const [selectedModelForMenu, setSelectedModelForMenu] = useState<GeneratedModel | null>(null);
    const [isAddToMenuModalOpen, setIsAddToMenuModalOpen] = useState(false);
    const [previewModel, setPreviewModel] = useState<GeneratedModel | null>(null);
    const [isPreviewPanelOpen, setIsPreviewPanelOpen] = useState(false);

    // Form state for "Add to Menu" modal
    const [menuFormData, setMenuFormData] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
    });

    // Task queue for background processing
    const taskQueue = useTaskQueue();

    const lightingStyles = ['Studio', 'Sunset', 'Restaurant', 'Soft White'];
    const outputFormats = ['.glb', '.gltf', '.usdz'];
    const categories = ['Burgers', 'Pizza', 'Pasta', 'Seafood', 'Salads', 'Desserts', 'Appetizers', 'Drinks'];

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const urls = Array.from(files).map(file => URL.createObjectURL(file));
            setUploadedPhotos([...uploadedPhotos, ...urls]);
        }
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedVideo(URL.createObjectURL(file));
        }
    };

    const removePhoto = (index: number) => {
        setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
    };

    const toggleOutputFormat = (format: string) => {
        if (outputFormat.includes(format)) {
            setOutputFormat(outputFormat.filter(f => f !== format));
        } else {
            setOutputFormat([...outputFormat, format]);
        }
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        setProgress(0);
        setLogs([]);
        setGeneratedModel(null);

        const messages = [
            'Initializing AI engine...',
            'Processing uploaded images...',
            'Detecting object boundaries...',
            'Extracting depth information...',
            'Building 3D mesh structure...',
            'Applying textures and materials...',
            'Enhancing surface details...',
            'Optimizing polygon count...',
            'Applying lighting effects...',
            'Finalizing 3D model...',
            'Generation complete!',
        ];

        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < messages.length) {
                setStatusMessage(messages[currentStep]);
                setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${messages[currentStep]}`]);
                setProgress(((currentStep + 1) / messages.length) * 100);
                currentStep++;
            } else {
                clearInterval(interval);
                setIsGenerating(false);
                setGeneratedModel('generated');

                // Add to library
                const newModel: GeneratedModel = {
                    id: generatedModels.length + 1,
                    name: `AI Generated Dish ${generatedModels.length + 1}`,
                    thumbnail: uploadedPhotos[0] || 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
                    modelUrl: '/models/new-model.glb',
                    status: 'ready',
                    timestamp: new Date(),
                };
                setGeneratedModels([newModel, ...generatedModels]);
            }
        }, 800);
    };

    const getDetailLabel = (value: number) => {
        if (value < 33) return 'Draft';
        if (value < 66) return 'Standard';
        return 'High Detail';
    };

    const handleOpenAddToMenuModal = (model: GeneratedModel) => {
        setSelectedModelForMenu(model);
        setMenuFormData({
            name: model.name,
            category: '',
            price: '',
            description: '',
        });
        setIsAddToMenuModalOpen(true);
    };

    const handleSaveToMenu = () => {
        // Here you would typically save to your backend/database
        alert(`"${menuFormData.name}" has been added to your menu!`);
        setIsAddToMenuModalOpen(false);
        setMenuFormData({ name: '', category: '', price: '', description: '' });
    };

    const handleOpenPreviewPanel = (model: GeneratedModel) => {
        setPreviewModel(model);
        setIsPreviewPanelOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ready':
                return (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Check className="w-3 h-3 mr-1" />
                        Ready
                    </Badge>
                );
            case 'processing':
                return (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Processing
                    </Badge>
                );
            case 'error':
                return (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Error
                    </Badge>
                );
        }
    };

    const formatTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const handleCaptureComplete = (photos: File[], modelName: string) => {
        setShowGuidedCapture(false);

        // Add to task queue (starts background processing immediately)
        taskQueue.addTask(modelName, photos);

        console.log(`Task added: ${modelName} with ${photos.length} photos`);
    };

    return (
        <div className="min-h-screen py-8 md:py-12 px-4">
            {/* Background Gradients */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#050505] via-[#0B0F1A] to-[#111827] pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.08)_0%,transparent_50%)] pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.06)_0%,transparent_50%)] pointer-events-none" />

            <div className="container mx-auto max-w-7xl relative z-10">

                {/* Header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-4">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-blue-400">Powered by AI</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl mb-3 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                        3D Food Model Generator
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400">Upload dish photos and generate stunning 3D models.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 md:gap-8">

                    {/* Main Content - Left Side (2 columns) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* PRIMARY CTA: Guided Capture */}
                        <div className="relative rounded-2xl md:rounded-3xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/5 border-2 border-purple-500/30 backdrop-blur-xl p-6 md:p-8 shadow-2xl shadow-purple-500/20 overflow-hidden">
                            {/* Animated glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-blue-500/0 animate-pulse pointer-events-none" />
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 backdrop-blur-sm mb-4 shadow-lg shadow-purple-500/20">
                                    <Sparkles className="w-4 h-4 text-purple-300" />
                                    <span className="text-sm text-purple-200">Recommended</span>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-2xl md:text-3xl mb-2 bg-gradient-to-r from-white via-purple-100 to-blue-200 bg-clip-text text-transparent">
                                            Guided Capture Mode
                                        </h3>
                                        <p className="text-gray-300 text-base mb-1">
                                            Follow guided steps to capture the perfect set of photos for high-quality 3D models.
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Get professional results with AI-powered guidance
                                        </p>
                                    </div>

                                    <Button
                                        onClick={() => setShowGuidedCapture(true)}
                                        className="h-16 px-8 md:px-10 bg-gradient-to-r from-purple-500 via-purple-600 to-blue-600 hover:from-purple-600 hover:via-purple-700 hover:to-blue-700 text-white rounded-2xl shadow-2xl shadow-purple-500/40 text-lg md:text-xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap relative overflow-hidden group"
                                    >
                                        {/* Button glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        <Camera className="w-6 h-6 mr-3 flex-shrink-0 relative z-10" />
                                        <span className="relative z-10">Start Capture</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* SECONDARY: Manual Upload Zone */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                <span className="text-sm text-gray-500">or</span>
                                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Upload Photos - Toned Down */}
                                <div className="rounded-xl md:rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/0 border border-white/[0.06] backdrop-blur-xl p-5 md:p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="text-sm md:text-base text-gray-300">Upload Photos</Label>
                                        <Badge className="bg-white/5 text-gray-400 border-white/10 text-xs">
                                            Advanced
                                        </Badge>
                                    </div>

                                    <label className="relative block">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                        />
                                        <div className="h-40 rounded-lg border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group">
                                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                                                <ImageIcon className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs text-gray-400 mb-1">Click to upload</div>
                                                <div className="text-xs text-gray-500">JPG, PNG (Max 10)</div>
                                            </div>
                                        </div>
                                    </label>

                                    {/* Photo Previews */}
                                    {uploadedPhotos.length > 0 && (
                                        <div className="mt-3 grid grid-cols-3 gap-2">
                                            {uploadedPhotos.map((photo, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={photo}
                                                        alt={`Upload ${index + 1}`}
                                                        className="w-full h-16 object-cover rounded-lg border border-white/10"
                                                    />
                                                    <button
                                                        onClick={() => removePhoto(index)}
                                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Upload Video - Toned Down */}
                                <div className="rounded-xl md:rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/0 border border-white/[0.06] backdrop-blur-xl p-5 md:p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="text-sm md:text-base text-gray-300">
                                            Upload Video <span className="text-gray-500 text-xs">(Optional)</span>
                                        </Label>
                                    </div>

                                    <label className="relative block">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={handleVideoUpload}
                                            className="hidden"
                                        />
                                        <div className="h-40 rounded-lg border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group">
                                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                                                <Video className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs text-gray-400 mb-1">Click to upload</div>
                                                <div className="text-xs text-gray-500">MP4, MOV (Max 30s)</div>
                                            </div>
                                        </div>
                                    </label>

                                    {/* Video Preview */}
                                    {uploadedVideo && (
                                        <div className="mt-3 relative group">
                                            <video
                                                src={uploadedVideo}
                                                className="w-full h-24 object-cover rounded-lg border border-white/10"
                                                controls
                                            />
                                            <button
                                                onClick={() => setUploadedVideo(null)}
                                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Generate Button */}
                        {!isGenerating && !generatedModel && (
                            <Button
                                onClick={handleGenerate}
                                disabled={uploadedPhotos.length === 0}
                                className="w-full h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Sparkles className="w-6 h-6 mr-2" />
                                Generate 3D Model
                            </Button>
                        )}

                        {/* Progress & Status */}
                        {isGenerating && (
                            <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-lg">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="relative w-32 h-32 mb-4">
                                        <svg className="w-32 h-32 transform -rotate-90">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                stroke="rgba(255,255,255,0.1)"
                                                strokeWidth="8"
                                                fill="none"
                                            />
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                stroke="url(#gradient)"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeDasharray={`${2 * Math.PI * 56}`}
                                                strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                                                className="transition-all duration-500"
                                                strokeLinecap="round"
                                            />
                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#3B82F6" />
                                                    <stop offset="100%" stopColor="#60A5FA" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-2xl">{Math.round(progress)}%</span>
                                        </div>
                                    </div>
                                    <div className="text-lg text-blue-400 mb-2">{statusMessage}</div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Processing...</span>
                                    </div>
                                </div>

                                {/* Mini Terminal Log */}
                                <div className="rounded-xl bg-black/40 border border-white/10 p-4 max-h-48 overflow-y-auto font-mono text-xs">
                                    {logs.map((log, index) => (
                                        <div key={index} className="text-green-400 mb-1">
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Generated Model Preview */}
                        {generatedModel && (
                            <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl md:text-2xl">3D Model Preview</h3>
                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                        <Check className="w-3 h-3 mr-1" />
                                        Ready
                                    </Badge>
                                </div>

                                {/* 3D Viewer Placeholder */}
                                <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2)_0%,transparent_70%)]" />
                                    <div className="relative z-10 text-center">
                                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-500/20 border-2 border-blue-500/40 flex items-center justify-center animate-pulse">
                                            <ImageIcon className="w-12 h-12 text-blue-400" />
                                        </div>
                                        <p className="text-gray-400">Interactive 3D model viewer</p>
                                        <p className="text-sm text-gray-500 mt-2">Drag to rotate • Scroll to zoom</p>
                                    </div>
                                </div>

                                {/* Viewer Tools */}
                                <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                                    <Button
                                        size="sm"
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
                                    >
                                        <RotateCw className="w-4 h-4 mr-2" />
                                        Rotate
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
                                    >
                                        <ZoomIn className="w-4 h-4 mr-2" />
                                        Zoom
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
                                    >
                                        <Lightbulb className="w-4 h-4 mr-2" />
                                        Lighting
                                    </Button>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid md:grid-cols-2 gap-3">
                                    <Button
                                        className="h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl"
                                    >
                                        <Download className="w-5 h-5 mr-2" />
                                        Download Model
                                    </Button>
                                    <Button
                                        onClick={() => handleOpenAddToMenuModal(generatedModels[0])}
                                        className="h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Add to Menu
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Active Processing Tasks */}
                        {taskQueue.tasks.length > 0 && (
                            <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-lg mb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-xl md:text-2xl mb-1">Processing Queue</h3>
                                        <p className="text-sm text-gray-400">Active 3D model generation tasks</p>
                                    </div>
                                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                        {taskQueue.activeCount} active
                                    </Badge>
                                </div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    {taskQueue.tasks.map(task => (
                                        <ProcessingCard
                                            key={task.id}
                                            task={task}
                                            onRemove={() => taskQueue.removeTask(task.id)}
                                        />
                                    ))}
                                </div>

                                {taskQueue.tasks.filter(t => t.status === 'complete').length > 0 && (
                                    <div className="mt-6 flex justify-center">
                                        <Button
                                            onClick={() => taskQueue.clearCompleted()}
                                            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Clear Completed
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Generated 3D Models Library */}
                        <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-lg">
                            {/* Library Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl md:text-2xl mb-1">Generated Models</h3>
                                    <p className="text-sm text-gray-400">Your recently generated 3D dishes</p>
                                </div>
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                    <Check className="w-3 h-3 mr-1" />
                                    Auto-saved
                                </Badge>
                            </div>

                            {/* Models Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {generatedModels.map((model) => (
                                    <div
                                        key={model.id}
                                        className="group rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl overflow-hidden hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative aspect-square overflow-hidden">
                                            <img
                                                src={model.thumbnail}
                                                alt={model.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute top-3 right-3">
                                                {getStatusBadge(model.status)}
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        {/* Info */}
                                        <div className="p-4">
                                            <h4 className="text-base mb-1 truncate">{model.name}</h4>
                                            <p className="text-xs text-gray-400 mb-4">{formatTimeAgo(model.timestamp)}</p>

                                            {/* Action Buttons */}
                                            <div className="flex flex-col gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleOpenPreviewPanel(model)}
                                                    disabled={model.status !== 'ready'}
                                                    className="w-full h-9 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    <Eye className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                                    <span className="whitespace-nowrap">Preview 3D</span>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleOpenAddToMenuModal(model)}
                                                    disabled={model.status !== 'ready'}
                                                    className="w-full h-9 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    <Plus className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                                    <span className="whitespace-nowrap">Add to Menu</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Model Settings - Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 backdrop-blur-xl p-6 md:p-8 shadow-lg sticky top-8">
                            <div className="flex items-center gap-2 mb-6">
                                <SettingsIcon className="w-5 h-5 text-blue-400" />
                                <h3 className="text-xl md:text-2xl">AI Model Settings</h3>
                            </div>

                            <div className="space-y-6">
                                {/* Model Detail Level */}
                                <div>
                                    <Label className="text-base mb-3 block">Model Detail Level</Label>
                                    <div className="space-y-3">
                                        <Slider
                                            value={detailLevel}
                                            onValueChange={setDetailLevel}
                                            max={100}
                                            step={1}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>Draft</span>
                                            <span className="text-blue-400">{getDetailLabel(detailLevel[0])}</span>
                                            <span>High Detail</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Lighting Style */}
                                <div>
                                    <Label className="text-base mb-3 block">Lighting Style</Label>
                                    <div className="relative">
                                        <select
                                            value={lightingStyle}
                                            onChange={(e) => setLightingStyle(e.target.value)}
                                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white appearance-none focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        >
                                            {lightingStyles.map(style => (
                                                <option key={style} value={style} className="bg-[#0a0a0a] text-white">
                                                    {style}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Output Format */}
                                <div>
                                    <Label className="text-base mb-3 block">Output Format</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {outputFormats.map(format => (
                                            <button
                                                key={format}
                                                onClick={() => toggleOutputFormat(format)}
                                                className={`px-4 py-2 rounded-lg text-sm transition-all ${outputFormat.includes(format)
                                                    ? 'bg-blue-500 text-white border border-blue-400'
                                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                                                    }`}
                                            >
                                                {format}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Toggle Settings */}
                                <div className="space-y-4 pt-4 border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label className="text-sm mb-1 block">Auto Cleanup</Label>
                                            <p className="text-xs text-gray-500">Remove artifacts automatically</p>
                                        </div>
                                        <Switch
                                            checked={autoCleanup}
                                            onCheckedChange={setAutoCleanup}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label className="text-sm mb-1 block">Texture Enhancement</Label>
                                            <p className="text-xs text-gray-500">AI-powered texture upscaling</p>
                                        </div>
                                        <Switch
                                            checked={textureEnhancement}
                                            onCheckedChange={setTextureEnhancement}
                                        />
                                    </div>
                                </div>

                                {/* Info Card */}
                                <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                                    <div className="flex items-start gap-3">
                                        <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-sm text-blue-400 mb-1">Pro Tip</div>
                                            <p className="text-xs text-gray-400">
                                                Upload photos from multiple angles for better 3D reconstruction accuracy.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add to Menu Modal */}
            <Dialog open={isAddToMenuModalOpen} onOpenChange={setIsAddToMenuModalOpen}>
                <DialogContent className="max-w-2xl bg-gradient-to-br from-[#0a0a0a]/95 to-[#111827]/95 border-white/10 backdrop-blur-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                            Add to Menu
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Add this 3D model to your menu
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        {/* Model Preview Card */}
                        {selectedModelForMenu && (
                            <div className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center gap-4">
                                <img
                                    src={selectedModelForMenu.thumbnail}
                                    alt={selectedModelForMenu.name}
                                    className="w-20 h-20 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <div className="text-xs text-gray-400 mb-1">3D Model</div>
                                    <div className="text-base">{selectedModelForMenu.name}</div>
                                </div>
                                {getStatusBadge(selectedModelForMenu.status)}
                            </div>
                        )}

                        {/* Form Fields */}
                        <div>
                            <Label htmlFor="name-modal" className="text-base mb-2 block">
                                Dish Name
                            </Label>
                            <Input
                                id="name-modal"
                                value={menuFormData.name}
                                onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                                placeholder="e.g. Premium Wagyu Burger"
                                className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-white"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <Label htmlFor="category-modal" className="text-base mb-2 block">
                                    Category
                                </Label>
                                <div className="relative">
                                    <select
                                        id="category-modal"
                                        value={menuFormData.category}
                                        onChange={(e) => setMenuFormData({ ...menuFormData, category: e.target.value })}
                                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white appearance-none focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="" disabled className="bg-[#0a0a0a] text-white">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat} className="bg-[#0a0a0a] text-white">{cat}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="price-modal" className="text-base mb-2 block">
                                    Price
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                    <Input
                                        id="price-modal"
                                        type="number"
                                        value={menuFormData.price}
                                        onChange={(e) => setMenuFormData({ ...menuFormData, price: e.target.value })}
                                        placeholder="0.00"
                                        className="h-12 pl-8 bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description-modal" className="text-base mb-2 block">
                                Description
                            </Label>
                            <Textarea
                                id="description-modal"
                                value={menuFormData.description}
                                onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                                placeholder="Describe your dish..."
                                rows={4}
                                className="bg-white/5 border-white/10 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none text-white"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="grid md:grid-cols-2 gap-3 pt-4">
                            <Button
                                onClick={() => setIsAddToMenuModalOpen(false)}
                                className="h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveToMenu}
                                disabled={!menuFormData.name || !menuFormData.category || !menuFormData.price}
                                className="h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                Save to Menu
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Preview Panel (sliding from right) */}
            {isPreviewPanelOpen && previewModel && (
                <div className="fixed inset-0 z-50 flex items-center justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsPreviewPanelOpen(false)}
                    />

                    {/* Panel */}
                    <div className="relative w-full max-w-2xl h-full bg-gradient-to-br from-[#0a0a0a]/98 to-[#111827]/98 border-l border-white/10 backdrop-blur-2xl shadow-2xl overflow-y-auto animate-in slide-in-from-right">
                        <div className="p-6 md:p-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl md:text-3xl mb-2">{previewModel.name}</h3>
                                    <p className="text-sm text-gray-400">Generated {formatTimeAgo(previewModel.timestamp)}</p>
                                </div>
                                <Button
                                    onClick={() => setIsPreviewPanelOpen(false)}
                                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
                                >
                                    <X />
                                </Button>
                            </div>

                            {/* 3D Viewer */}
                            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2)_0%,transparent_70%)]" />
                                <div className="relative z-10 text-center">
                                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-blue-500/20 border-2 border-blue-500/40 flex items-center justify-center animate-pulse">
                                        <ImageIcon className="w-16 h-16 text-blue-400" />
                                    </div>
                                    <p className="text-gray-400">Interactive 3D model viewer</p>
                                    <p className="text-sm text-gray-500 mt-2">Drag to rotate • Scroll to zoom</p>
                                </div>
                            </div>

                            {/* Viewer Tools */}
                            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                                <Button
                                    size="sm"
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
                                >
                                    <RotateCw className="w-4 h-4 mr-2" />
                                    Rotate
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
                                >
                                    <ZoomIn className="w-4 h-4 mr-2" />
                                    Zoom
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg"
                                >
                                    <Lightbulb className="w-4 h-4 mr-2" />
                                    Lighting
                                </Button>
                            </div>

                            {/* Model Info */}
                            <div className="rounded-xl bg-white/5 border border-white/10 p-5 mb-6 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Status</span>
                                    {getStatusBadge(previewModel.status)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Format</span>
                                    <span className="text-sm">.glb</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Generated</span>
                                    <span className="text-sm">{formatTimeAgo(previewModel.timestamp)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <Button className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl">
                                    <Download className="w-5 h-5 mr-2" />
                                    Download Model
                                </Button>
                                <Button className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl">
                                    <Trash2 className="w-5 h-5 mr-2" />
                                    Delete Model
                                </Button>
                                <Button
                                    onClick={() => {
                                        setIsPreviewPanelOpen(false);
                                        handleOpenAddToMenuModal(previewModel);
                                    }}
                                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add to Menu
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Guided 3D Capture Interface */}
            {showGuidedCapture && (
                <Guided3DCapture
                    onClose={() => setShowGuidedCapture(false)}
                    onComplete={handleCaptureComplete}
                />
            )}
        </div>
    );
}









