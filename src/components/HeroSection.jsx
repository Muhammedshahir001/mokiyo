import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ThreeRotatingLogo from './ThreeRotatingLogo';

export default function HeroSection() {
  // Always use the MOKIYO authentic brand campaign image.
  // We intentionally do NOT read heroData.heroImage from the backend
  // so that a stale DB entry never overrides the correct asset.
  const campaignImage = '/assets/mokiyo-hero-campaign.jpg';

  const scrollToCollection = () => {
    const el = document.getElementById('new-arrivals');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white px-2.5 sm:px-6 lg:px-8 pb-6 sm:pb-8 pt-1 sm:pt-2">
      {/* Outer Hero Container – rounded edges matching reference */}
      <div
        className="relative w-full h-[72vh] sm:h-[78vh] min-h-[480px] sm:min-h-[560px] max-h-[860px] rounded-[20px] sm:rounded-[36px] overflow-hidden select-none bg-[#0D1520] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-zinc-100"
      >
        {/* Background Campaign Image */}
        <motion.div
          initial={{ scale: 1.04, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={campaignImage}
            alt="Mokiyo Streetwear Campaign"
            className="w-full h-full object-cover object-top sm:object-[center_30%] filter brightness-[0.98] contrast-[1.02]"
          />
          {/* Subtle vignette overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
        </motion.div>

        {/* 3D Liquid Chrome Emblem — Centred in Hero */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="pointer-events-auto mt-1 sm:mt-3">
            <ThreeRotatingLogo className="w-56 h-48 sm:w-80 sm:h-64 md:w-[460px] md:h-[350px] lg:w-[520px] lg:h-[390px]" />
          </div>
        </div>

        {/* Bottom "Shop now" CTA */}
        <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 flex justify-center z-30">
          <button
            onClick={scrollToCollection}
            className="group text-white hover:text-white text-xs sm:text-base font-semibold tracking-wide cursor-pointer transition-colors"
          >
            <span className="relative pb-1">
              Shop now
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white transition-all group-hover:scale-x-110" />
            </span>
          </button>
        </div>
      </div>

      {/* Sub-Bar: LATEST DROP | DISCOVER MORE */}
      <div className="mt-4 sm:mt-5 px-1 sm:px-2 flex items-center justify-between">
        <div>
          <h2 className="text-xs sm:text-base font-extrabold uppercase tracking-widest text-black font-display">
            LATEST DROP
          </h2>
        </div>
        <button
          onClick={scrollToCollection}
          className="px-3.5 sm:px-4 py-1.5 rounded-full border border-zinc-300 text-[10px] sm:text-xs font-bold tracking-wider uppercase text-zinc-800 hover:border-black hover:text-black hover:bg-zinc-50 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <span>DISCOVER MORE</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>
  );
}
