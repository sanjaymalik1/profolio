"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DarkProfessionalTemplate } from "@/components/templates/DarkProfessionalTemplate";
import { ElegantMonochromeTemplate } from "@/components/templates/ElegantMonochromeTemplate";
import { WarmMinimalistTemplate } from "@/components/templates/WarmMinimalistTemplate";

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
    badgeClass: "bg-slate-900 text-white",
    Component: DarkProfessionalTemplate,
  },
  {
    id: "warm-minimalist",
    name: "Warm Minimalist",
    category: "Design & Creative",
    badge: "Design Pick" as string | null,
    badgeClass: "bg-amber-500 text-white",
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
];

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
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-5 border border-slate-200/80 bg-white transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1.5">

        {/* Badge */}
        {template.badge && (
          <div className={`absolute top-3 left-3 z-20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${template.badgeClass}`}>
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
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.06] transition-all duration-300 flex items-center justify-center pointer-events-none z-10">
          <div className="px-5 py-2.5 bg-white text-slate-900 text-xs font-semibold rounded-full shadow-xl flex items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            Use Template
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            {template.category}
          </div>
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
            {template.name}
          </h3>
        </div>
        <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-semibold">
          Free
        </span>
      </div>
    </motion.div>
  );
}

export default function TemplatesShowcase() {
  return (
    <section id="templates" className="py-24 sm:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-14">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-3 leading-tight">
              Beautiful templates,
              <br className="hidden sm:block" />
              <span className="text-slate-400">ready to customize.</span>
            </h2>
            <p className="text-base text-slate-500">
              Every template is fully editable, responsive, and built for maximum impact.
            </p>
          </div>
          <Link
            href="/templates"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors border-b border-slate-300 hover:border-slate-700 pb-0.5 shrink-0"
          >
            View all templates
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid — 3 columns on large screens to match the 3 real templates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {templates.map((template, index) => (
            <TemplateCard key={template.id} template={template} index={index} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/templates"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            View all templates
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
