import React from 'react';

const ITEMS = [
  'MOKIYO® HAUTE STREETWEAR',
  'COMPLIMENTARY SHIPPING OVER ₹2,999',
  '420 GSM COMPACT FRENCH TERRY',
  'ARCHIVAL SILHOUETTES',
  'LIMITED WORLDWIDE DROP',
  'PRE-SHRUNK ORGANIC COTTON',
  'CRAFTED FOR THE BOLD',
  'EXPRESS WORLDWIDE AIR SHIPPING',
  'HAND-DISTRESSED DETAILS',
  'ARCHIVAL BATCH NUMBERED',
];

export default function AnnouncementBar() {
  return (
    <div className="bg-[#0A0A0C] text-white border-b border-zinc-800/80 overflow-hidden select-none py-2 relative">
      {/* Left & right fade masks */}
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#0A0A0C] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#0A0A0C] to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee">
        {/* Track 1 */}
        <div className="flex items-center shrink-0 gap-10 pr-10">
          {ITEMS.map((item, i) => (
            <div key={`a-${i}`} className="flex items-center gap-10 shrink-0">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase font-mono whitespace-nowrap text-zinc-200">
                {item}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#FF4D00] shrink-0 animate-pulse" />
            </div>
          ))}
        </div>
        {/* Track 2 — clone for seamless loop */}
        <div className="flex items-center shrink-0 gap-10 pr-10" aria-hidden>
          {ITEMS.map((item, i) => (
            <div key={`b-${i}`} className="flex items-center gap-10 shrink-0">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase font-mono whitespace-nowrap text-zinc-200">
                {item}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#FF4D00] shrink-0 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
