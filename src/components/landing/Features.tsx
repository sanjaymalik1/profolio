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
    className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
  >
    <div className="text-2xl mb-3">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </motion.div>
);

export default function Features() {
  return (
    <section id="features" className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">What you can do with Profolio</h2>
        <div className="grid gap-6 md:grid-cols-3">
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