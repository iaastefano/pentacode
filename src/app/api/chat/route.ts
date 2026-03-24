import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CHAT_SYSTEM_PROMPT = `Sos el asistente virtual de Pentacode, una empresa de desarrollo web profesional argentina. Tu objetivo es ayudar a potenciales clientes a describir su idea de proyecto para que el equipo de Pentacode pueda evaluarla y dar un presupuesto.

Sé amigable, profesional y usá un tono argentino natural (tuteo con "vos"). 

Tu trabajo es guiar la conversación para obtener la siguiente información:
1. Qué tipo de proyecto necesitan (página web, tienda online, app, sistema de gestión, etc.)
2. Qué funcionalidades principales necesita el proyecto
3. Si tienen referencias visuales o de diseño (otras webs que les gusten)
4. En cuánto tiempo necesitan el proyecto
5. Si tienen un presupuesto estimado en mente

Reglas:
- Empezá presentándote y preguntando qué proyecto tienen en mente
- Hacé UNA pregunta a la vez, no bombardees con todas juntas
- Si el cliente no sabe algo, tranquilizalo y decile que el equipo lo va a asesorar
- Recordale que en Pentacode trabajan con metodología ágil: MVP en 1 semana y entregas semanales
- Si el cliente da información suficiente, agradecele y decile que el equipo se va a poner en contacto para darle un presupuesto detallado
- Mantené las respuestas cortas y concisas (máximo 2-3 oraciones)
- NUNCA inventes precios ni plazos específicos, solo decí que el equipo va a evaluar
- Si preguntan por tecnologías, mencioná que trabajan con React, Next.js, Node.js y las mejores herramientas del mercado`;

function hasOpenAIKey(): boolean {
  const key = process.env.OPENAI_API_KEY;
  return !!key && key !== "sk-your-openai-api-key-here" && key.startsWith("sk-");
}

interface Message {
  role: string;
  content: string;
}

const FLOW_STEPS = [
  {
    greeting: true,
    response: "¡Hola! 👋 Soy el asistente virtual de Pentacode. Estoy acá para ayudarte a darle forma a tu idea de proyecto. Contame, ¿qué tenés en mente? ¿Qué tipo de proyecto necesitás? (página web, tienda online, app, sistema de gestión, etc.)",
  },
  {
    keywords: [],
    response: "¡Genial! Suena como un proyecto muy interesante 🚀 Contame un poco más, ¿qué funcionalidades principales necesitás? Por ejemplo: catálogo de productos, carrito de compras, panel de administración, formulario de contacto, etc.",
  },
  {
    keywords: [],
    response: "Perfecto, ya me voy haciendo una idea clara. ¿Tenés alguna referencia visual? Alguna web que te guste y quieras algo parecido, o algún estilo de diseño que tengas en mente?",
  },
  {
    keywords: [],
    response: "Buenísimo. ¿Para cuándo lo necesitarías listo? Te cuento que en Pentacode trabajamos con metodología ágil: en 1 semana ya tenés un MVP funcional y después iteramos con entregas semanales. 💪",
  },
  {
    keywords: [],
    response: "Última pregunta: ¿tenés un presupuesto estimado en mente para el proyecto? No te preocupes si no sabés exactamente, el equipo de Pentacode lo va a evaluar y te va a dar un presupuesto detallado.",
  },
  {
    keywords: [],
    response: "¡Excelente! Ya tengo toda la información que necesito 🎉 El equipo de Pentacode se va a poner en contacto con vos para darte un presupuesto detallado. Si querés, también podés hablarnos por WhatsApp al +54 9 11 5669 4159 o escribirnos a stefano1dalessandro@gmail.com. ¡Gracias por confiar en nosotros!",
  },
];

function getFallbackResponse(messages: Message[]): string {
  const userMessages = messages.filter((m) => m.role === "user");
  const stepIndex = userMessages.length;

  if (stepIndex >= FLOW_STEPS.length) {
    return "¡Muchas gracias por tu interés! Ya registré toda tu información. El equipo de Pentacode te va a contactar pronto. Si necesitás algo más, escribinos por WhatsApp al +54 9 11 5669 4159. 😊";
  }

  return FLOW_STEPS[stepIndex].response;
}

async function getOpenAIResponse(messages: Message[]): Promise<string> {
  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const openaiMessages = [
    { role: "system" as const, content: CHAT_SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: openaiMessages,
    max_tokens: 300,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content || getFallbackResponse(messages);
}

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId } = await req.json();

    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    }

    if (!session) {
      session = await prisma.chatSession.create({ data: {} });
    }

    let assistantMessage: string;

    if (hasOpenAIKey()) {
      try {
        assistantMessage = await getOpenAIResponse(messages);
      } catch (error) {
        console.error("OpenAI error, using fallback:", error);
        assistantMessage = getFallbackResponse(messages);
      }
    } else {
      assistantMessage = getFallbackResponse(messages);
    }

    if (messages.length > 0) {
      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg.role === "user") {
        await prisma.chatMessage.create({
          data: {
            sessionId: session.id,
            role: "user",
            content: lastUserMsg.content,
          },
        });
      }
    }

    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: "assistant",
        content: assistantMessage,
      },
    });

    return NextResponse.json({
      message: assistantMessage,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        message: "¡Hola! Soy el asistente de Pentacode. Contame tu idea de proyecto y te ayudo a darle forma. ¿Qué tenés en mente?",
        sessionId: null,
      },
      { status: 200 }
    );
  }
}
