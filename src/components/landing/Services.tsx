"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Code2, Search, Cloud, Brain, CreditCard, LayoutDashboard, ArrowRight, type LucideIcon } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";
import Image from "next/image";

const services = [
  { key: "web", icon: Code2, image: "/images/service-web.png", gradient: "from-brand-green/20 to-emerald-500/10" },
  { key: "seo", icon: Search, image: "/images/service-seo.png", gradient: "from-orange-500/20 to-amber-500/10" },
  { key: "payments", icon: CreditCard, image: "/images/service-payments.png", gradient: "from-teal-500/20 to-cyan-500/10" },
  { key: "cloud", icon: Cloud, image: "/images/service-cloud.png", gradient: "from-blue-500/20 to-cyan-500/10" },
  { key: "ai", icon: Brain, image: "/images/service-ai.png", gradient: "from-purple-500/20 to-pink-500/10" },
  { key: "dashboard", icon: LayoutDashboard, image: "/images/service-dashboard.png", gradient: "from-rose-500/20 to-red-500/10" },
] as const;

export function Services() {
  const t = useTranslations("services");

  const scrollToContact = () => {
    document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="servicios" className="py-24 relative">
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

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.12}>
          {services.map(({ key, icon: Icon, image, gradient }) => (
            <StaggerItem key={key}>
              <ServiceCard
                serviceKey={key}
                Icon={Icon}
                image={image}
                gradient={gradient}
                t={t}
                onCta={scrollToContact}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function ServiceCard({
  serviceKey,
  Icon,
  image,
  gradient,
  t,
  onCta,
}: {
  serviceKey: string;
  Icon: LucideIcon;
  image: string;
  gradient: string;
  t: (key: string) => string;
  onCta: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative glass rounded-2xl overflow-hidden h-full hover:border-brand-green/30 transition-all duration-300"
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={image}
            alt={t(`${serviceKey}.title`)}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-brand-darker/40 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <div className="w-10 h-10 rounded-lg bg-brand-darkest/80 backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <Icon className="text-brand-green" size={20} />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-bold mb-2">{t(`${serviceKey}.title`)}</h3>
          <p className="text-white/50 text-sm leading-relaxed mb-4">
            {t(`${serviceKey}.description`)}
          </p>

          <button
            onClick={onCta}
            className="flex items-center gap-2 text-brand-green text-sm font-medium group/btn"
          >
            {t("cta")}
            <ArrowRight
              size={16}
              className="transition-transform group-hover/btn:translate-x-1"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
