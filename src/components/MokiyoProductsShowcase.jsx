import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MokiyoProductsShowcase({ onQuickView }) {
  const [unlocked, setUnlocked] = useState(false);

  const showcaseItems = [
    {
      id: 'sc-1',
      name: 'Mokiyo Panel Cuban Collar Shirt',
      category: 'Apparel',
      price: 'Rs.1899',
      image: '/assets/product-shirt-panel.jpg',
      colSpan: 'col-span-1 md:col-span-3',
      height: 'h-64 sm:h-80 md:h-96'
    },
    {
      id: 'sc-2',
      name: 'Resort Shirt // Create Your Own Reality',
      category: 'Apparel',
      price: 'Rs.1899',
      image: '/assets/product-shirt-graffiti.jpg',
      colSpan: 'col-span-1 md:col-span-3',
      height: 'h-64 sm:h-80 md:h-96'
    },
    {
      id: 'sc-3',
      name: 'Mokiyo Molten Gold Drip Cap',
      category: 'Headwear',
      price: 'Rs.999',
      image: '/assets/product-cap-gold.jpg',
      colSpan: 'col-span-2 md:col-span-6',
      height: 'h-80 sm:h-96 md:h-[400px]',
      isCenterHero: true
    },
    {
      id: 'sc-4',
      name: 'Wild Companion Hoodie // Golden Canyon',
      category: 'Campaign',
      price: 'Rs.1799',
      image: '/assets/mokiyo-hero-campaign-alt.jpg',
      colSpan: 'col-span-1 md:col-span-6',
      height: 'h-64 sm:h-80 md:h-96'
    },
    {
      id: 'sc-5',
      name: 'Mokiyo Obsidian Tactical Backpack',
      category: 'Accessories',
      price: 'Rs.2499',
      image: '/assets/product-backpack-black.jpg',
      colSpan: 'col-span-1 md:col-span-6',
      height: 'h-64 sm:h-80 md:h-96'
    }
  ];

  return (
    <section id="showcase" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-10 max-w-[1600px] mx-auto select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-5 border-b border-zinc-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-[0.14em] uppercase text-black font-display">
            MOKIYO PRODUCTS
          </h2>
          <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5 block">
            THE WILD REPERTOIRE // COMPLETE ECOSYSTEM
          </span>
        </div>

        {/* Unlock More Dropdown / Button from Figma */}
        <button
          onClick={() => setUnlocked(!unlocked)}
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

      {/* Expandable info */}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-zinc-200 py-4"
          >
            <p className="text-xs text-zinc-600 font-mono">
              From wearable streetwear to daily utilitarian carry — built to withstand the elements without sacrificing high-fashion aesthetics.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Creative Staggered / Overlapping Layout from Figma */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-12 gap-3.5 sm:gap-5 items-center">
        {showcaseItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onQuickView && onQuickView({
              name: item.name,
              price: item.price.replace('Rs.', ''),
              currency: 'Rs.',
              images: [item.image],
              description: `Part of the exclusive Mokiyo ${item.category} capsule. Designed for high durability and standout streetwear styling.`,
              details: { fit: 'Custom Fit', gsm: 'Heavyweight Spec', fabric: 'Premium Construction' }
            })}
            className={`${item.colSpan} ${item.height} group relative overflow-hidden bg-zinc-100 border border-[#ECECEE] hover:border-black/40 cursor-pointer transition-all duration-500 rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover object-center group-hover:scale-[1.06] transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {/* Gradient overlay — fades in on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

            {/* Hover shine sweep */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-[-100%] w-1/3 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:left-[150%] transition-all duration-700 ease-in-out" />
            </div>

            {/* Hover details badge */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-[#FF4D00] font-bold block">
                  {item.category}
                </span>
                <span className="text-xs sm:text-sm font-semibold truncate block drop-shadow-sm">
                  {item.name}
                </span>
              </div>
              <span className="text-xs font-bold font-mono bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded shrink-0 ml-2">
                {item.price}
              </span>
            </div>

            {/* Center hero cap label */}
            {item.isCenterHero && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                <span className="bg-white/95 backdrop-blur-sm text-black text-xs font-bold px-4 py-1 tracking-widest uppercase shadow-sm rounded">
                  Mokiyo — Cap
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
