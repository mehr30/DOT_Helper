"use client";

import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import React from "react";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
    icon: React.ElementType;
    title: string;
    description: string;
    valueProposition?: string;
    primaryAction?: { label: string; href: string; icon?: React.ReactNode };
    secondaryAction?: { label: string; href: string };
}

export default function EmptyState({ icon: Icon, title, description, valueProposition, primaryAction, secondaryAction }: EmptyStateProps) {
    return (
        <div className={styles.emptyState}>
            <div className={styles.iconCircle}>
                <Icon size={32} />
            </div>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
            {valueProposition && (
                <p className={styles.valueProposition}>{valueProposition}</p>
            )}
            <div className={styles.actions}>
                {primaryAction && (
                    <Link href={primaryAction.href} className={styles.primaryAction}>
                        {primaryAction.icon || <Plus size={18} />}
                        {primaryAction.label}
                    </Link>
                )}
                {secondaryAction && (
                    <Link href={secondaryAction.href} className={styles.secondaryAction}>
                        {secondaryAction.label}
                        <ArrowRight size={16} />
                    </Link>
                )}
            </div>
            <p className={styles.demoTip}>
                Switch to <strong>Demo</strong> mode in the sidebar to see this page with sample data.
            </p>
        </div>
    );
}
