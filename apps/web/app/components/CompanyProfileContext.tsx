"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

/* ─── Types ─── */
export interface SavedAddress {
    id: string;
    label: string;          // e.g. "Main Office", "Denver Branch"
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface CompanyProfile {
    companyName: string;
    usdotNumber: string;
    phone: string;
    email: string;
    addresses: SavedAddress[];
    // Fleet characteristics that control feature visibility
    hasVehiclesOver10001: boolean;  // triggers HOS visibility
    operationType: "interstate" | "intrastate" | "both" | "";
}

const DEFAULT_PROFILE: CompanyProfile = {
    companyName: "",
    usdotNumber: "",
    phone: "",
    email: "",
    addresses: [],
    hasVehiclesOver10001: false,
    operationType: "",
};

interface CompanyProfileContextType {
    profile: CompanyProfile;
    updateProfile: (updates: Partial<CompanyProfile>) => void;
    addAddress: (address: Omit<SavedAddress, "id">) => void;
    removeAddress: (id: string) => void;
    updateAddress: (id: string, updates: Partial<SavedAddress>) => void;
    needsHOS: boolean;
}

const CompanyProfileContext = createContext<CompanyProfileContextType | null>(null);

const STORAGE_KEY = "dot_helper_company_profile";

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function CompanyProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_PROFILE);
    const [loaded, setLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                setProfile({ ...DEFAULT_PROFILE, ...parsed });
            }
        } catch { /* ignore */ }
        setLoaded(true);
    }, []);

    // Save to localStorage on change (after initial load)
    useEffect(() => {
        if (loaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        }
    }, [profile, loaded]);

    const updateProfile = (updates: Partial<CompanyProfile>) => {
        setProfile(prev => ({ ...prev, ...updates }));
    };

    const addAddress = (address: Omit<SavedAddress, "id">) => {
        const newAddr: SavedAddress = { ...address, id: generateId() };
        setProfile(prev => ({
            ...prev,
            addresses: [...prev.addresses, newAddr],
        }));
    };

    const removeAddress = (id: string) => {
        setProfile(prev => ({
            ...prev,
            addresses: prev.addresses.filter(a => a.id !== id),
        }));
    };

    const updateAddress = (id: string, updates: Partial<SavedAddress>) => {
        setProfile(prev => ({
            ...prev,
            addresses: prev.addresses.map(a => a.id === id ? { ...a, ...updates } : a),
        }));
    };

    // HOS is needed if vehicles are over 10,001 lbs
    const needsHOS = profile.hasVehiclesOver10001;

    return (
        <CompanyProfileContext.Provider value={{
            profile, updateProfile, addAddress, removeAddress, updateAddress, needsHOS,
        }}>
            {children}
        </CompanyProfileContext.Provider>
    );
}

export function useCompanyProfile() {
    const ctx = useContext(CompanyProfileContext);
    if (!ctx) throw new Error("useCompanyProfile must be used within CompanyProfileProvider");
    return ctx;
}
