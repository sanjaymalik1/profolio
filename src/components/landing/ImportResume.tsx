"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import type { MotionValue } from "framer-motion";
import {
  FileText,
  Sparkles,
  User,
  Award,
  Code,
  Briefcase,
  CheckCircle2,
  MousePointer2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase =
  | "idle"
  | "cursor-move"
  | "click"
  | "zoom-in"
  | "zoom-out"
  | "file-picker"
  | "file-select"
  | "scanning"
  | "generating"
  | "portfolio";

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

const SCAN_SEQUENCE = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// ─── Cursor component ─────────────────────────────────────────────────────────
//
// Receives Framer Motion MotionValues for x/y position. Using MotionValues in
// the `style` prop bypasses React re-renders entirely — the spring values
// directly drive the DOM — so cursor movement is always smooth regardless of
// how React batches state updates.

function Cursor({
  x,
  y,
  clicking,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  clicking: boolean;
}) {
  return (
    <motion.div
      className="absolute z-50 pointer-events-none"
      style={{ left: x, top: y }}
    >
      <motion.div
        animate={clicking ? { scale: 0.72 } : { scale: 1 }}
        transition={{ duration: 0.1 }}
      >
        <MousePointer2 className="w-5 h-5 text-slate-800 drop-shadow-md" fill="white" />
      </motion.div>
    </motion.div>
  );
}

// ─── Resume document (scanning view) ─────────────────────────────────────────

function ResumeDocument({ highlightedLine }: { highlightedLine: number }) {
  const lines = [
    { label: "Alex Morgan", bold: true, indent: false },
    { label: "Full Stack Developer · alex@morgan.dev", bold: false, indent: false },
    { label: "Experience", bold: true, indent: false },
    { label: "Senior Engineer, Stripe  2021–present", bold: false, indent: true },
    { label: "Software Engineer, Airbnb  2018–2021", bold: false, indent: true },
    { label: "Education", bold: true, indent: false },
    { label: "B.Sc. Computer Science, MIT  2018", bold: false, indent: true },
    { label: "Skills", bold: true, indent: false },
    { label: "React · TypeScript · Node.js · AWS", bold: false, indent: true },
    { label: "Projects", bold: true, indent: false },
    { label: "Open-source CLI tool · 4.2k ★", bold: false, indent: true },
  ];
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-left min-w-0 overflow-hidden">
      <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2.5">
        <div className="w-6 h-6 bg-rose-100 rounded-lg flex items-center justify-center shrink-0">
          <FileText className="w-3 h-3 text-rose-600" />
        </div>
        <span className="text-[10px] font-bold text-slate-700 truncate">Resume.pdf</span>
      </div>
      <div className="space-y-1">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            animate={
              highlightedLine === i
                ? { backgroundColor: "rgb(239 246 255)" }
                : { backgroundColor: "transparent" }
            }
            transition={{ duration: 0.2 }}
            className={`rounded px-1 py-0.5 flex items-center gap-1.5 ${line.indent ? "ml-2.5" : ""}`}
          >
            {highlightedLine === i && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 2.5 }}
                className="h-3 rounded-full bg-blue-500 shrink-0"
              />
            )}
            <span
              className={`text-[9px] leading-snug truncate ${
                line.bold ? "font-bold text-slate-800" : "text-slate-500"
              } ${highlightedLine === i ? "text-blue-700" : ""}`}
            >
              {line.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Generated section row ────────────────────────────────────────────────────

function SectionRow({
  icon: Icon,
  label,
  color,
  visible,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  visible: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={label}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm"
        >
          <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${color}`}>
            <Icon className="w-3 h-3 text-white" />
          </div>
          <span className="text-[11px] font-semibold text-slate-700">{label}</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-auto shrink-0" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Portfolio mini-preview ───────────────────────────────────────────────────

function PortfolioPreview() {
  return (
    <div className="space-y-2.5">
      <div className="bg-slate-900 rounded-xl px-5 py-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-slate-600 flex items-center justify-center shrink-0 border-2 border-white/10">
          <span className="text-white text-[10px] font-bold select-none">AM</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-[12px] font-bold leading-tight">Alex Morgan</p>
          <p className="text-slate-400 text-[10px] mt-0.5">Full Stack Developer</p>
        </div>
        <div className="px-2.5 h-6 rounded-full bg-white flex items-center text-[9px] font-bold text-slate-900 shrink-0">
          View Work
        </div>
      </div>
      <div className="bg-white border border-slate-100 rounded-xl px-5 py-3.5">
        <p className="text-[10px] font-bold text-slate-700 mb-2">Experience</p>
        <div className="space-y-1.5">
          {[
            { company: "Stripe", role: "Senior Engineer", period: "2021–present", dot: "bg-blue-500" },
            { company: "Airbnb", role: "Software Engineer", period: "2018–2021",    dot: "bg-slate-400" },
          ].map((e) => (
            <div key={e.company} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${e.dot} shrink-0`} />
              <span className="text-[9px] text-slate-600">{e.role} · {e.company}</span>
              <span className="text-[9px] text-slate-400 ml-auto">{e.period}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-slate-100 rounded-xl px-5 py-3.5">
        <p className="text-[10px] font-bold text-slate-700 mb-2">Skills</p>
        <div className="flex flex-wrap gap-1">
          {["React", "TypeScript", "Node.js", "AWS", "Python"].map((s) => (
            <span key={s} className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ImportResume() {
  // viewportRef lets us measure actual rendered dimensions so cursor coordinates
  // are responsive — the button is always at ~50% width and ~62% height.
  const viewportRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase]                     = useState<Phase>("idle");
  const [clicking, setClicking]               = useState(false);
  const [showPicker, setShowPicker]           = useState(false);
  const [pickerHighlight, setPickerHighlight] = useState(false);
  const [scanIndex, setScanIndex]             = useState(-1);
  const [generatedCount, setGeneratedCount]   = useState(0);
  const [showPortfolio, setShowPortfolio]     = useState(false);
  const [showCursor, setShowCursor]           = useState(true);

  // Camera state — translates + scales the content layer to create a
  // cinematic "camera focus" effect without blowing up the scale so much
  // that content escapes the container. Scale stays ≤1.12 so edge overflow
  // is ≤24px, which is always clipped by the ContentWrapper.
  const [camX, setCamX]       = useState(0);
  const [camY, setCamY]       = useState(0);
  const [camScale, setCamScale] = useState(1);

  // Cursor position — plain MotionValues driven by the animate() utility.
  // animate(cursorX, target, opts) returns a thenable; awaiting it guarantees
  // the cursor has fully reached the target before the next step begins.
  // cursorX.set() snaps instantly without animation (used for reset).
  const cursorX = useMotionValue(50);
  const cursorY = useMotionValue(60);

  useEffect(() => {
    let cancelled = false;

    const CURVE_IN  = [0.16, 1, 0.3, 1] as const; // fast-out (easeOutExpo)
    const CURVE_OUT = [0.4, 0, 1, 1]   as const; // ease-in for retreat

    const run = async () => {
      while (!cancelled) {
        // ── Reset ─────────────────────────────────────────────────────────────
        setPhase("idle");
        setClicking(false);
        setShowPicker(false);
        setPickerHighlight(false);
        setScanIndex(-1);
        setGeneratedCount(0);
        setShowPortfolio(false);
        setShowCursor(true);
        setCamX(0); setCamY(0); setCamScale(1);
        // Snap cursor to rest instantly — .set() bypasses any tween
        cursorX.set(50);
        cursorY.set(60);
        await sleep(900);
        if (cancelled) return;

        // ── Cursor moves to Import Resume button ───────────────────────────────
        // animate() returns a thenable — awaiting it guarantees the cursor has
        // physically arrived at the target before the click step begins.
        setPhase("cursor-move");
        const el = viewportRef.current;
        const vw = el?.offsetWidth  ?? 520;
        const vh = el?.offsetHeight ?? 420;
        // Button sits horizontally centered and ~65% down the viewport.
        const btnX = vw * 0.50;
        const btnY = vh * 0.65;
        await Promise.all([
          animate(cursorX, btnX, { duration: 0.82, ease: CURVE_IN }),
          animate(cursorY, btnY, { duration: 0.82, ease: CURVE_IN }),
        ]);
        if (cancelled) return;

        // Brief hover pause so the user can see the cursor sitting on the button
        await sleep(300);
        if (cancelled) return;

        // ── Click ─────────────────────────────────────────────────────────────
        setPhase("click");
        setClicking(true);
        await sleep(140);
        setClicking(false);
        await sleep(200);
        if (cancelled) return;

        // ── Camera zoom-in toward button ──────────────────────────────────────
        // Translate the content up so the button (~65% down) drifts toward visual
        // center, then apply a small scale (1.1) — total edge overflow is ~22px,
        // safely clipped by ContentWrapper. This feels like a camera push-in.
        setPhase("zoom-in");
        setCamY(-28);    // nudge button up toward viewport center
        setCamScale(1.1);
        // Cursor retreats while the camera pushes in — clean visual beat
        animate(cursorX, 50, { duration: 0.5, ease: CURVE_OUT });
        animate(cursorY, 60, { duration: 0.5, ease: CURVE_OUT });
        await sleep(860);
        if (cancelled) return;

        // ── Camera pull-back to normal ─────────────────────────────────────────
        setPhase("zoom-out");
        setCamX(0); setCamY(0); setCamScale(1);
        await sleep(680);
        if (cancelled) return;

        // ── File picker; cursor moves to Resume.pdf row ────────────────────────
        setPhase("file-picker");
        setShowPicker(true);
        // Resume.pdf is the 2nd row inside the centered picker modal.
        // ~46% width (slightly left of center) and ~51% height (modal middle).
        const rowX = vw * 0.46;
        const rowY = vh * 0.51;
        await Promise.all([
          animate(cursorX, rowX, { duration: 0.55, ease: CURVE_IN }),
          animate(cursorY, rowY, { duration: 0.55, ease: CURVE_IN }),
        ]);
        if (cancelled) return;
        await sleep(320);
        if (cancelled) return;
        setPickerHighlight(true);
        await sleep(580);
        if (cancelled) return;

        // ── File selected → picker closes ─────────────────────────────────────
        setPhase("file-select");
        setClicking(true);
        await sleep(130);
        setClicking(false);
        setShowPicker(false);
        setPickerHighlight(false);
        setShowCursor(false);
        await sleep(380);
        if (cancelled) return;

        // Subtle camera nudge up to frame the resume document at the top
        setCamY(-18); setCamScale(1.08);
        await sleep(420);
        if (cancelled) return;

        // ── Scanning ──────────────────────────────────────────────────────────
        setPhase("scanning");
        for (let i = 0; i < SCAN_SEQUENCE.length; i++) {
          if (cancelled) return;
          setScanIndex(SCAN_SEQUENCE[i]);
          await sleep(185);
        }
        setScanIndex(-1);
        await sleep(260);
        if (cancelled) return;

        setCamX(0); setCamY(0); setCamScale(1);
        await sleep(360);
        if (cancelled) return;

        // ── Generating sections ────────────────────────────────────────────────
        setPhase("generating");
        for (let n = 1; n <= 4; n++) {
          if (cancelled) return;
          setGeneratedCount(n);
          await sleep(260);
        }
        await sleep(520);
        if (cancelled) return;

        // ── Portfolio preview ──────────────────────────────────────────────────
        setPhase("portfolio");
        setShowPortfolio(true);
        // Gentle push-in for portfolio reveal — pull up slightly so cards are centred
        setCamY(-14); setCamScale(1.1);
        await sleep(2100);
        if (cancelled) return;

        setCamX(0); setCamY(0); setCamScale(1);
        await sleep(600);
        if (cancelled) return;
      }
    };

    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sections = [
    { icon: User,      label: "Hero Section", color: "bg-slate-700"   },
    { icon: Award,     label: "Experience",   color: "bg-blue-600"    },
    { icon: Code,      label: "Skills",       color: "bg-emerald-600" },
    { icon: Briefcase, label: "Projects",     color: "bg-amber-500"   },
  ] as const;

  const isScanning      = phase === "scanning" || phase === "file-select";
  const isGenerating    = phase === "generating" || phase === "portfolio";
  const importBtnActive = phase === "click" || phase === "zoom-in";

  const stepGroups: Phase[][] = [
    ["idle", "cursor-move", "click", "zoom-in", "zoom-out"],
    ["file-picker", "file-select"],
    ["scanning"],
    ["generating"],
    ["portfolio"],
  ];
  const stepLabels = ["Import", "Select", "AI scan", "Generate", "Preview"];

  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_#e2e8f025_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ── Text side ── */}
          <motion.div
            className="w-full lg:w-[42%] shrink-0 text-center lg:text-left"
            initial={{ x: -24, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3 text-blue-600" />
              AI-Powered Import
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 mb-5 leading-tight">
              Resume in.
              <br />
              <span className="text-slate-400">Portfolio out.</span>
            </h2>

            <p className="text-lg text-slate-500 leading-relaxed">
              Upload your PDF and our AI builds your entire portfolio
              automatically — sections, content, and layout included.
            </p>
          </motion.div>

          {/* ── Mac-style window — takes all remaining space ── */}
          <motion.div
            className="w-full lg:flex-1 min-w-0"
            initial={{ x: 24, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          >
            {/* Window frame */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">

              {/* Title bar */}
              <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-3 shrink-0">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 flex justify-center min-w-0 px-2">
                  <div className="max-w-xs w-full px-3 py-1 bg-white border border-slate-200 rounded text-[11px] text-slate-500 font-medium text-center truncate">
                    editor.profolio.me
                  </div>
                </div>
                <motion.div
                  animate={importBtnActive
                    ? { scale: 0.94, backgroundColor: "rgb(55 65 81)" }
                    : { scale: 1,    backgroundColor: "rgb(15 23 42)" }
                  }
                  transition={{ duration: 0.12 }}
                  className="h-6 px-3 rounded text-[11px] font-semibold flex items-center gap-1.5 shrink-0 text-white cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  <span className="hidden sm:inline">Import Resume</span>
                  <span className="sm:hidden">Import</span>
                </motion.div>
              </div>

              {/* Viewport — cursor sits as a sibling of the zooming content div
                  so it is NOT scaled along with the content */}
              {/* Viewport
                  ─ isolation: isolate creates a self-contained compositing surface;
                    any child GPU layers are composited WITHIN this surface so they
                    can never paint outside its bounds.
                  ─ transform: translateZ(0) promotes the container to its own GPU
                    layer BEFORE children are promoted, ensuring the parent clip is
                    honoured at the compositing stage.
                  ─ overflow: hidden is the final software-level fallback.
              */}
              <div
                ref={viewportRef}
                className="relative h-[380px] sm:h-[460px] overflow-hidden bg-slate-50"
                style={{ isolation: "isolate", transform: "translateZ(0)" }}
              >
                {/*
                  ContentWrapper — the explicit, non-animated clip wall.
                  It sits between the static frame and the animated layer.
                  Because it carries no `will-change` or transform of its own,
                  the browser clips scaled children to its bounds reliably.
                */}
                <div className="absolute inset-0 overflow-hidden">

                  {/* AnimatedContent — ONLY this layer moves during zoom.
                      x/y translate brings the focus area toward center;
                      scale stays ≤1.1 so overflow is <25px (clipped by parent). */}
                  <motion.div
                    className="absolute inset-0 px-4 py-4"
                    animate={{ x: camX, y: camY, scale: camScale }}
                    transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "50% 50%" }}
                  >
                    <AnimatePresence mode="wait">

                    {/* Idle / cursor-move / click / zoom: canvas prompt card */}
                    {!isScanning && !isGenerating && !showPortfolio && (
                      <motion.div
                        key="idle-canvas"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3 }}
                        className="h-full flex items-center justify-center"
                      >
                        <div className="w-full max-w-[340px] bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-8 flex flex-col items-center gap-4 text-center">
                          <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 mb-1">
                              Import your resume
                            </p>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              We&apos;ll extract your experience, skills, and
                              projects automatically.
                            </p>
                          </div>
                          {/* Button the cursor physically targets */}
                          <motion.div
                            animate={importBtnActive
                              ? { scale: 0.94, backgroundColor: "rgb(55 65 81)" }
                              : { scale: 1,    backgroundColor: "rgb(15 23 42)" }
                            }
                            transition={{ duration: 0.12 }}
                            className="h-8 px-5 rounded-lg text-[11px] text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Import Resume
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    {/* File picker overlay */}
                    {showPicker && (
                      <motion.div
                        key="picker-overlay"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center z-10"
                      >
                        <div className="w-[260px] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
                          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700">Open File</span>
                            <span className="text-[10px] text-slate-400">Documents</span>
                          </div>
                          <div className="px-3 py-2 space-y-0.5">
                            {["Q4_Report.pdf", "Resume.pdf", "Portfolio_old.zip"].map((f, i) => (
                              <motion.div
                                key={f}
                                animate={
                                  i === 1 && pickerHighlight
                                    ? { backgroundColor: "rgb(239 246 255)" }
                                    : { backgroundColor: "transparent" }
                                }
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-2.5 px-2 py-2 rounded-lg"
                              >
                                <FileText className={`w-3.5 h-3.5 shrink-0 ${f.endsWith(".pdf") ? "text-rose-500" : "text-slate-400"}`} />
                                <span className={`text-[10px] truncate ${i === 1 && pickerHighlight ? "font-semibold text-blue-700" : "text-slate-600"}`}>
                                  {f}
                                </span>
                                {i === 1 && pickerHighlight && (
                                  <span className="ml-auto text-[9px] font-semibold text-blue-500 shrink-0">Select</span>
                                )}
                              </motion.div>
                            ))}
                          </div>
                          <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 flex justify-end gap-2">
                            <div className="h-6 px-3 rounded border border-slate-200 text-[11px] text-slate-500 flex items-center">Cancel</div>
                            <div className="h-6 px-3 rounded bg-slate-900 text-[11px] text-white flex items-center font-semibold">Open</div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Scanning: resume doc + AI checklist */}
                    {isScanning && (
                      <motion.div
                        key="scanning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-3 items-start h-full"
                      >
                        <div className="flex-1 min-w-0">
                          <ResumeDocument highlightedLine={scanIndex} />
                        </div>
                        <div className="w-[108px] shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm px-2.5 py-3 flex flex-col gap-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles className="w-3 h-3 text-blue-600" />
                            </motion.div>
                            <span className="text-[9px] font-bold text-slate-700">AI Scanning</span>
                          </div>
                          {["Experience", "Education", "Skills", "Projects"].map((cat, i) => {
                            const filled = scanIndex >= [2, 5, 7, 9][i];
                            return (
                              <div key={cat} className="flex items-center gap-1.5">
                                <motion.div
                                  animate={filled ? { opacity: 1 } : { opacity: 0.25 }}
                                  className="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"
                                >
                                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                </motion.div>
                                <span className={`text-[9px] ${filled ? "text-slate-700 font-semibold" : "text-slate-400"}`}>
                                  {cat}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* Generating: section rows */}
                    {isGenerating && !showPortfolio && (
                      <motion.div
                        key="generating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center h-full"
                      >
                        <div className="w-full max-w-xs">
                          <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <p className="text-[12px] font-bold text-slate-800">Building your portfolio…</p>
                          </div>
                          <div className="space-y-2">
                            {sections.map((s, i) => (
                              <SectionRow
                                key={s.label}
                                icon={s.icon}
                                label={s.label}
                                color={s.color}
                                visible={generatedCount > i}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Portfolio preview */}
                    {showPortfolio && (
                      <motion.div
                        key="portfolio"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="h-full overflow-hidden"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <p className="text-[12px] font-bold text-emerald-700">Portfolio generated!</p>
                        </div>
                        <PortfolioPreview />
                      </motion.div>
                    )}

                    </AnimatePresence>
                  </motion.div>

                </div>{/* end ContentWrapper */}

                {/* Cursor — sibling of ContentWrapper, never inside the scaled layer,
                    so it is NOT zoomed with the content. Opacity toggles to show/hide. */}
                <motion.div
                  className="absolute inset-0 pointer-events-none z-50"
                  animate={{ opacity: showCursor ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Cursor x={cursorX} y={cursorY} clicking={clicking} />
                </motion.div>

              </div>{/* end Viewport */}
            </div>

            {/* Step progress indicators */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-5">
              {stepGroups.map((phases, i) => {
                const active = phases.includes(phase);
                return (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <motion.div
                      animate={active ? { scale: 1.35 } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                        active ? "bg-blue-500" : "bg-slate-300"
                      }`}
                    />
                    <span className={`text-[9px] font-semibold transition-colors duration-200 ${
                      active ? "text-blue-600" : "text-slate-400"
                    }`}>
                      {stepLabels[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
