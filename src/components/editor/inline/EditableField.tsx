"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'email' | 'tel' | 'url';
  disabled?: boolean;
}

/**
 * EditableField - Controlled inline editable input for structured single values
 * 
 * Unlike EditableText (uncontrolled for free-form text), EditableField uses controlled
 * inputs for structured data like email, phone, URL that need validation/formatting.
 * 
 * Key differences:
 * - Uses <input> instead of contentEditable for better browser support
 * - Controlled component (value always synced with props)
 * - Supports input types (email, tel, url) for mobile keyboards
 * - Commits onChange on blur and Enter
 * - No section remounts when editing
 */
export const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  type = 'text',
  disabled = false,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external changes
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value);
    }
  }, [value, isFocused]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    // Select all on focus for easier editing
    e.target.select();
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Commit change on blur
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setLocalValue(value);
      inputRef.current?.blur();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  return (
    <input
      ref={inputRef}
      type={type}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        'bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-1 -mx-1',
        'w-full transition-all',
        className
      )}
    />
  );
};
