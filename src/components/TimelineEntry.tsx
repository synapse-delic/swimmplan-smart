import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2, Trash2, Clock, Flame, Zap, Timer, Waves, Snowflake, Sliders } from 'lucide-react';
import { TrainingBlock, BlockCategory } from '../types';
import { CATEGORY_LABELS } from '../defaultData';

interface TimelineEntryProps {
  block: TrainingBlock;
  index: number;
  startTimeStr: string;
  onEdit: (block: TrainingBlock) => void;
  onDelete: (id: string) => void;
}

// Icon helper function based on BlockCategory
const getCategoryIcons = (category: BlockCategory) => {
  switch (category) {
    case 'warmup':
      return {
        icon1: <Waves size={14} className="text-cat-warmup" />,
        icon2: <Clock size={14} className="text-cat-warmup" />,
        borderColor: 'border-l-[4px] border-l-cat-warmup',
        colorClass: 'text-cat-warmup',
        label: CATEGORY_LABELS.warmup
      };
    case 'drills':
      return {
        icon1: <Zap size={14} className="text-cat-drills" />,
        icon2: <Clock size={14} className="text-cat-drills" />,
        borderColor: 'border-l-[4px] border-l-cat-drills',
        colorClass: 'text-cat-drills',
        label: CATEGORY_LABELS.drills
      };
    case 'mainset':
      return {
        icon1: <Flame size={14} className="text-cat-mainset" />,
        icon2: <Clock size={14} className="text-cat-mainset" />,
        borderColor: 'border-l-[4px] border-l-cat-mainset',
        colorClass: 'text-cat-mainset',
        label: CATEGORY_LABELS.mainset
      };
    case 'sprint':
      return {
        icon1: <Timer size={14} className="text-cat-sprint" />,
        icon2: <Clock size={14} className="text-cat-sprint" />,
        borderColor: 'border-l-[4px] border-l-cat-sprint',
        colorClass: 'text-cat-sprint',
        label: CATEGORY_LABELS.sprint
      };
    case 'cooldown':
      return {
        icon1: <Snowflake size={14} className="text-cat-cooldown" />,
        icon2: <Clock size={14} className="text-cat-cooldown" />,
        borderColor: 'border-l-[4px] border-l-cat-cooldown',
        colorClass: 'text-cat-cooldown',
        label: CATEGORY_LABELS.cooldown
      };
    default:
      return {
        icon1: <Sliders size={14} className="text-brand-black" />,
        icon2: <Clock size={14} className="text-brand-black" />,
        borderColor: 'border-l-[4px] border-l-brand-black',
        colorClass: 'text-brand-black',
        label: 'Other'
      };
  }
};

export const TimelineEntry: React.FC<TimelineEntryProps> = ({
  block,
  index,
  startTimeStr,
  onEdit,
  onDelete
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 40 : 'auto',
    opacity: isDragging ? 0.35 : 1,
  };

  const { icon1, icon2, borderColor, colorClass, label } = getCategoryIcons(block.category);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-stretch my-[8px] ${isDragging ? 'cursor-grabbing' : ''}`}
      id={`timeline-item-${block.id}`}
    >
      {/* 1. Time Column - fixed 50px width */}
      <div className="flex w-[50px] flex-shrink-0 flex-col justify-start pt-1.5 text-right pr-3 select-none">
        <span className="font-mono text-xs font-black leading-none text-brand-black">
          {startTimeStr}
        </span>
        <span className="mt-1 font-mono text-[10px] leading-none text-gray-600 font-bold">
          {block.time}m
        </span>
      </div>

      {/* 2. Vertical Line Column - fixed 20px width - Sharp style */}
      <div className="relative flex w-[20px] flex-shrink-0 flex-col items-center">
        {/* Sharp Square Bullet */}
        <div className={`z-10 h-3 w-3 rounded-none border-2 bg-white transition duration-300 mt-2 rotate-45 ${
          block.category === 'warmup' ? 'border-cat-warmup' :
          block.category === 'drills' ? 'border-cat-drills' :
          block.category === 'mainset' ? 'border-cat-mainset' :
          block.category === 'sprint' ? 'border-cat-sprint' : 'border-cat-cooldown'
        }`} />
        
        {/* Line Segment */}
        <div className="absolute top-4 bottom-0 w-[2px] bg-brand-black/40 group-last:bg-transparent" />
      </div>

      {/* 3. Main block content */}
      <div 
        {...attributes}
        {...listeners}
        className={`relative flex-1 cursor-grab rounded-none bg-white border-2 border-brand-black ${borderColor} p-[8px_10px_8px_12px] shadow-[3px_3px_0_rgba(33,33,33,1)] transition hover:bg-synapse-gray active:cursor-grabbing`}
      >
        <div className="flex flex-col gap-[2px]">
          {/* Row 1: Title and Category subtitle */}
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-xs font-black tracking-tight text-brand-black line-clamp-1">
              {block.title}
            </h3>
            <span className={`font-sans text-[10px] uppercase tracking-wider font-extrabold ${colorClass}`}>
              {label}
            </span>
          </div>

          {/* Row 2: Distance set text */}
          {block.details && (
            <p className="font-mono text-[11px] font-bold leading-tight text-gray-800 line-clamp-1">
              {block.details}
            </p>
          )}

          {/* Row 3: Description in compact spacing */}
          {block.description && (
            <div className="flex items-center justify-between mt-0.5">
              <span className="font-sans text-[10px] italic leading-tight text-gray-600 font-medium line-clamp-1">
                {block.description}
              </span>

              {/* Decorative category specific icons as shown in template mockup */}
              <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition pr-1">
                {icon1}
                {icon2}
              </div>
            </div>
          )}
        </div>

        {/* Hover Action Overlays - Beautiful sharp styled overlay buttons for edit/delete */}
        <div className="absolute right-2 top-1.5 hidden items-center gap-1 rounded-none bg-white p-1 shadow-[2px_2px_0_rgba(33,33,33,1)] border-2 border-brand-black group-hover:flex">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(block);
            }}
            className="rounded-none p-1 text-brand-black hover:bg-synapse-gray transition"
            title="Edit block"
          >
            <Edit2 size={11} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(block.id);
            }}
            className="rounded-none p-1 text-red-600 hover:bg-red-50 transition"
            title="Delete block"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    </div>
  );
};
