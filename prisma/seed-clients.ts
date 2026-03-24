import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing sample data
  await prisma.testimonial.deleteMany({});
  await prisma.project.deleteMany({});
  console.log("Cleared existing projects and testimonials");

  // --- PROJECTS ---
  await prisma.project.createMany({
    data: [
      {
        title: "Rise of Gods TCG Store",
        description:
          "E-commerce completo para el juego de cartas coleccionables Rise of Gods. Tienda con catálogo de productos (boosters, mazos, accesorios), carrito de compras, pasarela de pagos integrada y panel de administración para gestionar inventario y pedidos.",
        url: "https://riseofgodstcg.store",
        technologies: JSON.stringify(["Next.js", "Stripe", "PostgreSQL", "Tailwind CSS", "Prisma"]),
        images: JSON.stringify(["/images/placeholder-project.svg"]),
        order: 1,
        visible: true,
      },
      {
        title: "Portal ALFA-LAC",
        description:
          "Plataforma web para la Alianza Latinoamericana contra el Fraude y Lavado de Activos. Sistema con autenticación OTP, gestión de miembros, foros de discusión, biblioteca de documentos, agenda de eventos y panel de métricas para administradores.",
        url: "https://portalalfa-lac.com",
        technologies: JSON.stringify(["Next.js", "NextAuth", "PostgreSQL", "Tailwind CSS", "Prisma"]),
        images: JSON.stringify(["/images/placeholder-project.svg"]),
        order: 2,
        visible: true,
      },
      {
        title: "Pots - Tienda de Productos Personalizados",
        description:
          "Tienda online de productos personalizados con catálogo dinámico, sistema de diseño personalizado donde el cliente arma su producto a medida, galería de clientes y gestión de pedidos con panel de administración.",
        url: "https://pots.com.ar",
        technologies: JSON.stringify(["Next.js", "Prisma", "SQLite", "Tailwind CSS", "Cloudinary"]),
        images: JSON.stringify(["/images/placeholder-project.svg"]),
        order: 3,
        visible: true,
      },
    ],
  });
  console.log("Created 3 real projects");

  // --- TESTIMONIALS ---
  await prisma.testimonial.createMany({
    data: [
      {
        name: "César Duarte",
        company: "Rise of Gods TCG",
        text: "Necesitábamos una tienda online a la altura de nuestro juego de cartas y Pentacode lo logró. Desde el catálogo de productos hasta la integración de pagos, todo funciona de forma impecable. El equipo entendió nuestra visión desde el primer día y la ejecución fue rápida y profesional.",
        rating: 5,
        visible: true,
      },
      {
        name: "Julieta Romero",
        company: "ALFA-LAC",
        text: "Desarrollar un portal seguro para nuestra alianza contra el fraude financiero requería un equipo que entendiera la seriedad del proyecto. Pentacode implementó autenticación con OTP, gestión de miembros y toda la plataforma en tiempo récord. La comunicación durante el proceso fue excelente.",
        rating: 5,
        visible: true,
      },
      {
        name: "Fernando Gomila",
        company: "Pots",
        text: "Quería que mis clientes pudieran armar sus productos personalizados directamente desde la web y Pentacode lo hizo realidad. La tienda es intuitiva, el diseño es moderno y el panel de administración me facilita mucho el trabajo del día a día. Totalmente recomendados.",
        rating: 5,
        visible: true,
      },
    ],
  });
  console.log("Created 3 real testimonials");

  console.log("\nDone! All client data seeded successfully.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
