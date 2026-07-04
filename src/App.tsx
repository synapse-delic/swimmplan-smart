import React, { useState, useEffect } from 'react';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
  Plus,
  RefreshCw,
  Search,
  Sliders,
  Trash2,
  Waves,
  AlertCircle,
  Calendar,
  CheckCircle
} from 'lucide-react';

import { TrainingBlock, BlockTemplate, Athlete } from './types';
import { DEFAULT_TEMPLATES, INITIAL_TIMELINE, TEAM_ATHLETES, CATEGORY_LABELS } from './defaultData';
import { Header } from './components/Header';
import { TimelineEntry } from './components/TimelineEntry';
import { LibraryItem } from './components/LibraryItem';
import { EditBlockModal } from './components/EditBlockModal';
import { AddCustomBlockModal } from './components/AddCustomBlockModal';
import { CommunityModal } from './components/CommunityModal';
import { AICoachModal } from './components/AICoachModal';

// Filter tags for the library shelf
const FILTER_TAGS = [
  'All Exercises',
  'Freestyle',
  'Drills',
  'Kick',
  'Backstroke',
  'Butterfly',
  'Starts',
  'Turns'
];

// Inner droppable container for the timeline list
interface TimelineContainerProps {
  children: React.ReactNode;
  isEmpty: boolean;
  isDragging: boolean;
}

const TimelineContainer: React.FC<TimelineContainerProps> = ({ children, isEmpty, isDragging }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'timeline-container',
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[380px] rounded-none flex flex-col justify-start transition-all duration-300 pb-16 md:pb-8 ${
        isOver ? 'bg-synapse-petrol/5' : ''
      }`}
    >
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4 border-2 border-dashed border-brand-black bg-white rounded-none mt-4 shadow-[4px_4px_0_rgba(33,33,33,1)]">
          <Waves size={36} className="text-synapse-petrol animate-pulse mb-3" />
          <h4 className="text-sm font-black text-brand-black font-display uppercase tracking-tight">No Training Blocks Scheduled</h4>
          <p className="text-xs text-gray-700 mt-1 max-w-[250px] leading-relaxed font-bold">
            Drag exercises from the library or click "+" to plan your first block!
          </p>
        </div>
      ) : (
        <div className="space-y-0.5">
          {children}
        </div>
      )}

      {/* Append indicator during template dragging */}
      {isDragging && (
        <div className={`mt-3 mx-12 rounded-none border-2 border-dashed py-4 text-center text-xs font-black transition ${
          isOver ? 'border-synapse-petrol text-synapse-petrol bg-synapse-petrol/10' : 'border-brand-black text-brand-black'
        }`}>
          {isOver ? 'Drop here to add block!' : 'Drag here to schedule'}
        </div>
      )}
    </div>
  );
};

export default function App() {
  // ---- 1. STATES ----
  const [templates, setTemplates] = useState<BlockTemplate[]>([]);
  const [timeline, setTimeline] = useState<TrainingBlock[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete>(TEAM_ATHLETES[0]);
  const [showAthletesDropdown, setShowAthletesDropdown] = useState(false);

  // Interface & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All Exercises');
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // Modals
  const [editingBlock, setEditingBlock] = useState<TrainingBlock | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddCustomActive, setIsAddCustomActive] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);

  // Info notification
  const [notification, setNotification] = useState<string | null>(null);

  // ---- 2. SENSORS CONFIG FOR HIGH-PERFORMANCE MULTI-TOUCH D&D ----
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // px threshold to allow buttons clicking easily
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180, // millisecond press constraint for mobile scroll vs drag
        tolerance: 6,
      },
    })
  );

  // ---- 3. INITIALIZATION, STORAGE & URL SHARE PARSING ----
  useEffect(() => {
    // Load blocks
    const storedTimeline = localStorage.getItem('swim_trainer_timeline_v1');
    if (storedTimeline) {
      try {
        setTimeline(JSON.parse(storedTimeline));
      } catch (e) {
        setTimeline(INITIAL_TIMELINE);
      }
    } else {
      setTimeline(INITIAL_TIMELINE);
    }

    // Load templates
    const storedTemplates = localStorage.getItem('swim_trainer_templates_v1');
    if (storedTemplates) {
      try {
        setTemplates(JSON.parse(storedTemplates));
      } catch (e) {
        setTemplates(DEFAULT_TEMPLATES);
      }
    } else {
      setTemplates(DEFAULT_TEMPLATES);
    }

    // Load athlete profile
    const storedProfile = localStorage.getItem('swim_trainer_active_athlete_v1');
    if (storedProfile) {
      try {
        const parsedAth = JSON.parse(storedProfile);
        const match = TEAM_ATHLETES.find(a => a.id === parsedAth.id);
        if (match) setSelectedAthlete(match);
      } catch (e) {
        // use default
      }
    }
  }, []);

  useEffect(() => {
    // Check if there is an incoming shared plan in the URL hash
    const checkIncomingShare = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#share=')) {
        const encoded = hash.replace('#share=', '');
        try {
          const decoded = decodeURIComponent(escape(atob(encoded)));
          const sharedTimeline = JSON.parse(decoded) as TrainingBlock[];
          if (Array.isArray(sharedTimeline) && sharedTimeline.length > 0) {
            setTimeout(() => {
              if (window.confirm(`Import Shared Training Plan?\n\nFound a shared plan containing ${sharedTimeline.length} blocks. This will replace your active timeline.`)) {
                setTimeline(sharedTimeline);
                localStorage.setItem('swim_trainer_timeline_v1', JSON.stringify(sharedTimeline));
                triggerToast('Shared plan loaded successfully!');
              }
              // Clear hash
              window.location.hash = '';
            }, 300);
          }
        } catch (e) {
          triggerToast('Failed to decode shared link.');
          window.location.hash = '';
        }
      }
    };

    checkIncomingShare();
    window.addEventListener('hashchange', checkIncomingShare);
    return () => window.removeEventListener('hashchange', checkIncomingShare);
  }, []);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 2500);
  };

  // ---- 4. DND INTERACTION HANDLERS ----
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // A. DRAGGING OUT OF CATALOG / LIBRARY
    if (activeId.startsWith('library-')) {
      const templateId = activeId.replace('library-', '');
      const template = templates.find((t) => t.id === templateId);
      if (!template) return;

      const newBlock: TrainingBlock = {
        ...template,
        id: `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        templateId: template.id
      };

      // Calculate position inside timetable
      let insertIdx = timeline.length;
      if (overId !== 'timeline-container') {
        const targetId = overId;
        const targetIndex = timeline.findIndex((b) => b.id === targetId);
        if (targetIndex !== -1) {
          insertIdx = targetIndex;
        }
      }

      const updated = [...timeline];
      updated.splice(insertIdx, 0, newBlock);
      setTimeline(updated);
      localStorage.setItem('swim_trainer_timeline_v1', JSON.stringify(updated));
      triggerToast(`"${template.title}" added`);
    }
    // B. REORDERING BLOCKS INSIDE TIMELINE
    else {
      if (activeId !== overId) {
        const oldIndex = timeline.findIndex((b) => b.id === activeId);
        const newIndex = timeline.findIndex((b) => b.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = arrayMove(timeline, oldIndex, newIndex);
          setTimeline(reordered);
          localStorage.setItem('swim_trainer_timeline_v1', JSON.stringify(reordered));
        }
      }
    }
  };

  // ---- 5. PERSISTABLE METADATA ACTIONS ----
  const handleAddBlockDirect = (template: BlockTemplate) => {
    const newBlock: TrainingBlock = {
      ...template,
      id: `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      templateId: template.id
    };
    const updated = [...timeline, newBlock];
    setTimeline(updated);
    localStorage.setItem('swim_trainer_timeline_v1', JSON.stringify(updated));
    triggerToast(`"${template.title}" added`);
  };

  const handleEditBlockClick = (block: TrainingBlock) => {
    setEditingBlock(block);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedBlock = (updatedBlock: TrainingBlock) => {
    const updated = timeline.map((b) => (b.id === updatedBlock.id ? updatedBlock : b));
    setTimeline(updated);
    localStorage.setItem('swim_trainer_timeline_v1', JSON.stringify(updated));
    setIsEditModalOpen(false);
    setEditingBlock(null);
    triggerToast('Training block updated');
  };

  const handleDeleteTimelineBlock = (id: string) => {
    const blockToDelete = timeline.find((b) => b.id === id);
    const updated = timeline.filter((b) => b.id !== id);
    setTimeline(updated);
    localStorage.setItem('swim_trainer_timeline_v1', JSON.stringify(updated));
    if (blockToDelete) {
      triggerToast(`"${blockToDelete.title}" removed`);
    }
  };

  const handleAddCustomTemplate = (newTemplate: BlockTemplate) => {
    const updated = [newTemplate, ...templates];
    setTemplates(updated);
    localStorage.setItem('swim_trainer_templates_v1', JSON.stringify(updated));
    triggerToast(`Template "${newTemplate.title}" saved`);
  };

  const handleApplyAIWorkout = (blocks: TrainingBlock[], append: boolean) => {
    let updated: TrainingBlock[];
    if (append) {
      updated = [...timeline, ...blocks];
      triggerToast(`Appended ${blocks.length} AI generated blocks`);
    } else {
      updated = blocks;
      triggerToast(`Replaced plan with AI generated workout`);
    }
    setTimeline(updated);
    localStorage.setItem('swim_trainer_timeline_v1', JSON.stringify(updated));
  };

  const handleResetToMockupDefault = () => {
    if (window.confirm('Reset training plan to default mockup layout?')) {
      setTimeline(INITIAL_TIMELINE);
      setTemplates(DEFAULT_TEMPLATES);
      localStorage.setItem('swim_trainer_timeline_v1', JSON.stringify(INITIAL_TIMELINE));
      localStorage.setItem('swim_trainer_templates_v1', JSON.stringify(DEFAULT_TEMPLATES));
      triggerToast('Reset to default layout!');
    }
  };

  const handleClearTimeline = () => {
    if (window.confirm('Clear the entire training plan?')) {
      setTimeline([]);
      localStorage.setItem('swim_trainer_timeline_v1', JSON.stringify([]));
      triggerToast('Timeline cleared');
    }
  };

  const handleSelectAthlete = (ath: Athlete) => {
    setSelectedAthlete(ath);
    localStorage.setItem('swim_trainer_active_athlete_v1', JSON.stringify(ath));
    triggerToast(`Coach Profile: ${ath.name}`);
  };

  // ---- 6. EXCEL EXPORT (CSV FORMAT WITH UTF-8 BOM) ----
  const handleExportExcel = () => {
    if (timeline.length === 0) {
      triggerToast('Nothing to export!');
      return;
    }

    try {
      let csvContent = 'sep=,\r\n';
      csvContent += '"Start Time","Duration (min)","Distance (m)","Category","Title","Structure / Pace Details","Instructions / Focus","Tags"\r\n';

      let accumulatedMins = 0;
      timeline.forEach((block) => {
        const startOffset = 9 * 60 + accumulatedMins;
        const startHrs = Math.floor(startOffset / 60);
        const startMins = startOffset % 60;
        const startTimeStr = `${startHrs.toString().padStart(2, '0')}:${startMins.toString().padStart(2, '0')}`;
        accumulatedMins += block.time;

        const catLabel = CATEGORY_LABELS[block.category] || block.category;
        const title = block.title.replace(/"/g, '""');
        const details = (block.details || '').replace(/"/g, '""');
        const desc = (block.description || '').replace(/"/g, '""');
        const tags = (block.tags || []).join(', ').replace(/"/g, '""');

        csvContent += `"${startTimeStr}","${block.time}","${block.distance}","${catLabel}","${title}","${details}","${desc}","${tags}"\r\n`;
      });

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `SwimPlan_Export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('Excel CSV exported successfully!');
    } catch (err) {
      triggerToast('Failed to export to Excel.');
    }
  };

  // ---- 7. FILTER LOGIC FOR SHIELD LIBRARY ----
  const filteredTemplates = templates.filter((template) => {
    // 1. Match search text query
    const matchesSearch = searchQuery
      ? template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.details && template.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;

    if (!matchesSearch) return false;

    // 2. Match Category tags pills
    if (selectedTag === 'All Exercises') return true;

    const queryTag = selectedTag.toLowerCase();
    
    // Check template tags
    const containsTag = template.tags?.some((t) => t.toLowerCase() === queryTag) || false;
    
    // Check direct category mapping
    const categoryConversions: Record<string, string> = {
      freestyle: 'mainset',
      drills: 'drills',
      kick: 'drills',
      backstroke: 'drills',
      butterfly: 'sprint',
      starts: 'sprint',
      turns: 'cooldown'
    };
    
    const matchesMappedCategory = template.category === categoryConversions[queryTag];
    const matchesTitleKeyword = template.title.toLowerCase().includes(queryTag.replace('all', '').trim());

    return containsTag || matchesMappedCategory || matchesTitleKeyword;
  });

  // ---- 8. TIMELINE HOUR PROGRESSIONS GENERATION ----
  let accumulatedMinutes = 0;
  const computedTimelineWithTimes = timeline.map((block) => {
    const startOffset = 9 * 60 + accumulatedMinutes; // minutes from midnight
    const startHrs = Math.floor(startOffset / 60);
    const startMins = startOffset % 60;
    const startTimeStr = `${startHrs.toString().padStart(2, '0')}:${startMins.toString().padStart(2, '0')}`;
    
    accumulatedMinutes += block.time; // append current block duration for next item
    
    return {
      block,
      startTimeStr
    };
  });

  const isDraggingTemplate = activeDragId?.startsWith('library-');

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-[#efefef] text-brand-black font-sans flex flex-col relative pb-56 md:pb-0 select-none">
        
        {/* Dynamic Toast / Notification Banner - Sharp Bold Style */}
        {notification && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-none border-2 border-brand-black bg-white px-4 py-2.5 shadow-[4px_4px_0_rgba(33,33,33,1)] animate-fade-in">
            <CheckCircle size={14} className="text-synapse-petrol" />
            <span className="text-xs font-black text-brand-black tracking-tight">{notification}</span>
          </div>
        )}

        {/* Global Navigation Header Component */}
        <Header
          timeline={timeline}
          athletes={TEAM_ATHLETES}
          selectedAthlete={selectedAthlete}
          onSelectAthlete={handleSelectAthlete}
          showAthletesDropdown={showAthletesDropdown}
          setShowAthletesDropdown={setShowAthletesDropdown}
          onOpenCommunity={() => setIsCommunityOpen(true)}
          onExportExcel={handleExportExcel}
          onOpenAICoach={() => setIsAICoachOpen(true)}
        />

        {/* Outer Workspace Grid Body */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 md:px-6 md:py-6 flex flex-col md:flex-row gap-6">

          {/* COLUMN 1: LEFT SIDEBAR (EXERCISE TEMPLATE LIBRARY) - HIDDEN ON MOBILE (HANDLED BY BOTTOM SHEET BELOW), EXPANDED ON DESKTOP */}
          <section className="hidden md:flex w-[340px] flex-shrink-0 flex-col rounded-none border-2 border-brand-black bg-white p-4 shadow-[4px_4px_0_rgba(33,33,33,1)]">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-synapse-petrol" />
                <h2 className="font-display text-sm font-black tracking-tight text-brand-black uppercase tracking-tight">
                  Exercise Library
                </h2>
              </div>
              <button
                onClick={() => setIsAddCustomActive(true)}
                className="flex items-center gap-1 rounded-none bg-white border-2 border-brand-black px-2.5 py-1.5 text-xs text-brand-black hover:bg-synapse-petrol hover:text-white transition font-black active:translate-x-[1px] active:translate-y-[1px]"
              >
                <Plus size={13} />
                <span>Create New</span>
              </button>
            </div>

            {/* Live Search Preset Bar */}
            <div className="relative mb-3.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-black">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-none border-2 border-brand-black bg-white pl-9 pr-4 py-2 text-xs text-brand-black placeholder-gray-500 font-bold focus:border-synapse-petrol focus:outline-none transition"
              />
            </div>

            {/* Category selection bar */}
            <div className="flex flex-wrap gap-1.5 mb-5 select-none">
              {FILTER_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`rounded-none border-2 border-brand-black px-2.5 py-1 text-[11px] font-black transition ${
                    selectedTag === tag
                      ? 'bg-synapse-petrol text-white shadow-[2px_2px_0_rgba(33,33,33,1)]'
                      : 'bg-white text-brand-black hover:bg-synapse-gray'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* List scroll panel */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[60vh] no-scrollbar">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <LibraryItem
                    key={template.id}
                    template={template}
                    onAdd={handleAddBlockDirect}
                  />
                ))
              ) : (
                <div className="text-center py-10 bg-synapse-gray border-2 border-dashed border-brand-black p-4">
                  <AlertCircle size={20} className="text-synapse-petrol mx-auto mb-2" />
                  <p className="text-xs text-brand-black font-black">No exercises found.</p>
                  <p className="text-[10px] text-gray-700 font-semibold mt-1">Change the filter or create a new template.</p>
                </div>
              )}
            </div>

            {/* Revert controls inside Shelf */}
            <div className="border-t-2 border-synapse-gray pt-3 mt-4 flex items-center justify-between">
              <button
                onClick={handleResetToMockupDefault}
                className="flex items-center gap-1.5 text-xs text-brand-black font-bold hover:text-synapse-petrol transition"
              >
                <RefreshCw size={12} className="text-synapse-gold" />
                <span>Reset to Default Setup</span>
              </button>
            </div>

          </section>

          {/* COLUMN 2: MAIN PANEL (TRAINING TIMELINE PLANNER) - VISIBLE ON BOTH DESKTOP AND MOBILE */}
          <section className="flex-1 flex flex-col">
            
            {/* Timeline header controls */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-synapse-petrol" />
                <h2 className="font-display text-sm font-black text-brand-black uppercase tracking-tight">
                  Training Timeline Planner
                </h2>
              </div>

              {/* Action utilities */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearTimeline}
                  disabled={timeline.length === 0}
                  className="flex items-center gap-1.5 rounded-none border-2 border-brand-black bg-white px-2.5 py-1.5 text-xs text-brand-black hover:bg-synapse-gray transition disabled:opacity-30 disabled:pointer-events-none font-bold shadow-[2px_2px_0_rgba(33,33,33,1)]"
                >
                  <Trash2 size={13} />
                  <span className="hidden sm:inline">Clear Plan</span>
                </button>
                <button
                  onClick={handleResetToMockupDefault}
                  className="flex items-center gap-1.5 rounded-none border-2 border-brand-black bg-white px-2.5 py-1.5 text-xs text-brand-black hover:bg-synapse-gray transition sm:hidden shadow-[2px_2px_0_rgba(33,33,33,1)]"
                  title="Reset to Mockup Default"
                >
                  <RefreshCw size={13} className="text-synapse-gold" />
                </button>
              </div>
            </div>

            {/* Core Drag context Timeline stack container */}
            <div className="flex-1">
              <SortableContext
                items={timeline.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                <TimelineContainer isEmpty={timeline.length === 0} isDragging={isDraggingTemplate}>
                  {computedTimelineWithTimes.map(({ block, startTimeStr }, idx) => (
                    <TimelineEntry
                      key={block.id}
                      block={block}
                      index={idx}
                      startTimeStr={startTimeStr}
                      onEdit={handleEditBlockClick}
                      onDelete={handleDeleteTimelineBlock}
                    />
                  ))}
                </TimelineContainer>
              </SortableContext>
            </div>

          </section>
        </main>

        {/* MOBILE BOTTOM SHEET FOR EXERCISE LIBRARY - ANCHORED EXACTLY AT THE BOTTOM OF THE MOBILE LANDSCAPE / PHONE PORTRAIT */}
        <section className="fixed bottom-0 left-0 right-0 z-30 flex h-[215px] flex-col rounded-none border-t-4 border-brand-black bg-white p-3 pb-4 shadow-[0_-6px_16px_rgba(33,33,33,0.15)] md:hidden">
          
          {/* Bottom sheet pull handle bar */}
          <div className="w-12 h-1.5 bg-brand-black rounded-none mx-auto mb-2" />

          <div className="flex items-center justify-between px-1 mb-2.5">
            <span className="text-[11px] font-black tracking-wider text-brand-black uppercase">
              Exercise Catalog
            </span>
            
            {/* Direct Create preset button for mobile */}
            <button
              onClick={() => setIsAddCustomActive(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-none border-2 border-brand-black bg-white text-brand-black text-[10px] font-black active:translate-x-[1px] active:translate-y-[1px]"
            >
              <Plus size={11} />
              <span>Create Preset</span>
            </button>
          </div>

          {/* Horizontal scroll pills */}
          <div className="flex flex-row overflow-x-auto gap-2 mb-2 w-full no-scrollbar flex-nowrap shrink-0">
            {FILTER_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`rounded-none px-3 py-1 text-[10px] font-black border-2 border-brand-black transition whitespace-nowrap ${
                  selectedTag === tag
                    ? 'bg-synapse-petrol text-white'
                    : 'bg-white text-brand-black'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Horizontal scroll cards container (110x110px small cells) */}
          <div className="flex flex-row overflow-x-auto gap-2.5 pb-2 pt-1 no-scrollbar flex-nowrap items-center w-full">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <LibraryItem
                   key={template.id}
                   template={template}
                   onAdd={handleAddBlockDirect}
                />
              ))
            ) : (
              <div className="w-full text-center py-4 flex flex-col justify-center items-center">
                <p className="text-[10px] text-brand-black font-bold">No presets found for this filter</p>
                <button 
                  onClick={() => setSelectedTag('All Exercises')}
                  className="text-[9px] text-synapse-petrol font-black underline mt-1"
                >
                  Reset filter
                </button>
              </div>
            )}
          </div>

        </section>

        {/* FLUID INTERACTIVE DRAG OVERLAY FOR GORGEOUS SMOOTH SHUFFLING FEEDBACK - KANTIG AND HIGH CONTRAST */}
        <DragOverlay>
          {activeDragId ? (() => {
            if (activeDragId.startsWith('library-')) {
              const tplId = activeDragId.replace('library-', '');
              const tpl = templates.find(t => t.id === tplId);
              if (!tpl) return null;
              return (
                <div className="flex h-[110px] w-[110px] flex-col justify-between rounded-none bg-white border-2 border-brand-black p-2.5 shadow-[4px_4px_0_rgba(33,33,33,1)] opacity-95 cursor-grabbing scale-105 text-brand-black">
                  <span className="text-[8px] uppercase font-black text-synapse-petrol">Drag preset</span>
                  <h4 className="text-[10px] font-black text-brand-black line-clamp-1">{tpl.title}</h4>
                  <span className="text-[9px] text-gray-700 font-mono font-bold">{tpl.time}m</span>
                </div>
              );
            } else {
              const item = timeline.find(b => b.id === activeDragId);
              if (!item) return null;
              return (
                <div className="flex items-center rounded-none bg-white p-3 shadow-[4px_4px_0_rgba(33,33,33,1)] border-2 border-brand-black border-l-8 border-l-synapse-petrol w-64 cursor-grabbing scale-105 text-brand-black">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase font-black text-synapse-petrol">Move block</span>
                    <h4 className="text-xs font-black text-brand-black line-clamp-1">{item.title}</h4>
                    <span className="text-[9px] text-gray-500 font-mono">{item.time} min ({item.distance}m)</span>
                  </div>
                </div>
              );
            }
          })() : null}
        </DragOverlay>

        {/* MODAL OVERLAYS */}
        <EditBlockModal
          block={editingBlock}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingBlock(null);
          }}
          onSave={handleSaveEditedBlock}
        />

        <AddCustomBlockModal
          isOpen={isAddCustomActive}
          onClose={() => setIsAddCustomActive(false)}
          onAdd={handleAddCustomTemplate}
        />

        <CommunityModal
          isOpen={isCommunityOpen}
          onClose={() => setIsCommunityOpen(false)}
          timeline={timeline}
          onLoadPlan={(imported) => {
            setTimeline(imported);
            localStorage.setItem('swim_trainer_timeline_v1', JSON.stringify(imported));
            triggerToast('Imported shared training plan!');
          }}
          triggerToast={triggerToast}
        />

        <AICoachModal
          isOpen={isAICoachOpen}
          onClose={() => setIsAICoachOpen(false)}
          onApplyWorkout={handleApplyAIWorkout}
        />

      </div>
    </DndContext>
  );
}
