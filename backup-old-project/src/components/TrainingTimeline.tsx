import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { TrainingBlock } from '../types';
import { SortableTimelineBlock } from './SortableTimelineBlock';

interface TrainingTimelineProps {
  blocks: TrainingBlock[];
  onRemoveBlock: (id: string) => void;
  onEditBlock: (block: TrainingBlock) => void;
  isDragging: boolean;
}

export const TrainingTimeline: React.FC<TrainingTimelineProps> = ({ blocks, onRemoveBlock, onEditBlock, isDragging }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'timeline-droppable',
  });

  const calculateStartTime = (index: number) => {
    let minutes = 9 * 60; // Start at 09:00
    for (let i = 0; i < index; i++) {
      minutes += blocks[i].time;
    }
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timeline-container">
      <h3 className="timeline-section-title">Training Timeline</h3>
      <div className="timeline" ref={setNodeRef}>
        <SortableContext 
          items={blocks.map(b => b.id)} 
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block, index) => (
            <SortableTimelineBlock 
              key={block.id} 
              block={block} 
              startTime={calculateStartTime(index)}
              onRemove={onRemoveBlock} 
              onEdit={onEditBlock}
            />
          ))}
        </SortableContext>

        {(isDragging || blocks.length === 0) && (
          <div className={`drop-zone ${isOver ? 'active' : ''}`}>
            {blocks.length === 0 ? 'Ziehe Übungen hierhin, um den Plan zu starten' : 'Block hier hinzufügen'}
          </div>
        )}
      </div>
    </div>
  );
};
