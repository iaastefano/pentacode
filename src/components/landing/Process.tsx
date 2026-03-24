"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MessageSquare, Lightbulb, Rocket, RefreshCw, ArrowRight } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import Image from "next/image";

const steps = [
  { key: "step1", icon: MessageSquare, color: "text-brand-green" },
  { key: "step2", icon: Lightbulb, color: "text-yellow-400" },
  { key: "step3", icon: Rocket, color: "text-blue-400" },
  { key: "step4", icon: RefreshCw, color: "text-purple-400" },
] as const;

export function Process() {
  const t = useTranslations("process");

  const scrollToContact = () => {
    document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="proceso" className="py-24 relative overflow-hidden">
      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/meeting-client.png"
                alt="Reunión con cliente"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 glass rounded-xl p-3 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <Rocket className="text-brand-green" size={20} />
                <span className="text-sm font-semibold">MVP en 7 días</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Steps */}
          <div>
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
              className="mt-4 text-lg text-white/50 mb-12"
            >
              {t("subtitle")}
            </motion.p>

            <div className="space-y-8 relative">
              {/* Connecting line */}
              <div className="absolute left-6 top-12 bottom-12 w-px bg-gradient-to-b from-brand-green/40 via-brand-green/20 to-transparent" />

              {steps.map(({ key, icon: Icon, color }, index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex gap-5 group"
                >
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-xl bg-brand-darker border border-white/10 flex items-center justify-center group-hover:border-brand-green/40 transition-colors">
                    <Icon className={color} size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-brand-green/60 font-mono">0{index + 1}</span>
                      <h3 className="text-lg font-bold">{t(`${key}.title`)}</h3>
                    </div>
                    <p className="text-white/50 leading-relaxed">{t(`${key}.description`)}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-10"
            >
              <button onClick={scrollToContact} className="btn-primary">
                {t("cta")}
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
