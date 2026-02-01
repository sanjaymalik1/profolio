"use client";
import React from "react";

export default function Testimonials() {
  const items = [
    { id: 1, name: 'Alex', quote: 'I built my portfolio in 20 minutes and landed an interview!' },
    { id: 2, name: 'Priya', quote: 'Profolio helped me showcase projects professionally.' },
    { id: 3, name: 'Miguel', quote: 'Exporting the code made it easy to customize further.' }
  ];
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">Trusted by creators</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map(i => (
            <div key={i.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-700 mb-4">“{i.quote}”</p>
              <div className="text-sm font-semibold">{i.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}