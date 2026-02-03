"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ContactData, SectionStyling } from '@/types/portfolio';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  Github,
  Linkedin,
  Twitter,
  Globe
} from 'lucide-react';

interface ContactSectionProps {
  data: ContactData;
  styling: SectionStyling;
  isEditing?: boolean;
  onEdit?: () => void;
}

export default function ContactSection({ data, styling, isEditing = false, onEdit }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
    
    // Show success message (you can implement this)
    alert('Message sent successfully!');
  };

  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    website: Globe
  };

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
          className="text-center mb-16"
          initial={!isEditing ? { opacity: 0, y: 20 } : undefined}
          whileInView={!isEditing ? { opacity: 1, y: 0 } : undefined}
          viewport={!isEditing ? { once: true } : undefined}
          transition={!isEditing ? { delay: 0.1, duration: 0.6 } : undefined}
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {data.heading || 'Get In Touch'}
          </h2>
          <p className="text-lg text-current/70 max-w-2xl mx-auto mb-6">
            I'm always open to discussing new opportunities and interesting projects.
          </p>
          <div className="w-20 h-1 bg-current mx-auto opacity-50 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Let's Talk</h3>
              <p className="text-current/70 mb-8">
                Feel free to reach out if you're looking for a developer, have a question, 
                or just want to connect.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {data.email && (
                <motion.div 
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="p-3 bg-current/10 rounded-lg">
                    <Mail className="text-current" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a 
                      href={`mailto:${data.email}`} 
                      className="text-current/70 hover:text-current transition-colors"
                    >
                      {data.email}
                    </a>
                  </div>
                </motion.div>
              )}

              {data.phone && (
                <motion.div 
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="p-3 bg-current/10 rounded-lg">
                    <Phone className="text-current" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <a 
                      href={`tel:${data.phone}`} 
                      className="text-current/70 hover:text-current transition-colors"
                    >
                      {data.phone}
                    </a>
                  </div>
                </motion.div>
              )}

              {data.location && (
                <motion.div 
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="p-3 bg-current/10 rounded-lg">
                    <MapPin className="text-current" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-current/70">{data.location}</p>
                  </div>
                </motion.div>
              )}

              {data.availability && (
                <motion.div 
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <div className="p-3 bg-current/10 rounded-lg">
                    <Clock className="text-current" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Availability</p>
                    <p className="text-current/70">{data.availability}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Social Links */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <motion.div 
                className="pt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <h4 className="font-medium mb-4">Connect with me</h4>
                <div className="flex gap-4">
                  {data.socialLinks.map((socialLink, index) => {
                    const Icon = socialIcons[socialLink.platform as keyof typeof socialIcons] || Globe;
                    return (
                      <motion.a
                        key={index}
                        href={socialLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-current/10 rounded-lg hover:bg-current/20 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon size={20} className="text-current" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="text-current" size={24} />
                  <h3 className="text-xl font-bold">Send Message</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@example.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Tell me about your project or just say hello..."
                      className="mt-1 min-h-[120px] resize-y"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Contact CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="bg-current/5 rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Prefer a quick call?</h3>
            <p className="text-current/70 mb-6">
              Sometimes it's easier to just talk. Feel free to schedule a call with me.
            </p>
            <Button size="lg" variant="outline" asChild>
              <a href="mailto:contact@example.com?subject=Schedule a Call">
                <Phone size={18} className="mr-2" />
                Schedule Call
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}