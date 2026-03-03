"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface DemoModeContextType {
    isDemoMode: boolean;
    toggleDemoMode: () => void;
}

const DemoModeContext = createContext<DemoModeContextType>({
    isDemoMode: true,
    toggleDemoMode: () => { },
});

export function useDemoMode() {
    return useContext(DemoModeContext);
}

export function DemoModeProvider({ children }: { children: ReactNode }) {
    const [isDemoMode, setIsDemoMode] = useState(true);

    // Persist preference in localStorage
    useEffect(() => {
        const saved = localStorage.getItem("dot_helper_demo_mode");
        if (saved !== null) {
            setIsDemoMode(saved === "true");
        }
    }, []);

    const toggleDemoMode = () => {
        setIsDemoMode(prev => {
            const next = !prev;
            localStorage.setItem("dot_helper_demo_mode", String(next));
            return next;
        });
    };

    return (
        <DemoModeContext.Provider value={{ isDemoMode, toggleDemoMode }}>
            {children}
        </DemoModeContext.Provider>
    );
}
