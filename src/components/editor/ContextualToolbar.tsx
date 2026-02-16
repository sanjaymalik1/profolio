"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
} from 'lucide-react';

export interface TextFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  align?: 'left' | 'center' | 'right';
}

interface ContextualToolbarProps {
  selection: Selection | null;
  formatting: TextFormatting;
  onChange: (formatting: Partial<TextFormatting>) => void;
  onClose: () => void;
  containerRef?: React.RefObject<HTMLElement>;
}

const fontSizePresets = [
  { value: 'sm', label: 'Small', className: 'text-sm' },
  { value: 'base', label: 'Normal', className: 'text-base' },
  { value: 'lg', label: 'Large', className: 'text-lg' },
  { value: 'xl', label: 'XL', className: 'text-xl' },
  { value: '2xl', label: '2XL', className: 'text-2xl' },
] as const;

const colorPresets = [
  { value: '#000000', label: 'Black' },
  { value: '#374151', label: 'Gray' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#ef4444', label: 'Red' },
  { value: '#f59e0b', label: 'Orange' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
];

/**
 * ContextualToolbar - Floating toolbar for text formatting
 * 
 * Appears near text selection to provide contextual editing controls.
 * Positions itself above or below the selection based on available space.
 * 
 * Features:
 * - Text formatting (bold, italic, underline)
 * - Font size presets
 * - Text color picker
 * - Text alignment
 * - Auto-positioning to avoid viewport edges
 * - Click/interaction isolation to prevent re-renders
 * 
 * Architecture:
 * - Pure presentation component (no global state)
 * - Parent controls when to show/hide
 * - All interactions via onChange callback
 * - No direct DOM manipulation of editable content
 */
export const ContextualToolbar: React.FC<ContextualToolbarProps> = ({
  selection,
  formatting,
  onChange,
  onClose,
  containerRef,
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);

  // Calculate toolbar position based on selection
  useEffect(() => {
    if (!selection || selection.rangeCount === 0) {
      setPosition(null);
      return;
    }

    const calculatePosition = () => {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const toolbarHeight = 48; // Approximate toolbar height
      const toolbarWidth = 400; // Approximate toolbar width
      const padding = 8;

      // Get container bounds if provided
      const containerBounds = containerRef?.current?.getBoundingClientRect();

      // Calculate ideal position (above selection by default)
      let top = rect.top - toolbarHeight - padding;
      let left = rect.left + (rect.width / 2) - (toolbarWidth / 2);

      // Check if toolbar would go above viewport
      if (top < padding) {
        // Position below selection instead
        top = rect.bottom + padding;
      }

      // Keep within horizontal bounds
      if (left < padding) {
        left = padding;
      } else if (left + toolbarWidth > window.innerWidth - padding) {
        left = window.innerWidth - toolbarWidth - padding;
      }

      setPosition({ top, left });
    };

    calculatePosition();

    // Recalculate on scroll or resize
    window.addEventListener('scroll', calculatePosition, true);
    window.addEventListener('resize', calculatePosition);

    return () => {
      window.removeEventListener('scroll', calculatePosition, true);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [selection, containerRef]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent selection changes
  };

  const toggleFormat = (format: keyof TextFormatting) => {
    onChange({ [format]: !formatting[format] });
  };

  const setAlignment = (align: 'left' | 'center' | 'right') => {
    onChange({ align });
  };

  const setFontSize = (fontSize: TextFormatting['fontSize']) => {
    onChange({ fontSize });
    setShowFontSize(false);
  };

  const setColor = (color: string) => {
    onChange({ color });
    setShowColorPicker(false);
  };

  if (!position) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[100] bg-white border border-gray-200 rounded-lg shadow-lg px-2 sm:px-2 py-2 sm:py-2"
      style={{
        top: position.top,
        left: position.left,
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center gap-1 sm:gap-1">
        {/* Text Formatting - touch-friendly buttons */}
        <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 sm:pr-2 mr-1">
          <button
            type="button"
            onClick={() => toggleFormat('bold')}
            className={cn(
              'p-2 sm:p-2 rounded hover:bg-gray-100 transition-colors touch-manipulation',
              formatting.bold && 'bg-gray-200'
            )}
            title="Bold"
          >
            <Bold size={16} className="sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('italic')}
            className={cn(
              'p-2 sm:p-2 rounded hover:bg-gray-100 transition-colors touch-manipulation',
              formatting.italic && 'bg-gray-200'
            )}
            title="Italic"
          >
            <Italic size={16} className="sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('underline')}
            className={cn(
              'p-2 rounded hover:bg-gray-100 transition-colors',
              formatting.underline && 'bg-gray-200'
            )}
            title="Underline"
          >
            <Underline size={16} />
          </button>
        </div>

        {/* Font Size */}
        <div className="relative border-r border-gray-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => setShowFontSize(!showFontSize)}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Font Size"
          >
            <Type size={16} />
          </button>
          {showFontSize && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px]">
              {fontSizePresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setFontSize(preset.value)}
                  className={cn(
                    'w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors',
                    formatting.fontSize === preset.value && 'bg-gray-200 font-medium'
                  )}
                >
                  <span className={preset.className}>{preset.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Color */}
        <div className="relative border-r border-gray-200 pr-2 mr-1">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title="Text Color"
          >
            <Palette size={16} />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
              <div className="grid grid-cols-4 gap-1">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setColor(preset.value)}
                    className={cn(
                      'w-8 h-8 rounded border-2 hover:scale-110 transition-transform',
                      formatting.color === preset.value
                        ? 'border-blue-500'
                        : 'border-gray-300'
                    )}
                    style={{ backgroundColor: preset.value }}
                    title={preset.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setAlignment('left')}
            className={cn(
              'p-2 rounded hover:bg-gray-100 transition-colors',
              formatting.align === 'left' && 'bg-gray-200'
            )}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => setAlignment('center')}
            className={cn(
              'p-2 rounded hover:bg-gray-100 transition-colors',
              formatting.align === 'center' && 'bg-gray-200'
            )}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => setAlignment('right')}
            className={cn(
              'p-2 rounded hover:bg-gray-100 transition-colors',
              formatting.align === 'right' && 'bg-gray-200'
            )}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
