"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { href: "#servicios", key: "services" },
  { href: "#proceso", key: "process" },
  { href: "#proyectos", key: "projects" },
  { href: "#testimonios", key: "testimonials" },
  { href: "#contacto", key: "contact" },
] as const;

const locales = [
  { code: "es", label: "ES", flag: "🇦🇷" },
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "pt", label: "PT", flag: "🇧🇷" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params.locale as string) || "es";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLocale = (locale: string) => {
    router.replace(pathname, { locale });
    setLangOpen(false);
  };

  const scrollToSection = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-brand-darker/80 backdrop-blur-xl border-b border-white/5 shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="section-container flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <Image src="/logo-pentacode.svg" alt="Pentacode" width={40} height={40} className="h-8 lg:h-10 w-auto transition-transform group-hover:scale-105" />
          <span className="text-xl font-bold text-white hidden sm:block font-heading tracking-tight">
            Penta<span className="text-brand-green">code</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => scrollToSection(link.href)}
              className="text-sm text-white/70 hover:text-brand-green transition-colors duration-200 relative group"
            >
              {t(link.key)}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-green transition-all duration-200 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
            >
              <Globe size={16} />
              <span className="hidden sm:block">{currentLocale.toUpperCase()}</span>
              <ChevronDown size={14} className={cn("transition-transform", langOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 bg-brand-darker/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-xl min-w-[140px]"
                >
                  {locales.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => switchLocale(loc.code)}
                      className={cn(
                        "flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors",
                        currentLocale === loc.code
                          ? "bg-brand-green/10 text-brand-green"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <span>{loc.flag}</span>
                      <span>{loc.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA button */}
          <button
            onClick={() => scrollToSection("#contacto")}
            className="hidden md:flex btn-primary text-sm py-2"
          >
            {t("requestQuote")}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white/70 hover:text-white"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-brand-darker/95 backdrop-blur-xl border-t border-white/5"
          >
            <div className="section-container py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.key}
                  onClick={() => scrollToSection(link.href)}
                  className="text-left text-lg text-white/80 hover:text-brand-green transition-colors py-2"
                >
                  {t(link.key)}
                </button>
              ))}
              <button
                onClick={() => scrollToSection("#contacto")}
                className="btn-primary mt-2 justify-center"
              >
                {t("requestQuote")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
