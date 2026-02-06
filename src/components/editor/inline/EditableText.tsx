"use client";

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  multiline?: boolean;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

/**
 * EditableText - Fully uncontrolled inline editable text (Notion/Framer-style)
 * 
 * Critical: This component NEVER triggers re-renders during typing.
 * - contentEditable is always true
 * - Browser manages text during editing
 * - onChange called ONLY on blur/Enter (commit time)
 * - No state updates, no parent re-renders while typing
 */
export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  placeholder = 'Type something...',
  className = '',
  as: Component = 'p',
  multiline = false,
  disabled = false,
  onFocus,
  onBlur,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Set initial content only on mount
  useEffect(() => {
    if (ref.current && ref.current.textContent === '') {
      ref.current.textContent = value || '';
    }
  }, []);

  // Sync external changes ONLY when not focused (user not editing)
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      if (ref.current.textContent !== value) {
        ref.current.textContent = value || '';
      }
    }
  }, [value]);

  const commitChange = () => {
    if (ref.current) {
      const newValue = ref.current.textContent || '';
      // Only call onChange if value actually changed
      if (newValue !== value) {
        onChange(newValue);
      }
    }
  };

  const handleBlur = () => {
    commitChange();
    onBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      // Restore original value without calling onChange
      if (ref.current) {
        ref.current.textContent = value || '';
      }
      ref.current?.blur();
    }
    
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      commitChange();
      ref.current?.blur();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  // Prevent click events from bubbling to parent (EditorBlock)
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <Component
      ref={ref}
      contentEditable={!disabled}
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      className={cn(
        'outline-none cursor-text',
        'focus:ring-2 focus:ring-blue-500/30 rounded',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      role="textbox"
      aria-label={placeholder}
      style={{
        minWidth: '2ch',
        display: 'inline-block'
      }}
    />
  );
};
