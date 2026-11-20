import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistIds = new Set(),
  products = [],
  onAddToCart,
  onRemoveFromWishlist,
}) {
  const wishlistedProducts = products.filter((p) =>
    wishlistIds.has(p._id || p.slug)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="w-screen max-w-md bg-white text-black shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg tracking-tight uppercase font-display">
                    SAVED SILHOUETTES ({wishlistedProducts.length})
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase">
                    YOUR CURATED MOKIYO WISHLIST
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {wishlistedProducts.length === 0 ? (
                  <div className="py-24 text-center text-zinc-400">
                    <p className="text-sm font-semibold uppercase tracking-wider mb-2">
                      No saved items yet
                    </p>
                    <p className="text-xs text-zinc-500">
                      Tap the bookmark icon on any piece to save it for later.
                    </p>
                  </div>
                ) : (
                  wishlistedProducts.map((product) => (
                    <div
                      key={product._id || product.slug}
                      className="flex gap-4 p-3 border border-zinc-200 bg-zinc-50/50"
                    >
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=200&auto=format&fit=crop'}
                        alt={product.name}
                        className="w-18 h-24 object-cover shrink-0 bg-zinc-200"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-bold text-black uppercase tracking-tight">
                              {product.name}
                            </h4>
                            <button
                              onClick={() => onRemoveFromWishlist(product)}
                              className="text-zinc-400 hover:text-red-600 transition-colors"
                              title="Remove from saved"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-xs font-bold text-black mt-1 font-mono">
                            {product.currency || 'Rs.'}{product.price}
                          </div>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mt-1">
                            {product.details?.fit || 'Signature Fit'}
                          </span>
                        </div>

                        {/* Quick Add to Bag */}
                        <button
                          onClick={() => {
                            onAddToCart(product);
                            onRemoveFromWishlist(product);
                          }}
                          className="mt-2 py-1.5 px-3 bg-black hover:bg-[#FF4D00] text-white text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>MOVE TO BAG</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {wishlistedProducts.length > 0 && (
                <div className="p-5 border-t border-zinc-200 bg-zinc-50">
                  <button
                    onClick={() => {
                      wishlistedProducts.forEach((p) => onAddToCart(p));
                      onClose();
                    }}
                    className="w-full py-3.5 bg-black hover:bg-[#FF4D00] text-white text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>MOVE ALL TO BAG</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

