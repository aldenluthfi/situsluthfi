import { useState, useEffect, useCallback } from 'react';

type TimeBasedColor = {
    name: string;
    colors: Record<string, string>;
};

const allColors = [
    "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal",
    "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"
];

function createColorObject(colorName: string): TimeBasedColor {
    return {
        name: colorName,
        colors: {
            "50": `var(--color-${colorName}-50)`,
            "100": `var(--color-${colorName}-100)`,
            "200": `var(--color-${colorName}-200)`,
            "300": `var(--color-${colorName}-300)`,
            "400": `var(--color-${colorName}-400)`,
            "500": `var(--color-${colorName}-500)`,
            "600": `var(--color-${colorName}-600)`,
            "700": `var(--color-${colorName}-700)`,
            "800": `var(--color-${colorName}-800)`,
            "900": `var(--color-${colorName}-900)`,
            "950": `var(--color-${colorName}-950)`,
        }
    };
}

function createFlippedColorObject(colorName: string): TimeBasedColor {
    return {
        name: colorName,
        colors: {
            "50": `var(--color-${colorName}-950)`,
            "100": `var(--color-${colorName}-900)`,
            "200": `var(--color-${colorName}-800)`,
            "300": `var(--color-${colorName}-700)`,
            "400": `var(--color-${colorName}-600)`,
            "500": `var(--color-${colorName}-500)`,
            "600": `var(--color-${colorName}-400)`,
            "700": `var(--color-${colorName}-300)`,
            "800": `var(--color-${colorName}-200)`,
            "900": `var(--color-${colorName}-100)`,
            "950": `var(--color-${colorName}-50)`,
        }
    };
}

function getTimezoneTime(): Date {
    const timezone = import.meta.env.VITE_TIMEZONE || 'Asia/Jakarta';
    const now = new Date();
    return new Date(now.toLocaleString("en-US", { timeZone: timezone }));
}

function shouldBeDarkMode(): boolean {
    const timezoneTime = getTimezoneTime();
    const hour = timezoneTime.getHours();

    return hour >= 18 || hour < 6;
}

function getCurrentTimezoneColor(): string {
    const timezoneTime = getTimezoneTime();
    const hour = (timezoneTime.getHours() - 6) % 12;
    const minutes = timezoneTime.getMinutes();
    const totalMinutes = hour * 60 + minutes;

    const colorIndex = Math.floor((totalMinutes / (12 * 60)) * 17);

    return allColors[Math.min(colorIndex, allColors.length - 1)];
}

function getCurrentTimezonePeriod(): string {
    const currentColor = getCurrentTimezoneColor();
    const mode = shouldBeDarkMode() ? "Dark" : "Light";

    return `${currentColor.charAt(0).toUpperCase() + currentColor.slice(1)} ${mode}`;
}

export function useTimezoneTheme() {
    const [currentColor, setCurrentColor] = useState(getCurrentTimezoneColor());
    const [isDarkMode, setIsDarkMode] = useState(shouldBeDarkMode());
    const [currentPeriod, setCurrentPeriod] = useState(getCurrentTimezonePeriod());

    const applyTimezoneTheme = useCallback(() => {
        const isDark = shouldBeDarkMode();
        const colorName = getCurrentTimezoneColor();
        const colors = isDark ? createFlippedColorObject(colorName) : createColorObject(colorName);
        const root = document.documentElement;

        Object.entries(colors.colors).forEach(([shade, value]) => {
            root.style.setProperty(`--primary-${shade}`, value);
            root.style.setProperty(`--color-primary-${shade}`, value);
        });

        root.style.setProperty(`--primary`, colors.colors["500"]);
        root.style.setProperty(`--color-primary`, colors.colors["500"]);

        const foregroundColor = isDark ? colors.colors["100"] : colors.colors["900"];
        root.style.setProperty(`--primary-foreground`, foregroundColor);
        root.style.setProperty(`--color-primary-foreground`, foregroundColor);
    }, []);

    const updateTimezoneData = useCallback(() => {
        const newColor = getCurrentTimezoneColor();
        const newIsDarkMode = shouldBeDarkMode();
        const newPeriod = getCurrentTimezonePeriod();

        setCurrentColor(newColor);
        setIsDarkMode(newIsDarkMode);
        setCurrentPeriod(newPeriod);

        localStorage.setItem('vite-ui-theme-color', newColor);

        return { newColor, newIsDarkMode };
    }, []);

    useEffect(() => {
        updateTimezoneData();

        const interval = setInterval(updateTimezoneData, 60000);

        return () => clearInterval(interval);
    }, [updateTimezoneData]);

    return {
        currentColor,
        isDarkMode,
        currentPeriod,
        applyTimezoneTheme,
        updateTimezoneData,
        getCurrentTimezoneColor,
        shouldBeDarkMode: () => isDarkMode,
        getCurrentTimezonePeriod: () => currentPeriod,
    };
}
