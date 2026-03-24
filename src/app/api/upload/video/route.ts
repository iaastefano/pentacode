import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { requireAdmin } from "@/lib/auth";
import path from "path";

const MAX_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const formData = await req.formData();
    const file = formData.get("video") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: mp4, webm, mov, avi" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 100MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "mp4";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "video");

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    return NextResponse.json({ path: `/uploads/video/${uniqueName}` });
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
