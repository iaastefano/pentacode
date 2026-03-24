"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MessageCircle, Mail, Github, Linkedin, Instagram } from "lucide-react";
import Image from "next/image";
import { trackEvent } from "@/lib/gtm";

const navLinks = [
  { href: "#servicios", key: "services" },
  { href: "#proceso", key: "process" },
  { href: "#proyectos", key: "projects" },
  { href: "#testimonios", key: "testimonials" },
  { href: "#contacto", key: "contact" },
];

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/5">
      <div className="absolute inset-0 bg-brand-darkest/80" />

      <div className="section-container relative z-10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-12"
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo-pentacode.svg" alt="Pentacode" width={32} height={32} className="h-8 w-auto" />
              <span className="text-xl font-bold font-heading tracking-tight">
                Penta<span className="text-brand-green">code</span>
              </span>
            </div>
            <p className="text-white/40 leading-relaxed text-sm">{t("description")}</p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-brand-green hover:bg-brand-green/10 transition-all"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-brand-green hover:bg-brand-green/10 transition-all"
              >
                <Github size={16} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-brand-green hover:bg-brand-green/10 transition-all"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-white/70">{t("quickLinks")}</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-white/40 hover:text-brand-green transition-colors"
                  >
                    {tNav(link.key)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-sm text-white/70">{t("contactUs")}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://wa.me/5491156694159"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("contact_whatsapp", { location: "footer" })}
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-brand-green transition-colors"
                >
                  <MessageCircle size={14} />
                  +54 9 11 5669 4159
                </a>
              </li>
              <li>
                <a
                  href="mailto:stefano1dalessandro@gmail.com"
                  onClick={() => trackEvent("contact_email", { location: "footer" })}
                  className="flex items-center gap-2 text-sm text-white/40 hover:text-brand-green transition-colors"
                >
                  <Mail size={14} />
                  stefano1dalessandro@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Pentacode. {t("rights")}
          </p>
          <button
            onClick={() => scrollTo("#contacto")}
            className="text-xs text-brand-green hover:text-brand-green/80 transition-colors"
          >
            {tNav("requestQuote")} →
          </button>
        </div>
      </div>
    </footer>
  );
}
