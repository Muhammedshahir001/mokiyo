import React, { lazy, Suspense } from 'react';
import { Plane, ShieldCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const RotatingEarthGlobe = lazy(() => import('./RotatingEarthGlobe'));

export default function GlobalBanner() {
  return (
    <section className="bg-white px-3 sm:px-6 lg:px-8 py-4 sm:py-8 select-none">
      <div className="relative w-full rounded-[20px] sm:rounded-[32px] lg:rounded-[40px] overflow-hidden bg-[#06091A] text-white shadow-[0_20px_60px_rgba(0,0,0,0.5)]">

        {/* Blue glow blobs behind the globe */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[300px] h-[300px] sm:w-[480px] sm:h-[480px] rounded-full bg-blue-800/20 blur-3xl" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[320px] sm:h-[320px] rounded-full bg-cyan-700/15 blur-2xl pointer-events-none z-0" />

        {/* ── 3D Globe — perfectly centred ── */}
        <div className="relative z-10 flex items-center justify-center py-10 sm:py-14 lg:py-16">
          <Suspense fallback={
            <div className="w-[300px] h-[300px] sm:w-[440px] sm:h-[440px] rounded-full bg-cyan-900/20 blur-2xl animate-pulse" />
          }>
            <RotatingEarthGlobe
              className="w-[300px] h-[300px] sm:w-[440px] sm:h-[440px] lg:w-[520px] lg:h-[520px]"
              interactive={true}
            />
          </Suspense>
        </div>

        {/* ── Bottom Stats Strip — 4 dark glass cards ── */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 border-t border-white/[0.07]">
          {[
            { icon: Plane,       top: 'WORLDWIDE SHIPPING', bot: 'Over 120+ Countries' },
            { icon: Clock,       top: '48-HOUR DISPATCH',   bot: 'Express Priority Air' },
            { icon: ShieldCheck, top: '100% AUTHENTIC',     bot: 'Archival Batch Numbered' },
            { icon: null,        top: '7-DAY',              mid: 'EASY EXCHANGES',  bot: 'Doorstep Pickups' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`flex flex-col items-center justify-center gap-1 py-5 sm:py-6 text-center px-3
                  ${i < 3 ? 'border-r border-white/[0.07]' : ''}
                  ${i >= 2 ? 'border-t sm:border-t-0 border-white/[0.07]' : ''}`}
              >
                {Icon
                  ? <Icon className="w-4 h-4 text-sky-400 mb-1" />
                  : <span className="text-sm sm:text-base font-black text-sky-400 leading-none mb-0.5">{item.top}</span>
                }
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white leading-tight">
                  {Icon ? item.top : item.mid}
                </span>
                <span className="text-[9px] sm:text-[10px] text-zinc-500 font-mono">{item.bot}</span>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
