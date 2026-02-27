"use client";

import React from 'react';
import { useDrop } from 'react-dnd';
import type { DropTargetMonitor } from 'react-dnd';
import { DragItem, DroppableProps } from '@/types/editor';

export const Droppable: React.FC<DroppableProps> = ({
  children,
  accept,
  onDrop,
  canDrop,
  className = ''
}) => {
  const [{ isOver, canDropItem }, drop] = useDrop(() => ({
    accept,
    drop: (item: DragItem, monitor: DropTargetMonitor) => {
      if (!monitor.didDrop()) {
        onDrop(item, monitor);
      }
    },
    canDrop: (item: DragItem) => {
      return canDrop ? canDrop(item) : true;
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDropItem: monitor.canDrop(),
    }),
  }), [accept, onDrop, canDrop]);

  const dropIndicatorClass = isOver && canDropItem 
    ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50'
    : '';

  return (
    <div
      ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
      className={`transition-all duration-200 ${dropIndicatorClass} ${className}`}
    >
      {children}
    </div>
  );
};