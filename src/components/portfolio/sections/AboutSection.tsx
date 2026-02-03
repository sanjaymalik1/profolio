"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AboutData, SectionStyling } from '@/types/portfolio';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, User, Globe, Heart } from 'lucide-react';

interface AboutSectionProps {
  data: AboutData;
  styling: SectionStyling;
  isEditing?: boolean;
  onEdit?: () => void;
}

export default function AboutSection({ data, styling, isEditing = false, onEdit }: AboutSectionProps) {
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

  return (
    <motion.section 
      className="relative py-16"
      style={containerStyle}
      initial={!isEditing && styling.animation?.type !== 'none' ? "hidden" : "visible"}
      whileInView={!isEditing ? "visible" : undefined}
      viewport={!isEditing ? { once: true, margin: "-100px" } : undefined}
      variants={!isEditing ? animationVariants : undefined}
      onClick={isEditing ? onEdit : undefined}
    >
      <div className="max-w-6xl mx-auto px-4 relative z-0">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={!isEditing ? { opacity: 0, y: 20 } : undefined}
          whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
          viewport={!isEditing ? { once: true } : undefined}
          transition={!isEditing ? { delay: 0.1, duration: 0.6 } : undefined}
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {data.heading || 'About Me'}
          </h2>
          <div className="w-20 h-1 bg-current mx-auto opacity-50 rounded-full" />
        </motion.div>

        <div className={`grid gap-12 ${isGridLayout ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} items-center`}>
          
          {/* Profile Image */}
          {data.profileImage && (
            <motion.div 
              className={`${isGridLayout ? 'order-1 lg:order-1' : 'float-left mr-8 mb-4'} ${isGridLayout ? 'justify-self-center' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="relative">
                <div className={`${isGridLayout ? 'w-80 h-80' : 'w-48 h-48'} rounded-2xl overflow-hidden shadow-2xl`}>
                  <Image
                    src={data.profileImage}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-current/10 rounded-full -z-10" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-current/5 rounded-full -z-10" />
              </div>
            </motion.div>
          )}

          {/* Content */}
          <motion.div 
            className={`${isGridLayout ? 'order-2 lg:order-2' : ''} space-y-6`}
            initial={{ opacity: 0, x: isGridLayout ? 30 : 0, y: isGridLayout ? 0 : 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            
            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-current/80">
                {data.content || 'Tell your story here. Share your background, experience, and what drives you.'}
              </p>
            </div>

            {/* Highlights */}
            {data.highlights && data.highlights.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold mb-4">Key Highlights</h3>
                {data.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  >
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                    <span className="text-current/80">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Personal Info Cards */}
        {data.personalInfo && (
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Age & Location */}
              {(data.personalInfo.age || data.personalInfo.location) && (
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <User className="mx-auto mb-4 text-current/60" size={32} />
                    <h4 className="font-semibold mb-2">Personal</h4>
                    <div className="space-y-1 text-sm text-current/70">
                      {data.personalInfo.age && <p>Age: {data.personalInfo.age}</p>}
                      {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Languages */}
              {data.personalInfo.languages && data.personalInfo.languages.length > 0 && (
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Globe className="mx-auto mb-4 text-current/60" size={32} />
                    <h4 className="font-semibold mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {data.personalInfo.languages.map((language, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Interests */}
              {data.personalInfo.interests && data.personalInfo.interests.length > 0 && (
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Heart className="mx-auto mb-4 text-current/60" size={32} />
                    <h4 className="font-semibold mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {data.personalInfo.interests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        )}

        {/* Quote or Call to Action */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <blockquote className="text-xl lg:text-2xl font-light italic text-current/80 max-w-3xl mx-auto">
            "The best way to predict the future is to create it."
          </blockquote>
          <div className="mt-4 w-32 h-0.5 bg-current/30 mx-auto" />
        </motion.div>
      </div>
    </motion.section>
  );
}