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

    const projects = await prisma.project.findMany({
      where: all ? {} : { visible: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = await req.json();
    const project = await prisma.project.create({ data });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
