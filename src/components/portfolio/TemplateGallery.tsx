"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioTemplate } from '@/types/portfolio';
import { TemplateManager } from '@/lib/portfolio/template-manager';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Palette,
  Eye,
  CheckCircle,
  X
} from 'lucide-react';

interface TemplateGalleryProps {
  onTemplateSelect: (template: PortfolioTemplate) => void;
  selectedTemplateId?: string;
  className?: string;
}

export default function TemplateGallery({
  onTemplateSelect,
  selectedTemplateId,
  className = ""
}: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewTemplate, setPreviewTemplate] = useState<PortfolioTemplate | null>(null);

  // Get template manager instance
  const templateManager = TemplateManager.getInstance();

  const categories = ['modern', 'classic', 'creative', 'developer', 'designer'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let filtered = templateManager.searchTemplates(searchQuery);

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    if (selectedStyle !== 'all') {
      filtered = filtered.filter(template => template.difficulty === selectedStyle);
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedStyle, templateManager]);

  return (
    <div className={`space-y-6 ${className}`}>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Template</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select from our professionally designed templates. Each template is fully customizable
          to match your personal brand and style.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">

          {/* Category Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Category</Label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Difficulty</Label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Levels</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
        </p>
        {(searchQuery || selectedCategory !== 'all' || selectedStyle !== 'all') && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedStyle('all');
            }}
          >
            <X size={14} className="mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Templates Grid/List */}
      <motion.div
        className={`
          grid gap-6
          ${viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
          }
        `}
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={viewMode === 'list' ? 'max-w-none' : ''}
            >
              <Card className={`
                group cursor-pointer border-2 transition-all duration-300
                hover:shadow-xl hover:scale-[1.02]
                ${selectedTemplateId === template.id
                  ? 'border-primary ring-2 ring-primary ring-opacity-20'
                  : 'border-border hover:border-primary/50'
                }
              `}>
                <CardContent className={`p-0 ${viewMode === 'list' ? 'flex' : ''}`}>

                  {/* Template Preview */}
                  <div className={`
                    relative overflow-hidden bg-gradient-to-br 
                    from-${template.colorScheme.primary}-50 
                    to-${template.colorScheme.secondary}-50
                    ${viewMode === 'grid' ? 'aspect-[4/3]' : 'w-48 aspect-[4/3] flex-shrink-0'}
                  `}>

                    {/* Mock Layout Preview */}
                    <div className="absolute inset-4 space-y-2">
                      {/* Header */}
                      <div className="h-3 bg-gray-200 rounded w-full" />

                      {/* Content Layout */}
                      <div className="flex gap-2 flex-1 flex-col">
                        <div className="flex-1 space-y-1">
                          <div className="h-2 bg-gray-300 rounded" />
                          <div className="h-2 bg-gray-300 rounded w-5/6" />
                          <div className="h-2 bg-gray-300 rounded w-4/6" />
                        </div>
                      </div>
                    </div>

                    {/* Selected Indicator */}
                    {selectedTemplateId === template.id && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          <CheckCircle size={16} />
                        </div>
                      </div>
                    )}

                    {/* Popular Badge */}
                    {template.isPopular && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-yellow-500 text-white">
                          <Star size={12} className="mr-1" />
                          Popular
                        </Badge>
                      </div>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template);
                        }}
                      >
                        <Eye size={14} className="mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTemplateSelect(template);
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                      {template.difficulty && (
                        <Badge variant="outline" className="ml-2">
                          {template.difficulty}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {template.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Palette size={10} className="mr-1" />
                        Color Scheme
                      </Badge>
                    </div>

                    {/* Features */}
                    {template.features && template.features.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Features:</span>{' '}
                        {template.features.slice(0, 3).join(', ')}
                        {template.features.length > 3 && '...'}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template);
                        }}
                      >
                        <Eye size={14} className="mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTemplateSelect(template);
                        }}
                      >
                        {selectedTemplateId === template.id ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Filter size={48} className="mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No templates found</h3>
            <p>Try adjusting your search criteria or clearing the filters.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedStyle('all');
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Template Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-xl font-bold">{previewTemplate.name}</h3>
                  <p className="text-muted-foreground">{previewTemplate.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewTemplate(null)}
                >
                  <X size={16} />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid md:grid-cols-2 gap-6">

                  {/* Preview */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Preview</h4>
                    <div className={`
                      aspect-[4/3] rounded-lg border-2 overflow-hidden
                      bg-gradient-to-br from-${previewTemplate.colorScheme.primary}-50 
                      to-${previewTemplate.colorScheme.secondary}-50
                    `}>
                      {/* Enhanced preview would go here */}
                      <div className="p-6 h-full flex items-center justify-center text-muted-foreground">
                        Detailed preview coming soon
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Features</h4>
                      <div className="space-y-1">
                        {previewTemplate.features?.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Template Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Category:</span>
                          <Badge variant="secondary">{previewTemplate.category}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Difficulty:</span>
                          <Badge variant="secondary">{previewTemplate.difficulty}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Premium:</span>
                          <Badge variant="outline">{previewTemplate.isPremium ? 'Yes' : 'No'}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <Badge variant="outline">{previewTemplate.estimatedTime}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setPreviewTemplate(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    onTemplateSelect(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                >
                  Select This Template
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}