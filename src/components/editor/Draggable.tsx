"use client";

import React from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { DragItem, DraggableProps } from '@/types/editor';

export const Draggable: React.FC<DraggableProps> = ({
  children,
  dragItem,
  canDrag = true,
  onDragStart,
  onDragEnd
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: dragItem.type,
    item: () => {
      onDragStart?.();
      return dragItem;
    },
    canDrag,
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item: any, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult() as any;
      onDragEnd?.(dropResult);
    }
  }), [dragItem, canDrag, onDragStart, onDragEnd]);

  return (
    <div
      ref={drag as any}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: canDrag ? 'grab' : 'default',
      }}
      className={`transition-opacity duration-200 ${isDragging ? 'scale-95' : ''}`}
    >
      {children}
    </div>
  );
};