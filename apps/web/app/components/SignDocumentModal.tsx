"use client";

import { useState, useTransition } from "react";
import { X, FileText, CheckCircle, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import SignaturePad from "./SignaturePad";
import { signDocument } from "../actions/signatures";
import styles from "./SignDocumentModal.module.css";

interface SignDocumentModalProps {
    documentId: string;
    documentName: string;
    documentUrl: string;
    signerName?: string;
    signerEmail?: string;
    signerRole?: string;
    onClose: () => void;
    onSigned: () => void;
}

export default function SignDocumentModal({
    documentId,
    documentName,
    documentUrl,
    signerName: initialName = "",
    signerEmail: initialEmail = "",
    signerRole = "owner",
    onClose,
    onSigned,
}: SignDocumentModalProps) {
    const [step, setStep] = useState<"review" | "sign" | "done">("review");
    const [signerName, setSignerName] = useState(initialName);
    const [signerEmail, setSignerEmail] = useState(initialEmail);
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSignature = (dataUrl: string) => {
        if (!signerName.trim()) {
            setError("Please enter your full legal name");
            return;
        }
        if (!agreed) {
            setError("Please agree to the electronic signature disclosure");
            return;
        }

        setError("");
        startTransition(async () => {
            const result = await signDocument({
                documentId,
                signerName: signerName.trim(),
                signerEmail: signerEmail.trim() || undefined,
                signerRole,
                signatureDataUrl: dataUrl,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                setStep("done");
                setTimeout(() => {
                    onSigned();
                }, 2000);
            }
        });
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        {step === "done" ? "Document Signed" : step === "sign" ? "Sign Document" : "Review Document"}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {step === "done" ? (
                    <div className={styles.doneState}>
                        <CheckCircle size={48} />
                        <h3>Signature Captured</h3>
                        <p>
                            <strong>{documentName}</strong> has been signed by {signerName} on{" "}
                            {new Date().toLocaleDateString("en-US", {
                                month: "long", day: "numeric", year: "numeric",
                            })}.
                        </p>
                        <p className={styles.auditNote}>
                            A timestamped record has been saved for your compliance audit trail.
                        </p>
                    </div>
                ) : step === "review" ? (
                    <>
                        <div className={styles.docPreview}>
                            <FileText size={24} />
                            <div className={styles.docInfo}>
                                <span className={styles.docName}>{documentName}</span>
                                <a
                                    href={documentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.viewLink}
                                >
                                    View full document <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>

                        <div className={styles.reviewNote}>
                            <AlertCircle size={16} />
                            <span>Please review the document above before signing. Your signature indicates
                                you have read and agree to its contents.</span>
                        </div>

                        <button className={styles.proceedBtn} onClick={() => setStep("sign")}>
                            I've Reviewed — Proceed to Sign
                        </button>
                    </>
                ) : (
                    <>
                        <div className={styles.docPreview}>
                            <FileText size={20} />
                            <span className={styles.docName}>{documentName}</span>
                        </div>

                        <div className={styles.signerFields}>
                            <div className={styles.field}>
                                <label className={styles.label}>Full Legal Name</label>
                                <input
                                    type="text"
                                    value={signerName}
                                    onChange={(e) => setSignerName(e.target.value)}
                                    placeholder="Enter your full legal name"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.field}>
                                <label className={styles.label}>Email (optional)</label>
                                <input
                                    type="email"
                                    value={signerEmail}
                                    onChange={(e) => setSignerEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.signatureSection}>
                            <label className={styles.label}>Signature</label>
                            <SignaturePad onSignature={handleSignature} />
                        </div>

                        <label className={styles.agreementLabel}>
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                            />
                            <span>
                                I agree that my electronic signature is the legal equivalent of my
                                manual/handwritten signature and I consent to be legally bound by this
                                document. This consent is given pursuant to the ESIGN Act (15 U.S.C. &sect; 7001).
                            </span>
                        </label>

                        {error && (
                            <div className={styles.error}>
                                <AlertCircle size={14} /> {error}
                            </div>
                        )}

                        {isPending && (
                            <div className={styles.saving}>
                                <Loader2 size={18} className={styles.spinner} /> Saving signature...
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
