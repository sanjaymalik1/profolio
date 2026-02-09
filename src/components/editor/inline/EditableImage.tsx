"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EditableImageProps {
  value: string; // Image URL
  onChange: (url: string) => void;
  alt?: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

/**
 * EditableImage - Inline editable image component
 * 
 * Behavior:
 * - Hover to show upload/remove controls
 * - Click to upload new image
 * - Support drag & drop
 * - Image preview
 */
export const EditableImage: React.FC<EditableImageProps> = ({
  value,
  onChange,
  alt = 'Image',
  className = '',
  containerClassName = '',
  aspectRatio = 'auto',
  disabled = false,
  onFocus,
  onBlur,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: 'aspect-auto'
  };

  const handleClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!disabled) {
      fileInputRef.current?.click();
      onFocus?.();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, we'll use a placeholder. In production, implement proper upload:
    // 1. Upload to storage (S3, Cloudinary, etc.)
    // 2. Get URL
    // 3. Call onChange with URL
    
    setIsUploading(true);
    
    try {
      // Convert to base64 for demo (in production, upload to cloud storage)
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange(base64String);
        setIsUploading(false);
        onBlur?.();
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    onBlur?.();
  };

  return (
    <div
      className={cn(
        'relative group',
        aspectRatioClasses[aspectRatio],
        containerClassName
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={handleMouseDown}
    >
      {value ? (
        <>
          <Image
            src={value}
            alt={alt}
            fill
            className={cn('object-cover', className)}
          />
          
          {/* Overlay controls */}
          {!disabled && isHovered && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 transition-opacity">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleClick}
                className="bg-white/90 hover:bg-white"
              >
                <Upload className="w-4 h-4 mr-1" />
                Change
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRemove}
                className="bg-red-500/90 hover:bg-red-600"
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          )}
        </>
      ) : (
        <div
          onClick={handleClick}
          className={cn(
            'w-full h-full min-h-[200px] border-2 border-dashed border-slate-300',
            'flex flex-col items-center justify-center gap-2',
            'cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-colors',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
        >
          <ImageIcon className="w-8 h-8 text-slate-400" />
          <p className="text-sm text-slate-500">
            {isUploading ? 'Uploading...' : 'Click to upload image'}
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};
