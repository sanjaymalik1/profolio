"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeroData, SectionStyling } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink } from 'lucide-react';
import { EditableText } from '@/components/editor/inline/EditableText';
import { EditableImage } from '@/components/editor/inline/EditableImage';

interface HeroSectionProps {
  data: HeroData;
  styling: SectionStyling;
  isEditing?: boolean;
  isPublicView?: boolean;
  onEdit?: () => void;
  onDataChange?: (newData: Partial<HeroData>) => void;
  onStylingChange?: (newStyling: Partial<SectionStyling>) => void;
}

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  email: Mail,
  website: ExternalLink
} as const;

export default function HeroSection({ 
  data, 
  styling, 
  isEditing = false, 
  isPublicView = false, 
  onEdit,
  onDataChange,
  onStylingChange 
}: HeroSectionProps) {
  // Determine if inline editing is active
  const inlineEditMode = isEditing && !isPublicView && !!onDataChange;


  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: (styling.animation?.duration || 800) / 1000,
        delay: (styling.animation?.delay || 0) / 1000,
        ease: "easeOut" as const
      }
    }
  };

  const containerStyle = {
    backgroundColor: styling.backgroundColor || 'transparent',
    color: styling.textColor || 'inherit',
    padding: `${styling.padding?.top || '4rem'} ${styling.padding?.right || '2rem'} ${styling.padding?.bottom || '4rem'} ${styling.padding?.left || '2rem'}`,
    margin: `${styling.margin?.top || '0'} 0 ${styling.margin?.bottom || '0'} 0`,
    textAlign: styling.alignment || 'center'
  } as React.CSSProperties;

  return (
    <motion.section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={containerStyle}
      initial={!isEditing && styling.animation?.type !== 'none' ? "hidden" : "visible"}
      animate={!isEditing ? "visible" : undefined}
      variants={!isEditing ? animationVariants : undefined}
      onClick={isEditing ? onEdit : undefined}
    >
      {/* Background Image */}
      {data.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={data.backgroundImage}
            alt="Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Profile Image */}
          {(data.profileImage || inlineEditMode) && (
            <motion.div 
              className="flex-shrink-0"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {inlineEditMode ? (
                <EditableImage
                  value={data.profileImage || ''}
                  onChange={(url) => onDataChange?.({ profileImage: url })}
                  alt={data.fullName}
                  containerClassName="w-48 h-48 lg:w-64 lg:h-64"
                  className="rounded-full border-4 border-white shadow-2xl"
                  aspectRatio="square"
                />
              ) : (
                <div className="relative">
                  <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                    <Image
                      src={data.profileImage!}
                      alt={data.fullName}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute -inset-4 rounded-full border-2 border-current opacity-20 animate-pulse" />
                </div>
              )}
            </motion.div>
          )}

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            
            {/* Name */}
            <motion.h1 
              className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-current to-current/70 bg-clip-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {inlineEditMode ? (
                <EditableText
                  value={data.fullName || ''}
                  onChange={(value) => onDataChange?.({ fullName: value })}
                  placeholder="Your Name"
                  className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2"
                  as="span"
                />
              ) : (
                data.fullName || 'Your Name'
              )}
            </motion.h1>

            {/* Title */}
            <motion.h2 
              className="text-xl lg:text-3xl font-medium mb-2 text-current/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {inlineEditMode ? (
                <EditableText
                  value={data.title || ''}
                  onChange={(value) => onDataChange?.({ title: value })}
                  placeholder="Your Professional Title"
                  className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2"
                  as="span"
                />
              ) : (
                data.title || 'Your Professional Title'
              )}
            </motion.h2>

            {/* Subtitle */}
            {(data.subtitle || inlineEditMode) && (
              <motion.p 
                className="text-lg lg:text-xl mb-6 text-current/70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {inlineEditMode ? (
                  <EditableText
                    value={data.subtitle || ''}
                    onChange={(value) => onDataChange?.({ subtitle: value })}
                    placeholder="Optional subtitle"
                    className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2"
                    as="span"
                  />
                ) : (
                  data.subtitle
                )}
              </motion.p>
            )}

            {/* Bio */}
            <motion.p 
              className="text-base lg:text-lg mb-8 text-current/80 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {inlineEditMode ? (
                <EditableText
                  value={data.bio || ''}
                  onChange={(value) => onDataChange?.({ bio: value })}
                  placeholder="Brief introduction about yourself and what you do."
                  className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2"
                  as="span"
                  multiline
                />
              ) : (
                data.bio || 'Brief introduction about yourself and what you do.'
              )}
            </motion.p>

            {/* Location & Contact */}
            <motion.div 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8 text-sm text-current/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              {data.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{data.location}</span>
                </div>
              )}
              {data.contactEmail && (
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  <span>{data.contactEmail}</span>
                </div>
              )}
            </motion.div>

            {/* Social Links */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <motion.div 
                className="flex items-center justify-center lg:justify-start gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {data.socialLinks.map((social, index) => {
                  const IconComponent = socialIcons[social.platform as keyof typeof socialIcons];
                  if (!IconComponent || !social.url) return null;

                  return (
                    <Link
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-current/10 hover:bg-current/20 transition-all duration-300 hover:scale-110"
                    >
                      <IconComponent size={20} />
                    </Link>
                  );
                })}
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {data.contactEmail && (
                <Button size="lg" className="px-8">
                  <Mail className="mr-2" size={18} />
                  Get In Touch
                </Button>
              )}
              <Button variant="outline" size="lg" className="px-8">
                <ExternalLink className="mr-2" size={18} />
                View Work
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator - Hidden in editor preview and public view */}
        {!isEditing && !isPublicView && (
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div className="flex flex-col items-center gap-2 text-current/50">
              <span className="text-sm">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-6 h-10 border-2 border-current/30 rounded-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1 h-3 bg-current/50 rounded-full mt-2"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}