import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const sessions = await prisma.chatSession.findMany({
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(sessions);
  } catch {
    return NextResponse.json([]);
  }
}
