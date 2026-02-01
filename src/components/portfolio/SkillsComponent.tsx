"use client";
import React from "react";

interface SkillsComponentProps {
  data?: {
    skills?: { name: string; level: number }[];
  };
}

export default function SkillsComponent({ data }: SkillsComponentProps) {
  const defaultSkills = data?.skills || [
    { name: "JavaScript", level: 90 },
    { name: "React", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "TypeScript", level: 75 },
    { name: "Python", level: 70 },
    { name: "SQL", level: 65 }
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Skills</h2>
      <div className="space-y-4">
        {defaultSkills.map((skill, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{skill.name}</span>
              <span className="text-sm text-gray-500">{skill.level}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
