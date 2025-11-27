"use client";

import { useState, useRef, useEffect } from 'react';
import { Camera, X, Loader2, Check, AlertCircle, Trash2, Play, Pause, ChevronUp, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { useQualityCheck } from '@/lib/hooks/useQualityCheck';
import { useBlurDetector } from '@/lib/hooks/useBlurDetector';
import { soundService } from '@/lib/services/sound.service';
import { ARBoundingBox } from './ARBoundingBox';

type CapturePhase = 'intro' | 'eye-level' | 'high-angle' | 'low-angle' | 'review' | 'name';

interface Guided3DCaptureProps {
    onClose: () => void;
    onComplete: (photos: File[], modelName: string) => void;
}

const PHASE_LIMIT = 8;

export function Guided3DCapture({ onClose, onComplete }: Guided3DCaptureProps) {
    const [step, setStep] = useState<CapturePhase>('intro');

    // Photo storage
    const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
    const [capturedFiles, setCapturedFiles] = useState<File[]>([]);

    // Phase tracking
    const [phaseProgress, setPhaseProgress] = useState(0);
    const [showPhaseIntro, setShowPhaseIntro] = useState(false);

    // Camera state
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [modelName, setModelName] = useState('');

    // AI & Settings
    const [autoCaptureEnabled, setAutoCaptureEnabled] = useState(true);
    const [captureTimer, setCaptureTimer] = useState<number | null>(null);
    const [showFlash, setShowFlash] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const captureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [captureProgress, setCaptureProgress] = useState(0);

    // AI Hooks
    const { quality } = useQualityCheck(videoRef, isCameraReady && ['eye-level', 'high-angle', 'low-angle'].includes(step));
    const blurResult = useBlurDetector(videoRef, isCameraReady && ['eye-level', 'high-angle', 'low-angle'].includes(step));

    const isStable = quality?.stability.passed ?? false;
    const isSharp = !blurResult.isBlurred;
    const isHighQuality = (quality?.overall ?? 0) >= 70;
    const isReadyToCapture = isStable && isSharp && isHighQuality;

    // --- Camera Management ---

    const requestCameraAccess = async () => {
        try {
            setCameraError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.muted = true;
                videoRef.current.playsInline = true;

                videoRef.current.onloadedmetadata = async () => {
                    try {
                        await videoRef.current?.play();
                        setIsCameraReady(true);
                    } catch (e) {
                        setIsCameraReady(true);
                    }
                };
            }
        } catch (error: any) {
            setCameraError(error.message || 'Unable to access camera');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraReady(false);
    };

    useEffect(() => {
        return () => stopCamera();
    }, []);

    useEffect(() => {
        if (['eye-level', 'high-angle', 'low-angle'].includes(step)) {
            if (!streamRef.current) requestCameraAccess();
        } else {
            stopCamera();
        }
    }, [step]);

    // --- Auto Capture Logic ---

    useEffect(() => {
        return () => {
            if (captureTimeoutRef.current) clearTimeout(captureTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        const isCaptureStep = ['eye-level', 'high-angle', 'low-angle'].includes(step);

        if (!autoCaptureEnabled || !isCameraReady || !quality || !isCaptureStep || showPhaseIntro) {
            resetTimer();
            return;
        }

        if (phaseProgress >= PHASE_LIMIT) {
            resetTimer();
            handlePhaseComplete();
            return;
        }

        if (isReadyToCapture) {
            if (!captureTimeoutRef.current) {
                const startTime = Date.now();
                setCaptureTimer(startTime);

                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    setCaptureProgress(progress);
                    if (progress >= 100) clearInterval(interval);
                }, 150);

                captureTimeoutRef.current = setTimeout(() => {
                    capturePhoto();
                    resetTimer();
                    clearInterval(interval);
                }, 1500);
            }
        } else {
            resetTimer();
        }
    }, [isCameraReady, quality, blurResult, autoCaptureEnabled, step, phaseProgress, showPhaseIntro]);

    const resetTimer = () => {
        if (captureTimeoutRef.current) {
            clearTimeout(captureTimeoutRef.current);
            captureTimeoutRef.current = null;
        }
        setCaptureTimer(null);
        setCaptureProgress(0);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current || !isCameraReady) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(video, 0, 0);

        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 200);
        soundService.playClick();
        if (navigator.vibrate) navigator.vibrate(50);

        canvas.toBlob((blob) => {
            if (!blob) return;

            const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
            const url = URL.createObjectURL(blob);

            setCapturedPhotos(prev => [...prev, url]);
            setCapturedFiles(prev => [...prev, file]);
            setPhaseProgress(prev => prev + 1);
        }, 'image/jpeg', 0.9);
    };

    const handlePhaseComplete = () => {
        soundService.playSuccess();
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        setShowPhaseIntro(true);
    };

    const nextPhase = () => {
        setShowPhaseIntro(false);
        setPhaseProgress(0);

        if (step === 'eye-level') setStep('high-angle');
        else if (step === 'high-angle') setStep('low-angle');
        else if (step === 'low-angle') setStep('review');
    };

    const deletePhoto = (index: number) => {
        setCapturedPhotos(prev => prev.filter((_, i) => i !== index));
        setCapturedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        const name = modelName.trim() || `Model ${new Date().toLocaleString()}`;
        onComplete(capturedFiles, name);
        onClose();
    };

    const getPhaseInstruction = () => {
        switch (step) {
            case 'eye-level': return "Orbit at Eye Level";
            case 'high-angle': return "Orbit from High Angle";
            case 'low-angle': return "Orbit from Low Angle";
            default: return "";
        }
    };

    const getPhaseIcon = () => {
        switch (step) {
            case 'eye-level': return <ChevronRight className="w-8 h-8 text-white animate-pulse" />;
            case 'high-angle': return <ChevronUp className="w-8 h-8 text-white animate-pulse" />;
            case 'low-angle': return <ChevronDown className="w-8 h-8 text-white animate-pulse" />;
            default: return null;
        }
    };

    const getQualityMessage = (q: any): string => {
        if (blurResult.isBlurred) return 'Hold camera steady';
        if (!q.blur.passed) return 'Hold camera steady';
        if (!q.stability.passed) return 'Reduce movement';
        if (!q.exposure.passed) return 'Adjust lighting';
        return 'Improving...';
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl font-sans">
            <canvas ref={canvasRef} className="hidden" />

            {/* INTRO */}
            {step === 'intro' && (
                <div className="h-full flex items-center justify-center p-6">
                    <div className="max-w-lg w-full text-center">
                        <button onClick={onClose} className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                            <X className="w-5 h-5 text-white" />
                        </button>

                        <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-500/30 flex items-center justify-center mb-8 animate-float">
                            <Camera className="w-16 h-16 text-purple-400" />
                        </div>

                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-100 to-blue-200 bg-clip-text text-transparent">
                            AI-Powered Capture
                        </h2>

                        <div className="space-y-4 text-left max-w-sm mx-auto mb-12 bg-white/5 p-6 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-green-400" />
                                <span>3 Angles: Eye-level, High, Low</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-green-400" />
                                <span>Auto-captures when stable</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-green-400" />
                                <span>Real-time quality checks</span>
                            </div>
                        </div>

                        <Button onClick={() => setStep('eye-level')} className="w-full h-14 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-2xl text-lg font-medium shadow-lg shadow-purple-500/25 hover:scale-[1.02] transition-transform">
                            <Camera className="w-5 h-5 mr-2" />
                            Start Capture
                        </Button>
                    </div>
                </div>
            )}

            {/* CAPTURE PHASES */}
            {['eye-level', 'high-angle', 'low-angle'].includes(step) && (
                <div className="h-full flex flex-col relative">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                        <button onClick={() => setStep('intro')} className="p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
                            <X className="w-5 h-5 text-white" />
                        </button>
                        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-white font-medium text-sm">{capturedPhotos.length} Photos</span>
                        </div>
                        <div className="w-10" />
                    </div>

                    {/* Video Viewport */}
                    <div className="flex-1 relative bg-gray-900 overflow-hidden">
                        <video
                            ref={videoRef}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isCameraReady ? 'opacity-100' : 'opacity-0'}`}
                            playsInline
                            autoPlay
                            muted
                        />

                        {/* AR Bounding Box */}
                        {!showPhaseIntro && <ARBoundingBox isActive={isCameraReady} pulseOnReady={isReadyToCapture} />}

                        {showFlash && <div className="absolute inset-0 bg-white animate-fade-out pointer-events-none z-50" />}

                        {/* Phase Instructions */}
                        {!showPhaseIntro && (
                            <div className="absolute top-24 left-0 right-0 flex flex-col items-center pointer-events-none">
                                <div className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
                                    {getPhaseIcon()}
                                    <span className="text-white font-bold text-lg tracking-wide">{getPhaseInstruction()}</span>
                                </div>
                                <div className="mt-2 text-white/70 text-sm font-medium bg-black/30 px-3 py-1 rounded-full">
                                    {phaseProgress} / {PHASE_LIMIT}
                                </div>
                            </div>
                        )}

                        {/* Quality Status */}
                        {isCameraReady && !showPhaseIntro && (
                            <div className="absolute bottom-32 left-0 right-0 flex justify-center pointer-events-none">
                                <div className={`px-4 py-2 rounded-full backdrop-blur-md border transition-colors ${isReadyToCapture ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-black/40 border-white/10 text-yellow-400'}`}>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        {isReadyToCapture ? (
                                            <><Check className="w-4 h-4" /> Holding Still...</>
                                        ) : (
                                            <><AlertCircle className="w-4 h-4" /> {quality ? getQualityMessage(quality) : 'Initializing...'}</>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Phase Complete Overlay */}
                        {showPhaseIntro && (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-6">
                                <div className="text-center max-w-sm">
                                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                                        <Check className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-2">Phase Complete!</h3>
                                    <p className="text-gray-300 mb-8 text-lg">
                                        {step === 'eye-level' ? "Great! Now move your camera HIGHER to capture the top details." :
                                            step === 'high-angle' ? "Perfect! Now move your camera LOWER to capture the base." :
                                                "All angles captured!"}
                                    </p>
                                    <Button onClick={nextPhase} className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-xl text-lg font-bold">
                                        {step === 'low-angle' ? "Review Photos" : "Continue"}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {!isCameraReady && !cameraError && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="p-8 bg-black/80 border-t border-white/10 backdrop-blur-xl z-30">
                        <div className="flex items-center justify-between max-w-md mx-auto">
                            <button
                                onClick={() => setAutoCaptureEnabled(!autoCaptureEnabled)}
                                className={`p-4 rounded-full transition-colors ${autoCaptureEnabled ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-400'}`}
                            >
                                {autoCaptureEnabled ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                            </button>

                            <button
                                onClick={capturePhoto}
                                disabled={!isCameraReady || showPhaseIntro}
                                className={`w-24 h-24 rounded-full border-4 transition-all relative ${isReadyToCapture ? 'border-green-500 scale-105' : 'border-white/30'} disabled:opacity-50 disabled:scale-100`}
                            >
                                <div className={`absolute inset-1 rounded-full ${isReadyToCapture ? 'bg-green-500' : 'bg-white'} transition-colors`} />

                                {captureTimer && (
                                    <svg className="absolute -inset-1 w-[104px] h-[104px] -rotate-90 pointer-events-none">
                                        <circle
                                            cx="52"
                                            cy="52"
                                            r="48"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="4"
                                            strokeDasharray="301"
                                            strokeDashoffset={301 - (301 * captureProgress) / 100}
                                            className="transition-all duration-150 ease-linear"
                                        />
                                    </svg>
                                )}
                            </button>

                            <div className="w-14" />
                        </div>
                    </div>
                </div>
            )}

            {/* REVIEW */}
            {step === 'review' && (
                <div className="h-full flex flex-col bg-gray-50">
                    <div className="p-6 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
                        <h3 className="text-xl font-bold text-gray-900">Review Photos ({capturedPhotos.length})</h3>
                        <Button variant="ghost" onClick={() => setStep('name')} className="text-blue-600 font-medium">Next</Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid grid-cols-3 gap-2">
                            {capturedPhotos.map((url, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group bg-gray-200">
                                    <img src={url} alt={`Capture ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => deletePhoto(idx)}
                                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {capturedPhotos.length < 15 && (
                            <div className="mt-8 text-center p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                                <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                <p className="text-yellow-800 font-medium">Recommended: 20+ photos</p>
                                <Button onClick={() => setStep('eye-level')} variant="outline" className="mt-3 border-yellow-500 text-yellow-700">
                                    Take More
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-white border-t border-gray-200">
                        <Button onClick={() => setStep('name')} className="w-full h-12 bg-blue-600 text-white rounded-xl text-lg font-medium shadow-lg shadow-blue-500/25">
                            Looks Good
                        </Button>
                    </div>
                </div>
            )}

            {/* NAME */}
            {step === 'name' && (
                <div className="h-full flex items-center justify-center p-6 bg-gray-100">
                    <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl">
                        <h3 className="text-2xl font-bold mb-2 text-gray-900">Name Your Model</h3>
                        <p className="text-gray-600 mb-6">Give this 3D model a name for easy identification</p>

                        <input
                            type="text"
                            value={modelName}
                            onChange={(e) => setModelName(e.target.value)}
                            placeholder="e.g., Deluxe Burger"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-gray-900 bg-gray-50"
                            autoFocus
                        />

                        <div className="flex gap-3">
                            <Button onClick={() => setStep('review')} variant="outline" className="flex-1 h-12 text-gray-700">Back</Button>
                            <Button onClick={handleSubmit} className="flex-1 h-12 bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/20">
                                Start Processing
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes fade-out {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                .animate-fade-out {
                    animation: fade-out 200ms ease-out;
                }
            `}</style>
        </div>
    );
}
