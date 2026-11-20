import React, { useState } from 'react';
import { ChevronDown, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PHILOSOPHY = [
  {
    num: '01',
    title: 'Zero Synthetic Fillers',
    body: 'Only 100% compact organic combed cotton. Double-knit terry loops weighing at least 380 GSM for that indestructible drape.',
  },
  {
    num: '02',
    title: 'Micro-Batch Drops',
    body: 'Every silhouette is numbered and capped at 200–500 pieces per run worldwide. When it sells out, it enters the permanent archive.',
  },
  {
    num: '03',
    title: 'Hand-Distressed Details',
    body: 'Raw edges, vintage mineral washes, and artisanal puff inks cured at 180°C to guarantee your prints never crack or fade.',
  },
];

const DEFAULTS = [
  {
    title: "Mokiyo Men's Wear Flagship Experience",
    thumbnail:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
    videoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-an-urban-setting-39878-large.mp4',
    badge: '13:54',
  },
  {
    title: 'Artisanal Tailoring & Heavyweight Fabrics',
    thumbnail:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
    videoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-her-outfit-39877-large.mp4',
    badge: '10:00',
  },
  {
    title: 'Live The Wild Campaign Lookbook',
    thumbnail:
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1000&auto=format&fit=crop',
    videoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-man-walking-down-a-city-street-40019-large.mp4',
    badge: '3:00',
  },
];

export default function WhyMokiyo({ items = [], onPlayVideo }) {
  const [unlocked, setUnlocked] = useState(false);

  const card = (i) => items[i] || DEFAULTS[i];

  return (
    <section
      id="why-mokiyo"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-10 max-w-[1600px] mx-auto select-none"
    >
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between pb-5 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-[0.14em] uppercase text-black font-display">
            WHY MOKIYO
          </h2>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5 block">
            BEHIND THE CRAFT // EDITORIAL ARCHIVES
          </span>
        </div>

        <button
          onClick={() => setUnlocked((u) => !u)}
          className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold tracking-wider uppercase text-zinc-700 hover:text-black transition-colors"
          aria-expanded={unlocked}
        >
          <span>Unlock More</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              unlocked ? 'rotate-180 text-[#FF4D00]' : ''
            }`}
          />
        </button>
      </div>

      {/* ── Expandable Philosophy Cards ── */}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden border-b border-zinc-200"
          >
            <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {PHILOSOPHY.map((p) => (
                <div
                  key={p.num}
                  className="p-5 bg-zinc-50 border border-zinc-200/70 rounded-md"
                >
                  <span className="text-2xl font-black font-display text-zinc-300 block">
                    {p.num}
                  </span>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-black font-display mt-2">
                    {p.title}
                  </h4>
                  <p className="text-xs text-zinc-600 mt-2 leading-relaxed font-sans">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 3 Cinematic Editorial Video Cards ── */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {[0, 1, 2].map((i) => {
          const item = card(i);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onPlayVideo && onPlayVideo(item)}
              className="group relative flex flex-col bg-white border border-[#ECECEE] hover:border-black/30 transition-all duration-500 cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative w-full aspect-[16/10] bg-zinc-900 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out filter brightness-85 group-hover:brightness-100"
                  loading="lazy"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />

                {/* Duration badge */}
                {item.badge && (
                  <span className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded font-semibold">
                    {item.badge}
                  </span>
                )}

                {/* Play button — animated */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-[#FF4D00] text-black group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,77,0,0.4)]">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Shine sweep on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
                  <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:left-[150%] transition-all duration-700 ease-in-out" />
                </div>
              </div>

              {/* Title & info */}
              <div className="p-4 bg-white border-t border-[#F2F2F4]">
                <h3 className="text-xs sm:text-[13px] font-bold text-black uppercase tracking-wider font-display truncate group-hover:text-[#FF4D00] transition-colors duration-300">
                  {item.title}
                </h3>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-1 block">
                  WATCH FILM // 4K CINEMATIC
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
