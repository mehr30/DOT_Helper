"use client";

import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import React from "react";

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
    primaryAction?: { label: string; href: string; icon?: React.ReactNode; };
    secondaryAction?: { label: string; href: string; };
}

export default function EmptyState({ icon, title, description, primaryAction, secondaryAction }: EmptyStateProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 2rem",
            textAlign: "center" as const,
        }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{icon}</div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
                {title}
            </h2>
            <p style={{
                fontSize: "0.9rem", color: "#64748b", lineHeight: 1.6,
                maxWidth: 420, marginBottom: "1.5rem",
            }}>
                {description}
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" as const, justifyContent: "center" }}>
                {primaryAction && (
                    <Link href={primaryAction.href} style={{
                        display: "inline-flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.6rem 1.25rem", borderRadius: "10px",
                        background: "#3b82f6", color: "white",
                        fontWeight: 600, fontSize: "0.875rem",
                        textDecoration: "none",
                    }}>
                        {primaryAction.icon || <Plus size={18} />}
                        {primaryAction.label}
                    </Link>
                )}
                {secondaryAction && (
                    <Link href={secondaryAction.href} style={{
                        display: "inline-flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.6rem 1.25rem", borderRadius: "10px",
                        border: "1px solid #e2e8f0", background: "white", color: "#475569",
                        fontWeight: 500, fontSize: "0.875rem",
                        textDecoration: "none",
                    }}>
                        {secondaryAction.label}
                        <ArrowRight size={16} />
                    </Link>
                )}
            </div>
            <p style={{
                marginTop: "1.5rem", fontSize: "0.8rem",
                color: "#94a3b8", padding: "0.75rem 1rem",
                background: "#f8fafc", borderRadius: "8px",
                border: "1px solid #f1f5f9",
            }}>
                💡 Switch to <strong>Demo</strong> mode in the sidebar to see this page with sample data.
            </p>
        </div>
    );
}
