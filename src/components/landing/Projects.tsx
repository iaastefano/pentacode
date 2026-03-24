"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const PLACEHOLDER = "/images/placeholder-project.svg";

interface Project {
  id: string;
  title: string;
  description: string;
  url: string | null;
  technologies: string;
  images: string;
}

function ProjectImage({ src }: { src: string }) {
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER);

  return (
    <Image
      src={imgSrc}
      alt=""
      fill
      className="object-cover"
      onError={() => setImgSrc(PLACEHOLDER)}
    />
  );
}

function ProjectCarousel({ images }: { images: string[] }) {
  const validImages = images.filter(Boolean);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  if (validImages.length <= 1) {
    return (
      <div className="relative aspect-video rounded-t-xl overflow-hidden bg-brand-darker">
        <ProjectImage src={validImages[0] || PLACEHOLDER} />
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-t-xl" ref={emblaRef}>
        <div className="flex">
          {validImages.map((img, i) => (
            <div key={i} className="flex-none w-full relative aspect-video bg-brand-darker">
              <ProjectImage src={img} />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={16} />
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {validImages.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === selectedIndex ? "bg-brand-green" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function Projects() {
  const t = useTranslations("projects");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => {});
  }, []);

  const scrollToContact = () => {
    document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="proyectos" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-darker/30 to-brand-dark" />

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

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" staggerDelay={0.15}>
          {projects.map((project) => {
            const images: string[] = JSON.parse(project.images || "[]");
            const techs: string[] = JSON.parse(project.technologies || "[]");

            return (
              <StaggerItem key={project.id}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="glass rounded-xl overflow-hidden group hover:border-brand-green/30 transition-all"
                >
                  <ProjectCarousel images={images} />

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-white/50 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {techs.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 text-xs rounded-full bg-brand-green/10 text-brand-green/80 border border-brand-green/20 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-brand-green text-sm font-medium hover:gap-3 transition-all"
                      >
                        {t("viewProject")}
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button onClick={scrollToContact} className="btn-primary">
            {t("cta")}
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
