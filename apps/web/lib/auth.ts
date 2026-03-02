import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID ?? "",
            clientSecret: process.env.APPLE_CLIENT_SECRET ?? "",
        }),
        CredentialsProvider({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "you@company.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // TODO: Replace with real DB lookup + password verification
                // For now, accept any email/password combo for development
                if (credentials?.email && credentials?.password) {
                    return {
                        id: "1",
                        name: "Demo User",
                        email: credentials.email,
                        image: null,
                    };
                }
                return null;
            },
        }),
    ],

    pages: {
        signIn: "/login",
        newUser: "/register",
        error: "/login",
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                (session.user as { id?: string }).id = token.id as string;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // After sign-in, redirect to dashboard
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (url.startsWith(baseUrl)) return url;
            return `${baseUrl}/dashboard`;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
};
