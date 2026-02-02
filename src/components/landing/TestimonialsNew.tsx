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
    <section className="py-10 sm:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 lg:mb-10 text-center lg:text-left"
        >
          Trusted by creators worldwide
        </motion.h2>
        <div className="grid gap-5 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border relative"
            >
              <div className="text-3xl sm:text-4xl text-blue-500 mb-2">"</div>
              <p className="text-sm sm:text-base text-gray-700 mb-4 italic leading-relaxed">{item.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                  {item.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-semibold truncate">{item.name}</div>
                  <div className="text-xs sm:text-sm text-gray-500 truncate">{item.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}