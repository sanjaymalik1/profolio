"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AboutData, SectionStyling } from '@/types/portfolio';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, User, Globe, Heart, Plus } from 'lucide-react';
import { EditableText } from '@/components/editor/inline/EditableText';
import { EditableImage } from '@/components/editor/inline/EditableImage';
import { EditableList } from '@/components/editor/inline/EditableList';
import { EditableField } from '@/components/editor/inline/EditableField';
import { typography, textColors } from '@/design/typography';
import { spacing, grid } from '@/design/spacing';

interface AboutSectionProps {
  data: AboutData;
  styling: SectionStyling;
  isEditing?: boolean;
  isPublicView?: boolean;
  onEdit?: () => void;
  onDataChange?: (newData: Partial<AboutData>) => void;
  onStylingChange?: (newStyling: Partial<SectionStyling>) => void;
}

export default function AboutSection({ 
  data, 
  styling, 
  isEditing = false, 
  isPublicView = false,
  onEdit,
  onDataChange,
  onStylingChange 
}: AboutSectionProps) {
  // Inline editing mode detection
  const inlineEditMode = isEditing && !isPublicView && !!onDataChange;

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

  const isGridLayout = styling.layout === 'grid';

  return (
    <motion.section 
      className={`relative ${spacing.section}`}
      style={containerStyle}
      initial={!isEditing && styling.animation?.type !== 'none' ? "hidden" : "visible"}
      whileInView={!isEditing ? "visible" : undefined}
      viewport={!isEditing ? { once: true, margin: "-100px" } : undefined}
      variants={!isEditing ? animationVariants : undefined}
      onClick={isEditing ? onEdit : undefined}
    >
      <div className={`${spacing.container} ${spacing.sectionX} relative z-0`}>
        
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
              <EditableText
                value={data.heading || ''}
                onChange={(value) => onDataChange?.({ heading: value })}
                placeholder="About Me"
                className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2"
                as="span"
              />
            ) : (
              data.heading || 'About Me'
            )}
          </h2>
          <div className="w-20 h-1 bg-current mx-auto opacity-50 rounded-full" />
        </motion.div>

        <div className={`grid ${grid.gapLarge} ${isGridLayout ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} items-center`}>
          
          {/* Profile Image */}
          {(data.profileImage || inlineEditMode) && (
            <motion.div 
              className={`${isGridLayout ? 'order-1 lg:order-1' : 'float-left mr-8 mb-4'} ${isGridLayout ? 'justify-self-center' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {inlineEditMode ? (
                <EditableImage
                  value={data.profileImage || ''}
                  onChange={(url) => onDataChange?.({ profileImage: url })}
                  alt="Profile"
                  containerClassName={`${isGridLayout ? 'w-80 h-80' : 'w-48 h-48'}`}
                  className="rounded-2xl shadow-2xl"
                  aspectRatio="square"
                />
              ) : (
                <div className="relative">
                  <div className={`${isGridLayout ? 'w-80 h-80' : 'w-48 h-48'} rounded-2xl overflow-hidden shadow-2xl`}>
                    <Image
                      src={data.profileImage!}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-current/10 rounded-full -z-10" />
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-current/5 rounded-full -z-10" />
                </div>
              )}
            </motion.div>
          )}

          {/* Content */}
          <motion.div 
            className={`${isGridLayout ? 'order-2 lg:order-2' : ''} space-y-6`}
            initial={{ opacity: 0, x: isGridLayout ? 30 : 0, y: isGridLayout ? 0 : 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            
            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              <p className={`${typography.body} ${textColors.secondary}`}>
                {inlineEditMode ? (
                  <EditableText
                    value={data.content || ''}
                    onChange={(value) => onDataChange?.({ content: value })}
                    placeholder="Tell your story here. Share your background, experience, and what drives you."
                    className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2 block min-h-[100px]"
                    as="span"
                    multiline
                  />
                ) : (
                  data.content || 'Tell your story here. Share your background, experience, and what drives you.'
                )}
              </p>
            </div>

            {/* Highlights */}
            {(data.highlights && data.highlights.length > 0) || inlineEditMode ? (
              <div className={spacing.contentGap}>
                <h3 className={`${typography.subsectionTitle} ${spacing.marginBottom.small}`}>Key Highlights</h3>
                {inlineEditMode && (!data.highlights || data.highlights.length === 0) ? (
                  <div className="py-8 px-4 border-2 border-dashed border-slate-200 rounded-lg text-center">
                    <CheckCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 mb-3">Click below to add your first highlight</p>
                    <EditableList
                      items={data.highlights || []}
                      onChange={(items) => onDataChange?.({ highlights: items })}
                      placeholder="Enter a highlight..."
                      addButtonText="Add highlight"
                      emptyMessage=""
                      renderItem={(item, index, onEdit, onDelete) => (
                        <motion.div
                          key={index}
                          className="flex items-start gap-3 group"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                        >
                          <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => onEdit(e.target.value)}
                            onBlur={() => {
                              if (!item.trim()) onDelete();
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            placeholder="Enter a highlight..."
                            className="flex-1 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2 text-current/80"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete();
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <span className="text-xs">×</span>
                          </button>
                        </motion.div>
                      )}
                    />
                  </div>
                ) : inlineEditMode ? (
                  <EditableList
                    items={data.highlights || []}
                    onChange={(items) => onDataChange?.({ highlights: items })}
                    placeholder="Enter a highlight..."
                    addButtonText="Add highlight"
                    emptyMessage="No highlights yet. Click 'Add highlight' to get started."
                    renderItem={(item, index, onEdit, onDelete) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3 group"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                      >
                        <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => onEdit(e.target.value)}
                          onBlur={() => {
                            if (!item.trim()) onDelete();
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                          placeholder="Enter a highlight..."
                          className="flex-1 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2 text-current/80"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <span className="text-xs">×</span>
                        </button>
                      </motion.div>
                    )}
                  />
                ) : (
                  data.highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    >
                      <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                      <span className="text-current/80">{highlight}</span>
                    </motion.div>
                  ))
                )}
              </div>
            ) : null}
          </motion.div>
        </div>

        {/* Personal Info Cards */}
        {data.personalInfo && (
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {/* Grid with items-stretch for equal height cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              
              {/* Personal Card */}
              {((data.personalInfo.age || data.personalInfo.location) || inlineEditMode) && (
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Header - Fixed */}
                    <div className="mb-6">
                      <User className="mx-auto mb-3 text-current/60" size={32} />
                      <h4 className="font-semibold text-base text-center">Personal</h4>
                    </div>
                    
                    {/* Content - Flexible, no overflow, natural wrapping */}
                    <div className="flex-1 w-full flex flex-col gap-3 justify-start">
                      {inlineEditMode ? (
                        <>
                          <div className="flex items-center justify-center gap-2 text-sm text-current/70">
                            <span className="text-current/60 whitespace-nowrap">Age:</span>
                            <EditableField
                              value={data.personalInfo?.age?.toString() || ''}
                              onChange={(value) => onDataChange?.({ 
                                personalInfo: { 
                                  ...data.personalInfo, 
                                  age: value ? parseInt(value) : undefined 
                                } 
                              })}
                              placeholder="25"
                              type="text"
                              className="w-16 text-center"
                            />
                          </div>
                          <EditableField
                            value={data.personalInfo?.location || ''}
                            onChange={(value) => onDataChange?.({ 
                              personalInfo: { 
                                ...data.personalInfo, 
                                location: value 
                              } 
                            })}
                            placeholder="City, Country"
                            className="text-center text-sm text-current/70"
                          />
                        </>
                      ) : (
                        <>
                          {data.personalInfo.age && (
                            <p className="text-center text-sm text-current/70 whitespace-normal break-words">
                              Age: {data.personalInfo.age}
                            </p>
                          )}
                          {data.personalInfo.location && (
                            <p className="text-center text-sm text-current/70 whitespace-normal break-words">
                              {data.personalInfo.location}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Footer - Separate block (empty for Personal) */}
                    <div className="mt-6" />
                  </CardContent>
                </Card>
              )}

              {/* Languages Card */}
              {((data.personalInfo.languages && data.personalInfo.languages.length > 0) || inlineEditMode) && (
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Header - Fixed */}
                    <div className="mb-6">
                      <Globe className="mx-auto mb-3 text-current/60" size={32} />
                      <h4 className="font-semibold text-base text-center">Languages</h4>
                    </div>
                    
                    {/* Content - Flexible, no overflow, natural wrapping */}
                    <div className="flex-1 w-full flex flex-col gap-2 justify-start items-center">
                      {inlineEditMode ? (
                        <>
                          {(!data.personalInfo?.languages || data.personalInfo.languages.length === 0) ? (
                            <p className="text-sm text-current/50 py-4">No languages yet</p>
                          ) : (
                            data.personalInfo.languages.map((language, index) => (
                              <div key={index} className="flex items-center gap-2 group w-full max-w-xs">
                                <input
                                  type="text"
                                  value={language}
                                  onChange={(e) => {
                                    const newLanguages = [...(data.personalInfo?.languages || [])];
                                    newLanguages[index] = e.target.value;
                                    onDataChange?.({
                                      personalInfo: {
                                        ...data.personalInfo,
                                        languages: newLanguages
                                      }
                                    });
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  className="flex-1 min-w-0 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 py-1 text-sm"
                                  placeholder="Enter language..."
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newLanguages = (data.personalInfo?.languages || []).filter((_, i) => i !== index);
                                    onDataChange?.({
                                      personalInfo: {
                                        ...data.personalInfo,
                                        languages: newLanguages
                                      }
                                    });
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-700 text-xs flex-shrink-0"
                                >
                                  ×
                                </button>
                              </div>
                            ))
                          )}
                        </>
                      ) : (
                        <div className="flex flex-wrap gap-2 justify-center items-center w-full">
                          {data.personalInfo.languages.map((language, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Footer - Separate block for actions */}
                    {inlineEditMode && (
                      <div className="mt-6 pt-4 border-t border-dashed border-slate-300">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newLanguages = [...(data.personalInfo?.languages || []), ''];
                            onDataChange?.({
                              personalInfo: {
                                ...data.personalInfo,
                                languages: newLanguages
                              }
                            });
                          }}
                          className="w-full py-3 px-4 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 rounded-lg transition-all flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-slate-400"
                        >
                          <Plus size={16} />
                          Add language
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Interests Card */}
              {((data.personalInfo?.interests && data.personalInfo.interests.length > 0) || inlineEditMode) && (
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Header - Fixed */}
                    <div className="mb-6">
                      <Heart className="mx-auto mb-3 text-current/60" size={32} />
                      <h4 className="font-semibold text-base text-center">Interests</h4>
                    </div>
                    
                    {/* Content - Flexible, no overflow, natural wrapping */}
                    <div className="flex-1 w-full flex flex-col gap-2 justify-start items-center">
                      {inlineEditMode ? (
                        <>
                          {(!data.personalInfo?.interests || data.personalInfo.interests.length === 0) ? (
                            <p className="text-sm text-current/50 py-4">No interests yet</p>
                          ) : (
                            data.personalInfo.interests.map((interest, index) => (
                              <div key={index} className="flex items-center gap-2 group w-full max-w-xs">
                                <input
                                  type="text"
                                  value={interest}
                                  onChange={(e) => {
                                    const newInterests = [...(data.personalInfo?.interests || [])];
                                    newInterests[index] = e.target.value;
                                    onDataChange?.({
                                      personalInfo: {
                                        ...data.personalInfo,
                                        interests: newInterests
                                      }
                                    });
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  className="flex-1 min-w-0 bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 py-1 text-sm"
                                  placeholder="Enter interest..."
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newInterests = (data.personalInfo?.interests || []).filter((_, i) => i !== index);
                                    onDataChange?.({
                                      personalInfo: {
                                        ...data.personalInfo,
                                        interests: newInterests
                                      }
                                    });
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-700 text-xs flex-shrink-0"
                                >
                                  ×
                                </button>
                              </div>
                            ))
                          )}
                        </>
                      ) : (
                        <div className="flex flex-wrap gap-2 justify-center items-center w-full">
                          {data.personalInfo.interests.map((interest, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Footer - Separate block for actions */}
                    {inlineEditMode && (
                      <div className="mt-6 pt-4 border-t border-dashed border-slate-300">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newInterests = [...(data.personalInfo?.interests || []), ''];
                            onDataChange?.({
                              personalInfo: {
                                ...data.personalInfo,
                                interests: newInterests
                              }
                            });
                          }}
                          className="w-full py-3 px-4 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50/50 rounded-lg transition-all flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-slate-400"
                        >
                          <Plus size={16} />
                          Add interest
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
        )}

        {/* Quote or Call to Action */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <blockquote className="text-xl lg:text-2xl font-light italic text-current/80 max-w-3xl mx-auto">
            {inlineEditMode ? (
              <EditableText
                value={data.quote || 'The best way to predict the future is to create it.'}
                onChange={(value) => onDataChange?.({ quote: value })}
                placeholder="Enter an inspirational quote..."
                className="outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2"
                as="span"
              />
            ) : (
              `"${data.quote || 'The best way to predict the future is to create it.'}"`
            )}
          </blockquote>
          <div className="mt-4 w-32 h-0.5 bg-current/30 mx-auto" />
        </motion.div>
      </div>
    </motion.section>
  );
}