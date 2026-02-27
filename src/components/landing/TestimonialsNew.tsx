"use client";
import React from "react";
import { motion } from "framer-motion";
import { Target, Pencil, Shield, Sparkles } from "lucide-react";

export default function Testimonials() {
  const principles = [
    { 
      id: 1, 
      icon: Target, 
      title: "Clarity over complexity", 
      description: "A focused editor that removes distractions. Build portfolios without learning code or wrestling with complicated tools." 
    },
    { 
      id: 2, 
      icon: Pencil, 
      title: "Editor-first experience", 
      description: "Real-time visual editing with instant feedback. What you see in the editor is what your visitors see on the web." 
    },
    { 
      id: 3, 
      icon: Shield, 
      title: "Academically honest", 
      description: "Designed as a final-year project with production-grade attention to detail. No false claims, no inflated metrics." 
    },
    { 
      id: 4, 
      icon: Sparkles, 
      title: "Production-ready output", 
      description: "Fully responsive portfolios built with modern web standards. Clean URLs, fast loading, and mobile-optimized." 
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-white via-gray-50/40 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 leading-tight"
          >
            Built with real-world needs in mind
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600/90 leading-[1.7]"
          >
            ProFolio was created to solve a simple problem: building a portfolio shouldn&apos;t require coding skills or design expertise. This tool prioritizes simplicity, honesty, and quality.
          </motion.p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <motion.div 
                key={principle.id}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="h-full p-7 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-md flex items-center justify-center mb-5 transition-shadow duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug">{principle.title}</h3>
                  <p className="text-sm text-gray-600/90 leading-relaxed">{principle.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}