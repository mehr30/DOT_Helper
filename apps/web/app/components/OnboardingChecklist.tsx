"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, ArrowRight, CheckCircle, ListChecks } from "lucide-react";
import styles from "./OnboardingChecklist.module.css";

const PERMANENT_DISMISS_KEY = "greenlight_checklist_dismissed";
const SESSION_DISMISS_KEY = "greenlight_checklist_session_dismissed";

interface OnboardingChecklistProps {
    hasCompany: boolean;
    driverCount: number;
    vehicleCount: number;
    /** Number of Company & Authority compliance items that still need action */
    companyDocsNeeded?: number;
    /** Number of Company & Authority compliance items that are compliant */
    companyDocsComplete?: number;
}

interface ChecklistItem {
    label: string;
    done: boolean;
    href?: string;
}

export default function OnboardingChecklist({
    hasCompany,
    driverCount,
    vehicleCount,
    companyDocsNeeded = 0,
    companyDocsComplete = 0,
}: OnboardingChecklistProps) {
    const [dismissed, setDismissed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Only permanently dismissed if user completed ALL items previously
        const permanentlyDismissed = localStorage.getItem(PERMANENT_DISMISS_KEY) === "true";
        // Session dismiss = user clicked "I'll do this later" (resets on new browser session)
        const sessionDismissed = sessionStorage.getItem(SESSION_DISMISS_KEY) === "true";
        setDismissed(permanentlyDismissed || sessionDismissed);

        // Clear any stale permanent dismiss if items aren't all done
        // (handles case where user dismissed in old version)
        if (permanentlyDismissed && !sessionDismissed) {
            // We'll check allDone below and clear if needed
            localStorage.removeItem(PERMANENT_DISMISS_KEY);
            setDismissed(sessionDismissed);
        }
    }, []);

    const totalCompanyDocs = companyDocsNeeded + companyDocsComplete;
    const hasUploadedDocs = companyDocsComplete > 0;

    const items: ChecklistItem[] = [
        { label: "Create your account", done: true },
        { label: "Set up your company", done: hasCompany, href: "/dashboard/onboarding" },
        { label: "Add your first driver", done: driverCount > 0, href: "/dashboard/drivers/new" },
        { label: "Add your first vehicle", done: vehicleCount > 0, href: "/dashboard/vehicles/new" },
        {
            label: hasUploadedDocs
                ? `Upload compliance documents (${companyDocsComplete}/${totalCompanyDocs} done)`
                : "Upload key compliance documents",
            done: companyDocsNeeded === 0 && totalCompanyDocs > 0,
            href: "/dashboard/compliance",
        },
        { label: "Review your compliance dashboard", done: hasCompany && driverCount > 0 && vehicleCount > 0, href: "/dashboard/compliance" },
    ];

    const completedCount = items.filter(i => i.done).length;
    const allDone = completedCount === items.length;

    if (!mounted) return null;

    // Show collapsed "reopen" button only if session-dismissed
    if (dismissed && !allDone) {
        return (
            <button
                className={styles.reopenButton}
                onClick={() => {
                    sessionStorage.removeItem(SESSION_DISMISS_KEY);
                    localStorage.removeItem(PERMANENT_DISMISS_KEY);
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
            // Permanently dismiss — everything is complete
            localStorage.setItem(PERMANENT_DISMISS_KEY, "true");
        } else {
            // Session-only dismiss — guide comes back next visit
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
