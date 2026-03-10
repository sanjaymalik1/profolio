"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  FileText,
  Code,
  Briefcase,
  Mail,
  GraduationCap,
  Award,
  GripVertical,
  MousePointer2,
  Check,
  Sparkles,
  Plus,
} from "lucide-react";

// ─── Palette section definitions ─────────────────────────────────────────────

const palette = [
  { type: "hero",       label: "Hero Section", icon: User },
  { type: "about",      label: "About Me",     icon: FileText },
  { type: "skills",     label: "Skills",       icon: Code },
  { type: "projects",   label: "Projects",     icon: Briefcase },
  { type: "contact",    label: "Contact",      icon: Mail },
  { type: "experience", label: "Experience",   icon: Award },
  { type: "education",  label: "Education",    icon: GraduationCap },
];

// ─── Real-content canvas blocks ───────────────────────────────────────────────

function HeroBlock() {
  return (
    <div className="bg-slate-900 rounded-lg px-4 py-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-slate-600 flex items-center justify-center shrink-0 border-2 border-white/10">
        <span className="text-white text-[11px] font-bold select-none">AM</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[12px] font-bold leading-tight">Alex Morgan</p>
        <p className="text-slate-400 text-[10px] leading-tight mt-0.5">Full Stack Developer</p>
        <p className="text-slate-500 text-[9px] leading-tight mt-0.5 hidden sm:block">
          Building elegant software since 2018
        </p>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <div className="px-2.5 h-6 rounded-full bg-white flex items-center text-[9px] font-bold text-slate-900">
          View Work
        </div>
        <div className="px-2.5 h-6 rounded-full border border-white/30 flex items-center text-[9px] font-medium text-white/70">
          Contact
        </div>
      </div>
    </div>
  );
}

function AboutBlock() {
  return (
    <div className="bg-white border border-slate-100 rounded-lg px-4 py-3.5">
      <p className="text-[10px] font-bold text-slate-700 mb-1.5">About Me</p>
      <p className="text-[10px] text-slate-500 leading-relaxed">
        Passionate full-stack developer with 6+ years building scalable web
        apps. Specializing in React, Node.js, and cloud infrastructure.
      </p>
    </div>
  );
}

function SkillsBlock() {
  const skills = ["React", "TypeScript", "Node.js", "AWS", "Figma", "Python"];
  return (
    <div className="bg-white border border-slate-100 rounded-lg px-4 py-3.5">
      <p className="text-[10px] font-bold text-slate-700 mb-2">Technical Skills</p>
      <div className="flex flex-wrap gap-1">
        {skills.map((s) => (
          <span
            key={s}
            className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Right panel: context-aware content fields ────────────────────────────────

function PanelField({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      {multiline ? (
        <div className="px-2.5 py-2 border border-slate-200 rounded-lg text-[10px] text-slate-600 bg-slate-50/50 leading-relaxed min-h-[40px]">
          {value}
        </div>
      ) : (
        <div className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px] text-slate-600 bg-slate-50/50">
          {value}
        </div>
      )}
    </div>
  );
}

function HeroPanel() {
  return (
    <div className="space-y-3">
      <PanelField label="Name" value="Alex Morgan" />
      <PanelField label="Profession" value="Full Stack Developer" />
      <PanelField label="Tagline" value="Building elegant software since 2018" />
      <PanelField label="Email" value="alex@morgan.dev" />
    </div>
  );
}

function SkillsPanel() {
  return (
    <div className="space-y-3">
      <PanelField label="Section Title" value="Technical Skills" />
      <div>
        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          Add Skill
        </p>
        <div className="flex gap-1.5">
          <div className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px] text-slate-400 bg-slate-50/50">
            e.g. &ldquo;Docker&rdquo;
          </div>
          <div className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-slate-500 shrink-0">
            <Plus className="w-3 h-3" />
          </div>
        </div>
      </div>
      <div>
        <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Skill Tags
        </p>
        <div className="flex flex-wrap gap-1">
          {["React", "TypeScript", "Node.js", "AWS", "Figma"].map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-blue-50 text-blue-600 border border-blue-100"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Canvas section row ───────────────────────────────────────────────────────

function CanvasSection({
  children,
  selected,
  label,
}: {
  children: React.ReactNode;
  selected: boolean;
  label: string;
}) {
  return (
    <div
      className={`relative group/block rounded-lg transition-all duration-200 ${
        selected ? "ring-2 ring-blue-500 ring-offset-1" : ""
      }`}
    >
      {selected && (
        <div className="absolute -top-px -left-px bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-tl-lg rounded-br-md z-20 leading-none flex items-center h-5">
          {label}
        </div>
      )}
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 transition-opacity ${
          selected ? "opacity-100" : "opacity-0"
        }`}
      >
        <GripVertical className="w-3.5 h-3.5 text-slate-400" />
      </div>
      {children}
    </div>
  );
}

// ─── Animation phases ─────────────────────────────────────────────────────────

/**
 * Cycle (~7.2 s):
 *  idle        1.2 s  — Hero+About canvas, Hero selected, Hero panel
 *  lift        0.6 s  — Skills palette item lifts
 *  fly         0.9 s  — Ghost tile flies + placeholder appears
 *  drop        0.4 s  — Skills snaps in, placeholder gone
 *  settle      1.5 s  — Skills selected, Skills panel
 *  to-publish  0.8 s  — cursor travels to Publish button
 *  saved       1.4 s  — "Published ✓" state on button
 */
type Phase = "idle" | "lift" | "fly" | "drop" | "settle" | "to-publish" | "saved";
type PublishState = "default" | "highlight" | "saved";

export default function EditorPreview() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [showDropped, setShowDropped] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<"hero" | "skills">("hero");
  const [publishState, setPublishState] = useState<PublishState>("default");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      while (!cancelled) {
        // Reset
        setPhase("idle");
        setShowPlaceholder(false);
        setShowDropped(false);
        setSelectedBlock("hero");
        setPublishState("default");
        await sleep(1200);

        // Pick up Skills
        setPhase("lift");
        await sleep(600);

        // Fly ghost to canvas
        setPhase("fly");
        setShowPlaceholder(true);
        await sleep(900);

        // Drop
        setPhase("drop");
        setShowDropped(true);
        await sleep(350);
        setShowPlaceholder(false);

        // Settle — Skills selected
        setPhase("settle");
        setSelectedBlock("skills");
        await sleep(1500);

        // Cursor moves to Publish
        setPhase("to-publish");
        await sleep(500);
        setPublishState("highlight");
        await sleep(500);

        // Published!
        setPhase("saved");
        setPublishState("saved");
        await sleep(1400);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const isSkillsDropped =
    phase === "drop" || phase === "settle" || phase === "to-publish" || phase === "saved";

  return (
    <section className="py-24 sm:py-32 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_#cbd5e120_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-14 lg:mb-18">
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6 shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-blue-600" />
            Visual Editor
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 mb-5"
          >
            Visual editing.
            <br />
            <span className="text-slate-400">Total control.</span>
          </motion.h2>
          <motion.p
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-slate-500 leading-relaxed"
          >
            Drag sections onto your canvas, edit content inline, and publish
            your portfolio in minutes.
          </motion.p>
        </div>

        {/* Editor mockup */}
        <motion.div
          className="relative max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >

          {/* Mac cursor — travels to Publish button */}
          <AnimatePresence>
            {(phase === "to-publish" || phase === "saved") && (
              <motion.div
                key="cursor"
                className="absolute z-50 pointer-events-none"
                style={{ top: 80, right: 220 }}
                initial={{ opacity: 0, y: 0, x: 0 }}
                animate={{ opacity: 1, y: -68, x: 170 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
              >
                <MousePointer2
                  className="w-4 h-4 text-slate-800 drop-shadow"
                  fill="white"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Title bar */}
          <div className="h-11 border-b border-slate-100 bg-slate-50 flex items-center px-4 justify-between gap-4 shrink-0">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-500 font-medium max-w-xs w-full text-center">
                my-portfolio.profolio.me
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <div className="h-6 px-3 bg-white border border-slate-200 rounded text-[11px] text-slate-500 flex items-center font-medium">
                Preview
              </div>
              <motion.div
                animate={
                  publishState === "highlight"
                    ? { scale: 1.06 }
                    : { scale: 1 }
                }
                transition={{ duration: 0.15 }}
                className={`h-6 px-3 rounded text-[11px] flex items-center gap-1 font-semibold transition-colors duration-300 ${
                  publishState === "saved"
                    ? "bg-emerald-600 text-white"
                    : publishState === "highlight"
                    ? "bg-slate-700 text-white ring-2 ring-offset-1 ring-slate-400"
                    : "bg-slate-900 text-white"
                }`}
              >
                {publishState === "saved" ? (
                  <>
                    <Check className="w-3 h-3" />
                    Published
                  </>
                ) : (
                  "Publish"
                )}
              </motion.div>
            </div>
          </div>

          {/* Three-column body */}
          <div className="flex h-[420px] sm:h-[480px]">

            {/* Left: Section Palette */}
            <div className="w-48 border-r border-slate-100 bg-slate-50/60 flex-col shrink-0 hidden sm:flex">
              <div className="px-4 pt-4 pb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Sections
                </p>
              </div>
              <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
                {palette.map((item) => {
                  const isLifting = phase === "lift" && item.type === "skills";
                  const isFlying  = phase === "fly"  && item.type === "skills";
                  const isDropped = isSkillsDropped && item.type === "skills";
                  return (
                    <motion.div
                      key={item.type}
                      animate={
                        isLifting
                          ? { y: -3, scale: 1.03, boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }
                          : isFlying
                          ? { opacity: 0.35, scale: 0.95 }
                          : { y: 0, scale: 1, boxShadow: "none", opacity: 1 }
                      }
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-colors select-none ${
                        isDropped
                          ? "bg-slate-100 border-slate-200 text-slate-400 cursor-default"
                          : "bg-white border-slate-100 text-slate-700 cursor-grab"
                      }`}
                    >
                      <item.icon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-[11px] font-semibold leading-none">
                        {item.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Center: Canvas */}
            <div className="flex-1 bg-slate-100/70 p-4 sm:p-5 overflow-hidden relative">

              {/* Flying ghost tile */}
              <AnimatePresence>
                {(phase === "fly" || phase === "drop") && (
                  <motion.div
                    key="ghost"
                    initial={{ x: -160, y: 40, opacity: 0, scale: 0.92 }}
                    animate={
                      phase === "fly"
                        ? { x: 0, y: 40, opacity: 0.88, scale: 0.97 }
                        : { x: 0, y: 40, opacity: 0, scale: 1.01 }
                    }
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: phase === "fly" ? 0.65 : 0.25,
                      ease: "easeOut",
                    }}
                    className="absolute top-28 left-4 right-4 z-40 pointer-events-none bg-white border-2 border-blue-400 rounded-lg px-4 py-3 shadow-xl"
                    style={{ maxWidth: "calc(100% - 2rem)" }}
                  >
                    <p className="text-[10px] font-bold text-blue-700 mb-2">
                      Technical Skills
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {["React", "TypeScript", "Node.js"].map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-500 border border-slate-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* White canvas card */}
              <div className="relative h-full bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden px-4 sm:px-5 py-4 flex flex-col gap-3 relative">

                  <CanvasSection
                    selected={selectedBlock === "hero"}
                    label="Hero Section"
                  >
                    <HeroBlock />
                  </CanvasSection>

                  <CanvasSection selected={false} label="About Me">
                    <AboutBlock />
                  </CanvasSection>

                  {/* Drop placeholder */}
                  <AnimatePresence>
                    {showPlaceholder && (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 54 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
                      >
                        <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                          Drop here
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Skills block — reveals after drop */}
                  <AnimatePresence>
                    {showDropped && (
                      <motion.div
                        key="skills-dropped"
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <CanvasSection
                          selected={selectedBlock === "skills"}
                          label="Skills"
                        >
                          <SkillsBlock />
                        </CanvasSection>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* Canvas status bar */}
                <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 flex items-center justify-between shrink-0">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {publishState === "saved"
                      ? "Portfolio published successfully"
                      : selectedBlock === "skills"
                      ? "Skills selected — edit in panel →"
                      : "Hero selected — edit in panel →"}
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-6 h-1.5 rounded-full bg-slate-200" />
                    <div className="w-3 h-1.5 rounded-full bg-slate-300" />
                    <div className="w-2 h-1.5 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Context-aware Content Panel */}
            <div className="w-52 sm:w-56 border-l border-slate-100 bg-white hidden md:flex flex-col shrink-0">
              <div className="px-4 pt-4 pb-3 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  Edit Content
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={selectedBlock}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="text-[11px] font-semibold text-slate-700"
                  >
                    {selectedBlock === "skills" ? "Skills Section" : "Hero Section"}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="flex-1 px-4 py-4 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {selectedBlock === "skills" ? (
                    <motion.div
                      key="skills-panel"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.22 }}
                    >
                      <SkillsPanel />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="hero-panel"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.22 }}
                    >
                      <HeroPanel />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Save button */}
              <div className="border-t border-slate-100 px-4 py-3">
                <div
                  className={`h-7 w-full flex items-center justify-center gap-1.5 rounded-lg text-[11px] font-semibold transition-all duration-300 ${
                    publishState === "saved"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-900 text-white"
                  }`}
                >
                  {publishState === "saved" ? (
                    <>
                      <Check className="w-3 h-3" />
                      Published!
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── helper ──────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
