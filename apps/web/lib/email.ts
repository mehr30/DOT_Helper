const FROM_EMAIL = process.env.EMAIL_FROM ?? "Greenlight USDOT <noreply@greenlightdot.com>";

/**
 * Send an email via Resend. Silently skips if RESEND_API_KEY is not set.
 */
export async function sendEmail(to: string, subject: string, html: string) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn(`[email] RESEND_API_KEY not set — skipping email to ${to}: ${subject}`);
        return;
    }
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
}
