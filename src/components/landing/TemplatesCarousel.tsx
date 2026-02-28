"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { enhancedPortfolioTemplates } from "@/lib/portfolio/enhanced-templates";
import { getAllTemplates } from "@/components/templates";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Zap, Crown, Eye } from "lucide-react";

export default function TemplatesCarousel() {
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const router = useRouter();
  const actualTemplates = getAllTemplates(); // Get actual template components
  // Only show templates that have actual components
  const featuredTemplates = enhancedPortfolioTemplates.filter(template =>
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
    <section id="templates" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4"
          >
            Professional Templates
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4"
          >
            Choose from our curated collection of modern, responsive templates designed for different professions and styles.
          </motion.p>
        </div>

        <div className="flex justify-center">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full">
            {featuredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="w-full"
              >
                <Card className="overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 border-0 relative h-full flex flex-col group">
                  <div className="relative">
                    <div className={`h-40 sm:h-48 lg:h-52 bg-gradient-to-br ${getCategoryColor(template.category)} flex items-center justify-center relative overflow-hidden`}>
                      {/* Template Preview Placeholder */}
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Template Name */}
                      <div className="text-white text-center z-10 px-4">
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-1">{template.name}</h3>
                        <p className="text-white/80 text-xs sm:text-sm">{template.category}</p>
                      </div>

                      {/* Premium Badge */}
                      {template.isPremium && (
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                          <Badge variant="secondary" className="bg-yellow-500 text-yellow-900 border-0 text-xs">
                            <Crown className="w-3 h-3 mr-1" />
                            Pro
                          </Badge>
                        </div>
                      )}

                      {/* Popular Badge */}
                      {template.isPopular && !template.isPremium && (
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                          <Badge variant="secondary" className="bg-orange-500 text-orange-900 border-0 text-xs">
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
                          className="bg-white text-gray-900 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0"
                        >
                          <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span className="hidden sm:inline">Preview Template</span>
                          <span className="sm:hidden">Preview</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
                    <div className="space-y-2 sm:space-y-3 flex-1 flex flex-col">
                      {/* Description */}
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
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
                        className="w-full bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-xs sm:text-sm mt-auto"
                      >
                        <span className="hidden sm:inline">Preview Template</span>
                        <span className="sm:hidden">Preview</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        {/* View All Templates Button */}
        <div className="text-center mt-10 sm:mt-12">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/templates')}
            className="bg-gray-900 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-gray-800 transition-colors"
          >
            View All Templates →
          </motion.button>

        </div>

        {/* Template Preview Modal */}
        <TemplatePreview
          templateId={previewTemplateId}
          isOpen={!!previewTemplateId}
          onClose={() => setPreviewTemplateId(null)}
          onUseTemplate={() => {
            // Navigate to editor with the template
            router.push('/editor-v2');
            setPreviewTemplateId(null);
          }}
        />
      </div>
    </section>
  );
}