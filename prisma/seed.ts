import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: process.env.ADMIN_USERNAME || "admin" },
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        username: process.env.ADMIN_USERNAME || "admin",
        password: hashSync(process.env.ADMIN_PASSWORD || "pentacode2024", 12),
      },
    });
    console.log("Admin user created");
  }

  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: "E-Commerce Premium",
          description:
            "Tienda online completa con pasarela de pagos, gestión de inventario y panel de administración.",
          url: "https://example.com",
          technologies: JSON.stringify(["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS"]),
          images: JSON.stringify(["/images/placeholder-project.svg"]),
          order: 1,
        },
        {
          title: "App de Gestión Empresarial",
          description:
            "Sistema integral de gestión con dashboards en tiempo real, reportes automatizados y control de usuarios.",
          url: "https://example.com",
          technologies: JSON.stringify(["React", "Node.js", "MongoDB", "Chart.js"]),
          images: JSON.stringify(["/images/placeholder-project.svg"]),
          order: 2,
        },
        {
          title: "Plataforma Educativa",
          description:
            "Plataforma de cursos online con videoconferencias, evaluaciones automáticas y certificados digitales.",
          url: "https://example.com",
          technologies: JSON.stringify(["Next.js", "WebRTC", "PostgreSQL", "AWS"]),
          images: JSON.stringify(["/images/placeholder-project.svg"]),
          order: 3,
        },
      ],
    });
    console.log("Sample projects created");
  }

  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          name: "María González",
          company: "TechStore Argentina",
          text: "Pentacode transformó nuestra idea en una tienda online increíble. El equipo fue muy profesional y cumplieron con todos los plazos. ¡Súper recomendados!",
          rating: 5,
        },
        {
          name: "Carlos Rodríguez",
          company: "Gestión Plus",
          text: "El sistema de gestión que nos desarrollaron superó nuestras expectativas. La metodología de entregas semanales nos permitió ir viendo el avance y pedir cambios al instante.",
          rating: 5,
        },
        {
          name: "Laura Martínez",
          company: "EduTech Solutions",
          text: "Excelente experiencia de principio a fin. Nos guiaron en cada paso del proceso y el resultado final fue espectacular. La plataforma funciona perfectamente.",
          rating: 5,
        },
      ],
    });
    console.log("Sample testimonials created");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
