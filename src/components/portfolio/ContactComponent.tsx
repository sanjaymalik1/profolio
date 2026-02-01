"use client";
import React from "react";

interface ContactComponentProps {
  data?: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export default function ContactComponent({ data }: ContactComponentProps) {
  const defaultData = {
    email: data?.email || "john.doe@email.com",
    phone: data?.phone || "+1 (555) 123-4567",
    location: data?.location || "San Francisco, CA",
    linkedin: data?.linkedin || "https://linkedin.com/in/johndoe",
    github: data?.github || "https://github.com/johndoe",
    website: data?.website || "https://johndoe.dev"
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs">@</span>
            </div>
            <span className="text-gray-700">{defaultData.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xs">📞</span>
            </div>
            <span className="text-gray-700">{defaultData.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-xs">📍</span>
            </div>
            <span className="text-gray-700">{defaultData.location}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs">in</span>
            </div>
            <a href={defaultData.linkedin} className="text-blue-600 hover:underline">LinkedIn</a>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs">🔗</span>
            </div>
            <a href={defaultData.github} className="text-blue-600 hover:underline">GitHub</a>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xs">🌐</span>
            </div>
            <a href={defaultData.website} className="text-blue-600 hover:underline">Website</a>
          </div>
        </div>
      </div>
    </section>
  );
}
