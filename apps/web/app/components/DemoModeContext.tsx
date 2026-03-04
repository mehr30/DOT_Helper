"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSearchParams } from "next/navigation";

interface DemoModeContextType {
    isDemoMode: boolean;
    toggleDemoMode: () => void;
    exitDemo: () => void;
}

const DemoModeContext = createContext<DemoModeContextType>({
    isDemoMode: false,
    toggleDemoMode: () => { },
    exitDemo: () => { },
});

export function useDemoMode() {
    return useContext(DemoModeContext);
}

export function DemoModeProvider({ children }: { children: ReactNode }) {
    const [isDemoMode, setIsDemoMode] = useState(false);
    const searchParams = useSearchParams();

    // Check URL param on mount, then localStorage
    useEffect(() => {
        const demoParam = searchParams.get("demo");
        if (demoParam === "true") {
            setIsDemoMode(true);
            localStorage.setItem("dot_helper_demo_mode", "true");
            return;
        }
        const saved = localStorage.getItem("dot_helper_demo_mode");
        if (saved === "true") {
            setIsDemoMode(true);
        }
    }, [searchParams]);

    const toggleDemoMode = () => {
        setIsDemoMode(prev => {
            const next = !prev;
            localStorage.setItem("dot_helper_demo_mode", String(next));
            return next;
        });
    };

    const exitDemo = () => {
        setIsDemoMode(false);
        localStorage.setItem("dot_helper_demo_mode", "false");
        // Remove ?demo param from URL if present
        if (typeof window !== "undefined" && window.location.search.includes("demo=true")) {
            const url = new URL(window.location.href);
            url.searchParams.delete("demo");
            window.history.replaceState({}, "", url.pathname);
        }
    };

    return (
        <DemoModeContext.Provider value={{ isDemoMode, toggleDemoMode, exitDemo }}>
            {children}
        </DemoModeContext.Provider>
    );
}
