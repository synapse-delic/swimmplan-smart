import React from 'react';
import { Waves, Activity, Flame, Zap, Snowflake, Trash2, Edit3, Clock } from 'lucide-react';
import type { BlockCategory, TrainingBlock, BlockTemplate } from '../types';

interface BlockProps {
  block: TrainingBlock | BlockTemplate;
  variant?: 'timeline' | 'library';
  isOverlay?: boolean;
  onRemove?: (id: string) => void;
  onEdit?: (block: any) => void;
  dragHandleListeners?: any;
  dragHandleAttributes?: any;
}

const CategoryIcon = ({ category, size = 16 }: { category: BlockCategory, size?: number }) => {
  switch (category) {
    case 'warmup': return <Waves size={size} />;
    case 'drills': return <Activity size={size} />;
    case 'mainset': return <Flame size={size} />;
    case 'sprint': return <Zap size={size} />;
    case 'cooldown': return <Snowflake size={size} />;
    default: return <Waves size={size} />;
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'warmup': return 'Warm-up';
    case 'drills': return 'Technique';
    case 'mainset': return 'Main Set';
    case 'sprint': return 'Sprint';
    case 'cooldown': return 'Cool-down';
    default: return 'Warm-up';
  }
}

const getCategoryColorVar = (category: string) => {
  switch (category) {
    case 'warmup': return 'var(--color-warmup)';
    case 'drills': return 'var(--color-drills)';
    case 'mainset': return 'var(--color-mainset)';
    case 'sprint': return 'var(--color-sprint)';
    case 'cooldown': return 'var(--color-cooldown)';
    default: return 'var(--color-warmup)';
  }
}

export const Block: React.FC<BlockProps> = ({ 
  block, 
  variant = 'timeline',
  isOverlay = false, 
  onRemove,
  onEdit,
  dragHandleListeners,
  dragHandleAttributes
}) => {

  return (
    <div 
      className={`training-block variant-${variant} ${block.category} ${isOverlay ? 'drag-overlay-block' : ''}`}
      {...dragHandleListeners}
      {...dragHandleAttributes}
      style={{ cursor: isOverlay ? 'grabbing' : 'grab' }}
    >
      {variant === 'timeline' && <div className={`block-color-accent ${block.category}-accent`}></div>}
      
      <div className="block-inner-content">
        {variant === 'timeline' ? (
          <>
            <div className="block-header-row">
              <div className="block-title">{block.title}</div>
              <div className="block-category-text">{getCategoryLabel(block.category)}</div>
            </div>
            
            {(block.details || block.description) && (
              <div className="block-details-container" title={block.description}>
                {block.details && <div className="block-subtitle-row">{block.details}</div>}
                {block.description && <div className="block-description-text mobile-only">{block.description}</div>}
                {block.description && <div className="block-desc-tooltip desktop-only">{block.description}</div>}
              </div>
            )}

            <div className="block-footer-row">
               <div className="block-actions-container">
                 {onEdit && <button className="icon-button" onClick={(e) => { e.stopPropagation(); onEdit(block); }}><Edit3 size={14} /></button>}
                 {onRemove && <button className="icon-button delete-btn" onClick={(e) => { e.stopPropagation(); onRemove(block.id); }}><Trash2 size={14} /></button>}
               </div>
               <div className="block-footer-icons" style={{ color: getCategoryColorVar(block.category) }}>
                  <CategoryIcon category={block.category} />
                  <Clock size={16} />
               </div>
            </div>
          </>
        ) : (
          <>
            <div className="library-card-header">
              <span className="library-card-icon" style={{ color: getCategoryColorVar(block.category) }}>
                <CategoryIcon category={block.category} size={12} />
              </span>
              <span className="library-card-cat-name">{getCategoryLabel(block.category)}</span>
            </div>
            <div className="library-card-title">{block.title}</div>
            <div className="library-card-footer">
              <div className="library-card-metrics">
                <Clock size={11} style={{ marginRight: '4px', opacity: 0.7 }} />
                <span>{block.time}m</span>
                {block.distance > 0 && <span style={{ marginLeft: '4px' }}>• {block.distance}m</span>}
              </div>
              {onEdit && (
                <button 
                  className="icon-button library-edit-btn" 
                  onClick={(e) => { e.stopPropagation(); onEdit(block); }}
                  title="Edit Template"
                >
                  <Edit3 size={12} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
