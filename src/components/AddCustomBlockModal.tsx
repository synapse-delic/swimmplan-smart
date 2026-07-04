import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { BlockTemplate, BlockCategory } from '../types';

interface AddCustomBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newTemplate: BlockTemplate) => void;
}

const CATEGORY_OPTIONS: { value: BlockCategory; label: string; color: string }[] = [
  { value: 'warmup', label: 'Warm-up', color: 'border-cat-warmup hover:bg-cat-warmup/10 text-brand-black' },
  { value: 'drills', label: 'Technique / Drills', color: 'border-cat-drills hover:bg-cat-drills/10 text-brand-black' },
  { value: 'mainset', label: 'Main Set', color: 'border-cat-mainset hover:bg-cat-mainset/10 text-brand-black' },
  { value: 'sprint', label: 'Sprint', color: 'border-cat-sprint hover:bg-cat-sprint/10 text-brand-black' },
  { value: 'cooldown', label: 'Cooldown', color: 'border-cat-cooldown hover:bg-cat-cooldown/10 text-brand-black' },
];

const PRESET_TAGS = ['Freestyle', 'Technique', 'Kick', 'Backstroke', 'Butterfly', 'Start', 'Turn', 'Warmup', 'Cooldown', 'Sprint'];

export const AddCustomBlockModal: React.FC<AddCustomBlockModalProps> = ({
  isOpen,
  onClose,
  onAdd
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BlockCategory>('mainset');
  const [time, setTime] = useState(20);
  const [distance, setDistance] = useState(400);
  const [details, setDetails] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTemplate: BlockTemplate = {
      id: `tpl-custom-${Date.now()}`,
      title: title.trim(),
      category,
      time: Number(time) || 1,
      distance: Number(distance) || 0,
      details: details.trim() || undefined,
      description: description.trim() || undefined,
      tags: selectedTags.length > 0 ? selectedTags : [category]
    };

    onAdd(newTemplate);
    // Reset fields
    setTitle('');
    setCategory('mainset');
    setTime(20);
    setDistance(400);
    setDetails('');
    setDescription('');
    setSelectedTags([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-none border-4 border-brand-black bg-white shadow-[8px_8px_0_rgba(33,33,33,1)]">
        <div className="flex items-center justify-between border-b-4 border-brand-black px-5 py-4 bg-[#efefef]">
          <h2 className="font-display text-base font-black text-brand-black uppercase tracking-tight flex items-center gap-2">
            <Sparkles size={16} className="text-synapse-petrol" />
            Create Exercise Template
          </h2>
          <button
            onClick={onClose}
            className="rounded-none border-2 border-brand-black p-1 text-brand-black bg-white hover:bg-synapse-gray transition"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-[10px] font-black tracking-wider text-brand-black uppercase mb-1.5">
              Title / Exercise Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Endurance Freestyle, Medley Drills, Broken Intervals"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-none border-2 border-brand-black bg-white px-3.5 py-2.5 text-sm text-brand-black placeholder-gray-500 font-bold focus:border-synapse-petrol focus:ring-0 focus:outline-none transition"
            />
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-[10px] font-black tracking-wider text-brand-black uppercase mb-1.5">
              Workout Category / Segment
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setCategory(opt.value)}
                  className={`rounded-none border-2 px-3 py-2 text-center text-xs font-black transition ${opt.color} ${
                    category === opt.value
                      ? 'bg-synapse-petrol text-white border-brand-black font-black shadow-[2px_2px_0_rgba(33,33,33,1)]'
                      : 'border-brand-black bg-white text-brand-black'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time & Distance */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black tracking-wider text-brand-black uppercase mb-1.5">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                required
                value={time}
                onChange={(e) => setTime(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full rounded-none border-2 border-brand-black bg-white px-3.5 py-2.5 text-sm text-brand-black font-bold focus:border-synapse-petrol focus:ring-0 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black tracking-wider text-brand-black uppercase mb-1.5">
                Total Distance (Meters)
              </label>
              <input
                type="number"
                min="0"
                max="5000"
                required
                value={distance}
                onChange={(e) => setDistance(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-none border-2 border-brand-black bg-white px-3.5 py-2.5 text-sm text-brand-black font-bold focus:border-synapse-petrol focus:ring-0 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Details (Formula) */}
          <div>
            <label className="block text-[10px] font-black tracking-wider text-brand-black uppercase mb-1.5">
              Formula / Details (Subtext)
            </label>
            <input
              type="text"
              placeholder="e.g. 6x75m (25m Kick, 50m Swim) @ 2:00"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full rounded-none border-2 border-brand-black bg-white px-3.5 py-2.5 text-sm text-brand-black placeholder-gray-500 font-bold focus:border-synapse-petrol focus:ring-0 focus:outline-none transition"
            />
          </div>

          {/* Focus goal */}
          <div>
            <label className="block text-[10px] font-black tracking-wider text-brand-black uppercase mb-1.5">
              Focus / Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Optimal streamline, emphasize catch phase"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-none border-2 border-brand-black bg-white px-3.5 py-2.5 text-sm text-brand-black placeholder-gray-500 font-bold focus:border-synapse-petrol focus:ring-0 focus:outline-none transition"
            />
          </div>

          {/* Helper Tags for Library sorting */}
          <div>
            <label className="block text-[10px] font-black tracking-wider text-brand-black uppercase mb-1.5">
              Search Tags for Library
            </label>
            <div className="flex flex-wrap gap-1.5 select-none">
              {PRESET_TAGS.map((tag) => {
                const selected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`rounded-none border-2 border-brand-black px-2.5 py-1 text-[10px] font-black transition ${
                      selected
                        ? 'bg-synapse-petrol text-white'
                        : 'bg-white text-brand-black hover:bg-synapse-gray'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row Save */}
          <div className="flex items-center justify-end gap-3 border-t-2 border-brand-black pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-none px-4 py-2.5 border-2 border-brand-black bg-white text-xs font-bold text-brand-black hover:bg-synapse-gray transition active:translate-x-[1px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-none bg-synapse-gold text-brand-black border-2 border-brand-black px-4 py-2.5 text-xs font-black hover:bg-synapse-petrol hover:text-white transition duration-200 shadow-[2px_2px_0_rgba(33,33,33,1)] active:translate-x-[1px] active:translate-y-[1px]"
            >
              <Plus size={14} />
              <span>Save to Library</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
