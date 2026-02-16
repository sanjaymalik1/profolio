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
import { typography, textColors } from '@/design/typography';
import { spacing } from '@/design/spacing';

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
          
          {/* Profile Image */}
          {(data.profileImage || inlineEditMode) && (
            <motion.div 
              className="flex-shrink-0 relative"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Subtle decorative ring - thin and lightweight */}
              <div className="absolute -inset-2 rounded-full border border-current opacity-15 pointer-events-none" />
              
              {/* Circular clipping container with soft shadow - responsive sizes */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 rounded-full overflow-hidden shadow-lg">
                {inlineEditMode ? (
                  <EditableImage
                    value={data.profileImage || ''}
                    onChange={(url) => onDataChange?.({ profileImage: url })}
                    alt={data.fullName}
                    containerClassName="w-full h-full"
                    className="object-cover"
                    aspectRatio="square"
                  />
                ) : (
                  <Image
                    src={data.profileImage!}
                    alt={data.fullName}
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            </motion.div>
          )}

          {/* Content */}
          <div className="flex-1 text-center lg:text-left max-w-3xl">
            
            {/* Name */}
            <motion.h1 
              className={`${typography.heroTitle} mb-3 sm:mb-4 bg-gradient-to-r from-current to-current/70 bg-clip-text`}
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
              className={`${typography.subtitle} mb-2 ${textColors.secondary}`}
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
                className={`${typography.body} ${spacing.marginBottom.medium} ${textColors.muted}`}
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
              className={`${typography.body} ${spacing.marginBottom.large} ${textColors.secondary} max-w-2xl mx-auto lg:mx-0`}
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
              className={`flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-6 ${spacing.marginBottom.large} text-sm sm:text-base ${textColors.muted}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              {data.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} className="flex-shrink-0" />
                  <span className="truncate max-w-[150px] sm:max-w-none">{data.location}</span>
                </div>
              )}
              {data.contactEmail && (
                <div className="flex items-center gap-1.5">
                  <Mail size={16} className="flex-shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{data.contactEmail}</span>
                </div>
              )}
            </motion.div>

            {/* Social Links */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <motion.div 
                className={`flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 ${spacing.marginBottom.large}`}
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
                      className="p-2.5 sm:p-3 rounded-full bg-current/10 hover:bg-current/20 transition-all duration-300 hover:scale-110"
                    >
                      <IconComponent size={18} className="sm:w-5 sm:h-5" />
                    </Link>
                  );
                })}
              </motion.div>
            )}

            {/* CTA Buttons - responsive sizes and layout */}
            <motion.div 
              className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {data.contactEmail && (
                <Button size="lg" className="w-full sm:w-auto px-6 sm:px-8 text-sm sm:text-base">
                  <Mail className="mr-2" size={18} />
                  Get In Touch
                </Button>
              )}
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 sm:px-8 text-sm sm:text-base">
                <ExternalLink className="mr-2" size={18} />
                View Work
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator - Hidden in editor preview, public view, and mobile */}
        {!isEditing && !isPublicView && (
          <motion.div 
            className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div className="flex flex-col items-center gap-2 text-current/50">
              <span className="text-xs sm:text-sm">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-current/30 rounded-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1 h-2 sm:h-3 bg-current/50 rounded-full mt-2"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}