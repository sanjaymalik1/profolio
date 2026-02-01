"use client";

import React from 'react';
import { useEditorActions } from '@/contexts/EditorContext';
import { EditorSection } from '@/types/editor';
import { ContactData } from '@/types/portfolio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Mail, Phone, MapPin, Link, MessageSquare } from 'lucide-react';

interface ContactPropertyFormProps {
  section: EditorSection;
}

export const ContactPropertyForm: React.FC<ContactPropertyFormProps> = ({ section }) => {
  const { updateSectionData } = useEditorActions();
  const contactData = section.data as ContactData;

  const handleInputChange = (field: keyof ContactData, value: any) => {
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

  const updateContactForm = (field: string, value: any) => {
    const updatedContactForm = {
      ...contactData.contactForm,
      [field]: value
    };
    handleInputChange('contactForm', updatedContactForm);
  };

  const addFormField = () => {
    const newField = {
      name: 'new-field',
      type: 'text' as const,
      label: 'New Field',
      required: false,
      placeholder: ''
    };
    const updatedFields = [...(contactData.contactForm?.fields || []), newField];
    updateContactForm('fields', updatedFields);
  };

  const removeFormField = (index: number) => {
    const updatedFields = contactData.contactForm?.fields?.filter((_, i) => i !== index) || [];
    updateContactForm('fields', updatedFields);
  };

  const updateFormField = (index: number, field: string, value: any) => {
    const updatedFields = [...(contactData.contactForm?.fields || [])];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    updateContactForm('fields', updatedFields);
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
            <Phone className="w-4 h-4" />
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
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={contactData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
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

      {/* Contact Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Contact Form
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="formEnabled"
              checked={contactData.contactForm?.enabled || false}
              onChange={(e) => updateContactForm('enabled', e.target.checked)}
            />
            <Label htmlFor="formEnabled">Enable Contact Form</Label>
          </div>

          {contactData.contactForm?.enabled && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Form Fields</Label>
                <div className="space-y-3 mt-2">
                  {contactData.contactForm.fields?.map((field, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          Field {index + 1}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFormField(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Name</Label>
                          <Input
                            value={field.name}
                            onChange={(e) => updateFormField(index, 'name', e.target.value)}
                            placeholder="field-name"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Type</Label>
                          <select
                            value={field.type}
                            onChange={(e) => updateFormField(index, 'type', e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm"
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="textarea">Textarea</option>
                            <option value="select">Select</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs">Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateFormField(index, 'label', e.target.value)}
                          placeholder="Field Label"
                          className="text-sm"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs">Placeholder</Label>
                        <Input
                          value={field.placeholder || ''}
                          onChange={(e) => updateFormField(index, 'placeholder', e.target.value)}
                          placeholder="Enter placeholder text"
                          className="text-sm"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`required-${index}`}
                          checked={field.required}
                          onChange={(e) => updateFormField(index, 'required', e.target.checked)}
                        />
                        <Label htmlFor={`required-${index}`} className="text-xs">
                          Required field
                        </Label>
                      </div>
                    </div>
                  )) || []}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addFormField}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Form Field
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};