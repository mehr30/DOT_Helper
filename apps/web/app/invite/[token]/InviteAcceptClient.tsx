"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Check, AlertTriangle, Loader2, LogIn } from "lucide-react";
import { acceptInvite } from "../../actions/invites";
import { useSession } from "../../../lib/auth-client";
import GreenlightLogo from "../../components/GreenlightLogo";

interface InviteInfo {
    id: string;
    email: string;
    role: string;
    status: string;
    expired: boolean;
    companyName: string;
}

export default function InviteAcceptClient({
    token,
    invite,
}: {
    token: string;
    invite: InviteInfo | null;
}) {
    const router = useRouter();
    const { data: session } = useSession();
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null);

    const isLoggedIn = !!session?.user;

    const handleAccept = () => {
        startTransition(async () => {
            const res = await acceptInvite(token);
            setResult(res);
            if (res.success) {
                setTimeout(() => router.push("/dashboard"), 1500);
            }
        });
    };

    const roleLabel = (role: string) => {
        switch (role) {
            case "OWNER": return "Owner";
            case "ADMIN": return "Admin";
            case "DISPATCHER": return "Dispatcher";
            case "DRIVER": return "Driver";
            default: return role;
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f8fafc 100%)",
            padding: "1rem",
        }}>
            <div style={{
                background: "white",
                borderRadius: "16px",
                padding: "2.5rem",
                maxWidth: "440px",
                width: "100%",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                textAlign: "center",
            }}>
                <div style={{ marginBottom: "1.5rem" }}>
                    <GreenlightLogo size={48} />
                </div>

                {/* Invalid or missing invite */}
                {!invite && (
                    <>
                        <div style={{
                            width: 48, height: 48, borderRadius: "50%",
                            background: "#fef2f2", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            margin: "0 auto 1rem",
                        }}>
                            <AlertTriangle size={24} style={{ color: "#ef4444" }} />
                        </div>
                        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
                            Invalid Invite
                        </h1>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6 }}>
                            This invite link is invalid or has been revoked. Please ask the company admin to send a new invitation.
                        </p>
                        <Link href="/" style={{
                            display: "inline-block", marginTop: "1.5rem",
                            color: "#16a34a", fontWeight: 600, fontSize: "0.9rem",
                            textDecoration: "none",
                        }}>
                            Go to Homepage
                        </Link>
                    </>
                )}

                {/* Expired invite */}
                {invite?.expired && (
                    <>
                        <div style={{
                            width: 48, height: 48, borderRadius: "50%",
                            background: "#fefce8", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            margin: "0 auto 1rem",
                        }}>
                            <AlertTriangle size={24} style={{ color: "#eab308" }} />
                        </div>
                        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
                            Invite Expired
                        </h1>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6 }}>
                            This invite to <strong>{invite.companyName}</strong> has expired.
                            Please ask the company admin to send a new invitation.
                        </p>
                        <Link href="/" style={{
                            display: "inline-block", marginTop: "1.5rem",
                            color: "#16a34a", fontWeight: 600, fontSize: "0.9rem",
                            textDecoration: "none",
                        }}>
                            Go to Homepage
                        </Link>
                    </>
                )}

                {/* Already accepted */}
                {invite && !invite.expired && invite.status === "ACCEPTED" && (
                    <>
                        <div style={{
                            width: 48, height: 48, borderRadius: "50%",
                            background: "#f0fdf4", display: "flex",
                            alignItems: "center", justifyContent: "center",
                            margin: "0 auto 1rem",
                        }}>
                            <Check size={24} style={{ color: "#16a34a" }} />
                        </div>
                        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
                            Already Accepted
                        </h1>
                        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6 }}>
                            This invite to <strong>{invite.companyName}</strong> has already been accepted.
                        </p>
                        <Link href="/dashboard" style={{
                            display: "inline-block", marginTop: "1.5rem", padding: "0.75rem 1.5rem",
                            background: "#16a34a", color: "white", borderRadius: "8px",
                            fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
                        }}>
                            Go to Dashboard
                        </Link>
                    </>
                )}

                {/* Valid invite, pending acceptance */}
                {invite && !invite.expired && invite.status === "PENDING" && (
                    <>
                        {result?.success ? (
                            <>
                                <div style={{
                                    width: 48, height: 48, borderRadius: "50%",
                                    background: "#f0fdf4", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    margin: "0 auto 1rem",
                                }}>
                                    <Check size={24} style={{ color: "#16a34a" }} />
                                </div>
                                <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
                                    Welcome aboard!
                                </h1>
                                <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6 }}>
                                    You've joined <strong>{invite.companyName}</strong>. Redirecting to your dashboard...
                                </p>
                            </>
                        ) : (
                            <>
                                <div style={{
                                    width: 48, height: 48, borderRadius: "50%",
                                    background: "#f0fdf4", display: "flex",
                                    alignItems: "center", justifyContent: "center",
                                    margin: "0 auto 1rem",
                                }}>
                                    <Building2 size={24} style={{ color: "#16a34a" }} />
                                </div>
                                <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem" }}>
                                    You&apos;re invited!
                                </h1>
                                <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 1.5rem" }}>
                                    You've been invited to join <strong>{invite.companyName}</strong> as
                                    a <strong>{roleLabel(invite.role)}</strong>.
                                </p>

                                {result?.error && (
                                    <div style={{
                                        background: "#fef2f2", border: "1px solid #fecaca",
                                        borderRadius: "8px", padding: "0.75rem",
                                        color: "#dc2626", fontSize: "0.85rem",
                                        marginBottom: "1rem",
                                    }}>
                                        {result.error}
                                    </div>
                                )}

                                {isLoggedIn ? (
                                    <button
                                        onClick={handleAccept}
                                        disabled={isPending}
                                        style={{
                                            width: "100%", padding: "0.75rem 1.5rem",
                                            background: "#16a34a", color: "white",
                                            border: "none", borderRadius: "8px",
                                            fontWeight: 600, fontSize: "0.95rem",
                                            cursor: isPending ? "not-allowed" : "pointer",
                                            opacity: isPending ? 0.7 : 1,
                                            display: "flex", alignItems: "center",
                                            justifyContent: "center", gap: "0.5rem",
                                        }}
                                    >
                                        {isPending ? (
                                            <>
                                                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                                                Joining...
                                            </>
                                        ) : (
                                            <>
                                                <Check size={18} />
                                                Accept Invite
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <>
                                        <p style={{ color: "#475569", fontSize: "0.85rem", marginBottom: "1rem" }}>
                                            Sign in or create an account to accept this invite.
                                        </p>
                                        <Link
                                            href={`/login?redirect=/invite/${token}`}
                                            style={{
                                                display: "flex", alignItems: "center",
                                                justifyContent: "center", gap: "0.5rem",
                                                width: "100%", padding: "0.75rem 1.5rem",
                                                background: "#16a34a", color: "white",
                                                border: "none", borderRadius: "8px",
                                                fontWeight: 600, fontSize: "0.95rem",
                                                textDecoration: "none",
                                            }}
                                        >
                                            <LogIn size={18} />
                                            Sign In to Accept
                                        </Link>
                                        <Link
                                            href={`/signup?redirect=/invite/${token}`}
                                            style={{
                                                display: "block", marginTop: "0.75rem",
                                                color: "#16a34a", fontWeight: 600,
                                                fontSize: "0.85rem", textDecoration: "none",
                                            }}
                                        >
                                            Don&apos;t have an account? Sign up
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                    </>
                )}
            </div>
        </div>
    );
}
