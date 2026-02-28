"use client";

import React, { useState } from 'react';
import HeroSection from '@/components/portfolio/sections/HeroSection';
import AboutSection from '@/components/portfolio/sections/AboutSection';
import SkillsSection from '@/components/portfolio/sections/SkillsSection';
import ProjectsSection from '@/components/portfolio/sections/ProjectsSection';
import ContactSection from '@/components/portfolio/sections/ContactSection';
import TemplateGallery from '@/components/portfolio/TemplateGallery';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  HeroData,
  AboutData,
  SkillsData,
  ProjectsData,
  ContactData,
  SectionStyling,
  PortfolioTemplate
} from '@/types/portfolio';

export default function TestPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplate | null>(null);

  // Sample styling configuration
  const defaultStyling: SectionStyling = {
    backgroundColor: 'transparent',
    textColor: 'inherit',
    padding: {
      top: '3rem',
      right: '2rem',
      bottom: '3rem',
      left: '2rem'
    },
    margin: {
      top: '0',
      bottom: '2rem'
    },
    alignment: 'left',
    layout: 'default',
    animation: {
      type: 'slide',
      duration: 600,
      delay: 200
    }
  };

  // Sample Hero Data
  const sampleHeroData: HeroData = {
    fullName: 'John Doe',
    title: 'Full Stack Developer',
    bio: 'I create beautiful, responsive web applications using modern technologies. Passionate about clean code and exceptional user experiences.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    backgroundImage: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200&h=800&fit=crop',
    socialLinks: [
      { platform: 'github', url: 'https://github.com/johndoe', username: 'johndoe' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/johndoe', username: 'johndoe' },
      { platform: 'twitter', url: 'https://twitter.com/johndoe', username: '@johndoe' },
      { platform: 'email', url: 'mailto:john@example.com', username: 'john@example.com' }
    ],
    contactEmail: 'john@example.com',
    location: 'San Francisco, CA'
  };

  // Sample About Data
  const sampleAboutData: AboutData = {
    heading: 'About Me',
    content: 'I\'m a passionate full-stack developer with over 5 years of experience building web applications. I love turning complex problems into simple, beautiful, and intuitive solutions. When I\'m not coding, you can find me exploring new technologies, contributing to open source, or enjoying a good cup of coffee.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face',
    highlights: [
      '5+ years of professional development experience',
      'Expert in React, Node.js, and TypeScript',
      'Strong focus on user experience and performance',
      'Active contributor to open source projects'
    ],
    personalInfo: {
      age: 28,
      location: 'San Francisco, CA',
      languages: ['English', 'Spanish', 'Portuguese'],
      interests: ['Photography', 'Traveling', 'Rock Climbing', 'Coffee']
    }
  };

  // Sample Skills Data
  const sampleSkillsData: SkillsData = {
    heading: 'Skills & Expertise',
    skills: [
      { name: 'JavaScript', level: 95, category: 'technical', icon: 'js' },
      { name: 'TypeScript', level: 90, category: 'technical', icon: 'ts' },
      { name: 'React', level: 92, category: 'technical', icon: 'react' },
      { name: 'Node.js', level: 88, category: 'technical', icon: 'node' }
    ],
    skillCategories: {
      technical: [
        { name: 'JavaScript', level: 95, category: 'technical', icon: 'js' },
        { name: 'TypeScript', level: 90, category: 'technical', icon: 'ts' },
        { name: 'React', level: 92, category: 'technical', icon: 'react' },
        { name: 'Node.js', level: 88, category: 'technical', icon: 'node' },
        { name: 'Python', level: 85, category: 'technical', icon: 'python' },
        { name: 'PostgreSQL', level: 82, category: 'technical', icon: 'postgres' }
      ],
      soft: [
        { name: 'Leadership', level: 88, category: 'soft' },
        { name: 'Communication', level: 92, category: 'soft' },
        { name: 'Problem Solving', level: 95, category: 'soft' },
        { name: 'Teamwork', level: 90, category: 'soft' }
      ],
      languages: [
        { name: 'English', level: 100, category: 'language' },
        { name: 'Spanish', level: 85, category: 'language' },
        { name: 'Portuguese', level: 70, category: 'language' }
      ],
      tools: [
        { name: 'VS Code', level: 95, category: 'tool' },
        { name: 'Git', level: 90, category: 'tool' },
        { name: 'Docker', level: 85, category: 'tool' },
        { name: 'AWS', level: 80, category: 'tool' },
        { name: 'Figma', level: 75, category: 'tool' }
      ]
    }
  };

  // Sample Projects Data
  const sampleProjectsData: ProjectsData = {
    heading: 'Featured Projects',
    projects: [
      {
        id: '1',
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce solution with React, Node.js, and PostgreSQL',
        longDescription: 'Built a comprehensive e-commerce platform featuring user authentication, product catalog, shopping cart, payment processing, and admin dashboard. Implemented real-time inventory management and order tracking.',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
        images: ['https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop'],
        links: {
          live: 'https://demo-ecommerce.example.com',
          github: 'https://github.com/johndoe/ecommerce-platform',
          documentation: 'https://johndoe.dev/case-study/ecommerce'
        },
        startDate: '2024-01',
        endDate: '2024-06',
        status: 'completed',
        featured: true,
        category: 'web',
        role: 'Full Stack Developer'
      },
      {
        id: '2',
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates',
        longDescription: 'Developed a real-time task management application with team collaboration features, drag-and-drop interface, and comprehensive reporting dashboard.',
        technologies: ['Next.js', 'Socket.io', 'MongoDB', 'Tailwind CSS'],
        images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop'],
        links: {
          live: 'https://taskify-demo.example.com',
          github: 'https://github.com/johndoe/taskify'
        },
        startDate: '2024-07',
        endDate: '2024-09',
        status: 'completed',
        featured: true,
        category: 'web',
        role: 'Lead Developer'
      },
      {
        id: '3',
        title: 'Mobile Fitness App',
        description: 'React Native fitness tracking app with workout plans and progress tracking',
        longDescription: 'Created a comprehensive fitness application with workout planning, progress tracking, social features, and integration with health APIs.',
        technologies: ['React Native', 'Firebase', 'Redux', 'Expo'],
        images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'],
        links: {
          github: 'https://github.com/johndoe/fitness-app'
        },
        startDate: '2024-03',
        endDate: '2024-05',
        status: 'completed',
        featured: false,
        category: 'mobile',
        role: 'Mobile Developer'
      }
    ],
    categories: ['web', 'mobile', 'desktop']
  };

  // Sample Contact Data
  const sampleContactData: ContactData = {
    heading: 'Get In Touch',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    availability: 'Available for freelance work',
    socialLinks: [
      { platform: 'github', url: 'https://github.com/johndoe', username: 'johndoe' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/johndoe', username: 'johndoe' },
      { platform: 'twitter', url: 'https://twitter.com/johndoe', username: '@johndoe' },
      { platform: 'website', url: 'https://johndoe.dev', username: 'johndoe.dev' }
    ],
    contactForm: {
      enabled: true,
      fields: [
        { name: 'name', type: 'text', label: 'Name', required: true, placeholder: 'Your name' },
        { name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'your.email@example.com' },
        { name: 'subject', type: 'text', label: 'Subject', required: false, placeholder: 'What\'s this about?' },
        { name: 'message', type: 'textarea', label: 'Message', required: true, placeholder: 'Tell me about your project...' }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Portfolio Components Test</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Test all portfolio section components and template gallery functionality
          </p>
        </div>

        <Tabs defaultValue="sections" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sections">Section Components</TabsTrigger>
            <TabsTrigger value="templates">Template Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="sections" className="space-y-8">

            {/* Hero Section Test */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <HeroSection
                  data={sampleHeroData}
                  styling={defaultStyling}
                  isEditing={false}
                />
              </CardContent>
            </Card>

            {/* About Section Test */}
            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <AboutSection
                  data={sampleAboutData}
                  styling={defaultStyling}
                  isEditing={false}
                />
              </CardContent>
            </Card>

            {/* Skills Section Test */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Section</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <SkillsSection
                  data={sampleSkillsData}
                  styling={defaultStyling}
                  isEditing={false}
                />
              </CardContent>
            </Card>

            {/* Projects Section Test */}
            <Card>
              <CardHeader>
                <CardTitle>Projects Section</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ProjectsSection
                  data={sampleProjectsData}
                  styling={{ ...defaultStyling, layout: 'grid' }}
                  isEditing={false}
                />
              </CardContent>
            </Card>

            {/* Contact Section Test */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Section</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ContactSection
                  data={sampleContactData}
                  styling={defaultStyling}
                  isEditing={false}
                />
              </CardContent>
            </Card>

            {/* Edit Mode Test */}
            <Card>
              <CardHeader>
                <CardTitle>Edit Mode Test</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Components with editing overlays enabled
                </p>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <HeroSection
                  data={sampleHeroData}
                  styling={defaultStyling}
                  isEditing={true}
                  onEdit={() => alert('Hero section clicked for editing!')}
                />
                <AboutSection
                  data={sampleAboutData}
                  styling={defaultStyling}
                  isEditing={true}
                  onEdit={() => alert('About section clicked for editing!')}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Template Gallery</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Browse and select portfolio templates
                </p>
              </CardHeader>
              <CardContent>
                <TemplateGallery
                  onTemplateSelect={(template) => {
                    setSelectedTemplate(template);
                    alert(`Selected template: ${template.name}`);
                  }}
                  selectedTemplateId={selectedTemplate?.id}
                />
              </CardContent>
            </Card>

            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle>Selected Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">{selectedTemplate.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {selectedTemplate.description}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div><strong>Category:</strong> {selectedTemplate.category}</div>
                        <div><strong>Difficulty:</strong> {selectedTemplate.difficulty}</div>
                        <div><strong>Estimated Time:</strong> {selectedTemplate.estimatedTime}</div>
                        <div><strong>Premium:</strong> {selectedTemplate.isPremium ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Features:</h4>
                      <ul className="text-sm space-y-1">
                        {selectedTemplate.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}