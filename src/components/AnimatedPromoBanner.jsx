import React from 'react';

const ITEMS_TOP = [
  'MOKIYO® HAUTE STREETWEAR',
  'COMPLIMENTARY SHIPPING OVER ₹2,999',
  '420 GSM COMPACT FRENCH TERRY',
  'ARCHIVAL SILHOUETTES',
  'LIMITED WORLDWIDE DROP',
  'CRAFTED FOR THE BOLD',
];

const ITEMS_BOT = [
  'EXPRESS WORLDWIDE AIR SHIPPING',
  'HAND-DISTRESSED DETAILS',
  'PRE-SHRUNK ORGANIC COTTON',
  'ARCHIVAL BATCH NUMBERED',
  'PREMIUM QUALITY GUARANTEED',
  'AUTHENTIC STREETWEAR CULTURE',
];

function Track({ items, reverse = false, dark = true }) {
  const cls = reverse ? 'animate-marquee-reverse' : 'animate-marquee';
  return (
    <div className="flex w-max overflow-hidden">
      <div className={`flex items-center shrink-0 gap-8 sm:gap-12 pr-8 sm:pr-12 ${cls}`}>
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-8 sm:gap-12 shrink-0">
            <span className={`text-[10px] sm:text-[11px] font-bold tracking-[0.26em] uppercase font-mono whitespace-nowrap ${dark ? 'text-zinc-200' : 'text-zinc-700'}`}>
              {item}
            </span>
            <span className={`w-1 h-1 rounded-full shrink-0 ${dark ? 'bg-[#FF4D00]' : 'bg-zinc-400'}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnimatedPromoBanner({ variant = 'dark' }) {
  const isDark = variant === 'dark';
  return (
    <div className={`relative w-full overflow-hidden border-y select-none ${isDark ? 'bg-[#0A0A0C] border-zinc-800' : 'bg-[#F4F4F6] border-zinc-200'}`}>
      {/* Left & right fade masks */}
      <div className={`absolute left-0 top-0 h-full w-16 bg-gradient-to-r ${isDark ? 'from-[#0A0A0C]' : 'from-[#F4F4F6]'} to-transparent z-10 pointer-events-none`} />
      <div className={`absolute right-0 top-0 h-full w-16 bg-gradient-to-l ${isDark ? 'from-[#0A0A0C]' : 'from-[#F4F4F6]'} to-transparent z-10 pointer-events-none`} />

      <div className="py-2.5 sm:py-3 flex flex-col gap-2.5">
        <Track items={ITEMS_TOP} reverse={false} dark={isDark} />
        <Track items={ITEMS_BOT} reverse={true}  dark={isDark} />
      </div>
    </div>
  );
}
