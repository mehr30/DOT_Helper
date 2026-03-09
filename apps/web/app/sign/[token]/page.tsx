"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    Shield,
    CheckCircle,
    AlertTriangle,
    Clock,
    FileText,
    Loader2,
    XCircle,
} from "lucide-react";
import { getSigningRequest, completeSigningRequest } from "../../actions/signing";
import SignaturePad from "../../components/SignaturePad";

type PageState =
    | { type: "loading" }
    | { type: "ready"; formTitle: string; formData: Record<string, string | boolean>; companyName: string; driverName: string | null; expiresAt: string }
    | { type: "signing"; formTitle: string }
    | { type: "done" }
    | { type: "already_signed"; signedAt: Date | null }
    | { type: "expired" }
    | { type: "not_found" }
    | { type: "error"; message: string };

export default function SigningPage() {
    const params = useParams();
    const token = params.token as string;
    const [state, setState] = useState<PageState>({ type: "loading" });
    const [formData, setFormData] = useState<Record<string, string | boolean>>({});

    useEffect(() => {
        if (!token) return;
        getSigningRequest(token).then((result) => {
            if ("error" in result) {
                if (result.error === "not_found") setState({ type: "not_found" });
                else if (result.error === "expired") setState({ type: "expired" });
                else if (result.error === "already_signed") setState({ type: "already_signed", signedAt: (result as { signedAt?: Date | null }).signedAt ?? null });
                return;
            }
            setFormData(result.formData);
            setState({
                type: "ready",
                formTitle: result.formTitle,
                formData: result.formData,
                companyName: result.companyName,
                driverName: result.driverName,
                expiresAt: result.expiresAt,
            });
        }).catch(() => setState({ type: "error", message: "Something went wrong loading this document." }));
    }, [token]);

    const handleSign = async (signatureDataUrl: string) => {
        if (state.type !== "ready") return;
        setState({ type: "signing", formTitle: state.formTitle });
        const result = await completeSigningRequest(token, signatureDataUrl);
        if (result.error) {
            setState({ type: "error", message: result.error });
        } else {
            setState({ type: "done" });
        }
    };

    // Format field label from camelCase
    const formatLabel = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());

    return (
        <div style={{
            minHeight: "100vh", background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f8fafc 100%)",
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        }}>
            {/* Header */}
            <header style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                padding: "1rem", borderBottom: "1px solid #e2e8f0", background: "white",
            }}>
                <Shield size={22} style={{ color: "#16a34a" }} />
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>Greenlight USDOT</span>
            </header>

            <main style={{ maxWidth: 600, margin: "0 auto", padding: "1.5rem 1rem" }}>

                {/* Loading */}
                {state.type === "loading" && (
                    <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b" }}>
                        <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
                        <p style={{ marginTop: "1rem" }}>Loading document...</p>
                        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                    </div>
                )}

                {/* Not Found */}
                {state.type === "not_found" && (
                    <div style={{ textAlign: "center", padding: "4rem 0" }}>
                        <XCircle size={48} style={{ color: "#ef4444", marginBottom: "1rem" }} />
                        <h2 style={{ color: "#0f172a", marginBottom: "0.5rem" }}>Link Not Found</h2>
                        <p style={{ color: "#64748b" }}>This signing link is invalid or has been removed.</p>
                    </div>
                )}

                {/* Expired */}
                {state.type === "expired" && (
                    <div style={{ textAlign: "center", padding: "4rem 0" }}>
                        <Clock size={48} style={{ color: "#f59e0b", marginBottom: "1rem" }} />
                        <h2 style={{ color: "#0f172a", marginBottom: "0.5rem" }}>Link Expired</h2>
                        <p style={{ color: "#64748b" }}>This signing link has expired. Please ask your employer to send a new one.</p>
                    </div>
                )}

                {/* Already Signed */}
                {state.type === "already_signed" && (
                    <div style={{ textAlign: "center", padding: "4rem 0" }}>
                        <CheckCircle size={48} style={{ color: "#16a34a", marginBottom: "1rem" }} />
                        <h2 style={{ color: "#0f172a", marginBottom: "0.5rem" }}>Already Signed</h2>
                        <p style={{ color: "#64748b" }}>This document has already been signed. No further action is needed.</p>
                    </div>
                )}

                {/* Error */}
                {state.type === "error" && (
                    <div style={{ textAlign: "center", padding: "4rem 0" }}>
                        <AlertTriangle size={48} style={{ color: "#ef4444", marginBottom: "1rem" }} />
                        <h2 style={{ color: "#0f172a", marginBottom: "0.5rem" }}>Error</h2>
                        <p style={{ color: "#64748b" }}>{state.message}</p>
                    </div>
                )}

                {/* Done */}
                {state.type === "done" && (
                    <div style={{ textAlign: "center", padding: "4rem 0" }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: "50%", background: "#dcfce7",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 1.5rem",
                        }}>
                            <CheckCircle size={40} style={{ color: "#16a34a" }} />
                        </div>
                        <h2 style={{ color: "#0f172a", marginBottom: "0.5rem", fontSize: "1.5rem" }}>Document Signed</h2>
                        <p style={{ color: "#64748b", lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>
                            Your signature has been recorded. Your employer will be notified. You can close this page.
                        </p>
                    </div>
                )}

                {/* Signing in progress */}
                {state.type === "signing" && (
                    <div style={{ textAlign: "center", padding: "4rem 0", color: "#64748b" }}>
                        <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
                        <p style={{ marginTop: "1rem" }}>Saving your signature...</p>
                        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                    </div>
                )}

                {/* Ready — show document and signature pad */}
                {state.type === "ready" && (
                    <>
                        {/* Info banner */}
                        <div style={{
                            display: "flex", alignItems: "flex-start", gap: "0.75rem",
                            padding: "1rem", marginBottom: "1.5rem",
                            background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: "10px",
                        }}>
                            <AlertTriangle size={20} style={{ color: "#f59e0b", flexShrink: 0, marginTop: 2 }} />
                            <div style={{ fontSize: "0.85rem", color: "#92400e", lineHeight: 1.5 }}>
                                <strong>{state.companyName}</strong> has prepared this document for your review and signature.
                                Please review the information below and sign at the bottom.
                            </div>
                        </div>

                        {/* Document card */}
                        <div style={{
                            background: "white", border: "1px solid #e2e8f0",
                            borderRadius: "12px", overflow: "hidden",
                        }}>
                            {/* Document header */}
                            <div style={{
                                padding: "1.25rem", borderBottom: "1px solid #e2e8f0",
                                background: "#f8fafc",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                    <FileText size={18} style={{ color: "#16a34a" }} />
                                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                                        {state.formTitle}
                                    </h2>
                                </div>
                                {state.driverName && (
                                    <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
                                        Prepared for: <strong style={{ color: "#0f172a" }}>{state.driverName}</strong>
                                    </p>
                                )}
                            </div>

                            {/* Document fields — text fields read-only */}
                            <div style={{ padding: "1rem 1.25rem" }}>
                                {(() => {
                                    const textFields = Object.entries(formData).filter(
                                        ([, val]) => val && typeof val === "string" && !val.startsWith("data:image")
                                    );
                                    const checkboxFields = Object.entries(formData).filter(
                                        ([, val]) => typeof val === "boolean"
                                    );
                                    return (
                                        <>
                                            {textFields.length > 0 && (
                                                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
                                                    <tbody>
                                                        {textFields.map(([key, val]) => (
                                                            <tr key={key}>
                                                                <td style={{
                                                                    padding: "0.4rem 1rem 0.4rem 0",
                                                                    fontWeight: 500, color: "#475569",
                                                                    fontSize: "0.85rem", whiteSpace: "nowrap",
                                                                    borderBottom: "1px solid #f1f5f9",
                                                                    verticalAlign: "top",
                                                                }}>
                                                                    {formatLabel(key)}
                                                                </td>
                                                                <td style={{
                                                                    padding: "0.4rem 0",
                                                                    color: "#0f172a",
                                                                    fontSize: "0.85rem",
                                                                    borderBottom: "1px solid #f1f5f9",
                                                                }}>
                                                                    {String(val)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}

                                            {/* Checkbox acknowledgments — interactive */}
                                            {checkboxFields.length > 0 && (
                                                <div style={{
                                                    padding: "1rem", marginTop: "0.5rem",
                                                    background: "#fffbeb", border: "1px solid #fef3c7",
                                                    borderRadius: "10px",
                                                }}>
                                                    <p style={{
                                                        fontSize: "0.8rem", fontWeight: 600, color: "#92400e",
                                                        marginBottom: "0.75rem",
                                                    }}>
                                                        Please review and check each item below:
                                                    </p>
                                                    {checkboxFields.map(([key]) => (
                                                        <label
                                                            key={key}
                                                            style={{
                                                                display: "flex", alignItems: "flex-start", gap: "0.6rem",
                                                                padding: "0.5rem 0", cursor: "pointer",
                                                                borderBottom: "1px solid #fef3c7",
                                                                fontSize: "0.85rem", color: "#0f172a",
                                                                lineHeight: 1.5,
                                                            }}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={!!formData[key]}
                                                                onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.checked }))}
                                                                style={{
                                                                    width: 18, height: 18, marginTop: 2,
                                                                    accentColor: "#16a34a", flexShrink: 0,
                                                                }}
                                                            />
                                                            <span>{formatLabel(key)}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

                            {/* Signature section */}
                            {(() => {
                                const checkboxFields = Object.entries(formData).filter(([, val]) => typeof val === "boolean");
                                const allChecked = checkboxFields.length === 0 || checkboxFields.every(([, val]) => val === true);
                                return (
                                    <div style={{
                                        padding: "1.25rem", borderTop: "2px solid #e2e8f0",
                                        background: "#fafafa",
                                    }}>
                                        <h3 style={{
                                            fontSize: "1rem", fontWeight: 700, color: "#0f172a",
                                            marginBottom: "0.5rem",
                                        }}>
                                            Your Signature
                                        </h3>
                                        <p style={{
                                            color: "#64748b", fontSize: "0.8rem", marginBottom: "1rem",
                                            lineHeight: 1.5,
                                        }}>
                                            By signing below, you acknowledge that you have reviewed the information above
                                            and agree to the terms of this document. Your signature is legally binding under
                                            the ESIGN Act (15 U.S.C. &sect; 7001).
                                        </p>
                                        {allChecked ? (
                                            <SignaturePad
                                                onSignature={handleSign}
                                                width={Math.min(520, typeof window !== "undefined" ? window.innerWidth - 80 : 520)}
                                                height={180}
                                            />
                                        ) : (
                                            <div style={{
                                                padding: "1.25rem", textAlign: "center",
                                                background: "#f1f5f9", borderRadius: "10px",
                                                border: "1px dashed #cbd5e1",
                                            }}>
                                                <AlertTriangle size={24} style={{ color: "#f59e0b", marginBottom: "0.5rem" }} />
                                                <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
                                                    Please check all acknowledgment boxes above before signing.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Expiry notice */}
                        <p style={{
                            textAlign: "center", color: "#94a3b8",
                            fontSize: "0.75rem", marginTop: "1.5rem",
                        }}>
                            <Clock size={12} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: 4 }} />
                            This link expires {new Date(state.expiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                    </>
                )}
            </main>
        </div>
    );
}
