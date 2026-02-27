"use client";

import React from 'react';
import { useEditorActions } from '@/contexts/EditorContext';
import { EditorSection } from '@/types/editor';
import type { HeroData, SocialLink } from '@/types/portfolio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Briefcase, 
  FileText, 
  Image as ImageIcon,
  MapPin,
  Mail,
  Plus,
  Trash2,
  Link
} from 'lucide-react';

interface HeroPropertyFormProps {
  section: EditorSection;
}

export const HeroPropertyForm: React.FC<HeroPropertyFormProps> = ({ section }) => {
  const { updateSectionData } = useEditorActions();
  const heroData = section.data as HeroData;

  const handleInputChange = <K extends keyof HeroData>(field: K, value: HeroData[K]) => {
    const updatedData = { ...heroData, [field]: value };
    updateSectionData(section.id, updatedData);
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedSocialLinks = [...(heroData.socialLinks || [])];
    updatedSocialLinks[index] = { ...updatedSocialLinks[index], [field]: value };
    handleInputChange('socialLinks', updatedSocialLinks);
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      platform: 'github',
      url: '',
    };

    const newSocialLinks = [...(heroData.socialLinks || []), newLink];
    handleInputChange('socialLinks', newSocialLinks);
  };

  const removeSocialLink = (index: number) => {
    const updatedSocialLinks = heroData.socialLinks?.filter((_, i) => i !== index) || [];
    handleInputChange('socialLinks', updatedSocialLinks);
  };

  return (
    <div className="space-y-5">
      
      {/* Basic Information */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 bg-slate-50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
            <User className="w-4 h-4 text-slate-600" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-slate-700">Full Name</Label>
            <Input
              id="fullName"
              value={heroData.fullName || ''}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="John Doe"
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-slate-700">Professional Title</Label>
            <Input
              id="title"
              value={heroData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Full Stack Developer"
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle" className="text-sm font-medium text-slate-700">Subtitle</Label>
            <Input
              id="subtitle"
              value={heroData.subtitle || ''}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="Passionate about creating amazing experiences"
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-slate-700">Bio</Label>
            <Textarea
              id="bio"
              value={heroData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell your story..."
              rows={4}
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 bg-slate-50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
            <Mail className="w-4 h-4 text-slate-600" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="text-sm font-medium text-slate-700">Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={heroData.contactEmail || ''}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              placeholder="john@example.com"
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-slate-700">Location</Label>
            <Input
              id="location"
              value={heroData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="San Francisco, CA"
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 bg-slate-50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
            <ImageIcon className="w-4 h-4 text-slate-600" />
            Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="profileImage" className="text-sm font-medium text-slate-700">Profile Image URL</Label>
            <Input
              id="profileImage"
              value={heroData.profileImage || ''}
              onChange={(e) => handleInputChange('profileImage', e.target.value)}
              placeholder="https://example.com/profile.jpg"
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backgroundImage" className="text-sm font-medium text-slate-700">Background Image URL</Label>
            <Input
              id="backgroundImage"
              value={heroData.backgroundImage || ''}
              onChange={(e) => handleInputChange('backgroundImage', e.target.value)}
              placeholder="https://example.com/background.jpg"
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 bg-slate-50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
            <Link className="w-4 h-4 text-slate-600" />
            Social Links
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {heroData.socialLinks?.map((social, index) => (
              <div key={index} className="flex gap-2 items-center">
                <select
                  value={social.platform}
                  onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                  <option value="email">Email</option>
                  <option value="website">Website</option>
                </select>
                <Input
                  value={social.url}
                  onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSocialLink(index)}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={addSocialLink}
              className="w-full border-slate-200 hover:bg-slate-50"
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