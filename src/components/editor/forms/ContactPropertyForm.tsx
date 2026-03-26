"use client";

import React from 'react';
import { useEditorActions } from '@/contexts/EditorContext';
import { EditorSection } from '@/types/editor';
import type { ContactData } from '@/types/portfolio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Mail, Link } from 'lucide-react';

interface ContactPropertyFormProps {
  section: EditorSection;
}

export const ContactPropertyForm: React.FC<ContactPropertyFormProps> = ({ section }) => {
  const { updateSectionData } = useEditorActions();
  const contactData = section.data as ContactData;

  const handleInputChange = <K extends keyof ContactData>(field: K, value: ContactData[K]) => {
    const updatedData = { ...contactData, [field]: value };
    updateSectionData(section.id, updatedData);
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedSocialLinks = [...(contactData.socialLinks || [])];
    updatedSocialLinks[index] = { ...updatedSocialLinks[index], [field]: value };
    handleInputChange('socialLinks', updatedSocialLinks);
  };

  const addSocialLink = () => {
    const newSocialLinks = [...(contactData.socialLinks || []), { platform: 'email' as const, url: '' }];
    handleInputChange('socialLinks', newSocialLinks);
  };

  const removeSocialLink = (index: number) => {
    const updatedSocialLinks = contactData.socialLinks?.filter((_, i) => i !== index) || [];
    handleInputChange('socialLinks', updatedSocialLinks);
  };

  return (
    <div className="space-y-6">

      {/* Section Heading */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Section Heading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="heading">Heading</Label>
            <Input
              id="heading"
              value={contactData.heading || ''}
              onChange={(e) => handleInputChange('heading', e.target.value)}
              placeholder="Get In Touch"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={contactData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={contactData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>

          <div>
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              value={contactData.availability || ''}
              onChange={(e) => handleInputChange('availability', e.target.value)}
              placeholder="Available for work"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Link className="w-4 h-4" />
            Social Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contactData.socialLinks?.map((social, index) => (
              <div key={index} className="flex gap-2 items-center">
                <select
                  value={social.platform}
                  onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="email">Email</option>
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                  <option value="website">Website</option>
                  <option value="instagram">Instagram</option>
                  <option value="dribbble">Dribbble</option>
                  <option value="behance">Behance</option>
                </select>
                <Input
                  value={social.url}
                  onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSocialLink(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )) || []}

            <Button
              variant="outline"
              size="sm"
              onClick={addSocialLink}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Social Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};