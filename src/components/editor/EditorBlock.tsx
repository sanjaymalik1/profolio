"use client";

import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorBlockProps {
  blockId: string;
  isSelected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}

export function EditorBlock({ 
  blockId, 
  isSelected, 
  onSelect, 
  children 
}: EditorBlockProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Block Outline - Pure CSS, no conditional rendering */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none rounded-lg transition-all duration-200",
          isSelected 
            ? "border-2 border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)] opacity-100" 
            : isHovered 
            ? "border-2 border-blue-500/30 opacity-100"
            : "opacity-0"
        )}
        style={{ zIndex: 10 }}
      />

      {/* Block Controls Menu - Pure CSS visibility */}
      <div
        className={cn(
          "absolute top-2 right-2 z-20 pointer-events-auto transition-opacity duration-200",
          (isHovered || isSelected) ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <button
          className="p-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          title="Block options"
        >
          <MoreVertical size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Section Content - Full pointer events enabled for inline editing */}
      <div className="relative pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
