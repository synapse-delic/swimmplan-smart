import { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  pointerWithin, 
  KeyboardSensor, 
  MouseSensor,
  TouchSensor, 
  useSensor, 
  useSensors
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { 
  arrayMove, 
  sortableKeyboardCoordinates 
} from '@dnd-kit/sortable';

import { defaultTemplates } from './data/templates';
import type { TrainingBlock, BlockTemplate } from './types';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { TrainingTimeline } from './components/TrainingTimeline';
import { Block } from './components/Block';
import { BlockEditorModal } from './components/BlockEditorModal';
import { Bell, Clock, Waves } from 'lucide-react';

function App() {
  const [templates, setTemplates] = useState<BlockTemplate[]>(() => {
    const saved = localStorage.getItem('swimmplan-templates');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultTemplates;
      }
    }
    return defaultTemplates;
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TrainingBlock | BlockTemplate | null>(null);
  const [blocks, setBlocks] = useState<TrainingBlock[]>(() => {
    const saved = localStorage.getItem('swimmplan-blocks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // Fallback to initial default blocks below
      }
    }
    
    // Default blocks sequence matching the mockup perfectly
    return [
      {
        id: 'block-mock-1',
        templateId: 'wu1',
        title: 'Warm-up Drills',
        distance: 400,
        time: 20,
        category: 'warmup',
        details: '4x100m Medley | Easy Pace',
        description: 'Focus on form'
      },
      {
        id: 'block-mock-2',
        templateId: 'ms1',
        title: 'Endurance Free',
        distance: 1600,
        time: 30,
        category: 'mainset',
        details: '8x200m Freestyle @ 3:00',
        description: '75% Effort, Zone 3'
      },
      {
        id: 'block-mock-3',
        templateId: 'dr1',
        title: 'Kick & Stroke Drills',
        distance: 300,
        time: 25,
        category: 'drills',
        details: '6x50m Back/Breast',
        description: 'Catch focus, Fin Use'
      },
      {
        id: 'block-mock-4',
        templateId: 'sp1',
        title: 'Speed Bursts',
        distance: 250,
        time: 15,
        category: 'sprint',
        details: '10x25m @ 0:45',
        description: 'All Out Sprint'
      }
    ];
  });
  
  const [activeDragItem, setActiveDragItem] = useState<TrainingBlock | BlockTemplate | null>(null);

  useEffect(() => {
    localStorage.setItem('swimmplan-blocks', JSON.stringify(blocks));
  }, [blocks]);

  useEffect(() => {
    localStorage.setItem('swimmplan-templates', JSON.stringify(templates));
  }, [templates]);

  const openEditor = (item: TrainingBlock | BlockTemplate | null) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const handleSaveBlock = (data: any) => {
    if (editingItem && 'templateId' in editingItem) {
      // Editing a Timeline Block
      setBlocks(blocks.map(b => b.id === editingItem.id ? { ...b, ...data } : b));
    } else if (editingItem) {
      // Editing a Library Template
      setTemplates(templates.map(t => t.id === editingItem.id ? { ...t, ...data } : t));
    } else {
      // Adding a new Library Template
      const newTemplate: BlockTemplate = {
        ...data,
        id: `tpl-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      };
      setTemplates([...templates, newTemplate]);
    }
  };

  const totalDistance = blocks.reduce((sum, b) => sum + b.distance, 0);
  const totalTime = blocks.reduce((sum, b) => sum + b.time, 0);
  const timeHours = Math.floor(totalTime / 60);
  const timeMinutes = totalTime % 60;
  const formattedTime = timeHours > 0 ? `${timeHours}:${timeMinutes.toString().padStart(2, '0')}:00` : `${timeMinutes.toString().padStart(2, '0')}:00`;

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { type, template, block } = active.data.current as any;
    
    if (type === 'LibraryBlock') {
      setActiveDragItem(template);
    } else if (type === 'TimelineBlock') {
      setActiveDragItem(block);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over) return;

    const activeType = active.data.current?.type;

    // Dropped a new item from library
    if (activeType === 'LibraryBlock') {
      const template = active.data.current?.template as BlockTemplate;
      const newBlock: TrainingBlock = {
        ...template,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        templateId: template.id,
      };

      if (over.id === 'timeline-droppable') {
        // dropped at the end
        setBlocks((blocks) => [...blocks, newBlock]);
      } else {
        // dropped over another item
        setBlocks((blocks) => {
          const overIndex = blocks.findIndex((b) => b.id === over.id);
          const newBlocks = [...blocks];
          newBlocks.splice(overIndex, 0, newBlock);
          return newBlocks;
        });
      }
      return;
    }

    // Reordered items in timeline
    if (activeType === 'TimelineBlock' && active.id !== over.id) {
      setBlocks((blocks) => {
        const oldIndex = blocks.findIndex((b) => b.id === active.id);
        const newIndex = blocks.findIndex((b) => b.id === over.id);
        return arrayMove(blocks, oldIndex, newIndex);
      });
    }
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  return (
    <div className="app-container">
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <ExerciseLibrary 
          templates={templates} 
          onAddNew={() => openEditor(null)}
          onEdit={(template) => openEditor(template)}
        />
        
        <div className="right-panel">
          <header className="header">
            <div className="header-top">
              <div className="header-left">
                <h1 className="header-title">Wednesday, Oct 25</h1>
                <span className="header-subtitle">
                  Morning Training Session
                </span>
                <div className="mobile-metrics-bar mobile-only">
                  <div className="mobile-metric-pill">
                    <Clock size={12} />
                    <span>{timeMinutes + timeHours * 60} Min</span>
                  </div>
                  <div className="mobile-metric-pill">
                    <Waves size={12} />
                    <span>{(totalDistance / 1000).toFixed(1)} km</span>
                  </div>
                </div>
              </div>
              <div className="header-right">
                <div className="user-profile-stack">
                  <img src="https://i.pravatar.cc/150?img=11" alt="User" className="user-avatar" />
                  <span className="user-name">Michael R.</span>
                </div>
                <button className="notification-btn" title="Benachrichtigungen">
                  <Bell size={24} />
                </button>
                <button className="btn-primary desktop-only">+ NEW PLAN</button>
              </div>
            </div>

            <div className="metrics desktop-only">
              <div className="metric">
                <span className="metric-label">ATHLETES ACTIVE:</span>
                <span className="metric-value">18</span>
              </div>
              <div className="metric">
                <span className="metric-label">WORKOUT DURATION:</span>
                <span className="metric-value">{formattedTime}</span>
              </div>
              <div className="metric">
                <span className="metric-label">TOTAL DISTANCE:</span>
                <span className="metric-value">{(totalDistance / 1000).toFixed(1)} <span style={{fontSize:'1rem', color:'var(--text-muted)'}}>km</span></span>
              </div>
              <div className="metric">
                <span className="metric-label">INTENSITY:</span>
                <span className="metric-value">MEDIUM</span>
              </div>
              <div className="metric">
                <span className="metric-label">RECOVERY:</span>
                <span className="metric-value">2d</span>
              </div>
            </div>

            <div className="tabs desktop-only">
              <button className="tab active">DAY</button>
              <button className="tab">WEEK</button>
              <button className="tab">MONTH</button>
              <button className="tab">PLAN</button>
            </div>
          </header>

          <main className="main-content">
            <TrainingTimeline 
              blocks={blocks} 
              onRemoveBlock={removeBlock} 
              onEditBlock={(block) => openEditor(block)}
              isDragging={activeDragItem !== null}
            />
          </main>
        </div>

        <DragOverlay>
          {activeDragItem ? <Block block={activeDragItem} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      <BlockEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialData={editingItem}
        onSave={handleSaveBlock}
      />
    </div>
  );
}

export default App;
