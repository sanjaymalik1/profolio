"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HeroData, SectionStyling } from '@/types/portfolio';
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  ArrowRight,
  Twitter,
  Globe,
} from 'lucide-react';
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

// Design tokens
const container = 'max-w-5xl mx-auto px-6';

// Social link component
function SocialLink({ platform, url, isPreview }: { platform: string; url: string; isPreview: boolean }) {
  const icons: Record<string, React.ReactNode> = {
    github: <Github className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    email: <Mail className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
    website: <Globe className="w-4 h-4" />,
  };
  const icon = icons[platform];
  if (!icon) return null;
  return (
    <a
      href={isPreview ? undefined : url}
      onClick={(e) => isPreview && e.preventDefault()}
      target={!isPreview ? '_blank' : undefined}
      rel={!isPreview ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
    >
      {icon}
    </a>
  );
}

export default function HeroSection({
  data,
  isEditing = false,
  isPublicView = false,
  onEdit,
  onDataChange,
}: HeroSectionProps) {
  const inlineEditMode = isEditing && !isPublicView && !!onDataChange;
  const isPreview = !isPublicView;

  return (
    <section
      className={`bg-white pt-16 pb-24 px-6 relative overflow-hidden ${isEditing ? 'cursor-pointer' : ''}`}
      onClick={isEditing ? onEdit : undefined}
    >
      <div className={`${container} flex flex-col md:flex-row items-center gap-12 relative z-10`}>
        
        {/* Left Column - Content */}
        <div className="flex-1 max-w-2xl w-full order-2 md:order-1">
          {/* Status pill */}
          <motion.div
            initial={!isEditing ? { opacity: 0, y: 12 } : undefined}
            animate={!isEditing ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Open to new opportunities
            </span>
          </motion.div>

          {/* Profile Image Mobile - moved to right column for desktop */}
          <div className="md:hidden">
            {(data.profileImage || inlineEditMode) && (
              <motion.div
                initial={!isEditing ? { opacity: 0, y: 16 } : undefined}
                animate={!isEditing ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.5 }}
                className="mb-8 flex justify-start shrink-0"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 aspect-square rounded-full overflow-hidden border-4 border-white shadow-lg relative bg-slate-100 ring-1 ring-slate-100">
                  {inlineEditMode ? (
                    <EditableImage
                      value={data.profileImage || ''}
                      onChange={(url) => onDataChange?.({ profileImage: url })}
                      alt={data.fullName}
                      containerClassName="absolute inset-0 w-full h-full !min-h-0"
                      className="object-cover !min-h-0"
                      aspectRatio="square"
                    />
                  ) : data.profileImage ? (
                    <Image src={data.profileImage} alt={data.fullName} fill className="object-cover" priority />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-300">
                        {data.fullName?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Name */}
          <motion.h1
            initial={!isEditing ? { opacity: 0, y: 16 } : undefined}
            animate={!isEditing ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight leading-none mb-5"
          >
            {inlineEditMode ? (
              <EditableText
                value={data.fullName || ''}
                onChange={(value) => onDataChange?.({ fullName: value })}
                placeholder="Your Name"
                className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              data.fullName || 'Your Name'
            )}
          </motion.h1>

          {/* Title */}
          <motion.p
            initial={!isEditing ? { opacity: 0, y: 14 } : undefined}
            animate={!isEditing ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-slate-500 font-medium mb-6"
          >
            {inlineEditMode ? (
              <EditableText
                value={data.title || ''}
                onChange={(value) => onDataChange?.({ title: value })}
                placeholder="Your Title"
                className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                as="span"
              />
            ) : (
              data.title || 'Your Title'
            )}
          </motion.p>

          {/* Bio */}
          <motion.p
            initial={!isEditing ? { opacity: 0, y: 12 } : undefined}
            animate={!isEditing ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-base text-slate-600 leading-relaxed max-w-xl mb-4"
          >
            {inlineEditMode ? (
              <EditableText
                value={data.bio || ''}
                onChange={(value) => onDataChange?.({ bio: value })}
                placeholder="Brief introduction about yourself and what you do."
                className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                as="span"
                multiline
              />
            ) : (
              data.bio || 'Brief introduction about yourself and what you do.'
            )}
          </motion.p>

          {/* Location */}
          {(data.location || inlineEditMode) && (
            <motion.div
              initial={!isEditing ? { opacity: 0 } : undefined}
              animate={!isEditing ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center gap-1.5 text-sm text-slate-400 mb-10"
            >
              <MapPin className="w-4 h-4" />
              <span>
                {inlineEditMode ? (
                  <EditableText
                    value={data.location || ''}
                    onChange={(value) => onDataChange?.({ location: value })}
                    placeholder="Your Location"
                    className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                    as="span"
                  />
                ) : (
                  data.location
                )}
              </span>
            </motion.div>
          )}

          {/* CTAs */}
          <motion.div
            initial={!isEditing ? { opacity: 0, y: 10 } : undefined}
            animate={!isEditing ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="flex flex-wrap items-center gap-3 mb-12"
          >
            <a
              href={isPreview ? undefined : '#projects'}
              onClick={(e) => isPreview && e.preventDefault()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-200"
            >
              View Projects
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={isPreview ? undefined : '#contact'}
              onClick={(e) => isPreview && e.preventDefault()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-800 text-sm font-semibold rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
            >
              Contact me
            </a>
          </motion.div>

          {/* Social links */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <motion.div
              initial={!isEditing ? { opacity: 0 } : undefined}
              animate={!isEditing ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.28 }}
              className="flex items-center gap-2"
            >
              {data.socialLinks.map((link, i) => (
                <SocialLink key={i} platform={link.platform} url={link.url} isPreview={isPreview} />
              ))}
            </motion.div>
          )}
        </div>

        {/* Right Column - Profile Image (Desktop) */}
        <div className="hidden md:flex md:w-[40%] justify-center md:justify-end order-1 md:order-2 shrink-0">
          {(data.profileImage || inlineEditMode) && (
            <motion.div
              initial={!isEditing ? { opacity: 0, scale: 0.95 } : undefined}
              animate={!isEditing ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative w-full max-w-[320px] aspect-square shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-100 to-white rounded-full shadow-2xl overflow-hidden border-8 border-white ring-1 ring-slate-100">
                {inlineEditMode ? (
                  <EditableImage
                    value={data.profileImage || ''}
                    onChange={(url) => onDataChange?.({ profileImage: url })}
                    alt={data.fullName}
                    containerClassName="absolute inset-0 w-full h-full !min-h-0"
                    className="object-cover !min-h-0"
                    aspectRatio="square"
                  />
                ) : data.profileImage ? (
                  <Image 
                    src={data.profileImage} 
                    alt={data.fullName} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 0vw, (max-width: 1024px) 320px, 384px"
                    priority 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50">
                    <span className="text-6xl font-bold text-slate-300">
                      {data.fullName?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Optional: subtle decorative elements around the image */}
              <div className="absolute -inset-4 border border-slate-100/50 rounded-full -z-10" />
              <div className="absolute -inset-8 border border-slate-50/50 rounded-full -z-10" />
            </motion.div>
          )}
        </div>

        {/* Decorative grid */}
        <div
          className="absolute right-0 inset-y-0 -z-10 w-1/2 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(226 232 240) 1px, transparent 0)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to right, transparent 0%, white 40%, white 60%, transparent 100%)',
          }}
        />
      </div>
    </section>
  );
}
