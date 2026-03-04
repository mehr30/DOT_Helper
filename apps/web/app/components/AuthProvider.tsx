"use client";

// AuthProvider is no longer needed with better-auth (it handles sessions internally).
// This wrapper is kept as a no-op for compatibility with any existing layout references.
export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
