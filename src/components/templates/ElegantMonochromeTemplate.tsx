"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, MapPin, Award, Briefcase, User } from 'lucide-react';
import type { TemplateData, Project, ProjectsData } from '@/types/portfolio';

interface ElegantMonochromeTemplateProps {
  data?: TemplateData;
  isPreview?: boolean;
}

export function ElegantMonochromeTemplate({ data, isPreview = false }: ElegantMonochromeTemplateProps) {
  const heroData = data?.hero || {
    fullName: "Victoria Sterling",
    title: "Business Consultant & Strategy Expert",
    bio: "Transforming businesses through strategic consulting and innovative solutions. 10+ years of experience helping companies achieve sustainable growth and operational excellence.",
    profileImage: "",
    location: "London, UK",
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/victoriaserling" },
      { platform: "email", url: "mailto:victoria@example.com" }
    ]
  };

  const aboutData = data?.about || {
    heading: "About Me",
    content: "I am a strategic business consultant with a passion for helping organizations unlock their full potential. My approach combines analytical rigor with creative thinking to deliver measurable results. I specialize in strategic planning, operational optimization, and change management.",
    highlights: [
      "10+ years in business consulting",
      "Managed $50M+ in strategic initiatives",
      "Certified Project Management Professional",
      "MBA from London Business School"
    ]
  };

  const skillsData = data?.skills || {
    heading: "Core Competencies",
    skillCategories: {
      technical: [
        { name: "Strategic Planning", level: 95 },
        { name: "Business Analysis", level: 90 },
        { name: "Project Management", level: 88 },
        { name: "Data Analytics", level: 85 },
        { name: "Financial Modeling", level: 82 }
      ],
      tools: [
        { name: "Microsoft Suite", level: 95 },
        { name: "Tableau", level: 80 },
        { name: "Salesforce", level: 75 },
        { name: "SAP", level: 70 }
      ]
    }
  };

  const projectsData: ProjectsData = data?.projects || {
    heading: "Key Projects",
    categories: ["Strategy", "Growth", "Operations"],
    projects: [
      {
        id: "1",
        title: "Digital Transformation Initiative",
        description: "Led comprehensive digital transformation for Fortune 500 company, resulting in 40% efficiency improvement and $5M annual cost savings.",
        technologies: ["Strategy", "Change Management", "Process Optimization"],
        images: [],
        links: {},
        featured: true,
        category: "Strategy",
        status: "completed" as const
      },
      {
        id: "2",
        title: "Market Expansion Strategy",
        description: "Developed and executed market entry strategy for European expansion, achieving 25% market share within 18 months.",
        technologies: ["Market Research", "Strategic Planning", "Risk Assessment"],
        images: [],
        links: {},
        featured: true,
        category: "Growth",
        status: "completed" as const
      },
      {
        id: "3",
        title: "Operational Excellence Program",
        description: "Designed and implemented operational excellence program across 15 business units, improving productivity by 35%.",
        technologies: ["Lean Six Sigma", "Process Design", "Performance Management"],
        images: [],
        links: {},
        featured: true,
        category: "Operations",
        status: "completed" as const
      }
    ] as Project[]
  };

  const contactData = data?.contact || {
    heading: "Get In Touch",
    email: "victoria@example.com",
    phone: "+44 20 7946 0958",
    location: "London, UK"
  };

  return (
    <div className={`min-h-screen bg-white text-gray-900 ${isPreview ? 'pointer-events-none' : ''}`}>
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600 mb-6">
                Available for Consultation
              </div>

              <h1 className="text-5xl lg:text-6xl font-light mb-6 leading-tight">
                <span className="font-extralight text-gray-500">I&apos;m</span><br />
                <span className="font-medium">{heroData.fullName}</span>
              </h1>

              <h2 className="text-2xl text-gray-600 font-light mb-8">
                {heroData.title}
              </h2>

              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                {heroData.bio}
              </p>

              <div className="flex items-center gap-2 text-gray-500 mb-8">
                <MapPin className="w-5 h-5" />
                <span>{heroData.location}</span>
              </div>

              <div className="flex gap-4">
                {(heroData.socialLinks || []).map((link: { platform: string; url: string }, index: number) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    whileHover={{ scale: 1.05 }}
                    className="p-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    {link.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-gray-600" />}
                    {link.platform === 'email' && <Mail className="w-5 h-5 text-gray-600" />}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="w-80 h-80 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full"></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <User className="w-32 h-32 text-gray-300" />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gray-800 rounded-full"></div>
                <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-gray-400 rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-light mb-8">{aboutData.heading}</h2>
              <div className="w-16 h-px bg-gray-800 mb-8"></div>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {aboutData.content}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-light mb-6">Key Achievements</h3>
              <div className="space-y-4">
                {(aboutData.highlights || []).map((highlight: string, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-gray-800 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-gray-600">{highlight}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light mb-4">{skillsData.heading}</h2>
            <div className="w-16 h-px bg-gray-800 mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Core Skills */}
            <div>
              <h3 className="text-2xl font-light mb-8 flex items-center gap-3">
                <Award className="w-6 h-6 text-gray-600" />
                Core Skills
              </h3>
              <div className="space-y-6">
                {(skillsData.skillCategories?.technical || []).map((skill: { name: string; level: number }, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{skill.name}</span>
                      <span className="text-sm text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gray-800 h-2 rounded-full"
                      ></motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tools & Technologies */}
            <div>
              <h3 className="text-2xl font-light mb-8 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-gray-600" />
                Tools & Platforms
              </h3>
              <div className="space-y-6">
                {(skillsData.skillCategories?.tools || []).map((skill: { name: string; level: number }, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">{skill.name}</span>
                      <span className="text-sm text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gray-600 h-2 rounded-full"
                      ></motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light mb-4">{projectsData.heading}</h2>
            <div className="w-16 h-px bg-gray-800 mx-auto"></div>
          </motion.div>

          <div className="space-y-12">
            {(projectsData.projects || []).map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600 mb-4">
                      {project.category}
                    </div>
                    <h3 className="text-3xl font-light mb-4">{project.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(project.technologies || []).map((tech: string, techIndex: number) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 border border-gray-200 rounded-full text-sm text-gray-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-300">
                      <div className="text-center">
                        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">{project.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-light mb-8">{contactData.heading}</h2>
            <div className="w-16 h-px bg-white mx-auto mb-12"></div>

            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Ready to transform your business? Let&apos;s discuss how we can achieve your strategic objectives together.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <Mail className="w-8 h-8 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-300">Email</p>
                <p className="font-medium">{contactData.email}</p>
              </div>
              <div>
                <MapPin className="w-8 h-8 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-300">Location</p>
                <p className="font-medium">{contactData.location}</p>
              </div>
              <div>
                <Briefcase className="w-8 h-8 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-300">Consultation</p>
                <p className="font-medium">Available</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border border-white text-white font-medium rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              Schedule Consultation
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}