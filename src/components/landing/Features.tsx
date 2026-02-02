"use client";
import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ title, desc, icon, index }: { title: string; desc: string; icon: string; index: number }) => (
  <motion.div 
    initial={{ y: 30, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-white p-5 sm:p-6 lg:p-7 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
  >
    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{icon}</div>
    <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{desc}</p>
  </motion.div>
);

export default function Features() {
  return (
    <section id="features" className="py-10 sm:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 lg:mb-10 text-center lg:text-left">What you can do with Profolio</h2>
        <div className="grid gap-5 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard 
            title="Drag & Drop Editor" 
            desc="Visually build pages using an intuitive canvas. Add About, Projects, Skills, and more." 
            icon="🎨"
            index={0}
          />
          <FeatureCard 
            title="Resume → Portfolio" 
            desc="Upload your resume and automatically generate About & Experience sections." 
            icon="📄"
            index={1}
          />
          <FeatureCard 
            title="One-click Deploy" 
            desc="Deploy instantly to Vercel/Netlify or download code for self-hosting." 
            icon="🚀"
            index={2}
          />
        </div>
      </div>
    </section>
  );
}