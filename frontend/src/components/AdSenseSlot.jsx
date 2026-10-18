import React from 'react';

/**
 * Reusable AdSense Placeholder Component
 * Slots:
 *  - 'homepage-leaderboard'
 *  - 'homepage-infeed'
 *  - 'tool-leaderboard'
 *  - 'tool-rectangle'
 *  - 'all-pages-anchor'
 */
export default function AdSenseSlot({ slot, className = '' }) {
  // Dimension and layout presets
  const configs = {
    'homepage-leaderboard': {
      label: 'Leaderboard Ad (728x90 / responsive)',
      classes: 'w-full max-w-[728px] min-h-[90px] mx-auto',
    },
    'homepage-infeed': {
      label: 'In-Feed Ad (Responsive Grid Placement)',
      classes: 'w-full min-h-[140px] h-full',
    },
    'tool-leaderboard': {
      label: 'Tool Top Banner (728x90 / responsive)',
      classes: 'w-full max-w-[728px] min-h-[90px] mx-auto',
    },
    'tool-rectangle': {
      label: 'Result Rectangle Ad (336x280 / 300x250)',
      classes: 'w-full max-w-[336px] min-h-[250px] mx-auto',
    },
    'all-pages-anchor': {
      label: 'Footer Anchor Ad Slot',
      classes: 'w-full max-w-4xl min-h-[70px] mx-auto',
    },
  };

  const current = configs[slot] || {
    label: `Ad Slot (${slot})`,
    classes: 'w-full min-h-[90px] max-w-2xl mx-auto',
  };

  return (
    <div className={`my-6 ${className}`}>
      {/* HTML comment explicitly injected into DOM for AdSense snippet integration */}
      <div
        dangerouslySetInnerHTML={{
          __html: `<!-- AdSense: ${slot} -->`,
        }}
      />
      
      {/* AdSense Placement Container */}
      <div
        data-adsense-slot={slot}
        className={`${current.classes} bg-slate-50/80 border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-3 text-center transition-all select-none hover:border-slate-400`}
      >
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">
          Advertisement
        </span>
        <span className="text-xs font-medium text-slate-500">
          {current.label}
        </span>
        <span className="text-[11px] text-slate-400 mt-0.5">
          Replace with AdSense display tag (Slot: {slot})
        </span>
      </div>
    </div>
  );
}
