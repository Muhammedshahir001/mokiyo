import React, { useState, useCallback } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  onQuickView,
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const images =
    product?.images && product.images.length > 0
      ? product.images
      : [
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
        ];

  const handleNextImage = useCallback(
    (e) => {
      e.stopPropagation();
      setImageIndex((prev) => (prev + 1) % images.length);
    },
    [images.length],
  );

  const handlePrevImage = useCallback(
    (e) => {
      e.stopPropagation();
      setImageIndex((prev) => (prev - 1 + images.length) % images.length);
    },
    [images.length],
  );

  const handleAdd = useCallback(
    (e) => {
      e.stopPropagation();
      onAddToCart(product);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1200);
    },
    [onAddToCart, product],
  );

  const handleWishlist = useCallback(
    (e) => {
      e.stopPropagation();
      onToggleWishlist(product);
    },
    [onToggleWishlist, product],
  );

  // Active display image: show secondary image on hover if available and user hasn't explicitly clicked next
  const activeImage =
    isHovered && images.length > 1 && imageIndex === 0 ? images[1] : images[imageIndex];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView && onQuickView(product)}
      className="group relative flex flex-col bg-white border border-[#ECECEE] hover:border-black/30 transition-all duration-300 cursor-pointer overflow-hidden rounded-md shadow-2xs hover:shadow-md"
    >
      {/* ── Image Area ── */}
      <div className="relative w-full aspect-[3/4] bg-[#F7F7F8] overflow-hidden select-none">
        {/* Main image with zoom and flip on hover */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={activeImage}
            src={activeImage}
            alt={product.name}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.85 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            loading="lazy"
            draggable={false}
          />
        </AnimatePresence>

        {/* Tag badge — top-left */}
        {product.tag && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-black text-white text-[9px] font-mono font-bold px-2 py-0.5 tracking-widest uppercase rounded-2xs">
              {product.tag}
            </span>
          </div>
        )}

        {/* Wishlist — top-right */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/70 hover:bg-white backdrop-blur-xs transition-all duration-200 shadow-2xs ${
            isWishlisted ? 'text-[#FF4D00]' : 'text-zinc-600 hover:text-black'
          }`}
          title="Save to Wishlist"
          aria-label="Toggle wishlist"
        >
          <Bookmark
            className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#FF4D00]' : ''}`}
            strokeWidth={1.8}
          />
        </button>

        {/* Carousel arrows — visible on group hover if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-xs"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.2} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 shadow-xs"
              aria-label="Next image"
            >
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.2} />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10 pointer-events-none">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1 transition-all duration-300 rounded-full ${
                  idx === imageIndex ? 'bg-black w-3' : 'bg-black/25 w-1'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Product Info ── */}
      <div className="p-3 sm:p-3.5 flex items-center justify-between gap-2 border-t border-[#F2F2F4] bg-white">
        <div className="flex flex-col min-w-0 pr-1">
          <h3 className="text-xs sm:text-[13px] font-medium text-black truncate tracking-tight font-sans capitalize group-hover:text-[#FF4D00] transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs sm:text-[13px] font-bold text-black tracking-tight font-sans">
              {product.currency || 'Rs.'}
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-zinc-400 line-through font-sans">
                {product.currency || 'Rs.'}
                {product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Quick-add button */}
        <button
          onClick={handleAdd}
          className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 border ${
            isAdded
              ? 'bg-[#FF4D00] border-[#FF4D00] text-white shadow-xs'
              : 'border-zinc-200 text-zinc-700 hover:border-black hover:bg-black hover:text-white'
          }`}
          title="Quick add to bag"
          aria-label="Add to bag"
        >
          {isAdded ? (
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <Plus className="w-3.5 h-3.5 stroke-[2]" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
