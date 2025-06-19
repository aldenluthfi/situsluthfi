import { useState, useEffect } from 'react';

const FONT_FAMILIES = [
    'heading',
    'body',
    'code'
];

export const useAssetLoading = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [fontsLoaded, setFontsLoaded] = useState(false);

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
            setTimeout(() => setFontsLoaded(true), 1500);
        }
    };

    useEffect(() => {
        checkFontsLoaded();

        const fallbackTimer = setTimeout(() => {
            setFontsLoaded(true);
        }, 4000);

        return () => clearTimeout(fallbackTimer);
    }, []);

    useEffect(() => {
        if (fontsLoaded && isLoading) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [fontsLoaded, isLoading]);

    return {
        isLoading
    };
};