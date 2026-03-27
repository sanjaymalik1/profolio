"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DarkProfessionalTemplate } from "@/components/templates/DarkProfessionalTemplate";
import { ElegantMonochromeTemplate } from "@/components/templates/ElegantMonochromeTemplate";
import { WarmMinimalistTemplate } from "@/components/templates/WarmMinimalistTemplate";
import EliteProTemplate from "@/components/templates/EliteProTemplate";

// Scale factor: inner div is (1/SCALE * 100)% wide so that after scale(SCALE)
// it fills exactly 100% of the card — fully responsive, no JS measurement needed.
const PREVIEW_SCALE = 0.25;
const INNER_WIDTH_PCT = `${(1 / PREVIEW_SCALE) * 100}%`; // "400%"

const templates = [
  {
    id: "dark-professional",
    name: "Dark Professional",
    category: "Software Engineering",
    badge: "Most Popular" as string | null,
    badgeClass: "bg-[#2D2A26] text-[#F5F1EA]",
    Component: DarkProfessionalTemplate,
  },
  {
    id: "warm-minimalist",
    name: "Warm Minimalist",
    category: "Design & Creative",
    badge: "Design Pick" as string | null,
    badgeClass: "bg-[#6B7A52] text-[#F5F1EA]",
    Component: WarmMinimalistTemplate,
  },
  {
    id: "elegant-monochrome",
    name: "Elegant Monochrome",
    category: "Business & Strategy",
    badge: null,
    badgeClass: "",
    Component: ElegantMonochromeTemplate,
  },
  {
    id: "elite-pro",
    name: "Elite Pro",
    category: "Premium Developer",
    badge: "Premium" as string | null,
    badgeClass: "bg-[#5C554D] text-[#F5F1EA]",
    Component: EliteProTemplate,
  },
];

const landingTemplates = [templates[0], templates[1], templates[3]];

type Template = (typeof templates)[number];

function TemplateCard({ template, index }: { template: Template; index: number }) {
  const { Component } = template;

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group cursor-pointer"
    >
      {/* Preview thumbnail */}
      <div className="relative w-full aspect-[16/10] overflow-hidden mb-5 bg-[#f8f4ee] transition-all duration-400 group-hover:-translate-y-1">

        {/* Badge */}
        {template.badge && (
          <div className={`absolute top-3 left-3 z-20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] rounded-full ${template.badgeClass}`}>
            {template.badge}
          </div>
        )}

        {/* Real template scaled down to fill the card.
            Inner div is 400% wide; scale(0.25) brings it back to 100% visually.
            overflow-hidden on the parent clips the template height to the 16/10 window. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: INNER_WIDTH_PCT,
            transform: `scale(${PREVIEW_SCALE})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          <Component isPreview />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-[#2d2a26]/[0.05] transition-all duration-300 flex items-center justify-center pointer-events-none z-10">
          <div className="px-5 py-2.5 border landing-divider bg-[#f5f1ea] text-[#2d2a26] text-[11px] font-semibold rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            Use Template
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold text-[#5c554d] uppercase tracking-[0.14em] mb-1">
            {template.category}
          </div>
          <h3 className="landing-serif text-[1.06rem] font-semibold text-[#2d2a26] group-hover:text-[#6b7a52] transition-colors">
            {template.name}
          </h3>
        </div>
        <span className="px-2.5 py-1 border landing-divider text-[#5c554d] rounded-full text-[10px] font-semibold uppercase tracking-[0.11em]">
          Free
        </span>
      </div>
    </motion.div>
  );
}

export default function TemplatesShowcase() {
  return (
    <section id="templates" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-14">
          <div className="max-w-xl">
            <p className="landing-eyebrow mb-4">Templates</p>
            <h2 className="landing-serif text-[2.45rem] sm:text-[3.3rem] font-semibold mb-3 leading-[0.98]">
              Beautiful templates,
              <br className="hidden sm:block" />
              <span className="text-[#6B7A52]">ready to customize.</span>
            </h2>
            <p className="landing-body text-[1rem]">
              Every template is fully editable, responsive, and built for maximum impact.
            </p>
          </div>
          <Link
            href="/templates"
            className="hidden sm:inline-flex items-center gap-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#5c554d] hover:text-[#2d2a26] transition-colors border-b landing-divider hover:border-[#2d2a26] pb-0.5 shrink-0"
          >
            View all templates
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid — 3 columns on large screens to match the 3 real templates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {landingTemplates.map((template, index) => (
            <TemplateCard key={template.id} template={template} index={index} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#5c554d] hover:text-[#2d2a26] transition-colors"
          >
            View all templates
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
