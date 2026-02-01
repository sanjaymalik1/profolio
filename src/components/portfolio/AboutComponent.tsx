"use client";
import React from "react";

interface AboutComponentProps {
  data?: {
    name?: string;
    title?: string;
    description?: string;
    image?: string;
  };
}

export default function AboutComponent({ data }: AboutComponentProps) {
  const defaultData = {
    name: data?.name || "John Doe",
    title: data?.title || "Full Stack Developer",
    description: data?.description || "Passionate developer with 5+ years of experience building web applications using modern technologies.",
    image: data?.image || "/placeholder-avatar.jpg"
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">About Me</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-500">Photo</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{defaultData.name}</h3>
          <p className="text-lg text-blue-600 mb-3">{defaultData.title}</p>
          <p className="text-gray-600 leading-relaxed">{defaultData.description}</p>
        </div>
      </div>
    </section>
  );
}
