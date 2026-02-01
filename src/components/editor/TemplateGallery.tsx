"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { enhancedPortfolioTemplates } from '@/lib/portfolio/enhanced-templates';
import { getAllTemplates } from '@/components/templates';
import { TemplatePreview } from '@/components/templates/TemplatePreview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Star, 
  Clock, 
  Zap, 
  Crown, 
  Filter,
  Search,
  Grid3X3,
  List,
  X
} from 'lucide-react';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateGallery({ isOpen, onClose, onSelectTemplate }: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  // Filter templates to only show those with actual components
  const actualTemplates = getAllTemplates();
  const availableTemplates = enhancedPortfolioTemplates.filter(template => 
    actualTemplates.some(actualTemplate => actualTemplate.id === template.id)
  );

  const categories = ['all', ...Array.from(new Set(availableTemplates.map(t => t.category)))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredTemplates = availableTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'developer':
        return 'from-blue-500 to-indigo-600';
      case 'creative':
        return 'from-purple-500 to-pink-600';
      case 'business':
        return 'from-gray-600 to-gray-800';
      case 'freelancer':
        return 'from-green-500 to-teal-600';
      default:
        return 'from-blue-500 to-purple-600';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Zap className="w-3 h-3" />;
      case 'intermediate':
        return <Star className="w-3 h-3" />;
      case 'advanced':
        return <Crown className="w-3 h-3" />;
      default:
        return <Zap className="w-3 h-3" />;
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    onSelectTemplate(templateId);
    onClose();
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose a Template</DialogTitle>
          <DialogDescription>
            Select a professional template to start building your portfolio
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="space-y-4 border-b pb-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>

              {/* Quick Filter Badges */}
              {(selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
                <div className="flex items-center gap-2">
                  {selectedCategory !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {selectedCategory}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => setSelectedCategory('all')}
                      />
                    </Badge>
                  )}
                  {selectedDifficulty !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      {selectedDifficulty}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => setSelectedDifficulty('all')}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}  
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden"
              >
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="capitalize"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map((difficulty) => (
                      <Button
                        key={difficulty}
                        variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className="capitalize"
                      >
                        {difficulty}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSelectTemplate(template.id)}
              >
                <Card className={`overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 ${
                  viewMode === 'list' ? 'flex flex-row' : ''
                }`}>
                  <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                    <div className={`${viewMode === 'list' ? 'h-32' : 'h-48'} bg-gradient-to-br ${getCategoryColor(template.category)} flex items-center justify-center relative overflow-hidden`}>
                      {/* Template Preview */}
                      <div className="text-white text-center z-10">
                        <h3 className={`font-semibold mb-1 ${viewMode === 'list' ? 'text-sm' : 'text-lg'}`}>
                          {template.name}
                        </h3>
                        <p className={`text-white/80 ${viewMode === 'list' ? 'text-xs' : 'text-sm'}`}>
                          {template.category}
                        </p>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-2 right-2 space-y-1">
                        {template.isPremium && (
                          <Badge variant="secondary" className="bg-yellow-500 text-yellow-900 border-0 text-xs">
                            <Crown className="w-3 h-3 mr-1" />
                            Pro
                          </Badge>
                        )}
                        {template.isPopular && !template.isPremium && (
                          <Badge variant="secondary" className="bg-orange-500 text-orange-900 border-0 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm flex items-center justify-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-white text-gray-900 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewTemplateId(template.id);
                          }}
                        >
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-blue-600 text-white hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTemplate(template.id);
                          }}
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardContent className={`p-4 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                    <div className="space-y-3">
                      {/* Description */}
                      <p className={`text-gray-600 ${viewMode === 'list' ? 'text-sm' : 'text-sm'} ${viewMode === 'grid' ? 'line-clamp-2' : ''}`}>
                        {template.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, viewMode === 'list' ? 5 : 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > (viewMode === 'list' ? 5 : 3) && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tags.length - (viewMode === 'list' ? 5 : 3)}
                          </Badge>
                        )}
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {getDifficultyIcon(template.difficulty)}
                            <span className="capitalize">{template.difficulty}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{template.estimatedTime}</span>
                          </div>
                        </div>
                        {viewMode === 'list' && (
                          <Button size="sm" className="ml-4">
                            Select
                          </Button>
                        )}
                      </div>

                      {/* Features */}
                      {viewMode === 'list' && (
                        <div className="text-xs text-gray-500">
                          <div className="font-medium mb-1">Features:</div>
                          <ul className="space-y-1">
                            {template.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx}>• {feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="text-lg mb-2">No templates found</div>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="border-t pt-4 text-sm text-gray-500">
          Showing {filteredTemplates.length} of {availableTemplates.length} templates
        </div>
      </DialogContent>
    </Dialog>

    {/* Template Preview Modal */}
    <TemplatePreview
      templateId={previewTemplateId}
      isOpen={!!previewTemplateId}
      onClose={() => setPreviewTemplateId(null)}
      onUseTemplate={(templateId) => {
        setPreviewTemplateId(null);
        onSelectTemplate(templateId);
        onClose();
      }}
    />
    </>
  );
}