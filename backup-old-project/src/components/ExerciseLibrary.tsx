import React, { useState } from 'react';
import type { BlockTemplate } from '../types';
import { DraggableLibraryBlock } from './DraggableLibraryBlock';
import { Search, Plus } from 'lucide-react';

interface ExerciseLibraryProps {
  templates: BlockTemplate[];
  onAddNew: () => void;
  onEdit: (template: BlockTemplate) => void;
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ templates, onAddNew, onEdit }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Group templates by category
  const grouped = templates.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {} as Record<string, BlockTemplate[]>);

  const categories = [
    { key: 'all', label: 'Alle' },
    { key: 'warmup', label: 'Einschwimmen' },
    { key: 'drills', label: 'Technik' },
    { key: 'mainset', label: 'Hauptteil' },
    { key: 'sprint', label: 'Sprint' },
    { key: 'cooldown', label: 'Ausschwimmen' },
  ];

  const blocksToDisplay = activeCategory === 'all' ? templates : (grouped[activeCategory] || []);

  return (
    <div className="library-container">
      <div className="library-header-row">

        <div className="library-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', width: '100%' }}>
            <h2 className="library-title">My Library</h2>
            <button className="icon-button" onClick={onAddNew} title="Neue Übung erstellen" style={{ color: 'var(--color-teal)' }}>
              <Plus size={20} />
            </button>
          </div>
          <div className="search-bar" style={{ marginTop: '0.5rem' }}>
            <Search size={16} color="var(--text-muted)" />
            <input type="text" placeholder="Search" className="search-input" />
          </div>
        </div>
      </div>

      <div className="pill-nav-container">
        <div className="pill-nav">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              className={`pill-button ${activeCategory === key ? 'active' : ''}`}
              onClick={() => setActiveCategory(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="library-content">
        <h3 className="section-subtitle">
          {activeCategory === 'all' ? 'Alle Übungen' : categories.find(c => c.key === activeCategory)?.label}
        </h3>
        <div className="blocks-list">
          {blocksToDisplay.map(template => (
            <DraggableLibraryBlock key={template.id} template={template} onEdit={onEdit} />
          ))}
        </div>
      </div>
    </div>
  );
};

