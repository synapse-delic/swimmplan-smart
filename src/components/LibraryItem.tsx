import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Waves, Zap, Flame, Timer, Snowflake, Sliders } from 'lucide-react';
import { BlockTemplate, BlockCategory } from '../types';

interface LibraryItemProps {
  template: BlockTemplate;
  onAdd: (template: BlockTemplate) => void;
  onDeleteTemplate?: (id: string) => void;
}

const getCategoryDetails = (category: BlockCategory) => {
  switch (category) {
    case 'warmup':
      return {
        icon: <Waves size={16} className="text-cat-warmup" />,
        borderColor: 'border-t-4 border-t-cat-warmup',
        colorClass: 'text-cat-warmup',
        badgeBg: 'bg-cat-warmup/10',
        label: 'Warm-up'
      };
    case 'drills':
      return {
        icon: <Zap size={16} className="text-cat-drills" />,
        borderColor: 'border-t-4 border-t-cat-drills',
        colorClass: 'text-cat-drills',
        badgeBg: 'bg-cat-drills/10',
        label: 'Technique / Drills'
      };
    case 'mainset':
      return {
        icon: <Flame size={16} className="text-cat-mainset" />,
        borderColor: 'border-t-4 border-t-cat-mainset',
        colorClass: 'text-cat-mainset',
        badgeBg: 'bg-cat-mainset/10',
        label: 'Main Set'
      };
    case 'sprint':
      return {
        icon: <Timer size={16} className="text-cat-sprint" />,
        borderColor: 'border-t-4 border-t-cat-sprint',
        colorClass: 'text-cat-sprint',
        badgeBg: 'bg-cat-sprint/10',
        label: 'Sprint'
      };
    case 'cooldown':
      return {
        icon: <Snowflake size={16} className="text-cat-cooldown" />,
        borderColor: 'border-t-4 border-t-cat-cooldown',
        colorClass: 'text-cat-cooldown',
        badgeBg: 'bg-cat-cooldown/10',
        label: 'Cooldown'
      };
    default:
      return {
        icon: <Sliders size={16} className="text-brand-black" />,
        borderColor: 'border-t-4 border-t-brand-black',
        colorClass: 'text-brand-black',
        badgeBg: 'bg-synapse-gray',
        label: 'Other'
      };
  }
};

export const LibraryItem: React.FC<LibraryItemProps> = ({
  template,
  onAdd,
  onDeleteTemplate
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: `library-${template.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const { icon, borderColor, colorClass, badgeBg, label } = getCategoryDetails(template.category);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative flex h-[110px] w-[110px] flex-shrink-0 cursor-grab flex-col justify-between rounded-none bg-white border-2 border-brand-black ${borderColor} p-2.5 shadow-[2px_2px_0_rgba(33,33,33,1)] transition-all hover:bg-synapse-gray active:cursor-grabbing md:h-auto md:w-full md:flex-row md:items-center md:gap-4 md:border-t-2 md:border-l-[6px] md:border-l-synapse-petrol md:shadow-[3px_3px_0_rgba(33,33,33,1)] md:p-2.5`}
    >
      <div className="flex flex-col gap-0.5 justify-start md:flex-row md:items-center md:gap-4 md:flex-1">
        {/* Top bar on Mobile / Left icon on Desktop */}
        <div className="flex items-center justify-between md:justify-start">
          <span className={`inline-flex rounded-none border border-brand-black ${badgeBg} p-1 md:p-1.5`}>
            {icon}
          </span>
          
          {/* Quick add / delete buttons as secondary overlay */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(template);
            }}
            className="flex h-5 w-5 items-center justify-center rounded-none border border-brand-black bg-white text-brand-black hover:bg-synapse-petrol hover:text-white transition active:scale-95 md:hidden"
            title="Add"
          >
            <Plus size={10} />
          </button>
        </div>

        {/* Text Details */}
        <div className="mt-1 md:mt-0 md:flex flex-col">
          {/* Category label */}
          <span className={`hidden text-[9px] uppercase tracking-wider font-extrabold md:inline ${colorClass}`}>
            {label}
          </span>
          <h4 className="font-sans text-[11px] font-black text-brand-black line-clamp-1 leading-tight md:text-xs">
            {template.title}
          </h4>
          <p className="font-mono text-[9px] font-bold text-gray-700 line-clamp-1 mt-0.5 md:text-[10px]">
            {template.details || `${template.distance}m | ${template.time} Min`}
          </p>
        </div>
      </div>

      {/* Stats and hover controls for Desktop layout */}
      <div className="hidden items-center gap-3 md:flex">
        <div className="flex flex-col text-right">
          <span className="font-mono text-xs font-black text-brand-black">
            {template.time} Min
          </span>
          <span className="font-mono text-[9px] text-gray-600 font-bold">
            {template.distance}m
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd(template);
          }}
          className="flex h-7 w-7 items-center justify-center rounded-none bg-white text-brand-black border-2 border-brand-black hover:bg-synapse-petrol hover:text-white transition active:translate-x-[1px] active:translate-y-[1px]"
          title="Add"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* For mobile view: bottom indicators inside card */}
      <div className="flex items-center justify-between text-[9px] font-mono font-bold text-gray-700 md:hidden">
        <span>{template.time}m</span>
        <span>{template.distance}m</span>
      </div>
    </div>
  );
};
