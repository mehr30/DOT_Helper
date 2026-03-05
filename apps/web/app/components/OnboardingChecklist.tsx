"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, ArrowRight, CheckCircle, ListChecks } from "lucide-react";
import styles from "./OnboardingChecklist.module.css";

const SESSION_DISMISS_KEY = "greenlight_checklist_session_dismissed";
const PERMANENT_DISMISS_KEY = "greenlight_checklist_dismissed";

interface OnboardingChecklistProps {
    hasCompany: boolean;
    driverCount: number;
    vehicleCount: number;
}

interface ChecklistItem {
    label: string;
    done: boolean;
    href?: string;
}

export default function OnboardingChecklist({ hasCompany, driverCount, vehicleCount }: OnboardingChecklistProps) {
    const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const permanentlyDismissed = localStorage.getItem(PERMANENT_DISMISS_KEY) === "true";
        const sessionDismissed = sessionStorage.getItem(SESSION_DISMISS_KEY) === "true";
        setDismissed(permanentlyDismissed || sessionDismissed);
    }, []);

    const items: ChecklistItem[] = [
        { label: "Create your account", done: true },
        { label: "Set up your company", done: hasCompany, href: "/dashboard/onboarding" },
        { label: "Add your first driver", done: driverCount > 0, href: "/dashboard/drivers/new" },
        { label: "Add your first vehicle", done: vehicleCount > 0, href: "/dashboard/vehicles/new" },
        { label: "Review your compliance dashboard", done: hasCompany && driverCount > 0 && vehicleCount > 0, href: "/dashboard/compliance" },
    ];

    const completedCount = items.filter(i => i.done).length;
    const allDone = completedCount === items.length;

    if (!mounted) return null;

    // Show a small "reopen" button when dismissed but not all done
    if (dismissed && !allDone) {
        return (
            <button
                className={styles.reopenButton}
                onClick={() => {
                    sessionStorage.removeItem(SESSION_DISMISS_KEY);
                    setDismissed(false);
                }}
            >
                <ListChecks size={16} />
                <span>Show setup guide ({completedCount}/{items.length})</span>
            </button>
        );
    }

    if (dismissed) return null;

    const handleDismiss = () => {
        if (allDone) {
            // Permanently dismiss once all items complete
            localStorage.setItem(PERMANENT_DISMISS_KEY, "true");
        } else {
            // Only dismiss for this browser session — comes back on next login
            sessionStorage.setItem(SESSION_DISMISS_KEY, "true");
        }
        setDismissed(true);
    };

    if (allDone) {
        return (
            <div className={styles.checklist}>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: "100%" }} />
                </div>
                <div className={styles.celebration}>
                    <div className={styles.celebrationIcon}>
                        <CheckCircle size={24} />
                    </div>
                    <span className={styles.celebrationTitle}>You're all set!</span>
                    <span className={styles.celebrationDesc}>
                        Your fleet is set up and ready for DOT compliance tracking.
                    </span>
                </div>
                <button className={styles.dismissButton} onClick={handleDismiss}>
                    Dismiss
                </button>
            </div>
        );
    }

    return (
        <div className={styles.checklist}>
            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{ width: `${(completedCount / items.length) * 100}%` }}
                />
            </div>

            <div className={styles.checklistHeader}>
                <h3 className={styles.checklistTitle}>Getting Started</h3>
                <span className={styles.checklistProgress}>{completedCount} of {items.length} complete</span>
            </div>

            <div className={styles.checklistItems}>
                {items.map((item) => {
                    const inner = (
                        <>
                            <div className={`${styles.itemCheck} ${item.done ? styles.itemCheckDone : styles.itemCheckPending}`}>
                                {item.done && <Check size={14} />}
                            </div>
                            <span className={`${styles.itemLabel} ${item.done ? styles.itemLabelDone : ""}`}>
                                {item.label}
                            </span>
                            {!item.done && item.href && (
                                <ArrowRight size={16} className={styles.itemArrow} />
                            )}
                        </>
                    );

                    if (!item.done && item.href) {
                        return (
                            <Link key={item.label} href={item.href} className={styles.checklistItem}>
                                {inner}
                            </Link>
                        );
                    }

                    return (
                        <div key={item.label} className={styles.checklistItem}>
                            {inner}
                        </div>
                    );
                })}
            </div>

            <button className={styles.dismissButton} onClick={handleDismiss}>
                I'll do this later
            </button>
        </div>
    );
}
