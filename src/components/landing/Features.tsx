"use client";
import React from "react";
import { motion } from "framer-motion";
import { Zap, Globe, Palette } from "lucide-react";

const FeatureCard = ({ title, desc, icon: Icon, index }: { title: string; desc: string; icon: React.ElementType; index: number }) => (
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group"
  >
    <div className="h-full p-8 rounded-2xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-md flex items-center justify-center mb-6 transition-shadow duration-300">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900 leading-snug">{title}</h3>
      <p className="text-gray-600/90 leading-relaxed text-[15px]">{desc}</p>
    </div>
  </motion.div>
);

export default function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-gradient-to-b from-white via-slate-50/60 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight"
          >
            Built for professionals
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600/90 leading-relaxed"
          >
            Create and publish portfolios with a visual editor
          </motion.p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <FeatureCard
            title="Visual editor"
            desc="Drag, drop, and customize sections with an intuitive interface. See changes update in real-time."
            icon={Palette}
            index={0}
          />
          <FeatureCard
            title="Instant publishing"
            desc="Publish your portfolio with a custom URL. Share your work without managing deployment."
            icon={Globe}
            index={1}
          />
          <FeatureCard
            title="Ready-made templates"
            desc="Start with pre-designed templates for common portfolio layouts. Customize to match your needs."
            icon={Zap}
            index={2}
          />
        </div>
      </div>
    </section>
  );
}