"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ContactData, SectionStyling } from '@/types/portfolio';
import {
  Mail,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
} from 'lucide-react';
import { EditableText } from '@/components/editor/inline/EditableText';
import { EditableField } from '@/components/editor/inline/EditableField';

interface ContactSectionProps {
  data: ContactData;
  styling: SectionStyling;
  isEditing?: boolean;
  isPublicView?: boolean;
  onEdit?: () => void;
  onDataChange?: (newData: Partial<ContactData>) => void;
  onStylingChange?: (newStyling: Partial<SectionStyling>) => void;
}

// Design tokens
const container = 'max-w-5xl mx-auto px-6';
const sectionPy = 'py-24';
const VALID_SOCIAL_PLATFORMS: ContactData['socialLinks'][number]['platform'][] = [
  'email',
  'website',
  'linkedin',
  'github',
  'twitter',
  'instagram',
  'dribbble',
  'behance',
  'youtube',
  'medium',
];

function isValidSocialPlatform(value: string): value is ContactData['socialLinks'][number]['platform'] {
  return VALID_SOCIAL_PLATFORMS.includes(value as ContactData['socialLinks'][number]['platform']);
}

// Section heading component
function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-14">
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">{title}</h2>
      {subtitle && <p className="text-slate-500 text-base max-w-xl">{subtitle}</p>}
      <div className="mt-4 w-10 h-0.5 bg-slate-900" />
    </div>
  );
}

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

export default function ContactSection({
  data,
  isEditing = false,
  isPublicView = false,
  onEdit,
  onDataChange,
}: ContactSectionProps) {
  const inlineEditMode = isEditing && !isPublicView && !!onDataChange;
  const isPreview = !isPublicView;

  return (
    <section
      id="contact"
      className={`${sectionPy} px-6 bg-white`}
      onClick={isEditing ? onEdit : undefined}
    >
      <div className={container}>
        <div className="max-w-xl">
          <SectionHeading
            title={inlineEditMode ? (
              <EditableText
                value={data.heading || ''}
                onChange={(v) => onDataChange?.({ heading: v })}
                placeholder="Let's Connect"
                className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                as="span"
              />
            ) as unknown as string : (data.heading || "Let's Connect")}
          />

          <p className="text-base text-slate-500 leading-relaxed mb-10">
            {inlineEditMode ? (
              <EditableText
                value={data.availability || ''}
                onChange={(v) => onDataChange?.({ availability: v })}
                placeholder="I'm always open to new opportunities, collaborations, and interesting conversations. Feel free to reach out."
                className="outline-none focus:ring-2 focus:ring-slate-900/20 rounded px-1 -mx-1"
                as="span"
                multiline
              />
            ) : (
              data.availability || "I'm always open to new opportunities, collaborations, and interesting conversations. Feel free to reach out."
            )}
          </p>

          {/* Email CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <a
              href={isPreview ? undefined : `mailto:${data.email}`}
              onClick={(e) => isPreview && e.preventDefault()}
              className="inline-flex items-center gap-2.5 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-200"
            >
              <Mail className="w-4 h-4" />
              {inlineEditMode ? (
                <EditableField
                  value={data.email || ''}
                  onChange={(v) => onDataChange?.({ email: v })}
                  placeholder="your@email.com"
                  type="email"
                  className="bg-transparent text-white outline-none focus:ring-1 focus:ring-white/50 rounded"
                />
              ) : (
                data.email || 'your@email.com'
              )}
            </a>
          </div>

          {/* Location */}
          {(data.location || inlineEditMode) && (
            <p className="flex items-center gap-1.5 text-sm text-slate-400 mb-6">
              <MapPin className="w-4 h-4" />
              {inlineEditMode ? (
                <EditableField
                  value={data.location || ''}
                  onChange={(v) => onDataChange?.({ location: v })}
                  placeholder="Your Location"
                  type="text"
                  className="text-slate-400 outline-none focus:ring-1 focus:ring-slate-400/50 rounded"
                />
              ) : (
                data.location
              )}
            </p>
          )}

          {/* Social links */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <motion.div
              initial={!isEditing ? { opacity: 0 } : undefined}
              animate={!isEditing ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={inlineEditMode ? 'space-y-3' : 'flex items-center gap-2'}
            >
              {data.socialLinks.map((link, i) => {
                if (!inlineEditMode) {
                  return <SocialLink key={i} platform={link.platform} url={link.url} isPreview={isPreview} />;
                }

                return (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <SocialLink platform={link.platform} url={link.url} isPreview={isPreview} />
                    <EditableField
                      value={link.platform || ''}
                      onChange={(value) => {
                        const normalized = value.trim().toLowerCase();
                        if (!isValidSocialPlatform(normalized)) return;
                        const updatedLinks = [...(data.socialLinks || [])];
                        updatedLinks[i] = { ...updatedLinks[i], platform: normalized };
                        onDataChange?.({ socialLinks: updatedLinks });
                      }}
                      placeholder="platform"
                      type="text"
                      className="text-slate-500 text-xs sm:text-sm"
                    />
                    <EditableField
                      value={link.url || ''}
                      onChange={(value) => {
                        const updatedLinks = [...(data.socialLinks || [])];
                        updatedLinks[i] = { ...updatedLinks[i], url: value };
                        onDataChange?.({ socialLinks: updatedLinks });
                      }}
                      placeholder="https://..."
                      type="url"
                      className="text-slate-500 text-xs sm:text-sm min-w-[160px]"
                    />
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
