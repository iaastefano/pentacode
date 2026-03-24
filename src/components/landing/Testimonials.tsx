"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Star, ArrowRight, Play, Pause, Quote } from "lucide-react";
import { SectionBadge } from "@/components/ui/SectionBadge";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";

interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  photo: string | null;
  text: string;
  rating: number;
  videoUrl: string | null;
}

function VideoPlayer({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-brand-darker cursor-pointer group" onClick={toggle}>
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-cover"
        playsInline
        preload="metadata"
        onEnded={() => setPlaying(false)}
      />
      <div className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
        <div className="w-12 h-12 rounded-full bg-brand-green/90 flex items-center justify-center">
          {playing ? <Pause size={20} className="text-brand-darkest" /> : <Play size={20} className="text-brand-darkest ml-0.5" />}
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const t = useTranslations("testimonials");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then(setTestimonials)
      .catch(() => {});
  }, []);

  const scrollToContact = () => {
    document.querySelector("#contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="testimonios" className="py-24 relative overflow-hidden">
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

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-none w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <div className="glass rounded-2xl h-full flex flex-col hover:border-brand-green/20 transition-colors overflow-hidden">
                    {testimonial.videoUrl && (
                      <VideoPlayer url={testimonial.videoUrl} />
                    )}

                    <div className="p-6 flex flex-col flex-grow">
                      <Quote className="text-brand-green/30 mb-4" size={32} />

                      <p className="text-white/70 leading-relaxed flex-grow mb-4">
                        &ldquo;{testimonial.text}&rdquo;
                      </p>

                      <div className="mt-auto">
                        <StarRating rating={testimonial.rating} />
                        <div className="mt-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green font-bold text-sm">
                            {testimonial.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{testimonial.name}</p>
                            {testimonial.company && (
                              <p className="text-xs text-white/40">{testimonial.company}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {testimonials.length > 1 && (
            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={scrollPrev}
                aria-label="Testimonio anterior"
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-brand-green/10 transition-colors"
              >
                <ChevronLeftIcon />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Siguiente testimonio"
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-brand-green/10 transition-colors"
              >
                <ChevronRightIcon />
              </button>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
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

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
