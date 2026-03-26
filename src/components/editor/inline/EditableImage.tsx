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
  emptyStateContent?: React.ReactNode;
  emptyStateClassName?: string;
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
  emptyStateContent,
  emptyStateClassName = '',
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fileInputRef.current?.click();
      onFocus?.();
    }
  };

  const handleUploadTriggerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      handleClick();
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
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          const result = reader.result;
          if (typeof result === 'string') {
            resolve(result);
            return;
          }
          reject(new Error('Failed to read image file'));
        };

        reader.onerror = () => {
          reject(reader.error || new Error('Image upload failed while reading file'));
        };

        reader.onabort = () => {
          reject(new Error('Image upload was aborted'));
        };

        reader.readAsDataURL(file);
      });

      onChange(base64String);
      onBlur?.();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
          onKeyDown={handleUploadTriggerKeyDown}
          className={cn(
            'w-full h-full min-h-[200px] border-2 border-dashed border-slate-300',
            'flex flex-col items-center justify-center gap-2',
            'cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-colors',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
        >
          {emptyStateContent ? (
            <div className={cn('flex flex-col items-center justify-center gap-2 text-center px-3', emptyStateClassName)}>
              {emptyStateContent}
              <p className="text-sm text-slate-500">
                {isUploading ? 'Uploading...' : 'Click to upload image'}
              </p>
            </div>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-slate-400" />
              <p className="text-sm text-slate-500">
                {isUploading ? 'Uploading...' : 'Click to upload image'}
              </p>
            </>
          )}
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
