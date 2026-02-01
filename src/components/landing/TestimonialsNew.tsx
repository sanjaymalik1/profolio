"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Testimonials() {
  const items = [
    { id: 1, name: 'Alex Chen', role: 'Frontend Developer', quote: 'I built my portfolio in 20 minutes and landed an interview the next week!' },
    { id: 2, name: 'Priya Patel', role: 'UX Designer', quote: 'Profolio helped me showcase projects professionally with zero coding.' },
    { id: 3, name: 'Miguel Rodriguez', role: 'Full Stack Developer', quote: 'Exporting the code made it easy to customize further and host anywhere.' }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-6"
        >
          Trusted by creators worldwide
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border relative"
            >
              <div className="text-2xl text-blue-500 mb-2">"</div>
              <p className="text-gray-700 mb-4 italic">{item.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {item.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}