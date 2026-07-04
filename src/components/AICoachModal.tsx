import React, { useState, useEffect } from 'react';
import { X, Sparkles, Brain, Loader2, Check, AlertTriangle, Plus } from 'lucide-react';
import { TrainingBlock, BlockCategory } from '../types';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyWorkout: (blocks: TrainingBlock[], append: boolean) => void;
}

interface WorkoutBlock {
  title: string;
  distance: number;
  time: number;
  category: BlockCategory;
  details: string;
  description: string;
  tags: string[];
}

interface SwimWorkoutPlan {
  blocks: WorkoutBlock[];
}

const CATEGORY_COLORS: Record<BlockCategory, string> = {
  warmup: 'border-cat-warmup text-cat-warmup bg-cat-warmup/5',
  drills: 'border-cat-drills text-cat-drills bg-cat-drills/5',
  mainset: 'border-cat-mainset text-cat-mainset bg-cat-mainset/5',
  sprint: 'border-cat-sprint text-cat-sprint bg-cat-sprint/5',
  cooldown: 'border-cat-cooldown text-cat-cooldown bg-cat-cooldown/5',
};

const CATEGORY_LABELS: Record<BlockCategory, string> = {
  warmup: 'Warm-up',
  drills: 'Drills / Technique',
  mainset: 'Main Set',
  sprint: 'Sprint',
  cooldown: 'Cooldown',
};

export const AICoachModal: React.FC<AICoachModalProps> = ({ isOpen, onClose, onApplyWorkout }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<SwimWorkoutPlan | null>(null);
  const [loadingStep, setLoadingStep] = useState('');

  // Loading step rotations
  useEffect(() => {
    if (!loading) return;
    const steps = [
      'Spawning ADK Workout Generator Agent...',
      'Retrieving swim templates from MCP Server...',
      'Consulting coaching guidelines...',
      'Assembling individual training blocks...',
      'Activating Validator Agent for safety checks...',
      'Verifying warm-up and cool-down order...',
      'Enforcing total duration safety bounds...',
      'Formatting final JSON plan...'
    ];
    let currentIdx = 0;
    setLoadingStep(steps[0]);

    const interval = setInterval(() => {
      currentIdx = (currentIdx + 1) % steps.length;
      setLoadingStep(steps[currentIdx]);
    }, 2500);

    return () => clearInterval(interval);
  }, [loading]);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedPlan(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    try {
      const response = await fetch(`${backendUrl}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appName: 'app',
          userId: 'coach_admin',
          sessionId: `swim_session_${Date.now()}`,
          newMessage: {
            role: 'user',
            parts: [{ text: prompt.trim() }],
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}. Make sure the ADK backend is running.`);
      }

      const events = await response.json();
      
      // Parse the last model response event containing text
      const modelEvents = events.filter((e: any) => e.content?.role === 'model');
      if (modelEvents.length === 0) {
        throw new Error('No agent response events were returned.');
      }

      const lastModelEvent = modelEvents[modelEvents.length - 1];
      const rawText = lastModelEvent?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Agent returned an empty response.');
      }

      // Clean the response markdown blocks if present
      let cleanText = rawText.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.substring(7);
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.substring(3);
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.slice(0, -3);
      }
      cleanText = cleanText.trim();

      const parsedPlan = JSON.parse(cleanText) as SwimWorkoutPlan;
      if (!parsedPlan.blocks || !Array.isArray(parsedPlan.blocks)) {
        throw new Error('Returned JSON does not match the workout plan structure.');
      }

      setGeneratedPlan(parsedPlan);
    } catch (err: any) {
      console.error('Error generating workout:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (append: boolean) => {
    if (!generatedPlan) return;

    // Map WorkoutBlock format to TrainingBlock format (injecting unique IDs)
    const blocks: TrainingBlock[] = generatedPlan.blocks.map((block, idx) => ({
      ...block,
      id: `block-ai-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
      templateId: `tpl-ai-${idx}`
    }));

    onApplyWorkout(blocks, append);
    onClose();
    // Reset state
    setPrompt('');
    setGeneratedPlan(null);
  };

  const totalTime = generatedPlan?.blocks.reduce((sum, b) => sum + b.time, 0) || 0;
  const totalDistance = generatedPlan?.blocks.reduce((sum, b) => sum + b.distance, 0) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-none border-4 border-brand-black bg-white shadow-[8px_8px_0_rgba(33,33,33,1)] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-brand-black px-5 py-4 bg-[#efefef] flex-shrink-0">
          <h2 className="font-display text-base font-black text-brand-black uppercase tracking-tight flex items-center gap-2">
            <Brain size={18} className="text-synapse-petrol animate-pulse" />
            AI Coach Assistant
          </h2>
          <button
            onClick={onClose}
            className="rounded-none border-2 border-brand-black p-1 text-brand-black bg-white hover:bg-synapse-gray transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Container */}
        <div className="overflow-y-auto p-5 flex-1 space-y-4">
          {!generatedPlan && !loading && (
            <form onSubmit={handleGenerate} className="space-y-4">
              <p className="text-xs text-gray-700 font-bold leading-relaxed">
                Describe the training plan you want to create. The assistant will consult standard coaching guidelines and templates to build a safe and balanced workout.
              </p>
              
              <div>
                <label className="block text-[10px] font-black tracking-wider text-brand-black uppercase mb-1.5">
                  Workout Request / Instruction
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g., Create a 60-minute endurance session focusing on Freestyle, including a brief technique drill set."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full rounded-none border-2 border-brand-black bg-white px-3.5 py-2.5 text-sm text-brand-black placeholder-gray-500 font-bold focus:border-synapse-petrol focus:ring-0 focus:outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-none bg-synapse-gold text-brand-black border-2 border-brand-black py-3 text-sm font-black hover:bg-synapse-petrol hover:text-white transition duration-200 shadow-[3px_3px_0_rgba(33,33,33,1)] active:translate-x-[1px] active:translate-y-[1px]"
              >
                <Sparkles size={16} />
                <span>Ask AI Coach to Plan</span>
              </button>
            </form>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="text-synapse-petrol animate-spin" size={40} />
              <div className="font-display text-sm font-black text-brand-black uppercase tracking-tight">
                AI Coach is planning your session...
              </div>
              <p className="text-xs text-gray-600 font-bold italic animate-pulse">
                {loadingStep}
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="border-4 border-red-500 bg-red-50 p-4 space-y-3 rounded-none shadow-[4px_4px_0_rgba(239,68,68,1)]">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle size={18} className="flex-shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider">Generation Failed</span>
              </div>
              <p className="text-xs text-red-600 font-bold leading-relaxed">
                {error}
              </p>
              <button
                onClick={() => setError(null)}
                className="text-xs font-black underline text-red-700 hover:text-red-900 block"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Result State */}
          {generatedPlan && !loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-2 border-brand-black bg-[#fafafa] p-3 rounded-none">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-black tracking-wider">AI Generated Workout</div>
                  <div className="text-xs font-black text-brand-black mt-0.5">
                    {generatedPlan.blocks.length} Blocks | {totalTime} mins | {totalDistance}m
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-none bg-green-500 text-white border-2 border-brand-black px-2.5 py-1 text-[10px] font-black uppercase">
                  <Check size={12} />
                  Verified
                </div>
              </div>

              {/* Workout Block Previews */}
              <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
                {generatedPlan.blocks.map((block, idx) => (
                  <div key={idx} className={`p-3 rounded-none border-2 border-brand-black relative ${CATEGORY_COLORS[block.category]}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-black text-brand-black font-display uppercase tracking-tight">
                          {block.title}
                        </h4>
                        <p className="text-[10px] text-gray-700 mt-0.5 font-bold">
                          {block.details}
                        </p>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 border border-brand-black rounded-none bg-white text-brand-black">
                        {CATEGORY_LABELS[block.category]}
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-600 mt-2 italic font-bold">
                      {block.description}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      <span className="text-[9px] font-bold bg-white/70 border border-brand-black/20 px-2 py-0.5 rounded-none text-brand-black">
                        {block.time} min
                      </span>
                      {block.distance > 0 && (
                        <span className="text-[9px] font-bold bg-white/70 border border-brand-black/20 px-2 py-0.5 rounded-none text-brand-black">
                          {block.distance}m
                        </span>
                      )}
                      {block.tags.map((tag) => (
                        <span key={tag} className="text-[9px] font-bold bg-white/40 border border-brand-black/10 px-1.5 py-0.5 rounded-none text-gray-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 border-t-2 border-brand-black pt-4">
                <button
                  onClick={() => handleApply(true)}
                  className="rounded-none border-2 border-brand-black bg-white hover:bg-synapse-gray text-xs font-black text-brand-black py-3 text-center transition active:translate-x-[1px]"
                >
                  Append to Active Plan
                </button>
                <button
                  onClick={() => handleApply(false)}
                  className="flex items-center justify-center gap-1.5 rounded-none bg-synapse-gold text-brand-black border-2 border-brand-black py-3 text-xs font-black hover:bg-synapse-petrol hover:text-white transition duration-200 shadow-[3px_3px_0_rgba(33,33,33,1)] active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <Plus size={14} />
                  <span>Replace Active Plan</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
