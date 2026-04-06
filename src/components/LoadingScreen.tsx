import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
    onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [showComplete, setShowComplete] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Randomize progress increments for more realistic feel
                const increment = Math.random() * 8 + 2; // 2-10% increments
                return Math.min(prev + increment, 100);
            });
        }, 150); // Update every 150ms

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress >= 100) {
            // Show completion message
            setTimeout(() => {
                setShowComplete(true);
            }, 500);

            // Hide loading screen and call onComplete
            setTimeout(() => {
                setIsVisible(false);
                setTimeout(onComplete, 500);
            }, 2500);
        }
    }, [progress, onComplete]);

    const loadingMessages = [
        'Initializing systems...',
        'Loading modules...',
        'Connecting to servers...',
        'Compiling components...',
        'Optimizing performance...',
        'Finalizing setup...',
    ];

    const getCurrentMessage = () => {
        const index = Math.floor((progress / 100) * loadingMessages.length);
        return loadingMessages[Math.min(index, loadingMessages.length - 1)];
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 bg-surface-base flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Matrix-style background effect */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute text-primary font-mono text-xs"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        y: [0, -20, 0],
                                        opacity: [0.3, 0.8, 0.3],
                                    }}
                                    transition={{
                                        duration: 2 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2,
                                    }}
                                >
                                    {Math.random() > 0.5 ? '01' : '10'}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 max-w-md w-full px-8">
                        {!showComplete ? (
                            <>
                                {/* Rubrion Logo com animação de stroke/fill */}
                                <motion.div
                                    className="flex justify-center mb-8"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                >
                                    <div className="w-16 h-16 relative">
                                        <svg
                                            viewBox="0 0 1369691 1351508"
                                            className="w-full h-full"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <defs>
                                                <filter id="loadingGlow">
                                                    <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                                                    <feMerge>
                                                        <feMergeNode in="coloredBlur" />
                                                        <feMergeNode in="SourceGraphic" />
                                                    </feMerge>
                                                </filter>
                                            </defs>

                                            <motion.path
                                                d="M336194 676699l254 344276c-2062,-2699 -34308,-35241 -36630,-38088 -51960,-63639 -90552,-160624 -98194,-241964 -57422,-611277 832864,-746317 959005,-150832 58308,275244 -193190,696550 -400211,298339 222676,-1668 342797,-256615 214791,-437659 -94868,-114989 -167751,-119716 -311603,-121042 -116144,-1072 -157418,1190 -246788,76712 -29681,29678 -63070,79390 -75608,137214l322396 637c48230,123 98276,-8566 134261,27999 34590,35167 3233,104336 -36759,108100l-424914 -3692zm198181 674809c3553,-10757 2336,-415256 1461,-459649 383975,666516 840703,304465 833775,-219386 -3679,-277612 -181744,-530330 -442336,-627372 -564951,-210380 -1098227,353567 -875430,898908 84447,206695 266527,357188 482530,407500z"
                                                fill="none"
                                                stroke="#ff0040"
                                                strokeWidth="10000"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                filter="url(#loadingGlow)"
                                                initial={{
                                                    pathLength: 0,
                                                    opacity: 0
                                                }}
                                                animate={{
                                                    pathLength: 1,
                                                    opacity: 1
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    ease: "easeInOut",
                                                    delay: 0.5
                                                }}
                                            />

                                            <motion.path
                                                d="M336194 676699l254 344276c-2062,-2699 -34308,-35241 -36630,-38088 -51960,-63639 -90552,-160624 -98194,-241964 -57422,-611277 832864,-746317 959005,-150832 58308,275244 -193190,696550 -400211,298339 222676,-1668 342797,-256615 214791,-437659 -94868,-114989 -167751,-119716 -311603,-121042 -116144,-1072 -157418,1190 -246788,76712 -29681,29678 -63070,79390 -75608,137214l322396 637c48230,123 98276,-8566 134261,27999 34590,35167 3233,104336 -36759,108100l-424914 -3692zm198181 674809c3553,-10757 2336,-415256 1461,-459649 383975,666516 840703,304465 833775,-219386 -3679,-277612 -181744,-530330 -442336,-627372 -564951,-210380 -1098227,353567 -875430,898908 84447,206695 266527,357188 482530,407500z"
                                                fill="#ff0040"
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.8
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                    ease: "easeOut",
                                                    delay: 2.5
                                                }}
                                            />
                                        </svg>
                                    </div>
                                </motion.div>

                                {/* Loading Text */}
                                <motion.div
                                    className="text-center mb-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <h1 className="text-2xl font-mono font-bold text-primary neon-text mb-2">
                                        RUBRION SYSTEM
                                    </h1>
                                    <p className="text-text-muted font-mono text-sm typing-cursor">
                                        {getCurrentMessage()}
                                    </p>
                                </motion.div>

                                {/* Progress Bar Container */}
                                <motion.div
                                    className="mb-6"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <div className="bg-surface-raised border border-border-default rounded-lg p-4 neon-border">
                                        {/* Progress Bar */}
                                        <div className="relative h-4 bg-surface-base rounded-full overflow-hidden mb-3">
                                            <motion.div
                                                className="absolute inset-y-0 left-0 bg-primary rounded-full"
                                                style={{
                                                    width: `${progress}%`,
                                                    boxShadow: '0 0 10px #ff0040, inset 0 0 10px #ff0040',
                                                }}
                                                initial={{ width: '0%' }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                            />

                                            {/* Scanning line effect */}
                                            <motion.div
                                                className="absolute inset-y-0 w-1 bg-accent-cyan opacity-80"
                                                style={{ left: `${Math.max(0, progress - 2)}%` }}
                                                animate={{
                                                    opacity: [0.4, 1, 0.4],
                                                }}
                                                transition={{
                                                    duration: 0.8,
                                                    repeat: Infinity,
                                                }}
                                            />
                                        </div>

                                        {/* Progress Text */}
                                        <div className="flex justify-between items-center text-sm font-mono">
                                            <span className="text-text-secondary">
                                                &gt; Loading...
                                            </span>
                                            <motion.span
                                                className="text-primary font-bold"
                                                key={Math.floor(progress)}
                                                initial={{ scale: 1.2 }}
                                                animate={{ scale: 1 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {Math.floor(progress)}%
                                            </motion.span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Terminal-style output */}
                                <motion.div
                                    className="bg-surface-base border border-border-default rounded-lg p-3 font-mono text-xs"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2 }}
                                >
                                    <div className="text-accent-green mb-1">
                                        $ rubrion --init --verbose
                                    </div>
                                    <div className="text-text-muted">
                                        [INFO] Initializing Rubrion platform...
                                    </div>
                                    <div className="text-text-muted">
                                        [INFO] Loading configuration files...
                                    </div>
                                    <div className="text-accent-cyan">
                                        [SUCCESS] All systems operational
                                    </div>
                                </motion.div>
                            </>
                        ) : (
                            /* Completion Message */
                            <motion.div
                                className="text-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    className="text-4xl mb-4"
                                    animate={{
                                        textShadow: [
                                            '0 0 5px #ff0040',
                                            '0 0 20px #ff0040, 0 0 30px #ff0040',
                                            '0 0 5px #ff0040',
                                        ],
                                    }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    ✓
                                </motion.div>
                                <motion.h2
                                    className="text-2xl font-mono font-bold text-primary neon-text mb-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Coding experience completed!
                                </motion.h2>
                                <motion.p
                                    className="text-text-secondary font-mono text-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    &gt; Welcome to Rubrion
                                </motion.p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
