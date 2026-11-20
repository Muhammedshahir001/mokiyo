import React, { useState, useMemo } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';

const CATEGORIES = ['ALL', 'HOODIES', 'T-SHIRTS', 'SHIRTS'];

export default function NewArrivals({
  products = [],
  onAddToCart,
  onToggleWishlist,
  wishlistIds = new Set(),
  onQuickView,
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  // Exclude caps — they live in their own collection
  const apparelProducts = useMemo(
    () => products.filter((p) => !p.isCap),
    [products],
  );

  const filteredProducts = useMemo(() => {
    if (selectedFilter === 'ALL') return apparelProducts;
    const catMap = {
      HOODIES: 'hoodies',
      'T-SHIRTS': 't-shirts',
      SHIRTS: 'shirts',
    };
    return apparelProducts.filter(
      (p) => p.category === catMap[selectedFilter],
    );
  }, [apparelProducts, selectedFilter]);

  return (
    <section
      id="new-arrivals"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-10 max-w-[1600px] mx-auto select-none"
    >
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between pb-5 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-[0.14em] uppercase text-black font-display">
            NEW ARRIVAL
          </h2>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5 block">
            LIMITED EDITION RUN // {filteredProducts.length} STYLES
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

      {/* ── Expandable Category Filters ── */}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden border-b border-zinc-200"
          >
            <div className="py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 mr-1" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 mr-2 font-sans">
                  Filter:
                </span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedFilter(cat)}
                    className={`px-3 py-1 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all duration-200 font-sans ${
                      selectedFilter === cat
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="text-xs font-mono text-zinc-500">
                Premium 380–420 GSM • Pre-shrunk Compact Cotton
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Product Grid: 4 columns like Reference Website ── */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
        {filteredProducts.map((product) => (
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
