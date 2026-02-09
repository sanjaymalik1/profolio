"use client";

import React, { useState } from 'react';
import { MoreVertical, Copy, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorBlockProps {
  blockId: string;
  sectionType?: string;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  children: React.ReactNode;
}

export function EditorBlock({ 
  blockId,
  sectionType,
  isSelected, 
  onSelect,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  children 
}: EditorBlockProps) {
  // Helper to format section type for display
  const formatSectionType = (type?: string) => {
    if (!type) return 'Section';
    return type.charAt(0).toUpperCase() + type.slice(1) + ' Section';
  };
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setShowMenu(false);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      {/* Block Outline - Enhanced selected state with subtle background tint */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none rounded-lg transition-all duration-200",
          isSelected 
            ? "border-2 border-blue-500 bg-blue-50/5 shadow-[0_0_0_4px_rgba(59,130,246,0.12)] opacity-100" 
            : isHovered 
            ? "border-2 border-blue-400/40 opacity-100"
            : "opacity-0"
        )}
        style={{ zIndex: 10 }}
      />

      {/* Section Type Label - Only shown when selected */}
      {isSelected && sectionType && (
        <div
          className="absolute top-2 left-2 z-20 transition-all duration-200 opacity-100"
        >
          <div className="px-2.5 py-1 bg-blue-500 text-white text-xs font-medium rounded-md shadow-sm">
            {formatSectionType(sectionType)}
          </div>
        </div>
      )}

      {/* Block Controls - Pure CSS visibility */}
      <div
        className={cn(
          "absolute top-2 right-2 z-20 transition-opacity duration-200",
          (isHovered || isSelected) ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1">
          {/* Move Up */}
          {canMoveUp && onMoveUp && (
            <button
              type="button"
              onClick={(e) => handleAction(e, onMoveUp)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="Move up"
            >
              <ChevronUp size={16} className="text-gray-600" />
            </button>
          )}

          {/* Move Down */}
          {canMoveDown && onMoveDown && (
            <button
              type="button"
              onClick={(e) => handleAction(e, onMoveDown)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="Move down"
            >
              <ChevronDown size={16} className="text-gray-600" />
            </button>
          )}

          {/* Duplicate */}
          {onDuplicate && (
            <button
              type="button"
              onClick={(e) => handleAction(e, onDuplicate)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="Duplicate block"
            >
              <Copy size={16} className="text-gray-600" />
            </button>
          )}

          {/* Delete */}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => handleAction(e, onDelete)}
              className="p-1.5 rounded hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
              title="Delete block"
            >
              <Trash2 size={16} />
            </button>
          )}

          {/* More Options Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={handleMenuClick}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="More options"
            >
              <MoreVertical size={16} className="text-gray-600" />
            </button>

            {showMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                <div className="px-3 py-2 text-xs text-gray-500">
                  More options coming soon
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section Content - Full pointer events enabled for inline editing */}
      <div className="relative pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
