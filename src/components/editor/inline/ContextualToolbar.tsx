"use client";

import React, { useEffect, useState } from 'react';
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Minus,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ContextualToolbarProps {
  visible: boolean;
  position?: { x: number; y: number };
  onStyleChange?: (style: StyleUpdate) => void;
  currentStyles?: TextStyles;
}

interface StyleUpdate {
  type: 'alignment' | 'fontSize' | 'color' | 'fontWeight' | 'fontStyle';
  value: string | number;
}

interface TextStyles {
  alignment?: 'left' | 'center' | 'right';
  fontSize?: number;
  color?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
}

/**
 * ContextualToolbar - Floating toolbar that appears when user selects text (Notion-style)
 * 
 * Features:
 * - Text formatting (bold, italic, underline)
 * - Alignment (left, center, right)
 * - Font size
 * - Color picker
 */
export const ContextualToolbar: React.FC<ContextualToolbarProps> = ({
  visible,
  position,
  onStyleChange,
  currentStyles = {},
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !visible) return null;

  const handleAlignment = (align: 'left' | 'center' | 'right') => {
    onStyleChange?.({ type: 'alignment', value: align });
  };

  const handleFontSize = (delta: number) => {
    const currentSize = currentStyles.fontSize || 16;
    const newSize = Math.max(12, Math.min(72, currentSize + delta));
    onStyleChange?.({ type: 'fontSize', value: newSize });
  };

  const handleBold = () => {
    const newWeight = currentStyles.fontWeight === 'bold' ? 'normal' : 'bold';
    onStyleChange?.({ type: 'fontWeight', value: newWeight });
  };

  const handleItalic = () => {
    const newStyle = currentStyles.fontStyle === 'italic' ? 'normal' : 'italic';
    onStyleChange?.({ type: 'fontStyle', value: newStyle });
  };

  return (
    <div
      className={cn(
        'fixed z-50 bg-white border border-slate-200 shadow-lg rounded-lg',
        'flex items-center gap-1 p-1.5',
        'transition-opacity duration-200',
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      style={{
        top: position?.y ? `${position.y - 60}px` : '50%',
        left: position?.x ? `${position.x}px` : '50%',
        transform: position ? 'translateX(-50%)' : 'translate(-50%, -50%)',
      }}
    >
      {/* Text Formatting */}
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          'h-8 w-8 p-0',
          currentStyles.fontWeight === 'bold' && 'bg-slate-100'
        )}
        onClick={handleBold}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className={cn(
          'h-8 w-8 p-0',
          currentStyles.fontStyle === 'italic' && 'bg-slate-100'
        )}
        onClick={handleItalic}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Alignment */}
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          'h-8 w-8 p-0',
          currentStyles.alignment === 'left' && 'bg-slate-100'
        )}
        onClick={() => handleAlignment('left')}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className={cn(
          'h-8 w-8 p-0',
          currentStyles.alignment === 'center' && 'bg-slate-100'
        )}
        onClick={() => handleAlignment('center')}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        className={cn(
          'h-8 w-8 p-0',
          currentStyles.alignment === 'right' && 'bg-slate-100'
        )}
        onClick={() => handleAlignment('right')}
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Font Size */}
      <div className="flex items-center gap-0.5 bg-slate-50 rounded px-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => handleFontSize(-2)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="text-xs font-medium text-slate-600 min-w-[2rem] text-center">
          {currentStyles.fontSize || 16}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => handleFontSize(2)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Color Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Palette className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="center">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-700">Text Color</p>
            <div className="grid grid-cols-6 gap-2">
              {[
                '#000000', '#374151', '#6B7280', '#9CA3AF',
                '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
                '#8B5CF6', '#EC4899', '#FFFFFF', '#F3F4F6'
              ].map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-slate-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => onStyleChange?.({ type: 'color', value: color })}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
