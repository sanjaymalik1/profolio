"use client";
import React from "react";
import { DarkProfessionalTemplate } from "./DarkProfessionalTemplate";
import { ElegantMonochromeTemplate } from "./ElegantMonochromeTemplate";
import { WarmMinimalistTemplate } from "./WarmMinimalistTemplate";
import { PortfolioRenderer } from "@/app/p/[slug]/PortfolioRenderer";
import type { EditorSection } from "@/types/editor";

// Scale: inner div is 400% wide, then scaled back to 25% → visually fills 100% of the card.
// Fully responsive — no JS measurement needed.
const SCALE = 0.25;
const INNER_W = `${(1 / SCALE) * 100}%`; // "400%"

type PreviewComponent = React.ComponentType<{ isPreview?: boolean; data?: Record<string, unknown> }>;

const TEMPLATE_MAP: Record<string, PreviewComponent> = {
  "dark-professional": DarkProfessionalTemplate,
  "elegant-monochrome": ElegantMonochromeTemplate,
  "warm-minimalist": WarmMinimalistTemplate,
};

interface ScaledTemplatePreviewProps {
  templateId?: string | null;
  /** Pass real portfolio data to render user content instead of demo data */
  data?: Record<string, unknown>;
  /** Pass raw editor sections for non-template (blank canvas) portfolios */
  sections?: EditorSection[];
}

/**
 * Renders a real scaled-down template preview inside whatever container you
 * position-relatively around it.
 *
 * Usage:
 *   <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
 *     <ScaledTemplatePreview templateId="dark-professional" />
 *   </div>
 */
export function ScaledTemplatePreview({ templateId, data, sections }: ScaledTemplatePreviewProps) {
  const Component = templateId ? TEMPLATE_MAP[templateId] : undefined;

  // ── Case 1: Known template component ────────────────────────────────────
  if (Component) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: INNER_W,
            transform: `scale(${SCALE})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          <Component data={data} isPreview />
        </div>
      </div>
    );
  }

  // ── Case 2: Blank-canvas portfolio with user sections ───────────────────
  if (sections && sections.length > 0) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: INNER_W,
            transform: `scale(${SCALE})`,
            transformOrigin: "top left",
            pointerEvents: "none",
          }}
        >
          <PortfolioRenderer sections={sections} />
        </div>
      </div>
    );
  }

  // ── Case 3: Empty portfolio — mini canvas placeholder ───────────────────
  return (
    <div className="absolute inset-0 bg-white">
      {/* Mini nav bar */}
      <div className="h-[12%] border-b border-slate-100 flex items-center px-[6%] gap-[3%]">
        <div className="w-[12%] h-[25%] rounded-sm bg-slate-200" />
        <div className="flex-1" />
        <div className="w-[8%] h-[20%] rounded-sm bg-slate-100" />
        <div className="w-[8%] h-[20%] rounded-sm bg-slate-100" />
        <div className="w-[8%] h-[20%] rounded-sm bg-slate-100" />
      </div>
      {/* Hero area */}
      <div className="flex flex-col items-center pt-[10%] px-[10%]">
        <div className="w-[14%] aspect-square rounded-full bg-slate-100 mb-[4%]" />
        <div className="w-[45%] h-[4%] rounded-sm bg-slate-200 mb-[2.5%]" />
        <div className="w-[30%] h-[3%] rounded-sm bg-slate-100 mb-[2%]" />
        <div className="w-[55%] h-[2.5%] rounded-sm bg-slate-50 mb-[1.2%]" />
        <div className="w-[48%] h-[2.5%] rounded-sm bg-slate-50 mb-[6%]" />
        <div className="w-[18%] h-[5%] rounded bg-slate-900 mb-[8%]" />
      </div>
      {/* Section blocks */}
      <div className="px-[8%] space-y-[4%]">
        <div className="w-[22%] h-[3%] rounded-sm bg-slate-100 mb-[2%]" />
        <div className="grid grid-cols-3 gap-[3%]">
          <div className="aspect-[4/3] rounded bg-slate-50" />
          <div className="aspect-[4/3] rounded bg-slate-50" />
          <div className="aspect-[4/3] rounded bg-slate-50" />
        </div>
      </div>
    </div>
  );
}
