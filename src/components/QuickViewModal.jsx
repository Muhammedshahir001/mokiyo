import React, { useState } from 'react';
import { X, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickViewModal({ product, isOpen, onClose, onAddToCart }) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'L');
  const [selectedImg, setSelectedImg] = useState(0);
  const [added, setAdded] = useState(false);

  const images = product.images || ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop'];

  const handleAdd = () => {
    onAddToCart({ ...product, selectedSize });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white text-black max-w-3xl w-full shadow-2xl z-10 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 text-zinc-500 hover:text-black bg-white/80 rounded-none transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Gallery */}
              <div className="bg-zinc-100 flex flex-col justify-between">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={images[selectedImg]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.tag && (
                    <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                      {product.tag}
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 p-3 bg-white border-t border-zinc-200">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImg(i)}
                        className={`w-14 h-16 border overflow-hidden ${
                          selectedImg === i ? 'border-black ring-1 ring-black' : 'border-zinc-200 opacity-60'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#FF4D00] uppercase font-bold">
                    MOKIYO® APPAREL
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black uppercase font-display mt-1">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-lg font-black text-zinc-900 font-mono">
                      {product.currency || 'Rs.'}{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-zinc-400 line-through font-mono">
                        {product.currency || 'Rs.'}{product.originalPrice}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-600 mt-4 leading-relaxed">
                    {product.description ||
                      'Crafted with high-GSM custom French terry cotton. Engineered for an effortless boxy streetwear drape.'}
                  </p>

                  {/* Streetwear Specifications */}
                  <div className="mt-5 p-3.5 bg-zinc-50 border border-zinc-200/80 space-y-1.5 text-[11px] font-mono">
                    <div className="flex justify-between text-zinc-700">
                      <span>FABRIC:</span>
                      <strong className="text-black">{product.details?.fabric || '100% Combed Cotton'}</strong>
                    </div>
                    <div className="flex justify-between text-zinc-700">
                      <span>WEIGHT:</span>
                      <strong className="text-black">{product.details?.gsm || '380 GSM Heavyweight'}</strong>
                    </div>
                    <div className="flex justify-between text-zinc-700">
                      <span>CUT:</span>
                      <strong className="text-black">{product.details?.fit || 'Signature Boxy Fit'}</strong>
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="mt-6">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                      <span>SELECT SIZE</span>
                      <span className="text-zinc-400 font-mono text-[11px]">Size Guide</span>
                    </div>
                    <div className="flex gap-2">
                      {(product.sizes || ['S', 'M', 'L', 'XL']).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`flex-1 py-2 text-xs font-bold tracking-wider uppercase border transition-all ${
                            selectedSize === sz
                              ? 'bg-black text-white border-black'
                              : 'border-zinc-300 text-zinc-700 hover:border-black'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add to Bag Button */}
                <div className="mt-8 pt-6 border-t border-zinc-200 space-y-3">
                  <button
                    onClick={handleAdd}
                    className={`w-full py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                      added
                        ? 'bg-[#FF4D00] text-white'
                        : 'bg-black text-white hover:bg-[#FF4D00]'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>ADDED TO YOUR BAG</span>
                      </>
                    ) : (
                      <span>ADD TO BAG</span>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3" /> Worldwide Shipping
                    </span>
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> 7-Day Easy Exchange
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

