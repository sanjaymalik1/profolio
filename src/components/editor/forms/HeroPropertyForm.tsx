"use client";

import React from 'react';
import { useEditorActions } from '@/contexts/EditorContext';
import { EditorSection } from '@/types/editor';
import { HeroData } from '@/types/portfolio';
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

  const handleInputChange = (field: keyof HeroData, value: any) => {
    const updatedData = { ...heroData, [field]: value };
    updateSectionData(section.id, updatedData);
  };

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedSocialLinks = [...(heroData.socialLinks || [])];
    updatedSocialLinks[index] = { ...updatedSocialLinks[index], [field]: value };
    handleInputChange('socialLinks', updatedSocialLinks);
  };

  const addSocialLink = () => {
    const newSocialLinks = [...(heroData.socialLinks || []), { platform: 'github', url: '' }];
    handleInputChange('socialLinks', newSocialLinks);
  };

  const removeSocialLink = (index: number) => {
    const updatedSocialLinks = heroData.socialLinks?.filter((_, i) => i !== index) || [];
    handleInputChange('socialLinks', updatedSocialLinks);
  };

  return (
    <div className="space-y-6">
      
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="w-4 h-4" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={heroData.fullName || ''}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              value={heroData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Full Stack Developer"
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={heroData.subtitle || ''}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="Passionate about creating amazing experiences"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={heroData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell your story..."
              rows={4}
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
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={heroData.contactEmail || ''}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={heroData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="profileImage">Profile Image URL</Label>
            <Input
              id="profileImage"
              value={heroData.profileImage || ''}
              onChange={(e) => handleInputChange('profileImage', e.target.value)}
              placeholder="https://example.com/profile.jpg"
            />
          </div>

          <div>
            <Label htmlFor="backgroundImage">Background Image URL</Label>
            <Input
              id="backgroundImage"
              value={heroData.backgroundImage || ''}
              onChange={(e) => handleInputChange('backgroundImage', e.target.value)}
              placeholder="https://example.com/background.jpg"
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
            {heroData.socialLinks?.map((social, index) => (
              <div key={index} className="flex gap-2 items-center">
                <select
                  value={social.platform}
                  onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
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
            ))}
            
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