"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, ExternalLink, Heart, Coffee, Star, Send } from 'lucide-react';

interface WarmMinimalistTemplateProps {
  data?: {
    hero?: any;
    about?: any;
    skills?: any;
    projects?: any;
    contact?: any;
  };
  isPreview?: boolean;
}

export function WarmMinimalistTemplate({ data, isPreview = false }: WarmMinimalistTemplateProps) {
  const heroData = data?.hero || {
    fullName: "Sarah Martinez",
    title: "Creative Freelancer & Brand Designer",
    bio: "Helping small businesses and startups create authentic brand identities that connect with their audience. Passionate about meaningful design that tells your story.",
    profileImage: "",
    location: "Austin, TX",
    socialLinks: [
      { platform: "github", url: "https://github.com/sarahmartinez" },
      { platform: "linkedin", url: "https://linkedin.com/in/sarahmartinez" },
      { platform: "email", url: "mailto:sarah@example.com" }
    ]
  };

  const aboutData = data?.about || {
    heading: "About Me",
    content: "I'm a passionate creative professional who believes great design should be accessible to everyone. With 6+ years of experience in brand design and digital marketing, I help small businesses and entrepreneurs build authentic connections with their customers through thoughtful, strategic design.",
    highlights: [
      "6+ years in brand & digital design",
      "Worked with 100+ small businesses",
      "Featured in Design Weekly magazine",
      "Certified Google Ads specialist"
    ]
  };

  const skillsData = data?.skills || {
    heading: "What I Do Best",
    skillCategories: {
      technical: [
        { name: "Brand Identity Design", level: 95 },
        { name: "Web Design", level: 90 },
        { name: "Illustration", level: 85 },
        { name: "Photography", level: 80 },
        { name: "Content Strategy", level: 88 }
      ],
      tools: [
        { name: "Adobe Creative Suite", level: 95 },
        { name: "Figma", level: 90 },
        { name: "Webflow", level: 85 },
        { name: "Canva", level: 80 }
      ]
    }
  };

  const projectsData = data?.projects || {
    heading: "Recent Work",
    projects: [
      {
        title: "Bloom Coffee Co.",
        description: "Complete brand identity and packaging design for a local organic coffee roaster. Created a warm, approachable brand that reflects their commitment to sustainability.",
        image: "",
        technologies: ["Brand Identity", "Packaging", "Web Design"],
        liveUrl: "",
        githubUrl: "",
        category: "Branding"
      },
      {
        title: "Mindful Yoga Studio",
        description: "Peaceful, zen-inspired brand design and marketing materials for a local yoga studio, including class schedules, social media templates, and signage.",
        image: "",
        technologies: ["Brand Design", "Print Design", "Social Media"],
        liveUrl: "",
        githubUrl: "",
        category: "Wellness"
      },
      {
        title: "TechStart Accelerator",
        description: "Modern, professional brand identity for a startup accelerator program, including pitch deck templates and digital marketing materials.",
        image: "",
        technologies: ["Brand Identity", "Digital Marketing", "Presentation Design"],
        liveUrl: "",
        githubUrl: "",
        category: "Technology"
      }
    ]
  };

  const contactData = data?.contact || {
    heading: "Let's Create Together",
    email: "sarah@example.com",
    phone: "+1 (512) 555-0123",
    location: "Austin, TX"
  };

  return (
    <div className={`min-h-screen bg-amber-50 text-amber-900 ${isPreview ? 'pointer-events-none' : ''}`}>
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="w-32 h-32 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <Heart className="w-12 h-12 text-amber-500" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-amber-700 mb-6 shadow-sm">
                <Coffee className="w-4 h-4" />
                Available for new projects
              </div>
              
              <h1 className="text-4xl md:text-6xl font-light mb-4 text-amber-800">
                Hi, I'm <span className="font-medium text-red-600">{heroData.fullName.split(' ')[0]}</span>
              </h1>
              
              <h2 className="text-xl md:text-2xl text-amber-700 font-light mb-8">
                {heroData.title}
              </h2>
              
              <p className="text-lg text-amber-800 leading-relaxed mb-8 max-w-2xl mx-auto">
                {heroData.bio}
              </p>

              <div className="flex items-center justify-center gap-2 text-amber-600 mb-8">
                <MapPin className="w-5 h-5" />
                <span>{heroData.location}</span>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                {(heroData.socialLinks || []).map((link: any, index: number) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {link.platform === 'github' && <Github className="w-5 h-5 text-amber-700" />}
                    {link.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-blue-600" />}
                    {link.platform === 'email' && <Mail className="w-5 h-5 text-red-500" />}
                  </motion.a>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                Let's Work Together
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-amber-300 rounded-full opacity-60"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-red-300 rounded-full opacity-40"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-orange-300 rounded-full opacity-50"></div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-light mb-4 text-amber-800">{aboutData.heading}</h2>
              <div className="w-16 h-1 bg-red-500 mx-auto rounded-full"></div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-lg text-amber-800 leading-relaxed mb-8">
                {aboutData.content}
              </p>

              <div className="space-y-4">
                {(aboutData.highlights || []).map((highlight: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <Star className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-amber-700">{highlight}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <Heart className="w-24 h-24 text-red-400 mx-auto mb-4" />
                  <p className="text-amber-700 font-medium">Passionate about meaningful design</p>
                </div>
              </div>
              {/* Decorative dots */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-400 rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-amber-400 rounded-full opacity-60"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-6 bg-amber-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light mb-4 text-amber-800">{skillsData.heading}</h2>
            <div className="w-16 h-1 bg-red-500 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Creative Skills */}
            <div>
              <h3 className="text-2xl font-light mb-8 text-amber-800">Creative Skills</h3>
              <div className="space-y-6">
                {(skillsData.skillCategories?.technical || []).map((skill: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-amber-800">{skill.name}</span>
                      <span className="text-sm text-amber-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-amber-100 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-red-400 to-amber-400 h-3 rounded-full"
                      ></motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <h3 className="text-2xl font-light mb-8 text-amber-800">Favorite Tools</h3>
              <div className="space-y-6">
                {(skillsData.skillCategories?.tools || []).map((skill: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-amber-800">{skill.name}</span>
                      <span className="text-sm text-amber-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-amber-100 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-amber-400 to-orange-400 h-3 rounded-full"
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
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-light mb-4 text-amber-800">{projectsData.heading}</h2>
            <div className="w-16 h-1 bg-red-500 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {(projectsData.projects || []).map((project: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-amber-50 rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="aspect-video bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center group-hover:from-amber-300 group-hover:to-orange-300 transition-all duration-300">
                  <div className="text-center">
                    <Heart className="w-12 h-12 text-white mx-auto mb-2" />
                    <p className="text-white font-medium">{project.category}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-3 text-amber-800">{project.title}</h3>
                  <p className="text-amber-700 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(project.technologies || []).map((tech: string, techIndex: number) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-white rounded-full text-xs text-amber-700 border border-amber-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-red-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-light mb-8">{contactData.heading}</h2>
            <div className="w-16 h-1 bg-white mx-auto rounded-full mb-12"></div>
            
            <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
              Have a project in mind? I'd love to hear about it! Let's create something beautiful together.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white bg-opacity-10 rounded-2xl p-6">
                <Mail className="w-8 h-8 mx-auto mb-4" />
                <p className="opacity-80 mb-2">Email</p>
                <p className="font-medium">{contactData.email}</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-2xl p-6">
                <MapPin className="w-8 h-8 mx-auto mb-4" />
                <p className="opacity-80 mb-2">Location</p>
                <p className="font-medium">{contactData.location}</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-2xl p-6">
                <Coffee className="w-8 h-8 mx-auto mb-4" />
                <p className="opacity-80 mb-2">Status</p>
                <p className="font-medium">Available</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-red-500 font-medium rounded-full hover:bg-amber-50 transition-all duration-300 inline-flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Start a Project
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}