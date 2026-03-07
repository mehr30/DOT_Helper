"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Truck,
    Clock,
    Shield,
    FileText,
    BarChart3,
    Settings,
    Bell,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Building2,
    Check,
    AlertCircle,
    Plus,
} from "lucide-react";
import GreenlightLogo from "./GreenlightLogo";
import { useState, useEffect, useTransition } from "react";
import styles from "./Sidebar.module.css";
import { useDemoMode } from "./DemoModeContext";
import { useCompanyProfile } from "./CompanyProfileContext";
import { getUserCompanies, switchCompany } from "../actions/company";

const demoOrganizations = [
    { id: "org1", name: "Transport Co.", usdotNumber: "1234567", location: "Kansas City, KS", role: "OWNER" as const },
    { id: "org2", name: "Transport Co. — Denver", usdotNumber: "2345678", location: "Denver, CO", role: "ADMIN" as const },
    { id: "org3", name: "Southwest Fleet", usdotNumber: "3456789", location: "Dallas, TX", role: "OWNER" as const },
];

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: number;
}

interface UserCompany {
    id: string;
    name: string;
    usdotNumber: string | null;
    location: string | null;
    role: string;
}

const navigation: NavItem[] = [
    { name: "Home", href: "/dashboard", icon: LayoutDashboard },
    { name: "Compliance", href: "/dashboard/compliance", icon: Shield },
    { name: "Drivers", href: "/dashboard/drivers", icon: Users },
    { name: "Vehicles", href: "/dashboard/vehicles", icon: Truck },
    { name: "Driver Hours", href: "/dashboard/hos", icon: Clock },
    { name: "Documents", href: "/dashboard/documents", icon: FileText },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
];

function getInitials(name: string): string {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
    const { isDemoMode, exitDemo } = useDemoMode();
    const { profile } = useCompanyProfile();
    const [isPending, startTransition] = useTransition();

    // Multi-org state
    const [companies, setCompanies] = useState<UserCompany[]>([]);
    const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);

    // Load user's companies on mount (non-demo mode only)
    useEffect(() => {
        if (isDemoMode) return;
        getUserCompanies().then(result => {
            setCompanies(result);
            // The active company is determined by the profile context
        }).catch(() => {});
    }, [isDemoMode]);

    // Sync activeCompanyId when profile loads
    useEffect(() => {
        if (!isDemoMode && profile.companyName && companies.length > 0) {
            // Find the company that matches the current profile
            const match = companies.find(c => c.name === profile.companyName);
            if (match) {
                setActiveCompanyId(match.id);
            } else if (companies.length > 0) {
                setActiveCompanyId(companies[0]!.id);
            }
        }
    }, [isDemoMode, profile.companyName, companies]);

    const activeCompany = isDemoMode
        ? demoOrganizations[0]!
        : companies.find(c => c.id === activeCompanyId) || companies[0];

    const hasMultipleCompanies = isDemoMode
        ? demoOrganizations.length > 1
        : companies.length > 1;

    const orgList = isDemoMode ? demoOrganizations : companies;

    // Always show all nav items
    const visibleNavigation = navigation;

    // During onboarding, show a minimal sidebar (no nav links)
    const isOnboarding = pathname.startsWith("/dashboard/onboarding");

    const handleSwitchCompany = (companyId: string) => {
        if (isDemoMode) {
            setActiveCompanyId(companyId);
            setOrgDropdownOpen(false);
            return;
        }
        setOrgDropdownOpen(false);
        startTransition(async () => {
            await switchCompany(companyId);
        });
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                className={styles.mobileMenuButton}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
            >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay */}
            {mobileOpen && (
                <div
                    className={styles.overlay}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
                {/* Logo */}
                <div className={styles.logo}>
                    {isOnboarding ? (
                        <div className={styles.logoLink}>
                            <GreenlightLogo size={44} />
                            <span className={styles.logoText}>Greenlight DOT</span>
                        </div>
                    ) : (
                        <Link href="/dashboard" className={styles.logoLink}>
                            <GreenlightLogo size={44} />
                            <span className={styles.logoText}>Greenlight DOT</span>
                        </Link>
                    )}
                </div>

                {/* Navigation — hidden during onboarding */}
                {!isOnboarding && (
                    <nav className={styles.nav}>
                        <ul className={styles.navList}>
                            {visibleNavigation.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== "/dashboard" && pathname.startsWith(item.href));
                                const Icon = item.icon;

                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            <Icon size={20} className={styles.navIcon} />
                                            <span>{item.name}</span>
                                            {item.badge && isDemoMode && (
                                                <span className={styles.badge}>{item.badge}</span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                )}

                {isOnboarding && (
                    <div style={{
                        padding: "1.5rem 1rem", textAlign: "center",
                        color: "rgba(255,255,255,0.5)", fontSize: "0.8rem",
                        lineHeight: 1.6,
                    }}>
                        Complete your company setup to unlock all features.
                    </div>
                )}

                {/* Bottom section */}
                <div className={styles.bottomSection}>
                    {/* Demo/Live Mode Toggle */}
                    {isDemoMode && (
                        <div className={styles.demoBanner}>
                            <AlertCircle size={14} />
                            <span>Viewing sample data</span>
                            <button onClick={exitDemo} className={styles.demoBannerExit}>Exit demo</button>
                        </div>
                    )}

                    {/* Org switcher - hidden during onboarding */}
                    {!isOnboarding && activeCompany && (
                        <div className={styles.companyInfo}>
                            <button
                                className={styles.orgSwitcher}
                                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                                style={isPending ? { opacity: 0.6, pointerEvents: "none" } : undefined}
                            >
                                <div className={styles.companyAvatar}>
                                    {getInitials(activeCompany.name)}
                                </div>
                                <div className={styles.companyDetails}>
                                    <span className={styles.companyName}>{activeCompany.name}</span>
                                    <span className={styles.usdot}>
                                        {activeCompany.usdotNumber ? `USDOT: ${activeCompany.usdotNumber}` : "USDOT: Pending"}
                                    </span>
                                </div>
                                {(hasMultipleCompanies || !isDemoMode) && (
                                    <ChevronDown size={16} className={`${styles.orgChevron} ${orgDropdownOpen ? styles.rotated : ""}`} />
                                )}
                            </button>

                            {orgDropdownOpen && (
                                <div className={styles.orgDropdown}>
                                    <div className={styles.orgDropdownHeader}>
                                        <Building2 size={14} />
                                        <span>Switch Company</span>
                                    </div>
                                    {orgList.map(org => (
                                        <button
                                            key={org.id}
                                            className={`${styles.orgOption} ${org.id === activeCompany.id ? styles.activeOrg : ""}`}
                                            onClick={() => handleSwitchCompany(org.id)}
                                        >
                                            <div className={styles.orgOptionAvatar}>{getInitials(org.name)}</div>
                                            <div className={styles.orgOptionDetails}>
                                                <span className={styles.orgOptionName}>{org.name}</span>
                                                <span className={styles.orgOptionMeta}>
                                                    {org.usdotNumber ? `DOT: ${org.usdotNumber}` : "No DOT"}
                                                    {org.location ? ` · ${org.location}` : ""}
                                                </span>
                                            </div>
                                            {org.id === activeCompany.id && <Check size={16} className={styles.orgCheck} />}
                                        </button>
                                    ))}
                                    {/* Add Another Company */}
                                    <Link
                                        href="/dashboard/onboarding"
                                        className={styles.orgOption}
                                        onClick={() => setOrgDropdownOpen(false)}
                                        style={{ borderTop: "1px solid rgba(255,255,255,0.1)", textDecoration: "none" }}
                                    >
                                        <div className={styles.orgOptionAvatar} style={{ background: "rgba(255,255,255,0.1)", fontSize: "1rem" }}>
                                            <Plus size={16} />
                                        </div>
                                        <div className={styles.orgOptionDetails}>
                                            <span className={styles.orgOptionName}>Add Another Company</span>
                                            <span className={styles.orgOptionMeta}>Set up a new DOT entity</span>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Show setup prompt if no company and not onboarding */}
                    {!isOnboarding && !activeCompany && !isDemoMode && (
                        <div className={styles.companyInfo}>
                            <Link href="/dashboard/onboarding" className={styles.orgSwitcher} style={{ textDecoration: 'none' }}>
                                <div className={styles.companyAvatar} style={{ background: 'rgba(255,255,255,0.1)', fontSize: '1rem' }}>+</div>
                                <div className={styles.companyDetails}>
                                    <span className={styles.companyName}>Set Up Your Company</span>
                                    <span className={styles.usdot}>Add USDOT &amp; details</span>
                                </div>
                            </Link>
                        </div>
                    )}

                    <div className={styles.bottomLinks}>
                        {!isOnboarding && (
                            <>
                                <Link href="/dashboard/settings" className={styles.bottomLink}>
                                    <Settings size={18} />
                                    <span>Settings</span>
                                </Link>
                            </>
                        )}
                        <button className={styles.logoutButton}>
                            <LogOut size={18} />
                            <span>Log out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
