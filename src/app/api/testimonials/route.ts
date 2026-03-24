import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    if (all) {
      const denied = await requireAdmin();
      if (denied) return denied;
    }

    const testimonials = await prisma.testimonial.findMany({
      where: all ? {} : { visible: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(testimonials);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = await req.json();
    const testimonial = await prisma.testimonial.create({ data });
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Create testimonial error:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
