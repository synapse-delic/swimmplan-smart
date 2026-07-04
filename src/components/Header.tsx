import React from 'react';
import { Clock, Award, Bell, Users, ChevronDown, Sliders, Download, Sparkles } from 'lucide-react';
import { TrainingBlock, Athlete } from '../types';

interface HeaderProps {
  timeline: TrainingBlock[];
  athletes: Athlete[];
  selectedAthlete: Athlete;
  onSelectAthlete: (athlete: Athlete) => void;
  showAthletesDropdown: boolean;
  setShowAthletesDropdown: (show: boolean) => void;
  onOpenCommunity: () => void;
  onExportExcel: () => void;
  onOpenAICoach: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  timeline,
  athletes,
  selectedAthlete,
  onSelectAthlete,
  showAthletesDropdown,
  setShowAthletesDropdown,
  onOpenCommunity,
  onExportExcel,
  onOpenAICoach
}) => {
  // Calculate stats
  const totalMinutes = timeline.reduce((sum, block) => sum + block.time, 0);
  const totalDistance = timeline.reduce((sum, block) => sum + block.distance, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const timeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
  
  const distanceStr = totalDistance >= 1000 
    ? `${(totalDistance / 1000).toFixed(2)} km` 
    : `${totalDistance}m`;

  // Start time is 09:00
  const startHour = 9;
  const startMinute = 0;
  const endTotalMinutes = startHour * 60 + startMinute + totalMinutes;
  const endHour = Math.floor(endTotalMinutes / 60);
  const endMinute = endTotalMinutes % 60;
  
  const formatTimePadding = (h: number, m: number) => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const sessionTimeRange = `09:00 - ${formatTimePadding(endHour, endMinute)}`;

  return (
    <header className="relative w-full border-b-4 border-synapse-petrol bg-white px-4 py-4 md:px-6 shadow-[0_4px_0_rgba(33,33,33,0.1)]">
      {/* 1. Synapse Delić Corporate Identity Brand Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-synapse-gray mb-4">
        <div className="flex items-center gap-3.5">
          {/* Visual Icon Mark (Page 3 Logo Representation - Sharp/Kantig) */}
          <div 
            style={{ backgroundColor: '#f2a900' }} 
            className="relative h-11 w-11 rounded-none flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-brand-black shadow-[3px_3px_0_rgba(33,33,33,1)] select-none"
          >
            {/* Teal/Petrol columns background block */}
            <div 
              style={{ backgroundColor: '#007d8a' }} 
              className="absolute inset-[10%_10%_10%_10%] rounded-none flex flex-col justify-around py-1 px-1.5"
            >
              <div className="h-1 w-full bg-white rounded-none opacity-95" />
              <div className="h-1 w-[80%] bg-white rounded-none opacity-95" />
              <div className="h-1 w-[60%] bg-white rounded-none opacity-95" />
            </div>
          </div>
          
          {/* Core Wordmark and Tagline Claim */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black tracking-tight text-brand-black text-lg md:text-xl">
                SwimmPlan <span style={{ color: '#007d8a' }}>Smart</span>
              </span>
              <span style={{ color: '#ffffff', backgroundColor: '#007d8a', borderColor: '#212121' }} className="hidden sm:inline text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-none border-2">
                Swim Trainer
              </span>
            </div>
            <p className="text-[10px] md:text-xs text-brand-black font-semibold font-sans italic tracking-wide">
              Simplifying Processes
            </p>
          </div>
        </div>

        {/* Coach / Athlete Profile Selector & Action Controls */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto">
          
          {/* AI Coach Assistant Button */}
          <button
            onClick={onOpenAICoach}
            className="flex items-center gap-1.5 h-10 px-3.5 rounded-none border-2 border-brand-black bg-synapse-gold hover:bg-synapse-petrol hover:text-white font-black text-xs text-brand-black transition active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0_rgba(33,33,33,1)]"
            title="AI Coach Assistant"
          >
            <Sparkles size={16} />
            <span className="hidden sm:inline">AI Coach</span>
          </button>

          {/* Club Sharing Hub Button */}
          <button
            onClick={onOpenCommunity}
            className="flex items-center gap-1.5 h-10 px-3.5 rounded-none border-2 border-brand-black bg-white hover:bg-synapse-gray font-black text-xs text-brand-black transition active:translate-x-[1px] active:translate-y-[1px]"
            title="Club Community Hub"
          >
            <Users size={16} className="text-synapse-petrol" />
            <span className="hidden sm:inline">Club Hub</span>
          </button>

          {/* Excel Export Button */}
          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 h-10 px-3.5 rounded-none border-2 border-brand-black bg-white hover:bg-synapse-gray font-black text-xs text-brand-black transition active:translate-x-[1px] active:translate-y-[1px]"
            title="Export to Excel"
          >
            <Download size={16} className="text-synapse-gold" />
            <span className="hidden sm:inline">Excel</span>
          </button>

          {/* Profile Selector */}
          <div className="relative flex-1 md:flex-initial">
            <button
              onClick={() => setShowAthletesDropdown(!showAthletesDropdown)}
              className="flex w-full md:w-auto items-center justify-between md:justify-start gap-2 rounded-none border-2 border-brand-black bg-white p-1.5 pr-3.5 transition hover:bg-synapse-gray active:translate-x-[1px] active:translate-y-[1px]"
            >
              <div className="flex items-center gap-2">
                <img
                  src={selectedAthlete.avatarUrl}
                  alt={selectedAthlete.name}
                  referrerPolicy="no-referrer"
                  className="h-7 w-7 rounded-none border border-brand-black object-cover animate-fade-in"
                />
                <span className="text-xs font-black text-brand-black font-sans">
                  {selectedAthlete.name}
                </span>
              </div>
              <ChevronDown size={14} className="text-brand-black ml-2" />
            </button>

            {showAthletesDropdown && (
              <div className="absolute right-0 top-12 z-50 w-52 rounded-none border-2 border-brand-black bg-white py-1.5 shadow-[4px_4px_0_rgba(33,33,33,1)]">
                <div className="px-3 py-1.5 text-[9px] font-black tracking-wider text-gray-500 uppercase border-b border-synapse-gray">
                  Change Profile
                </div>
                {athletes.map((ath) => (
                  <button
                    key={ath.id}
                    onClick={() => {
                      onSelectAthlete(ath);
                      setShowAthletesDropdown(false);
                    }}
                    className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs text-brand-black hover:bg-synapse-gray transition ${
                      selectedAthlete.id === ath.id ? 'bg-synapse-petrol text-white font-extrabold' : 'font-medium'
                    }`}
                  >
                    <img
                      src={ath.avatarUrl}
                      alt={ath.name}
                      referrerPolicy="no-referrer"
                      className="h-6 w-6 rounded-none border border-brand-black object-cover"
                    />
                    <span>{ath.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-none border-2 border-brand-black bg-white text-brand-black transition hover:bg-synapse-gray active:translate-x-[1px] active:translate-y-[1px]" title="Notifications">
            <Bell size={18} />
          </button>
        </div>
      </div>

      {/* 2. Session Calendar Date Subtitle */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-black tracking-widest text-[#007d8a] font-sans">
            Athletic Swim Training
          </span>
          <h1 className="font-display text-xl font-black tracking-tight text-brand-black md:text-2xl mt-0.5">
            Wednesday, Oct 25th
          </h1>
          <p className="mt-1 text-xs text-gray-600 font-bold font-sans">
            Morning Training Session ({sessionTimeRange})
          </p>
        </div>
      </div>

      {/* Desktop Metrics Bar */}
      <div className="mt-4 hidden grid-cols-2 gap-4 border-2 border-brand-black bg-synapse-gray p-3 sm:grid md:grid-cols-4 rounded-none">
        <div className="flex items-center gap-2.5 bg-white border border-brand-black p-2.5 px-3 rounded-none shadow-[2px_2px_0_rgba(33,33,33,1)]">
          <Clock className="text-synapse-petrol" size={18} />
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Total Time</div>
            <div className="text-sm font-black text-brand-black">{timeStr}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-white border border-brand-black p-2.5 px-3 rounded-none shadow-[2px_2px_0_rgba(33,33,33,1)]">
          <Award className="text-synapse-gold" size={18} />
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Total Distance</div>
            <div className="text-sm font-black text-brand-black">{distanceStr}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-white border border-brand-black p-2.5 px-3 rounded-none shadow-[2px_2px_0_rgba(33,33,33,1)]">
          <Users className="text-synapse-petrol" size={18} />
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Active Swimmers</div>
            <div className="text-sm font-black text-brand-black">Full Squad (8)</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-white border border-brand-black p-2.5 px-3 rounded-none shadow-[2px_2px_0_rgba(33,33,33,1)]">
          <Sliders className="text-synapse-gold" size={18} />
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-wider font-sans">Blocks</div>
            <div className="text-sm font-black text-brand-black">{timeline.length} blocks</div>
          </div>
        </div>
      </div>

      {/* Mobile-Only Metrics Bar as requested (labeled mobile-metrics-bar) - sharp style */}
      <div className="mobile-metrics-bar mt-3 flex items-center gap-2 sm:hidden">
        <div className="flex items-center gap-1.5 rounded-none bg-white border-2 border-brand-black px-3 py-1 text-xs font-black text-brand-black">
          <Clock className="text-synapse-petrol" size={12} />
          <span>{timeStr}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-none bg-white border-2 border-brand-black px-3 py-1 text-xs font-black text-brand-black">
          <Award className="text-synapse-gold" size={12} />
          <span>{distanceStr}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-none bg-white border-2 border-brand-black px-3 py-1 text-xs font-black text-brand-black">
          <Users className="text-synapse-petrol" size={12} />
          <span>8 Active</span>
        </div>
      </div>
    </header>
  );
};
