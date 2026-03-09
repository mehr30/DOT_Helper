import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const APP_NAME = "Greenlight USDOT";
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Greenlight USDOT <noreply@greenlightdot.com>";

async function sendEmail(to: string, subject: string, html: string) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn(`[auth] RESEND_API_KEY not set — skipping email to ${to}: ${subject}`);
        return;
    }
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
}

const baseURL = process.env.BETTER_AUTH_URL || "https://dot-helper-web.vercel.app";

export const auth = betterAuth({
    baseURL,
    trustHost: true,
    trustedOrigins: [
        baseURL,
        "https://dot-helper-web.vercel.app",
        "http://localhost:3000",
        ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
    ],
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to true once Resend API key is live
        sendResetPassword: async ({ user, url }) => {
            await sendEmail(
                user.email,
                `${APP_NAME} — Reset Your Password`,
                `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; margin-bottom: 16px;">Reset Your Password</h2>
                    <p style="color: #64748b; line-height: 1.6;">
                        Hi ${user.name},<br><br>
                        We received a request to reset your password. Click the button below to choose a new one.
                    </p>
                    <a href="${url}" style="display: inline-block; padding: 12px 32px; background: #1B5E35; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0;">
                        Reset Password
                    </a>
                    <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
                        If you didn't request this, you can safely ignore this email. The link expires in 1 hour.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                    <p style="color: #94a3b8; font-size: 12px;">${APP_NAME} — DOT compliance, plain and simple.</p>
                </div>`,
            );
        },
    },

    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmail(
                user.email,
                `${APP_NAME} — Verify Your Email`,
                `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; margin-bottom: 16px;">Welcome to ${APP_NAME}!</h2>
                    <p style="color: #64748b; line-height: 1.6;">
                        Hi ${user.name},<br><br>
                        Thanks for signing up. Please verify your email to get started.
                    </p>
                    <a href="${url}" style="display: inline-block; padding: 12px 32px; background: #1B5E35; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0;">
                        Verify Email
                    </a>
                    <p style="color: #94a3b8; font-size: 14px;">
                        If you didn't create an account, you can ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                    <p style="color: #94a3b8; font-size: 12px;">${APP_NAME} — DOT compliance, plain and simple.</p>
                </div>`,
            );
        },
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        },
        apple: {
            clientId: process.env.APPLE_CLIENT_ID ?? "",
            clientSecret: process.env.APPLE_CLIENT_SECRET ?? "",
        },
    },

    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    // Notify admin of every new signup
                    await sendEmail(
                        "scottmehr10@gmail.com",
                        `${APP_NAME} — New Signup: ${user.email}`,
                        `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
                            <h2 style="color: #1e293b; margin-bottom: 16px;">New User Signup</h2>
                            <p style="color: #64748b; line-height: 1.6;">
                                A new user just signed up for ${APP_NAME}:
                            </p>
                            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                                <tr><td style="padding: 8px; color: #94a3b8; font-size: 14px;">Name</td><td style="padding: 8px; color: #1e293b; font-weight: 600;">${user.name}</td></tr>
                                <tr><td style="padding: 8px; color: #94a3b8; font-size: 14px;">Email</td><td style="padding: 8px; color: #1e293b; font-weight: 600;">${user.email}</td></tr>
                                <tr><td style="padding: 8px; color: #94a3b8; font-size: 14px;">Time</td><td style="padding: 8px; color: #1e293b; font-weight: 600;">${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}</td></tr>
                            </table>
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                            <p style="color: #94a3b8; font-size: 12px;">${APP_NAME} — Admin Notification</p>
                        </div>`,
                    );
                },
            },
        },
    },

    rateLimit: {
        window: 60,
        max: 10,
    },

    session: {
        expiresIn: 60 * 60 * 24 * 30, // 30 days
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        },
    },
});
