"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProjectsData, SectionStyling } from '@/types/portfolio';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Calendar, User, Star } from 'lucide-react';

interface ProjectsSectionProps {
  data: ProjectsData;
  styling: SectionStyling;
  isEditing?: boolean;
  onEdit?: () => void;
}

export default function ProjectsSection({ data, styling, isEditing = false, onEdit }: ProjectsSectionProps) {
  const animationVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: (styling.animation?.duration || 600) / 1000,
        delay: (styling.animation?.delay || 200) / 1000,
        ease: "easeOut" as const
      }
    }
  };

  const containerStyle = {
    backgroundColor: styling.backgroundColor || 'transparent',
    color: styling.textColor || 'inherit',
    padding: `${styling.padding?.top || '3rem'} ${styling.padding?.right || '2rem'} ${styling.padding?.bottom || '3rem'} ${styling.padding?.left || '2rem'}`,
    margin: `${styling.margin?.top || '0'} 0 ${styling.margin?.bottom || '0'} 0`,
    textAlign: styling.alignment || 'left'
  } as React.CSSProperties;

  const isGridLayout = styling.layout === 'grid';
  const isMasonryLayout = styling.layout === 'masonry';

  return (
    <motion.section 
      className="relative py-16"
      style={containerStyle}
      initial={styling.animation?.type !== 'none' ? "hidden" : "visible"}
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={animationVariants}
      onClick={isEditing ? onEdit : undefined}
    >
      {/* Edit Overlay */}
      {isEditing && (
        <div className="absolute inset-0 bg-purple-500/10 border-2 border-purple-500 border-dashed rounded-lg flex items-center justify-center z-10">
          <Badge variant="secondary" className="bg-purple-500 text-white">
            Click to edit Projects section
          </Badge>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 relative z-0">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {data.heading || 'Featured Projects'}
          </h2>
          <p className="text-lg text-current/70 max-w-2xl mx-auto mb-6">
            A showcase of my recent work and contributions
          </p>
          <div className="w-20 h-1 bg-current mx-auto opacity-50 rounded-full" />
        </motion.div>

        {/* Projects Grid */}
        <div className={`
          grid gap-8
          ${isGridLayout ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}
          ${isMasonryLayout ? 'md:grid-cols-2 lg:grid-cols-3' : ''}
        `}>
          {data.projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: 0.2 + index * 0.1, 
                duration: 0.6,
                ease: "easeOut"
              }}
              whileHover={{ y: -5 }}
              className={`group ${isMasonryLayout ? 'break-inside-avoid' : ''}`}
            >
              <Card className="border-2 hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
                
                {/* Project Image */}
                {project.images && project.images.length > 0 && (
                  <div className="relative overflow-hidden aspect-video">
                    <Image
                      src={project.images[0]}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {project.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 text-white">
                          <Star size={14} className="mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                <CardContent className="p-6">
                  {/* Project Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      {project.status && (
                        <Badge 
                          variant={project.status === 'completed' ? 'secondary' : 'outline'}
                          className="ml-2"
                        >
                          {project.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-current/70 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Details */}
                  <div className="flex items-center gap-4 text-sm text-current/60 mb-6">
                    {project.startDate && (
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{project.startDate}</span>
                      </div>
                    )}
                    {project.role && (
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{project.role}</span>
                      </div>
                    )}
                    {project.category && (
                      <Badge variant="secondary" className="text-xs">
                        {project.category}
                      </Badge>
                    )}
                  </div>

                  {/* Long Description */}
                  {project.longDescription && (
                    <div className="mb-6">
                      <p className="text-sm text-current/70 leading-relaxed">
                        {project.longDescription.substring(0, 150)}...
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-auto">
                    {project.links.live && (
                      <Button 
                        asChild 
                        size="sm" 
                        className="flex-1"
                      >
                        <Link 
                          href={project.links.live} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink size={16} className="mr-2" />
                          Live Demo
                        </Link>
                      </Button>
                    )}
                    {project.links.github && (
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                      >
                        <Link 
                          href={project.links.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Github size={16} className="mr-2" />
                          Code
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Projects CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/projects">
              View All Projects
              <ExternalLink size={18} className="ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Projects */}
            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-current mb-2">
                  {data.projects.length}
                </div>
                <div className="text-sm text-current/60">Total Projects</div>
              </CardContent>
            </Card>

            {/* Completed Projects */}
            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {data.projects.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-sm text-current/60">Completed</div>
              </CardContent>
            </Card>

            {/* Featured Projects */}
            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {data.projects.filter(p => p.featured).length}
                </div>
                <div className="text-sm text-current/60">Featured</div>
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {new Set(data.projects.flatMap(p => p.technologies || [])).size}
                </div>
                <div className="text-sm text-current/60">Technologies</div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}