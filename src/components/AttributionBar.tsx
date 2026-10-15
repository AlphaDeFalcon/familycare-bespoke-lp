/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Share2,
  Linkedin,
  Youtube,
  Globe,
  Sliders,
  ChevronDown,
  ChevronUp,
  Activity,
  Check
} from 'lucide-react';
import { HERO_COPY, ChannelSource } from '../utils/attribution';
import type { UtmParams } from '../utils/conversion';

interface AttributionBarProps {
  currentChannel: ChannelSource;
  onSelectChannel: (channel: ChannelSource) => void;
  activeUtms: UtmParams;
  onOpenAnalytics: () => void;
  eventCount: number;
}

export const AttributionBar: React.FC<AttributionBarProps> = ({
  currentChannel,
  onSelectChannel,
  activeUtms,
  onOpenAnalytics,
  eventCount
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const channelIcons: Record<ChannelSource, React.ReactNode> = {
    google_search: <Search className="w-3.5 h-3.5 text-amber-400" />,
    meta_instagram: <Share2 className="w-3.5 h-3.5 text-blue-400" />,
    linkedin: <Linkedin className="w-3.5 h-3.5 text-sky-400" />,
    youtube: <Youtube className="w-3.5 h-3.5 text-red-400" />,
    direct: <Globe className="w-3.5 h-3.5 text-emerald-400" />
  };

  return (
    <div className="bg-[#121826] text-zinc-200 border-b border-zinc-800 text-xs select-none sticky top-0 z-40">
      {/* Top micro bar with toggle */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-semibold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A859] animate-pulse" />
            QA Attribution Console
          </span>
          <span className="hidden md:inline text-zinc-400 text-[11px]">
            Inspect detected UTM context and the live event stream (debug mode only)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAnalytics}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00A859] hover:bg-[#007F43] text-white font-medium text-[11px] transition-colors shadow-xs"
            aria-label="Open live analytics drawer"
          >
            <Activity className="w-3 h-3" />
            <span>Audit Drawer</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-mono">
              {eventCount}
            </span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-zinc-800 transition-colors text-[11px]"
            aria-label={isExpanded ? 'Collapse campaign bar' : 'Expand campaign bar'}
          >
            {isExpanded ? (
              <>
                <span>Hide Bar</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Channel: {HERO_COPY[currentChannel].name}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded controls */}
      {isExpanded && (
        <div className="bg-[#182133] border-t border-zinc-800/80 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Channel buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-zinc-400 text-[11px] font-medium mr-1 flex items-center gap-1">
                <Sliders className="w-3 h-3" />
                Select Channel:
              </span>
              {(Object.keys(HERO_COPY) as ChannelSource[]).map((key) => {
                const config = HERO_COPY[key];
                const isSelected = currentChannel === key;
                return (
                  <button
                    key={key}
                    onClick={() => onSelectChannel(key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-[#3A55A3] text-white shadow-xs ring-1 ring-white/30'
                        : 'bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 hover:text-white'
                    }`}
                  >
                    {channelIcons[key]}
                    <span>{config.name.split(' (')[0]}</span>
                    {isSelected && <Check className="w-3 h-3 text-emerald-300" />}
                  </button>
                );
              })}
            </div>

            {/* Active UTM string badge */}
            <div className="text-[11px] font-mono bg-zinc-950/80 px-2.5 py-1 rounded border border-zinc-800 text-zinc-400 overflow-x-auto whitespace-nowrap">
              <span className="text-emerald-400">utm_source</span>={activeUtms.utm_source}&nbsp;
              <span className="text-blue-400">utm_campaign</span>={activeUtms.utm_campaign}
              {activeUtms.gclid && (
                <span className="text-amber-400">&nbsp;gclid={activeUtms.gclid}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
