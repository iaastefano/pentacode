"use client";

import { motion } from "framer-motion";

export function SectionBadge({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20 mb-4"
    >
      <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
      <span className="text-brand-green text-sm font-medium font-mono tracking-wide uppercase">{text}</span>
    </motion.div>
  );
}
