import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { TrainingBlock, BlockCategory } from '../types';

interface EditBlockModalProps {
  block: TrainingBlock | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedBlock: TrainingBlock) => void;
}

const CATEGORY_OPTIONS: { value: BlockCategory; label: string; color: string }[] = [
  { value: 'warmup', label: 'Warm-up', color: 'border-cat-warmup hover:bg-cat-warmup/10 text-brand-black' },
  { value: 'drills', label: 'Technique / Drills', color: 'border-cat-drills hover:bg-cat-drills/10 text-brand-black' },
  { value: 'mainset', label: 'Main Set', color: 'border-cat-mainset hover:bg-cat-mainset/10 text-brand-black' },
  { value: 'sprint', label: 'Sprint', color: 'border-cat-sprint hover:bg-cat-sprint/10 text-brand-black' },
  { value: 'cooldown', label: 'Cooldown', color: 'border-cat-cooldown hover:bg-cat-cooldown/10 text-brand-black' },
];

export const EditBlockModal: React.FC<EditBlockModalProps> = ({
  block,
  isOpen,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BlockCategory>('warmup');
  const [time, setTime] = useState(15);
  const [distance, setDistance] = useState(200);
  const [details, setDetails] = useState('');
  const [description, setDescription] = useState('');

  // Hydrate fields on select
  useEffect(() => {
    if (block) {
      setTitle(block.title);
      setCategory(block.category);
      setTime(block.time);
      setDistance(block.distance);
      setDetails(block.details || '');
      setDescription(block.description || '');
    }
  }, [block]);

  if (!isOpen || !block) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...block,
      title: title.trim(),
      category,
      time: Number(time) || 1,
      distance: Number(distance) || 0,
      details: details.trim() || undefined,
      description: description.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-none border-4 border-brand-black bg-white shadow-[8px_8px_0_rgba(33,33,33,1)]">
        <div className="flex items-center justify-between border-b-4 border-brand-black px-5 py-4 bg-[#efefef]">
          <h2 className="font-display text-base font-black text-brand-black uppercase tracking-tight">
            Edit Exercise
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
              Title / Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Endurance Freestyle, Kick drills..."
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

          {/* Duration & Distance */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black tracking-wider text-brand-black uppercase mb-1.5">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="240"
                required
                value={time}
                onChange={(e) => setTime(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full rounded-none border-2 border-brand-black bg-white px-3.5 py-2.5 text-sm text-brand-black font-bold focus:border-synapse-petrol focus:ring-0 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black tracking-wider text-brand-black uppercase mb-1.5">
                Distance (Meters)
              </label>
              <input
                type="number"
                min="0"
                max="10000"
                required
                value={distance}
                onChange={(e) => setDistance(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-none border-2 border-brand-black bg-white px-3.5 py-2.5 text-sm text-brand-black font-bold focus:border-synapse-petrol focus:ring-0 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Formula details */}
          <div>
            <label className="block text-[10px] font-black tracking-wider text-brand-black uppercase mb-1.5">
              Formula / Pace Details (Subtext)
            </label>
            <input
              type="text"
              placeholder="e.g. 8x200m Freestyle @ 3:00, 4x50m Choice"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full rounded-none border-2 border-brand-black bg-white px-3.5 py-2.5 text-sm text-brand-black placeholder-gray-500 font-bold focus:border-synapse-petrol focus:ring-0 focus:outline-none transition"
            />
          </div>

          {/* Focused Description */}
          <div>
            <label className="block text-[10px] font-black tracking-wider text-brand-black uppercase mb-1.5">
              Focus / Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Focus on high elbow, emphasize catch phase"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-none border-2 border-brand-black bg-white px-3.5 py-2.5 text-sm text-brand-black placeholder-gray-500 font-bold focus:border-synapse-petrol focus:ring-0 focus:outline-none transition"
            />
          </div>

          {/* Footer Save Row */}
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
              <Save size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
