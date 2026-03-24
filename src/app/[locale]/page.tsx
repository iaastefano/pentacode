import dynamic from "next/dynamic";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { Process } from "@/components/landing/Process";
import { Projects } from "@/components/landing/Projects";
import { Testimonials } from "@/components/landing/Testimonials";
import { QuoteSection } from "@/components/landing/QuoteSection";
import { Footer } from "@/components/landing/Footer";

const ChatWidget = dynamic(
  () => import("@/components/landing/ChatWidget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false }
);

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <Projects />
      <Testimonials />
      <QuoteSection />
      <Footer />
      <ChatWidget />
    </main>
  );
}
