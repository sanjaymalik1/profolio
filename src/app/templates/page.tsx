"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { enhancedPortfolioTemplates } from "@/lib/portfolio/enhanced-templates";
import { getAllTemplates } from "@/components/templates";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Clock, Zap, Crown, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TemplatesPage() {
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const router = useRouter();
  const actualTemplates = getAllTemplates();
  
  // Only show templates that have actual components
  const availableTemplates = enhancedPortfolioTemplates.filter(template => 
    actualTemplates.some(actualTemplate => actualTemplate.id === template.id)
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Portfolio Templates
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Choose from our professionally designed templates and customize them to match your style.
          </motion.p>
        </div>

        {/* Templates Grid */}
        <div className="flex justify-center mb-16">
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-5xl">
            {availableTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="w-full"
              >
                <Card className="overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 border-0 relative h-full flex flex-col group">
                  <div className="relative">
                    <div className={`h-48 bg-gradient-to-br ${getCategoryColor(template.category)} flex items-center justify-center relative overflow-hidden`}>
                      {/* Template Preview Placeholder */}
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Template Name */}
                      <div className="text-white text-center z-10">
                        <h3 className="text-lg font-semibold mb-1">{template.name}</h3>
                        <p className="text-white/80 text-sm capitalize">{template.category}</p>
                      </div>

                      {/* Premium Badge */}
                      {template.isPremium && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-yellow-500 text-yellow-900 border-0">
                            <Crown className="w-3 h-3 mr-1" />
                            Pro
                          </Badge>
                        </div>
                      )}

                      {/* Popular Badge */}
                      {template.isPopular && !template.isPremium && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-orange-500 text-orange-900 border-0">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        </div>
                      )}

                      {/* Hover Preview Button */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewTemplateId(template.id);
                          }}
                          className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0"
                        >
                          <Eye className="w-4 h-4" />
                          Preview Template
                        </button>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 flex-1 flex flex-col">
                    <div className="space-y-3 flex-1 flex flex-col">
                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {template.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Features */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          {getDifficultyIcon(template.difficulty)}
                          <span className="capitalize">{template.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{template.estimatedTime}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplateId(template.id);
                        }}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm mt-auto"
                      >
                        Preview Template
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Coming Soon Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-gray-500 text-lg">
            More templates coming soon
          </p>
        </motion.div>
      </div>

      {/* Template Preview Modal */}
      <TemplatePreview
        templateId={previewTemplateId}
        isOpen={!!previewTemplateId}
        onClose={() => setPreviewTemplateId(null)}
        onUseTemplate={(templateId) => {
          // Set flags to load the template in editor
          localStorage.setItem('apply_template', 'true');
          localStorage.setItem('selected_template', templateId);
          localStorage.removeItem('current_portfolio');
          router.push('/editor-v2');
          setPreviewTemplateId(null);
        }}
      />
    </div>
  );
}
