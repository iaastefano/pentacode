"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { QuoteForm } from "@/components/landing/QuoteForm";
import { MessageCircle, Mail } from "lucide-react";
import { trackEvent } from "@/lib/gtm";

export function QuoteSection() {
  const t = useTranslations("quote");

  return (
    <section id="contacto" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-darker/50 to-brand-dark" />

      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <SectionBadge text={t("badge")} />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-lg text-white/50 max-w-2xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass rounded-2xl p-6 sm:p-8"
          >
            <QuoteForm />
          </motion.div>

          {/* Alternative contact methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-white/40 mb-4">{t("or")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/5491156694159"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("contact_whatsapp", { location: "quote_section" })}
                className="btn-secondary"
              >
                <MessageCircle size={18} />
                {t("whatsapp")}
              </a>
              <a
                href="mailto:stefano1dalessandro@gmail.com"
                onClick={() => trackEvent("contact_email", { location: "quote_section" })}
                className="btn-secondary"
              >
                <Mail size={18} />
                {t("email")}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
