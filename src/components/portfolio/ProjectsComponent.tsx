"use client";
import React from "react";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

interface ProjectsComponentProps {
  data?: {
    projects?: Project[];
  };
}

export default function ProjectsComponent({ data }: ProjectsComponentProps) {
  const defaultProjects = data?.projects || [
    {
      title: "E-commerce Platform",
      description: "A full-stack e-commerce solution built with React and Node.js, featuring user authentication, payment processing, and admin dashboard.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "https://example.com",
      github: "https://github.com/example"
    },
    {
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Socket.io"],
      link: "https://example.com",
      github: "https://github.com/example"
    },
    {
      title: "Weather Dashboard",
      description: "A responsive weather application that provides current conditions and forecasts with interactive maps and data visualization.",
      technologies: ["React", "Chart.js", "Weather API", "Tailwind CSS"],
      link: "https://example.com",
      github: "https://github.com/example"
    }
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Projects</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {defaultProjects.map((project, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.technologies.map((tech, techIndex) => (
                <span 
                  key={techIndex}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              {project.link && (
                <a href={project.link} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Live Demo
                </a>
              )}
              {project.github && (
                <a href={project.github} className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  GitHub
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
