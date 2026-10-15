/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { AnalyticsEvent, CrmLeadPayload, UtmParams } from '../utils/conversion';
import type { ChannelSource } from '../utils/attribution';
import { AttributionBar } from './AttributionBar';
import { AnalyticsDrawer } from './AnalyticsDrawer';

interface DebugToolsProps {
  currentChannel: ChannelSource;
  onSelectChannel: (channel: ChannelSource) => void;
  activeUtms: UtmParams;
  isDrawerOpen: boolean;
  onOpenDrawer: () => void;
  onCloseDrawer: () => void;
  events: AnalyticsEvent[];
  leads: CrmLeadPayload[];
  onClearEvents: () => void;
}

/**
 * QA-only overlay bundle. Rendered exclusively behind ?debug=1 via a
 * lazy import so real traffic never downloads it.
 */
export const DebugTools: React.FC<DebugToolsProps> = ({
  currentChannel,
  onSelectChannel,
  activeUtms,
  isDrawerOpen,
  onOpenDrawer,
  onCloseDrawer,
  events,
  leads,
  onClearEvents
}) => {
  return (
    <>
      <AttributionBar
        currentChannel={currentChannel}
        onSelectChannel={onSelectChannel}
        activeUtms={activeUtms}
        onOpenAnalytics={onOpenDrawer}
        eventCount={events.length}
      />
      <AnalyticsDrawer
        isOpen={isDrawerOpen}
        onClose={onCloseDrawer}
        events={events}
        leads={leads}
        activeUtms={activeUtms}
        onClearEvents={onClearEvents}
      />
    </>
  );
};
