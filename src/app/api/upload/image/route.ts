import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { requireAdmin } from "@/lib/auth";
import path from "path";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: jpg, png, webp, gif, svg" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 10MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "png";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "images");

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    return NextResponse.json({ path: `/uploads/images/${uniqueName}` });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
