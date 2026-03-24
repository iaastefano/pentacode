"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/gtm";

function FloatingShape({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
        opacity: [0.15, 0.3, 0.15],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

function TypingText({ texts, className }: { texts: string[]; className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [phase, setPhase] = useState<"typing" | "waiting" | "deleting">("typing");

  useEffect(() => {
    const current = texts[currentIndex];

    if (phase === "typing") {
      if (displayText.length < current.length) {
        const timeout = setTimeout(() => {
          setDisplayText(current.slice(0, displayText.length + 1));
        }, 60);
        return () => clearTimeout(timeout);
      }
      const timeout = setTimeout(() => setPhase("deleting"), 2500);
      return () => clearTimeout(timeout);
    }

    if (phase === "deleting") {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 30);
        return () => clearTimeout(timeout);
      }
      setCurrentIndex((prev) => (prev + 1) % texts.length);
      setPhase("typing");
    }
  }, [displayText, phase, currentIndex, texts]);

  return (
    <span className={className} style={{ minHeight: "1.2em", display: "inline-block" }}>
      {displayText || "\u00A0"}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export function Hero() {
  const t = useTranslations("hero");
  const [stats, setStats] = useState({
    projectsCount: 50,
    clientsCount: 30,
    satisfactionRate: 99,
  });

  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((data) => {
        setStats({
          projectsCount: Number(data.projectsCount) || 50,
          clientsCount: Number(data.clientsCount) || 30,
          satisfactionRate: Number(data.satisfactionRate) || 99,
        });
      })
      .catch(() => {});
  }, []);

  const scrollToContact = () => {
    document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/abstract-bg.png"
          alt=""
          fill
          className="object-cover opacity-20"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/60 to-brand-dark" />
      </div>

      {/* Floating shapes */}
      <FloatingShape
        className="absolute top-20 left-10 w-20 h-20 border border-brand-green/20 rotate-12"
        delay={0}
      />
      <FloatingShape
        className="absolute top-40 right-20 w-16 h-16 bg-brand-green/5 rounded-full"
        delay={1}
      />
      <FloatingShape
        className="absolute bottom-40 left-1/4 w-12 h-12 border border-brand-green/10 rotate-45"
        delay={2}
      />
      <FloatingShape
        className="absolute bottom-20 right-1/3 w-24 h-24 bg-brand-green/5 rounded-full"
        delay={3}
      />

      <div className="section-container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-16">
        {/* Left content */}
        <div>
          <div className="animate-hero-text">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              {t("title1")}
              <br />
              <TypingText
                texts={[t("title2"), "nuestra pasión.", "tu solución."]}
                className="gradient-text"
              />
            </h1>
          </div>

          <p className="mt-6 text-lg sm:text-xl text-white/60 max-w-xl leading-relaxed animate-hero-text" style={{ animationDelay: "0.2s" }}>
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-hero-text" style={{ animationDelay: "0.4s" }}>
            <button onClick={scrollToContact} className="btn-primary text-lg px-8 py-4">
              {t("cta")}
              <ArrowRight size={20} />
            </button>
            <a
              href="https://wa.me/5491156694159"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("contact_whatsapp", { location: "hero" })}
              className="btn-secondary text-lg px-8 py-4"
            >
              <MessageCircle size={20} />
              {t("whatsapp")}
            </a>
          </div>

          <div className="mt-12 flex gap-8 animate-hero-text" style={{ animationDelay: "0.6s" }}>
            <CounterStat end={stats.projectsCount} suffix="+" label="Proyectos" />
            <CounterStat end={stats.clientsCount} suffix="+" label="Clientes" />
            <CounterStat end={stats.satisfactionRate} suffix="%" label="Satisfacción" />
          </div>
        </div>

        {/* Right image — no motion wrapper to avoid LCP render delay */}
        <div className="relative hidden lg:block animate-fade-in-right">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-brand-green/5">
            <Image
              src="/images/hero-team.png"
              alt="Equipo Pentacode trabajando"
              width={700}
              height={450}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-auto"
              priority
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6 glass rounded-xl p-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center">
                <span className="text-brand-green text-lg">✓</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">MVP Entregado</p>
                <p className="text-xs text-white/50">En solo 7 días</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-brand-green rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

function CounterStat({ end, suffix = "", label }: { end: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const increment = end / 40;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [started, end]);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center">
      <p className="text-2xl sm:text-3xl font-bold text-brand-green">
        {count}
        {suffix}
      </p>
      <p className="text-sm text-white/50 mt-1">{label}</p>
    </div>
  );
}
