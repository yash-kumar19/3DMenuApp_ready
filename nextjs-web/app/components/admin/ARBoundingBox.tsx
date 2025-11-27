import React from 'react';

interface ARBoundingBoxProps {
    isActive: boolean;
    pulseOnReady?: boolean;
}

export function ARBoundingBox({ isActive, pulseOnReady = false }: ARBoundingBoxProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-[70%] aspect-square max-w-md">
                {/* 3D Perspective Container */}
                <div className="absolute inset-0" style={{ perspective: '800px' }}>
                    <div
                        className={`absolute inset-0 transition-all duration-700 ${isActive ? 'opacity-100' : 'opacity-30'}`}
                        style={{
                            transformStyle: 'preserve-3d',
                            transform: 'rotateX(5deg) rotateY(-5deg)',
                        }}
                    >
                        {/* Front Face */}
                        <div
                            className={`box-face absolute inset-0 border-2 rounded-lg transition-all ${pulseOnReady ? 'border-green-400 shadow-lg shadow-green-400/50 animate-pulse-border' : 'border-white/60'
                                }`}
                            style={{ transform: 'translateZ(80px)' }}
                        />

                        {/* Back Face */}
                        <div
                            className="box-face absolute inset-0 border-2 border-white/40 rounded-lg"
                            style={{ transform: 'translateZ(-80px)' }}
                        />

                        {/* Edges connecting front to back */}
                        {/* Top-left edge */}
                        <div
                            className="absolute w-0.5 h-40 bg-gradient-to-b from-white/60 to-white/40"
                            style={{
                                left: '0',
                                top: '0',
                                transform: 'translateZ(80px) rotateY(90deg)',
                                transformOrigin: 'left center'
                            }}
                        />

                        {/* Top-right edge */}
                        <div
                            className="absolute w-0.5 h-40 bg-gradient-to-b from-white/60 to-white/40"
                            style={{
                                right: '0',
                                top: '0',
                                transform: 'translateZ(80px) rotateY(90deg)',
                                transformOrigin: 'right center'
                            }}
                        />

                        {/* Bottom-left edge */}
                        <div
                            className="absolute w-0.5 h-40 bg-gradient-to-b from-white/60 to-white/40"
                            style={{
                                left: '0',
                                bottom: '0',
                                transform: 'translateZ(80px) rotateY(90deg)',
                                transformOrigin: 'left center'
                            }}
                        />

                        {/* Bottom-right edge */}
                        <div
                            className="absolute w-0.5 h-40 bg-gradient-to-b from-white/60 to-white/40"
                            style={{
                                right: '0',
                                bottom: '0',
                                transform: 'translateZ(80px) rotateY(90deg)',
                                transformOrigin: 'right center'
                            }}
                        />

                        {/* Corner Markers on Front Face */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white/80 rounded-tl-lg" style={{ transform: 'translateZ(80px)' }} />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white/80 rounded-tr-lg" style={{ transform: 'translateZ(80px)' }} />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white/80 rounded-bl-lg" style={{ transform: 'translateZ(80px)' }} />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white/80 rounded-br-lg" style={{ transform: 'translateZ(80px)' }} />
                    </div>
                </div>

                {/* Center crosshair */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`relative w-8 h-8 transition-all ${pulseOnReady ? 'scale-110' : 'scale-100'}`}>
                        <div className={`absolute inset-0 border-2 rounded-full transition-colors ${pulseOnReady ? 'border-green-400' : 'border-white/60'}`} />
                        <div className={`absolute left-1/2 top-0 w-0.5 h-2 -ml-px transition-colors ${pulseOnReady ? 'bg-green-400' : 'bg-white/60'}`} />
                        <div className={`absolute left-1/2 bottom-0 w-0.5 h-2 -ml-px transition-colors ${pulseOnReady ? 'bg-green-400' : 'bg-white/60'}`} />
                        <div className={`absolute top-1/2 left-0 h-0.5 w-2 -mt-px transition-colors ${pulseOnReady ? 'bg-green-400' : 'bg-white/60'}`} />
                        <div className={`absolute top-1/2 right-0 h-0.5 w-2 -mt-px transition-colors ${pulseOnReady ? 'bg-green-400' : 'bg-white/60'}`} />
                    </div>
                </div>

                {/* Instructions overlay */}
                {isActive && (
                    <div className="absolute -bottom-16 left-0 right-0 text-center">
                        <div className={`inline-block px-4 py-2 rounded-full backdrop-blur-md border text-sm font-medium transition-all ${pulseOnReady
                                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                                : 'bg-black/40 border-white/20 text-white/80'
                            }`}>
                            {pulseOnReady ? '✓ Perfect! Hold still...' : 'Center object in frame'}
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes pulse-border {
                    0%, 100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.02);
                    }
                }
                .animate-pulse-border {
                    animation: pulse-border 2s ease-in-out infinite;
                }
                .box-face {
                    backface-visibility: hidden;
                }
            `}</style>
        </div>
    );
}
