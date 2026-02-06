"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface EditableListProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addButtonText?: string;
  className?: string;
  itemClassName?: string;
  emptyMessage?: string;
  disabled?: boolean;
  maxItems?: number;
  renderItem?: (item: string, index: number, onEdit: (value: string) => void, onDelete: () => void) => React.ReactNode;
}

/**
 * EditableList - Inline editable list for array data
 * 
 * Features:
 * - Click on any item to edit inline
 * - Add new items with + button
 * - Delete items with trash icon
 * - No section remounts during editing
 * - Visual feedback for hover/focus states
 * 
 * Use cases:
 * - About highlights
 * - Key highlights
 * - Bullet points
 * - List-based content
 */
export const EditableList: React.FC<EditableListProps> = ({
  items,
  onChange,
  placeholder = 'Enter text...',
  addButtonText = 'Add item',
  className = '',
  itemClassName = '',
  emptyMessage = 'No items yet. Click "Add item" to get started.',
  disabled = false,
  maxItems,
  renderItem,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleEdit = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const handleAdd = () => {
    if (maxItems && items.length >= maxItems) return;
    const newItems = [...items, ''];
    onChange(newItems);
    // Focus on the new item
    setEditingIndex(newItems.length - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setEditingIndex(null);
      // Add new item if it's the last one and has content
      if (index === items.length - 1 && items[index].trim()) {
        handleAdd();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditingIndex(null);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const DefaultItemRenderer = ({ item, index }: { item: string; index: number }) => {
    const isEditing = editingIndex === index;
    const isHovered = hoveredIndex === index;

    return (
      <div
        className={cn(
          'group relative flex items-center gap-2 p-3 rounded-lg transition-all',
          isHovered && !isEditing && 'bg-blue-50/50',
          isEditing && 'bg-blue-50',
          itemClassName
        )}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
      >
        {/* Drag handle (visual only for now) */}
        <div className={cn(
          'opacity-0 group-hover:opacity-50 transition-opacity cursor-grab',
          isEditing && 'opacity-0'
        )}>
          <GripVertical size={16} className="text-gray-400" />
        </div>

        {/* Editable content */}
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={item}
              onChange={(e) => handleEdit(index, e.target.value)}
              onBlur={() => setEditingIndex(null)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              placeholder={placeholder}
              autoFocus
              className={cn(
                'w-full bg-transparent border-none outline-none',
                'focus:ring-2 focus:ring-blue-500/30 rounded px-2 -mx-2'
              )}
            />
          ) : (
            <div
              onClick={() => setEditingIndex(index)}
              className="cursor-text px-2 -mx-2 min-h-[24px]"
            >
              {item || <span className="text-gray-400 italic">{placeholder}</span>}
            </div>
          )}
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(index);
          }}
          className={cn(
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-700',
            isEditing && 'opacity-0'
          )}
          title="Delete item"
        >
          <Trash2 size={14} />
        </button>
      </div>
    );
  };

  return (
    <div className={cn('space-y-2', className)} onClick={handleClick} onMouseDown={handleMouseDown}>
      {items.length === 0 ? (
        <div className="text-sm text-gray-400 italic p-4 text-center border border-dashed border-gray-300 rounded-lg">
          {emptyMessage}
        </div>
      ) : (
        items.map((item, index) => (
          <div key={index}>
            {renderItem ? (
              renderItem(
                item,
                index,
                (value) => handleEdit(index, value),
                () => handleDelete(index)
              )
            ) : (
              <DefaultItemRenderer item={item} index={index} />
            )}
          </div>
        ))
      )}

      {/* Add button */}
      {!disabled && (!maxItems || items.length < maxItems) && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleAdd();
          }}
          className={cn(
            'w-full p-3 border border-dashed border-gray-300 rounded-lg',
            'hover:border-blue-400 hover:bg-blue-50/50 transition-all',
            'flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-blue-600'
          )}
        >
          <Plus size={16} />
          {addButtonText}
        </button>
      )}
    </div>
  );
};
