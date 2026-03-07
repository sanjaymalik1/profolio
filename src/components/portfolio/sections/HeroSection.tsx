"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HeroData, SectionStyling } from '@/types/portfolio';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, ArrowDown, Sparkles } from 'lucide-react';
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
  website: ExternalLink,
} as const;

export default function HeroSection({
  data,
  styling,
  isEditing = false,
  isPublicView = false,
  onEdit,
  onDataChange,
}: HeroSectionProps) {
  const inlineEditMode = isEditing && !isPublicView && !!onDataChange;

  const containerStyle = {
    backgroundColor: styling.backgroundColor || 'transparent',
    color: styling.textColor || 'inherit',
    padding: `${styling.padding?.top || '0'} ${styling.padding?.right || '0'} ${styling.padding?.bottom || '0'} ${styling.padding?.left || '0'}`,
  } as React.CSSProperties;

  return (
    <motion.section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={containerStyle}
      initial={!isEditing ? { opacity: 0 } : undefined}
      animate={!isEditing ? { opacity: 1 } : undefined}
      transition={{ duration: 0.6 }}
      onClick={isEditing ? onEdit : undefined}
    >
      {/* Subtle background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-indigo-100/60 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-purple-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Background image overlay */}
      {data.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image src={data.backgroundImage} alt="Background" fill className="object-cover opacity-10" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/80" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Profile Image */}
          {(data.profileImage || inlineEditMode) && (
            <motion.div
              className="flex-shrink-0 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7, type: 'spring', stiffness: 100 }}
            >
              {/* Gradient ring */}
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-80 blur-sm" />
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500" />

              <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-white shadow-2xl">
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
                  data.profileImage && (
                    <Image src={data.profileImage} alt={data.fullName} fill className="object-cover" priority />
                  )
                )}
                {!data.profileImage && !inlineEditMode && (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-5xl font-bold text-indigo-400">
                      {data.fullName?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
              </div>

              {/* Status badge */}
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Badge className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 shadow-md border-0 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Available for Work
                </Badge>
              </motion.div>
            </motion.div>
          )}

          {/* Content */}
          <div className="flex-1 text-center lg:text-left max-w-3xl">

            {/* Eyebrow label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="flex items-center justify-center lg:justify-start gap-2 mb-4"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-indigo-600 tracking-wide uppercase">
                {data.title || 'Portfolio'}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-5 tracking-tight leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
            >
              {inlineEditMode ? (
                <EditableText
                  value={data.fullName || ''}
                  onChange={(value) => onDataChange?.({ fullName: value })}
                  placeholder="Your Name"
                  className="outline-none focus:ring-2 focus:ring-indigo-500/30 rounded px-2 -mx-2"
                  as="span"
                />
              ) : (
                <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent">
                  {data.fullName || 'Your Name'}
                </span>
              )}
            </motion.h1>

            {/* Bio */}
            <motion.p
              className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              {inlineEditMode ? (
                <EditableText
                  value={data.bio || ''}
                  onChange={(value) => onDataChange?.({ bio: value })}
                  placeholder="Brief introduction about yourself and what you do."
                  className="outline-none focus:ring-2 focus:ring-indigo-500/30 rounded px-1 -mx-1"
                  as="span"
                  multiline
                />
              ) : (
                data.bio || 'Brief introduction about yourself and what you do.'
              )}
            </motion.p>

            {/* Meta row */}
            {(data.location || data.contactEmail) && (
              <motion.div
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-7 text-sm text-slate-500"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                {data.location && (
                  <span className="flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1">
                    <MapPin size={13} className="text-indigo-500" />
                    {data.location}
                  </span>
                )}
                {data.contactEmail && (
                  <span className="flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1">
                    <Mail size={13} className="text-indigo-500" />
                    {data.contactEmail}
                  </span>
                )}
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 mb-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
            >
              {data.contactEmail && (
                <a
                  href={`mailto:${data.contactEmail}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Mail size={16} />
                  Get In Touch
                </a>
              )}
              <a
                href="#projects"
                className="inline-flex items-center gap-2 border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold text-sm hover:border-indigo-300 hover:text-indigo-700 hover:-translate-y-0.5 transition-all duration-200"
              >
                <ExternalLink size={16} />
                View Work
              </a>
            </motion.div>

            {/* Social links */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <motion.div
                className="flex items-center justify-center lg:justify-start gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.5 }}
              >
                {data.socialLinks.map((social, i) => {
                  const Icon = socialIcons[social.platform as keyof typeof socialIcons];
                  if (!Icon || !social.url) return null;
                  return (
                    <Link
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-110 transition-all duration-200 border border-slate-200 hover:border-indigo-200"
                    >
                      <Icon size={17} />
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      {!isEditing && !isPublicView && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <ArrowDown size={16} />
          </motion.div>
        </motion.div>
      )}
    </motion.section>
  );
}