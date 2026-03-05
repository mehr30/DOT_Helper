import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
    // Verify auth
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
            { error: "Invalid file type. Accepted: PDF, JPG, PNG, WebP, DOC, DOCX." },
            { status: 400 },
        );
    }

    // Upload to Vercel Blob
    const blob = await put(`documents/${session.user.id}/${Date.now()}-${file.name}`, file, {
        access: "public",
    });

    return NextResponse.json({
        url: blob.url,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
    });
}
