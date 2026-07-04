import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TrainingBlock } from '../types';
import { Block } from './Block';

interface SortableTimelineBlockProps {
  block: TrainingBlock;
  startTime: string;
  onRemove: (id: string) => void;
  onEdit?: (block: TrainingBlock) => void;
}

export const SortableTimelineBlock: React.FC<SortableTimelineBlockProps> = ({ block, startTime, onRemove, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: block.id,
    data: {
      type: 'TimelineBlock',
      block,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="timeline-block-wrapper">
      <div className="timeline-time-col">
        <span className="time-text">{startTime}</span>
        <span className="duration-text">{block.time}m</span>
      </div>
      <div className="timeline-line-col">
        <div className={`timeline-dot ${block.category}-dot`}></div>
      </div>
      <div className="timeline-content-col">
        <Block 
          block={block} 
          variant="timeline"
          onRemove={onRemove}
          onEdit={onEdit}
          dragHandleListeners={listeners}
          dragHandleAttributes={attributes}
        />
      </div>
    </div>
  );
};
