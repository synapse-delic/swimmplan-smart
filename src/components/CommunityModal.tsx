import React, { useState, useEffect } from 'react';
import { X, Share2, Copy, Check, Users, Download, Trash2, Globe } from 'lucide-react';
import { TrainingBlock } from '../types';

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: TrainingBlock[];
  onLoadPlan: (importedTimeline: TrainingBlock[]) => void;
  triggerToast: (msg: string) => void;
}

interface ClubPlan {
  id: string;
  title: string;
  coach: string;
  blocksCount: number;
  totalDistance: number;
  totalTime: number;
  publishedAt: string;
  data: TrainingBlock[];
}

const DEFAULT_CLUB_PLANS: ClubPlan[] = [
  {
    id: 'club-tpl-1',
    title: 'Anaerobic Threshold Set',
    coach: 'Coach Laura S.',
    blocksCount: 4,
    totalDistance: 2500,
    totalTime: 90,
    publishedAt: '2 hours ago',
    data: [
      { id: 'c1', templateId: 'tpl-warmup-1', title: 'Warm-up Medley', distance: 600, time: 20, category: 'warmup', details: '6x100m Choice' },
      { id: 'c2', templateId: 'tpl-endurance-1', title: 'Threshold Main Set', distance: 1500, time: 45, category: 'mainset', details: '15x100m Freestyle @ 1:45' },
      { id: 'c3', templateId: 'tpl-speed-1', title: 'Speed Finisher', distance: 200, time: 15, category: 'sprint', details: '8x25m Sprint Kick' },
      { id: 'c4', templateId: 'tpl-cooldown-1', title: 'Active Recovery', distance: 200, time: 10, category: 'cooldown', details: '200m Easy' }
    ]
  },
  {
    id: 'club-tpl-2',
    title: 'High-Volume Aerobic Base',
    coach: 'Coach David K.',
    blocksCount: 3,
    totalDistance: 3200,
    totalTime: 75,
    publishedAt: 'Yesterday',
    data: [
      { id: 'd1', templateId: 'tpl-warmup-1', title: 'Warm-up Free', distance: 800, time: 15, category: 'warmup', details: '800m Easy Choice' },
      { id: 'd2', templateId: 'tpl-endurance-1', title: 'Aerobic Freestyle Ladder', distance: 2000, time: 50, category: 'mainset', details: '200-400-600-400-200m' },
      { id: 'd3', templateId: 'tpl-cooldown-1', title: 'Easy Swim Down', distance: 400, time: 10, category: 'cooldown', details: '400m choice' }
    ]
  }
];

export const CommunityModal: React.FC<CommunityModalProps> = ({
  isOpen,
  onClose,
  timeline,
  onLoadPlan,
  triggerToast
}) => {
  const [copied, setCopied] = useState(false);
  const [publishTitle, setPublishTitle] = useState('');
  const [clubPlans, setClubPlans] = useState<ClubPlan[]>([]);
  const [coachName, setCoachName] = useState('Coach Michael R.');

  useEffect(() => {
    // Load local storage club plans
    const stored = localStorage.getItem('swim_club_community_plans');
    if (stored) {
      try {
        setClubPlans(JSON.parse(stored));
      } catch (e) {
        setClubPlans(DEFAULT_CLUB_PLANS);
      }
    } else {
      setClubPlans(DEFAULT_CLUB_PLANS);
      localStorage.setItem('swim_club_community_plans', JSON.stringify(DEFAULT_CLUB_PLANS));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Generate shareable URL hash
  const handleCopyLink = () => {
    if (timeline.length === 0) {
      triggerToast('Cannot share an empty plan!');
      return;
    }

    try {
      const serialized = JSON.stringify(timeline);
      const encoded = btoa(unescape(encodeURIComponent(serialized)));
      const shareUrl = `${window.location.origin}${window.location.pathname}#share=${encoded}`;
      
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      triggerToast('Share link copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      triggerToast('Failed to generate share link.');
    }
  };

  // Publish current plan to club registry
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (timeline.length === 0) {
      triggerToast('Cannot publish an empty plan!');
      return;
    }
    if (!publishTitle.trim()) return;

    const totalDistance = timeline.reduce((sum, b) => sum + b.distance, 0);
    const totalTime = timeline.reduce((sum, b) => sum + b.time, 0);

    const newPlan: ClubPlan = {
      id: `club-${Date.now()}`,
      title: publishTitle.trim(),
      coach: coachName.trim() || 'Guest Coach',
      blocksCount: timeline.length,
      totalDistance,
      totalTime,
      publishedAt: 'Just now',
      data: timeline
    };

    const updated = [newPlan, ...clubPlans];
    setClubPlans(updated);
    localStorage.setItem('swim_club_community_plans', JSON.stringify(updated));
    setPublishTitle('');
    triggerToast(`"${newPlan.title}" published to club library!`);
  };

  const handleDeletePlan = (id: string) => {
    const updated = clubPlans.filter(p => p.id !== id);
    setClubPlans(updated);
    localStorage.setItem('swim_club_community_plans', JSON.stringify(updated));
    triggerToast('Plan removed from club library');
  };

  const handleImportPlan = (plan: ClubPlan) => {
    if (window.confirm(`Load "${plan.title}" shared by ${plan.coach}? This will overwrite your active timeline.`)) {
      onLoadPlan(plan.data);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-none border-4 border-brand-black bg-white shadow-[8px_8px_0_rgba(33,33,33,1)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-brand-black px-5 py-4 bg-[#efefef]">
          <h2 className="font-display text-base font-black text-brand-black uppercase tracking-tight flex items-center gap-2">
            <Users size={18} className="text-synapse-petrol" />
            Club Community Hub
          </h2>
          <button
            onClick={onClose}
            className="rounded-none border-2 border-brand-black p-1 text-brand-black bg-white hover:bg-synapse-gray transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-6 overflow-y-auto max-h-[80vh] no-scrollbar">
          
          {/* Section 1: URL Link sharing */}
          <div className="border-2 border-brand-black p-4 bg-[#f9f9f9]">
            <h3 className="text-xs font-black text-brand-black uppercase tracking-tight flex items-center gap-2 mb-1.5">
              <Globe size={14} className="text-synapse-petrol" />
              Direct Share Link
            </h3>
            <p className="text-[11px] text-gray-700 font-bold mb-3 leading-relaxed">
              Generate a shareable link of your active training plan. Anyone who clicks it can instantly import it.
            </p>
            <button
              onClick={handleCopyLink}
              className={`w-full flex items-center justify-center gap-2 rounded-none border-2 border-brand-black py-2.5 text-xs font-black transition active:translate-x-[1px] active:translate-y-[1px] ${
                copied
                  ? 'bg-synapse-petrol text-white'
                  : 'bg-white text-brand-black hover:bg-synapse-gray'
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Generate &amp; Copy Share Link</span>
                </>
              )}
            </button>
          </div>

          {/* Section 2: Publish plan */}
          <div className="border-2 border-brand-black p-4 bg-[#f9f9f9]">
            <h3 className="text-xs font-black text-brand-black uppercase tracking-tight flex items-center gap-2 mb-2">
              <Users size={14} className="text-synapse-gold" />
              Publish to Club Registry
            </h3>
            
            <form onSubmit={handlePublish} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black uppercase text-gray-500 mb-1">
                    Coach Name
                  </label>
                  <input
                    type="text"
                    required
                    value={coachName}
                    onChange={(e) => setCoachName(e.target.value)}
                    className="w-full text-xs font-bold rounded-none border-2 border-brand-black px-3 py-2 bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase text-gray-500 mb-1">
                    Plan Title / Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wednesday Endurance Set"
                    value={publishTitle}
                    onChange={(e) => setPublishTitle(e.target.value)}
                    className="w-full text-xs font-bold rounded-none border-2 border-brand-black px-3 py-2 bg-white focus:outline-none"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={timeline.length === 0}
                className="w-full flex items-center justify-center gap-1.5 rounded-none border-2 border-brand-black bg-synapse-gold hover:bg-synapse-petrol hover:text-white text-brand-black py-2.5 text-xs font-black transition active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-35 disabled:pointer-events-none"
              >
                <span>Publish Current Plan</span>
              </button>
            </form>
          </div>

          {/* Section 3: Club database */}
          <div>
            <h3 className="text-xs font-black text-brand-black uppercase tracking-tight mb-3">
              Club Shared Training Plans ({clubPlans.length})
            </h3>
            
            <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1 no-scrollbar">
              {clubPlans.length > 0 ? (
                clubPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between border-2 border-brand-black bg-white p-3 shadow-[2px_2px_0_rgba(33,33,33,1)]"
                  >
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs font-black text-brand-black line-clamp-1">
                        {plan.title}
                      </h4>
                      <p className="text-[10px] text-gray-700 font-semibold">
                        Shared by <span className="font-bold">{plan.coach}</span> &bull; {plan.publishedAt}
                      </p>
                      <span className="text-[9px] font-mono font-black text-synapse-petrol mt-0.5 uppercase">
                        {plan.blocksCount} blocks &bull; {plan.totalDistance}m &bull; {plan.totalTime}m
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleImportPlan(plan)}
                        className="flex items-center gap-1 border-2 border-brand-black px-2.5 py-1.5 text-[10px] font-black hover:bg-synapse-petrol hover:text-white transition bg-white text-brand-black"
                      >
                        <Download size={11} />
                        <span>Load</span>
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-red-500 hover:text-red-700 p-1 border-2 border-transparent hover:border-brand-black transition bg-white"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-brand-black">
                  <p className="text-xs text-brand-black font-bold">No shared plans in the club archive yet.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="flex items-center justify-end border-t-2 border-brand-black p-4 bg-[#efefef]">
          <button
            onClick={onClose}
            className="rounded-none border-2 border-brand-black bg-white px-4 py-2 text-xs font-black text-brand-black hover:bg-synapse-gray transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
