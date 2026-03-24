import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = (formData.get("phone") as string) || null;
    const description = (formData.get("description") as string) || null;
    const audioFile = formData.get("audio") as File | null;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    let audioPath: string | null = null;

    if (audioFile) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "audio");
      await mkdir(uploadsDir, { recursive: true });

      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webm`;
      const filePath = path.join(uploadsDir, filename);
      const buffer = Buffer.from(await audioFile.arrayBuffer());
      await writeFile(filePath, buffer);
      audioPath = `/uploads/audio/${filename}`;
    }

    const quote = await prisma.quoteRequest.create({
      data: { name, email, phone, description, audioPath },
    });

    return NextResponse.json({ success: true, id: quote.id });
  } catch (error) {
    console.error("Quote API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const quotes = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quotes);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
