"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Users,
    Mail,
    Shield,
    Trash2,
    Loader2,
    ArrowLeft,
    UserPlus,
    Clock,
    Crown,
} from "lucide-react";
import { inviteUser, revokeInvite, removeMember } from "../../../actions/invites";

interface Member {
    id: string;
    role: string;
    joinedAt: Date;
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
}

interface Invite {
    id: string;
    email: string;
    role: string;
    createdAt: Date;
    expiresAt: Date;
}

export default function TeamManagement({
    currentUserId,
    currentUserRole,
    initialMembers,
    initialInvites,
}: {
    currentUserId: string;
    currentUserRole: string;
    initialMembers: Member[];
    initialInvites: Invite[];
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<"ADMIN" | "DISPATCHER" | "DRIVER">("DISPATCHER");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const canManage = currentUserRole === "OWNER" || currentUserRole === "ADMIN";

    const roleLabel = (role: string) => {
        switch (role) {
            case "OWNER": return "Owner";
            case "ADMIN": return "Admin";
            case "DISPATCHER": return "Dispatcher";
            case "DRIVER": return "Driver";
            default: return role;
        }
    };

    const roleIcon = (role: string) => {
        if (role === "OWNER") return <Crown size={14} style={{ color: "#eab308" }} />;
        if (role === "ADMIN") return <Shield size={14} style={{ color: "#3b82f6" }} />;
        return null;
    };

    const getInitials = (name: string) =>
        name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

    const handleInvite = () => {
        if (!inviteEmail.trim()) return;
        setMessage(null);
        startTransition(async () => {
            const res = await inviteUser(inviteEmail.trim(), inviteRole);
            if (res.error) {
                setMessage({ type: "error", text: res.error });
            } else {
                setMessage({ type: "success", text: `Invite sent to ${inviteEmail}` });
                setInviteEmail("");
            }
            router.refresh();
        });
    };

    const handleRevoke = (inviteId: string) => {
        if (!confirm("Revoke this invite?")) return;
        startTransition(async () => {
            await revokeInvite(inviteId);
            router.refresh();
        });
    };

    const handleRemove = (memberId: string, name: string) => {
        if (!confirm(`Remove ${name} from this company?`)) return;
        startTransition(async () => {
            const res = await removeMember(memberId);
            if (res.error) {
                setMessage({ type: "error", text: res.error });
            }
            router.refresh();
        });
    };

    return (
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <Link href="/dashboard/settings" style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                color: "#64748b", fontSize: "0.85rem", textDecoration: "none",
                marginBottom: "1.5rem",
            }}>
                <ArrowLeft size={16} /> Back to Settings
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
                <div style={{
                    width: 40, height: 40, borderRadius: "10px",
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <Users size={20} style={{ color: "white" }} />
                </div>
                <div>
                    <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Team Members</h1>
                    <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
                        Manage who has access to your company
                    </p>
                </div>
            </div>

            {/* Invite Form */}
            {canManage && (
                <div style={{
                    background: "white", borderRadius: "12px", padding: "1.25rem",
                    border: "1px solid #e2e8f0", marginBottom: "1.5rem",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                        <UserPlus size={18} style={{ color: "#16a34a" }} />
                        <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>Invite a Team Member</span>
                    </div>

                    {message && (
                        <div style={{
                            padding: "0.6rem 0.75rem", borderRadius: "8px",
                            fontSize: "0.85rem", marginBottom: "0.75rem",
                            background: message.type === "success" ? "#f0fdf4" : "#fef2f2",
                            border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                            color: message.type === "success" ? "#166534" : "#dc2626",
                        }}>
                            {message.text}
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleInvite()}
                            style={{
                                flex: 1, minWidth: 200, padding: "0.5rem 0.75rem",
                                border: "1px solid #e2e8f0", borderRadius: "8px",
                                fontSize: "0.875rem",
                            }}
                        />
                        <select
                            value={inviteRole}
                            onChange={e => setInviteRole(e.target.value as "ADMIN" | "DISPATCHER" | "DRIVER")}
                            style={{
                                padding: "0.5rem 0.75rem", border: "1px solid #e2e8f0",
                                borderRadius: "8px", fontSize: "0.85rem", color: "#334155",
                                cursor: "pointer", background: "white",
                            }}
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="DISPATCHER">Dispatcher</option>
                            <option value="DRIVER">Driver</option>
                        </select>
                        <button
                            onClick={handleInvite}
                            disabled={isPending || !inviteEmail.trim()}
                            style={{
                                display: "flex", alignItems: "center", gap: "0.35rem",
                                padding: "0.5rem 1rem", background: "#16a34a",
                                color: "white", border: "none", borderRadius: "8px",
                                fontWeight: 600, fontSize: "0.85rem",
                                cursor: isPending ? "not-allowed" : "pointer",
                                opacity: isPending || !inviteEmail.trim() ? 0.6 : 1,
                            }}
                        >
                            {isPending ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Mail size={14} />}
                            Send Invite
                        </button>
                    </div>
                </div>
            )}

            {/* Current Members */}
            <div style={{
                background: "white", borderRadius: "12px",
                border: "1px solid #e2e8f0", marginBottom: "1.5rem",
                overflow: "hidden",
            }}>
                <div style={{
                    padding: "1rem 1.25rem",
                    borderBottom: "1px solid #f1f5f9",
                    fontWeight: 600, fontSize: "0.9rem",
                }}>
                    Members ({initialMembers.length})
                </div>
                {initialMembers.map(member => (
                    <div key={member.id} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "0.75rem 1.25rem",
                        borderBottom: "1px solid #f8fafc",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: "50%",
                                background: "linear-gradient(135deg, #e2e8f0, #cbd5e1)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "0.75rem", fontWeight: 700, color: "#475569",
                            }}>
                                {member.user.image ? (
                                    <img src={member.user.image} alt="" style={{ width: 36, height: 36, borderRadius: "50%" }} />
                                ) : (
                                    getInitials(member.user.name)
                                )}
                            </div>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                    <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>
                                        {member.user.name}
                                    </span>
                                    {member.user.id === currentUserId && (
                                        <span style={{
                                            fontSize: "0.7rem", color: "#64748b",
                                            background: "#f1f5f9", padding: "1px 6px",
                                            borderRadius: "4px",
                                        }}>you</span>
                                    )}
                                </div>
                                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{member.user.email}</span>
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <span style={{
                                display: "flex", alignItems: "center", gap: "0.25rem",
                                fontSize: "0.8rem", color: "#64748b", fontWeight: 500,
                            }}>
                                {roleIcon(member.role)}
                                {roleLabel(member.role)}
                            </span>
                            {canManage && member.user.id !== currentUserId && member.role !== "OWNER" && (
                                <button
                                    onClick={() => handleRemove(member.id, member.user.name)}
                                    disabled={isPending}
                                    style={{
                                        background: "none", border: "none",
                                        color: "#94a3b8", cursor: "pointer",
                                        padding: "0.25rem",
                                    }}
                                    title="Remove member"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pending Invites */}
            {initialInvites.length > 0 && (
                <div style={{
                    background: "white", borderRadius: "12px",
                    border: "1px solid #e2e8f0", overflow: "hidden",
                }}>
                    <div style={{
                        padding: "1rem 1.25rem",
                        borderBottom: "1px solid #f1f5f9",
                        fontWeight: 600, fontSize: "0.9rem",
                        display: "flex", alignItems: "center", gap: "0.5rem",
                    }}>
                        <Clock size={16} style={{ color: "#eab308" }} />
                        Pending Invites ({initialInvites.length})
                    </div>
                    {initialInvites.map(invite => (
                        <div key={invite.id} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "0.75rem 1.25rem",
                            borderBottom: "1px solid #f8fafc",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: "#fef9c3",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <Mail size={14} style={{ color: "#ca8a04" }} />
                                </div>
                                <div>
                                    <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{invite.email}</span>
                                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                                        Invited as {roleLabel(invite.role)}
                                    </div>
                                </div>
                            </div>
                            {canManage && (
                                <button
                                    onClick={() => handleRevoke(invite.id)}
                                    disabled={isPending}
                                    style={{
                                        background: "none", border: "1px solid #e2e8f0",
                                        color: "#ef4444", cursor: "pointer",
                                        padding: "0.25rem 0.6rem", borderRadius: "6px",
                                        fontSize: "0.75rem", fontWeight: 500,
                                    }}
                                >
                                    Revoke
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
    );
}
