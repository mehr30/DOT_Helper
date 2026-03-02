"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { useState } from "react";
import styles from "./Sidebar.module.css";

const organizations = [
    { id: "org1", name: "Transport Co.", initials: "TC", usdot: "1234567", location: "Kansas City, KS" },
    { id: "org2", name: "Transport Co. — Denver", initials: "TD", usdot: "2345678", location: "Denver, CO" },
    { id: "org3", name: "Southwest Fleet", initials: "SF", usdot: "3456789", location: "Dallas, TX" },
];

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: number;
}

const navigation: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Compliance", href: "/dashboard/compliance", icon: Shield },
    { name: "Alerts", href: "/dashboard/alerts", icon: Bell, badge: 5 },
    { name: "Drivers", href: "/dashboard/drivers", icon: Users },
    { name: "Vehicles", href: "/dashboard/vehicles", icon: Truck },
    { name: "Hours of Service", href: "/dashboard/hos", icon: Clock },
    { name: "Documents", href: "/dashboard/documents", icon: FileText },
    { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
    const [activeOrg, setActiveOrg] = useState(organizations[0]!);

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
                    <Link href="/dashboard" className={styles.logoLink}>
                        <div className={styles.logoIcon}>
                            <Truck size={28} />
                        </div>
                        <span className={styles.logoText}>DOT Helper</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        {navigation.map((item) => {
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
                                        {item.badge && (
                                            <span className={styles.badge}>{item.badge}</span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Bottom section */}
                <div className={styles.bottomSection}>
                    <div className={styles.companyInfo}>
                        <button
                            className={styles.orgSwitcher}
                            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                        >
                            <div className={styles.companyAvatar}>{activeOrg.initials}</div>
                            <div className={styles.companyDetails}>
                                <span className={styles.companyName}>{activeOrg.name}</span>
                                <span className={styles.usdot}>USDOT: {activeOrg.usdot}</span>
                            </div>
                            <ChevronDown size={16} className={`${styles.orgChevron} ${orgDropdownOpen ? styles.rotated : ""}`} />
                        </button>

                        {orgDropdownOpen && (
                            <div className={styles.orgDropdown}>
                                <div className={styles.orgDropdownHeader}>
                                    <Building2 size={14} />
                                    <span>Switch Business Unit</span>
                                </div>
                                {organizations.map(org => (
                                    <button
                                        key={org.id}
                                        className={`${styles.orgOption} ${org.id === activeOrg.id ? styles.activeOrg : ""}`}
                                        onClick={() => {
                                            setActiveOrg(org);
                                            setOrgDropdownOpen(false);
                                        }}
                                    >
                                        <div className={styles.orgOptionAvatar}>{org.initials}</div>
                                        <div className={styles.orgOptionDetails}>
                                            <span className={styles.orgOptionName}>{org.name}</span>
                                            <span className={styles.orgOptionMeta}>DOT: {org.usdot} · {org.location}</span>
                                        </div>
                                        {org.id === activeOrg.id && <Check size={16} className={styles.orgCheck} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.bottomLinks}>
                        <Link href="/dashboard/alerts" className={styles.bottomLink}>
                            <Bell size={18} />
                            <span>Notifications</span>
                            <span className={styles.notificationBadge}>3</span>
                        </Link>
                        <Link href="/dashboard/settings" className={styles.bottomLink}>
                            <Settings size={18} />
                            <span>Settings</span>
                        </Link>
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
