import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { BlockTemplate } from '../types';
import { Block } from './Block';

interface DraggableLibraryBlockProps {
  template: BlockTemplate;
  onEdit?: (template: BlockTemplate) => void;
}

export const DraggableLibraryBlock: React.FC<DraggableLibraryBlockProps> = ({ template, onEdit }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `template-${template.id}`,
    data: {
      type: 'LibraryBlock',
      template,
    },
  });

  return (
    <div 
      ref={setNodeRef} 
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <Block 
        block={template} 
        variant="library"
        onEdit={onEdit}
        dragHandleListeners={listeners}
        dragHandleAttributes={attributes}
      />
    </div>
  );
};
