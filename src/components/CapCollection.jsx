import React, { useState, useMemo } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const FEATURES = [
  'Custom Antique Brass Buckle',
  'Curved Brim 6-Panel',
  'Anti-Sweat Band',
];

export default function CapCollection({
  products = [],
  onAddToCart,
  onToggleWishlist,
  wishlistIds = new Set(),
  onQuickView,
}) {
  const [unlocked, setUnlocked] = useState(false);

  const capProducts = useMemo(
    () => products.filter((p) => p.isCap),
    [products],
  );

  return (
    <section
      id="caps"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-10 max-w-[1600px] mx-auto select-none"
    >
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between pb-5 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-[0.14em] uppercase text-black font-display">
            MOKIYO CAP COLLECTION
          </h2>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5 block">
            HEADWEAR CAPSULE // 100% WASHED DRILL COTTON
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

      {/* ── Expandable Feature Pills ── */}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden border-b border-zinc-200"
          >
            <div className="py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600">
              <div className="flex items-center gap-2 flex-wrap">
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-semibold uppercase tracking-wider text-black font-sans">
                  Craft Specs:
                </span>
                {FEATURES.map((feat) => (
                  <span
                    key={feat}
                    className="bg-zinc-100 px-2.5 py-1 font-mono text-[11px] text-zinc-700 rounded-2xs"
                  >
                    {feat}
                  </span>
                ))}
              </div>
              <div className="text-[11px] font-mono text-zinc-400">
                ONE SIZE FITS ALL // ADJUSTABLE STRAP
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cap Grid: 4 columns ── */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
        {capProducts.map((product) => (
          <ProductCard
            key={product._id || product.slug}
            product={product}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            isWishlisted={wishlistIds.has(product._id || product.slug)}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </section>
  );
}
