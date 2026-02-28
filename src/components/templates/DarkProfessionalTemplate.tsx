"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, ExternalLink, Terminal, Code2, Database, Server, Cpu, Zap } from 'lucide-react';
import type { TemplateData, ProjectsData, Project } from '@/types/portfolio';

interface DarkProfessionalTemplateProps {
  data?: TemplateData;
  isPreview?: boolean;
}

export function DarkProfessionalTemplate({ data }: DarkProfessionalTemplateProps) {
  const heroData = data?.hero || {
    fullName: "Jordan Smith",
    title: "Senior Software Engineer",
    bio: "Building scalable systems and leading development teams. Passionate about clean code, system architecture, and emerging technologies. 8+ years of experience in enterprise software development.",
    profileImage: "",
    location: "Seattle, WA",
    socialLinks: [
      { platform: "github", url: "https://github.com/jordansmith" },
      { platform: "linkedin", url: "https://linkedin.com/in/jordansmith" },
      { platform: "email", url: "mailto:jordan@example.com" }
    ]
  };

  const aboutData = data?.about || {
    heading: "About",
    content: "I'm a senior software engineer with a passion for building robust, scalable systems. My expertise spans full-stack development, cloud architecture, and team leadership. I believe in writing clean, maintainable code and fostering collaborative development environments.",
    highlights: [
      "8+ years in software development",
      "Led teams of 5-15 engineers",
      "Architected systems serving millions of users",
      "Open source contributor with 500+ GitHub stars"
    ]
  };

  const skillsData = data?.skills || {
    heading: "Technical Expertise",
    skillCategories: {
      technical: [
        { name: "JavaScript/TypeScript", level: 95 },
        { name: "Python", level: 90 },
        { name: "Go", level: 85 },
        { name: "React/Next.js", level: 95 },
        { name: "Node.js", level: 90 },
        { name: "PostgreSQL", level: 88 }
      ],
      tools: [
        { name: "Docker/Kubernetes", level: 92 },
        { name: "AWS/GCP", level: 88 },
        { name: "Redis", level: 85 },
        { name: "GraphQL", level: 82 }
      ]
    }
  };

  const projectsData: ProjectsData = data?.projects || {
    heading: "Projects",
    categories: [],
    projects: [
      {
        id: "1",
        title: "Microservices Platform",
        description: "Scalable microservices architecture serving 10M+ requests/day",
        technologies: ["Go", "Docker", "Kubernetes", "PostgreSQL"],
        images: [],
        links: {
          github: "https://github.com/jordansmith/microservices"
        },
        featured: true,
        category: "Backend",
        status: "completed" as const
      },
      {
        id: "2",
        title: "Real-time Analytics Engine",
        description: "High-performance analytics system with real-time data processing",
        technologies: ["Python", "Apache Kafka", "ClickHouse", "React"],
        images: [],
        links: {
          github: "https://github.com/jordansmith/analytics"
        },
        featured: true,
        category: "Data",
        status: "completed" as const
      },
      {
        id: "3",
        title: "Developer Tools Suite",
        description: "CLI tools and libraries to improve developer productivity",
        technologies: ["TypeScript", "Node.js", "CLI", "NPM"],
        images: [],
        links: {
          github: "https://github.com/jordansmith/devtools"
        },
        featured: true,
        category: "Tools",
        status: "completed" as const
      }
    ] as Project[]
  };

  const contactData = data?.contact || {
    heading: "Contact",
    email: "jordan@example.com",
    location: "Seattle, WA",
    availability: "Open to new opportunities"
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-mono overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-slate-900 opacity-90" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0)`,
          backgroundSize: '30px 30px'
        }}></div>

        {/* Animated Code Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-blue-400/20 text-xs font-mono whitespace-nowrap"
              animate={{
                x: [-200, typeof window !== 'undefined' ? window.innerWidth : 1200],
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                top: `${10 + i * 12}%`,
              }}
            >
              {i % 4 === 0 && "const buildApp = async () => { return await deploy(); }"}
              {i % 4 === 1 && "function optimizePerformance() { /* magic happens */ }"}
              {i % 4 === 2 && "git commit -m 'feat: implement new architecture'"}
              {i % 4 === 3 && "docker run --rm -p 8080:8080 awesome-app:latest"}
            </motion.div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            {/* Terminal Window */}
            <div className="bg-slate-800 rounded-lg border border-slate-600 shadow-2xl mx-auto max-w-md mb-8">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-600">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-400 text-sm ml-2">~/portfolio</span>
              </div>
              <div className="p-6 text-left">
                <div className="text-green-400 mb-2">
                  <span className="text-slate-400">$</span> whoami
                </div>
                <div className="text-blue-300 mb-2">{heroData.fullName}</div>
                <div className="text-green-400 mb-2">
                  <span className="text-slate-400">$</span> cat role.txt
                </div>
                <div className="text-blue-300 mb-2">{heroData.title}</div>
                <div className="text-green-400">
                  <span className="text-slate-400">$</span> <span className="animate-pulse">_</span>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              {heroData.fullName}
            </h1>
            <h2 className="text-xl md:text-2xl text-slate-300 mb-8 font-light">
              {heroData.title}
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              {heroData.bio}
            </p>
            <div className="flex items-center justify-center gap-2 text-slate-400 mb-8">
              <MapPin className="w-5 h-5" />
              <span>{heroData.location}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center gap-6"
          >
            {(heroData.socialLinks || []).map((link: { platform: string; url: string }, index: number) => (
              <motion.a
                key={index}
                href={link.url}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-slate-800 border border-slate-600 rounded-lg hover:border-blue-500/50 hover:bg-slate-700 transition-all duration-300"
              >
                {link.platform === 'github' && <Github className="w-6 h-6 text-slate-300" />}
                {link.platform === 'linkedin' && <Linkedin className="w-6 h-6 text-blue-400" />}
                {link.platform === 'email' && <Mail className="w-6 h-6 text-emerald-400" />}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-12">
              <Terminal className="w-8 h-8 text-blue-400" />
              <h2 className="text-4xl font-bold">{aboutData.heading}</h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-2">
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  {aboutData.content}
                </p>

                <div className="grid gap-4">
                  {(aboutData.highlights || []).map((highlight: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-slate-800/80 border border-slate-700 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-slate-300">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Code2 className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-semibold">Current Focus</h3>
                </div>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    Distributed Systems
                  </li>
                  <li className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    Cloud Architecture
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    Performance Optimization
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-12">
              <Database className="w-8 h-8 text-emerald-400" />
              <h2 className="text-4xl font-bold">{skillsData.heading}</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Programming Languages & Frameworks */}
              <div>
                <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                  <Code2 className="w-6 h-6 text-blue-400" />
                  Languages & Frameworks
                </h3>
                <div className="space-y-6">
                  {(skillsData.skillCategories?.technical || []).map((skill: { name: string; level: number }, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-slate-200">{skill.name}</span>
                        <span className="text-sm text-blue-400 font-mono">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tools & Infrastructure */}
              <div>
                <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                  <Server className="w-6 h-6 text-emerald-400" />
                  Tools & Infrastructure
                </h3>
                <div className="space-y-6">
                  {(skillsData.skillCategories?.tools || []).map((skill: { name: string; level: number }, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-slate-200">{skill.name}</span>
                        <span className="text-sm text-emerald-400 font-mono">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-12">
              <Terminal className="w-8 h-8 text-blue-400" />
              <h2 className="text-4xl font-bold">{projectsData.heading}</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(projectsData.projects || []).map((project: Project, index: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-blue-500/50 transition-all duration-300 group"
                >
                  <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 group-hover:from-blue-500/20 group-hover:to-emerald-500/20 transition-all duration-500"></div>
                    <Terminal className="w-16 h-16 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-slate-100 group-hover:text-blue-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 mb-4 leading-relaxed text-sm">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {(project.technologies || []).map((tech: string, techIndex: number) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-slate-700 border border-slate-600 text-slate-300 rounded text-xs font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 text-slate-300 rounded hover:bg-slate-600 hover:border-blue-500/50 transition-all duration-300 text-sm"
                        >
                          <Github className="w-4 h-4" />
                          Code
                        </a>
                      )}
                      {project.links.live && (
                        <a
                          href={project.links.live}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Terminal className="w-8 h-8 text-emerald-400" />
                <h2 className="text-4xl font-bold">{contactData.heading}</h2>
              </div>

              <p className="text-xl text-slate-300 mb-8">{contactData.availability}</p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail className="w-5 h-5" />
                  <span className="font-mono">{contactData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <MapPin className="w-5 h-5" />
                  <span>{contactData.location}</span>
                </div>
              </div>

              <motion.a
                href={`mailto:${contactData.email}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-emerald-500 transition-all duration-300"
              >
                <Mail className="w-6 h-6" />
                Get In Touch
              </motion.a>
            </div>

            {/* Terminal Footer */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-left max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-green-400 text-sm">
                <span className="text-slate-400">$</span> echo &quot;Thanks for visiting!&quot;
              </div>
              <div className="text-blue-300 text-sm mb-1">Thanks for visiting!</div>
              <div className="text-green-400 text-sm">
                <span className="text-slate-400">$</span> <span className="animate-pulse">_</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}