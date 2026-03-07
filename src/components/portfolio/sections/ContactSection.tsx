"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ContactData, SectionStyling } from '@/types/portfolio';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EditableText } from '@/components/editor/inline/EditableText';
import { EditableField } from '@/components/editor/inline/EditableField';
import { spacing } from '@/design/spacing';
import { typography, textColors } from '@/design/typography';
import {
  Mail, Phone, MapPin, Clock, Send, MessageSquare,
  Github, Linkedin, Twitter, Globe, CheckCircle2,
} from 'lucide-react';

interface ContactSectionProps {
  data: ContactData;
  styling: SectionStyling;
  isEditing?: boolean;
  isPublicView?: boolean;
  onEdit?: () => void;
  onDataChange?: (newData: Partial<ContactData>) => void;
  onStylingChange?: (newStyling: Partial<SectionStyling>) => void;
}

const socialIcons = { github: Github, linkedin: Linkedin, twitter: Twitter, website: Globe };

export default function ContactSection({
  data, styling, isEditing = false, isPublicView = false, onEdit, onDataChange,
}: ContactSectionProps) {
  const inlineEditMode = isEditing && !isPublicView && !!onDataChange;
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const containerStyle = {
    backgroundColor: styling.backgroundColor || 'transparent',
    color: styling.textColor || 'inherit',
    padding: `${styling.padding?.top || '3rem'} ${styling.padding?.right || '2rem'} ${styling.padding?.bottom || '3rem'} ${styling.padding?.left || '2rem'}`,
    margin: `${styling.margin?.top || '0'} 0 ${styling.margin?.bottom || '0'} 0`,
  } as React.CSSProperties;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const contactItems = [
    { icon: Mail, label: 'Email', value: data.email, field: 'email' as const, href: `mailto:${data.email}`, placeholder: 'email@example.com' },
    { icon: Phone, label: 'Phone', value: data.phone, field: 'phone' as const, href: `tel:${data.phone}`, placeholder: '+1 (555) 000-0000' },
    { icon: MapPin, label: 'Location', value: data.location, field: 'location' as const, href: undefined, placeholder: 'San Francisco, CA' },
    { icon: Clock, label: 'Availability', value: data.availability, field: 'availability' as const, href: undefined, placeholder: 'Available for work' },
  ].filter(item => item.value || inlineEditMode);

  const gradients = ['from-indigo-500 to-purple-500', 'from-emerald-500 to-teal-500', 'from-rose-500 to-pink-500', 'from-amber-500 to-orange-500'];
  const iconBgs = ['bg-indigo-50 text-indigo-600', 'bg-emerald-50 text-emerald-600', 'bg-rose-50 text-rose-600', 'bg-amber-50 text-amber-600'];

  return (
    <motion.section
      className={`relative ${spacing.section}`}
      style={containerStyle}
      initial={!isEditing && styling.animation?.type !== 'none' ? 'hidden' : 'visible'}
      whileInView={!isEditing ? 'visible' : undefined}
      viewport={!isEditing ? { once: true, margin: '-100px' } : undefined}
      variants={!isEditing ? { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } } : undefined}
      onClick={isEditing ? onEdit : undefined}
    >
      <div className={`${spacing.container} px-4 sm:px-6 lg:px-8 relative z-0`}>

        {/* Section Header */}
        <motion.div
          className={`text-center ${spacing.marginBottom.xlarge}`}
          initial={!isEditing ? { opacity: 0, y: 20 } : undefined}
          whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
          viewport={!isEditing ? { once: true } : undefined}
          transition={!isEditing ? { delay: 0.1, duration: 0.6 } : undefined}
        >
          <h2 className={`${typography.sectionTitle} ${spacing.marginBottom.small}`}>
            {inlineEditMode ? (
              <EditableText value={data.heading || ''} onChange={(v) => onDataChange?.({ heading: v })}
                placeholder="Get In Touch" className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2" as="span" />
            ) : (data.heading || 'Get In Touch')}
          </h2>
          <p className={`${typography.body} ${textColors.muted} max-w-2xl mx-auto ${spacing.marginBottom.medium}`}>
            I&apos;m always open to discussing new opportunities and interesting projects.
          </p>
          <div className="w-20 h-1 bg-current mx-auto opacity-50 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">

          {/* Left — Contact info cards */}
          <motion.div
            className="space-y-4 sm:space-y-5"
            initial={!isEditing ? { opacity: 0, x: -30 } : undefined}
            whileInView={!isEditing ? { opacity: 1, x: 0 } : undefined}
            viewport={!isEditing ? { once: true } : undefined}
            transition={!isEditing ? { delay: 0.2, duration: 0.6 } : undefined}
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Let&apos;s Talk</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Feel free to reach out if you&apos;re looking for a developer, have a question, or just want to connect.
              </p>
            </div>

            {/* Contact detail cards */}
            {contactItems.map(({ icon: Icon, label, value, field, href, placeholder }, i) => (
              <motion.div
                key={field}
                initial={!isEditing ? { opacity: 0, x: -20 } : undefined}
                whileInView={!isEditing ? { opacity: 1, x: 0 } : undefined}
                viewport={!isEditing ? { once: true } : undefined}
                transition={!isEditing ? { delay: 0.25 + i * 0.1, duration: 0.5 } : undefined}
                whileHover={!isEditing ? { y: -2 } : undefined}
              >
                <Card className="border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all duration-200 overflow-hidden">
                  <div className={`h-0.5 bg-gradient-to-r ${gradients[i % gradients.length]}`} />
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${iconBgs[i % iconBgs.length]} flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
                      {inlineEditMode ? (
                        <EditableField value={value || ''} onChange={(v) => onDataChange?.({ [field]: v })}
                          placeholder={placeholder} type={field === 'email' ? 'email' : 'text'} className="text-sm font-semibold text-slate-800" />
                      ) : href ? (
                        <a href={href} className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors truncate block">{value}</a>
                      ) : (
                        <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Social links */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <motion.div
                className="pt-2"
                initial={!isEditing ? { opacity: 0, y: 15 } : undefined}
                whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
                viewport={!isEditing ? { once: true } : undefined}
                transition={!isEditing ? { delay: 0.6, duration: 0.5 } : undefined}
              >
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Connect with me</p>
                <div className="flex flex-wrap gap-2.5">
                  {data.socialLinks.map((link, i) => {
                    const Icon = socialIcons[link.platform as keyof typeof socialIcons] || Globe;
                    return (
                      <motion.a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 transition-all duration-200"
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Icon size={18} />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right — Contact form */}
          <motion.div
            initial={!isEditing ? { opacity: 0, x: 30 } : undefined}
            whileInView={!isEditing ? { opacity: 1, x: 0 } : undefined}
            viewport={!isEditing ? { once: true } : undefined}
            transition={!isEditing ? { delay: 0.3, duration: 0.6 } : undefined}
            whileHover={!isEditing ? { y: -3 } : undefined}
          >
            <Card className="border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              <CardContent className="p-6 sm:p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-100">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Send a Message</h3>
                    <p className="text-xs text-slate-500">I&apos;ll respond within 24 hours</p>
                  </div>
                </div>

                {submitted ? (
                  <motion.div
                    className="flex flex-col items-center gap-3 py-10 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <p className="font-semibold text-slate-800">Message sent!</p>
                    <p className="text-sm text-slate-500">I&apos;ll get back to you soon.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-slate-600">Name *</Label>
                        <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                          required placeholder="Your name" className="mt-1 text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-slate-600">Email *</Label>
                        <Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                          required placeholder="your@email.com" className="mt-1 text-sm" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-slate-600">Subject</Label>
                      <Input value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                        placeholder="What's this about?" className="mt-1 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-slate-600">Message *</Label>
                      <Textarea value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                        required placeholder="Tell me about your project or just say hello..." className="mt-1 min-h-[110px] text-sm resize-none" />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Sending...</>
                      ) : (
                        <><Send size={15} className="mr-2" />Send Message</>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-14 sm:mt-16"
          initial={!isEditing ? { opacity: 0, y: 20 } : undefined}
          whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
          viewport={!isEditing ? { once: true } : undefined}
          transition={!isEditing ? { delay: 0.7, duration: 0.6 } : undefined}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 p-5 sm:p-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/40">
            <div className="flex-1 text-center sm:text-left">
              <p className="font-semibold text-slate-800 mb-0.5">Prefer a quick call?</p>
              <p className="text-sm text-slate-500">Sometimes it&apos;s easier to just talk.</p>
            </div>
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block animate-pulse" />
              {data.availability || 'Available for work'}
            </Badge>
            {data.email && (
              <a href={`mailto:${data.email}?subject=Scheduling a Call`}
                className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5">
                <Phone size={14} />Schedule Call
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}