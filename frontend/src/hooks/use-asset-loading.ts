import { useState, useEffect } from 'react';

const CRITICAL_IMAGES = [
    '/src/assets/images/solo.webp',
    '/src/assets/images/holeboys.webp',
    '/src/assets/images/medprop.webp',
    '/src/assets/images/weirdos.webp',
];

const FONT_FAMILIES = [
    'heading',
    'body',
    'code'
];

export const useAssetLoading = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const checkFontsLoaded = async () => {
        if (!('fonts' in document)) {
            setTimeout(() => setFontsLoaded(true), 1000);
            return;
        }

        try {
            await Promise.all(
                FONT_FAMILIES.map(font =>
                    document.fonts.check(`16px ${font}`)
                )
            );

            await document.fonts.ready;
            setFontsLoaded(true);
        } catch (error) {
            console.warn('Font loading check failed:', error);
            setTimeout(() => setFontsLoaded(true), 2000);
        }
    };

    const preloadImages = async () => {
        try {
            const imagePromises = CRITICAL_IMAGES.map(src => {
                return new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve();
                    img.onerror = () => reject(new Error(`Failed to load ${src}`));
                    img.src = src;
                });
            });

            await Promise.all(imagePromises);
            setImagesLoaded(true);
        } catch (error) {
            console.warn('Some images failed to preload:', error);
            setImagesLoaded(true);
        }
    };

    useEffect(() => {
        checkFontsLoaded();
        preloadImages();
    }, []);

    useEffect(() => {
        if (fontsLoaded && imagesLoaded) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [fontsLoaded, imagesLoaded]);

    return {
        isLoading,
        fontsLoaded,
        imagesLoaded,
        progress: {
            fonts: fontsLoaded,
            images: imagesLoaded,
            overall: fontsLoaded && imagesLoaded
        }
    };
};
