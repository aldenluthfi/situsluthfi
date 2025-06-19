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
        if (!isLoading && !showComplete) {
            setProgress(100);
            setShowComplete(true);
            console.log("Loading complete, showing completion state");

            const timer = setTimeout(() => {
                console.log("Calling onLoadingComplete after delay");
                onLoadingComplete();
            }, 600);

            return () => clearTimeout(timer);
        }
    }, [isLoading, onLoadingComplete]);

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 85) return prev;
                    return prev + Math.random() * 12;
                });
            }, 150);

            return () => clearInterval(interval);
        } else {
            setProgress(100);
        }
    }, [isLoading]);

    return (
        <AnimatePresence>
            {(isLoading || showComplete) && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="fixed inset-0 bg-background z-[9999] flex flex-col items-center justify-center"
                >
                    <div className="flex flex-col items-center space-y-8">
                        <div className="w-64 tablet:w-80 h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: `${Math.min(progress, 100)}%` }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
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
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
