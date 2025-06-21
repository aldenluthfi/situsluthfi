import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react"
import { useTimezoneTheme } from "@/hooks/use-timezone-theme"
import type { ThemeString, ModeString } from "@/lib/types"


type ThemeProviderProps = {
    readonly children: React.ReactNode
    readonly defaultTheme?: ThemeString
    readonly defaultMode?: ModeString
    readonly storageKey?: string
}

type ThemeProviderState = {
    readonly theme: ThemeString
    readonly mode: ModeString
    readonly setTheme: (theme: ThemeString) => void
    readonly setMode: (mode: ModeString) => void
}

const initialState: ThemeProviderState = {
    theme: "yellow",
    mode: "timezone",
    setTheme: () => null,
    setMode: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export default function ThemeProvider({
    children,
    defaultTheme = "yellow",
    defaultMode = "timezone",
    storageKey = "vite-ui-theme",
    ...props
}: Readonly<ThemeProviderProps>) {

    const themeKey = `${storageKey}-color`
    const modeKey = `${storageKey}-mode`

    const { applyTimezoneTheme, isDarkMode, updateTimezoneData } = useTimezoneTheme();

    const [theme, setThemeState] = useState<ThemeString>(
        () => (localStorage.getItem(themeKey) as ThemeString) || defaultTheme
    )

    const [mode, setModeState] = useState<ModeString>(
        () => (localStorage.getItem(modeKey) as ModeString) || defaultMode
    )

    const updateTimezoneTheme = useCallback(() => {
        if (mode === "timezone") {
            const { newColor } = updateTimezoneData();
            applyTimezoneTheme();

            if (newColor !== theme) {
                setThemeState(newColor as ThemeString);
            }

            const root = window.document.documentElement;
            root.classList.remove("light", "dark");
            root.classList.add(isDarkMode ? "dark" : "light");
        }
    }, [mode, applyTimezoneTheme, isDarkMode, updateTimezoneData, theme]);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem(themeKey, theme)

        if (mode !== "timezone") {
            const root = document.documentElement;
            ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].forEach(shade => {
                root.style.removeProperty(`--primary-${shade}`);
                root.style.removeProperty(`--color-primary-${shade}`);
            });
            root.style.removeProperty(`--primary`);
            root.style.removeProperty(`--color-primary`);
            root.style.removeProperty(`--primary-foreground`);
            root.style.removeProperty(`--color-primary-foreground`);
        } else {
            updateTimezoneTheme();
        }
    }, [theme, themeKey, mode, updateTimezoneTheme])

    useEffect(() => {
        if (mode === "timezone") {
            localStorage.setItem(modeKey, mode);
            updateTimezoneTheme();
            return;
        }

        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        let appliedMode = mode
        if (mode === "system") {
            appliedMode = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
        }
        root.classList.add(appliedMode)
        localStorage.setItem(modeKey, mode)
    }, [mode, modeKey, updateTimezoneTheme])

    useEffect(() => {
        if (mode !== "timezone") return;

        updateTimezoneTheme();

        const interval = setInterval(updateTimezoneTheme, 60000);

        return () => clearInterval(interval);
    }, [mode, updateTimezoneTheme]);

    const value: ThemeProviderState = useMemo(() => ({
        theme,
        mode,
        setTheme: (t: ThemeString) => setThemeState(t),
        setMode: (m: ModeString) => setModeState(m),
    }), [theme, mode])

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)
    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")
    return context
}
