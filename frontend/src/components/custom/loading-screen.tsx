import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
    isLoading: boolean;
    onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading, onLoadingComplete }) => {
    const [progress, setProgress] = useState(0);
    const [showComplete, setShowComplete] = useState(false);

    useEffect(() => {
        if (!isLoading && progress < 100) {
            setProgress(100);
            setShowComplete(true);

            const timer = setTimeout(() => {
                onLoadingComplete();
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [isLoading, progress, onLoadingComplete]);

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + Math.random() * 15;
                });
            }, 200);

            return () => clearInterval(interval);
        }
    }, [isLoading]);

    return (
        <AnimatePresence>
            {(isLoading || showComplete) && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="fixed inset-0 bg-background z-[9999] flex flex-col items-center justify-center"
                >
                    <div className="flex flex-col items-center space-y-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="text-4xl tablet:text-6xl font-heading text-primary"
                        >
                            aldenluth.fi
                        </motion.div>

                        <div className="w-64 tablet:w-80 h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: `${Math.min(progress, 100)}%` }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-sm tablet:text-base text-muted-foreground"
                        >
                            {showComplete ? "Ready!" : "Loading..."}
                        </motion.p>
                    </div>

                    <motion.div
                        className="absolute bottom-8 text-xs text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        Please wait while we prepare everything for you
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
