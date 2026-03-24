import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_SETTINGS = {
  projectsCount: 50,
  clientsCount: 30,
  satisfactionRate: 99,
};

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    return NextResponse.json(settings ?? DEFAULT_SETTINGS);
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const data = await req.json();
    const projectsCount = Number(data.projectsCount);
    const clientsCount = Number(data.clientsCount);
    const satisfactionRate = Number(data.satisfactionRate);

    if (
      Number.isNaN(projectsCount) ||
      Number.isNaN(clientsCount) ||
      Number.isNaN(satisfactionRate)
    ) {
      return NextResponse.json({ error: "Valores inválidos" }, { status: 400 });
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        projectsCount,
        clientsCount,
        satisfactionRate,
      },
      update: {
        projectsCount,
        clientsCount,
        satisfactionRate,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Update site settings error:", error);
    return NextResponse.json(
      { error: "No se pudo guardar la configuración" },
      { status: 500 }
    );
  }
}
