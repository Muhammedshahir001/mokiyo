import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchModal({ isOpen, onClose, products = [], onSelectProduct }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = searchTerm.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSelect = (product) => {
    onSelectProduct(product);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex flex-col items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Search Header Container */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="relative z-10 w-full max-w-3xl pt-16 px-4"
          >
            <div className="bg-white border border-zinc-200 shadow-2xl p-4">
              <div className="flex items-center gap-3 border-b border-zinc-200 pb-3">
                <Search className="w-5 h-5 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="SEARCH MOKIYO (HOODIES, TEES, CAPS...)"
                  className="w-full text-base font-bold uppercase tracking-wider text-black placeholder:text-zinc-400 focus:outline-none"
                />
                <button
                  onClick={onClose}
                  className="p-1 text-zinc-400 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex items-center gap-2 mt-3 pt-2 text-[11px] font-mono text-zinc-500">
                <span>POPULAR:</span>
                {['Oversized Hoodie', 'Social Savage', 'Caps', 'Shirts'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="hover:text-black underline underline-offset-2"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Results List */}
              <div className="mt-4 max-h-[50vh] overflow-y-auto divide-y divide-zinc-100">
                {searchTerm && filtered.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-400 font-mono">
                    NO SILHOUETTES MATCHING "{searchTerm.toUpperCase()}"
                  </div>
                ) : (
                  filtered.map((item) => (
                    <div
                      key={item._id || item.slug}
                      onClick={() => handleSelect(item)}
                      className="py-3 flex items-center justify-between hover:bg-zinc-50 px-2 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="w-12 h-14 object-cover bg-zinc-200"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-black uppercase tracking-tight">
                            {item.name}
                          </h4>
                          <span className="text-[11px] font-mono text-zinc-500">
                            Rs.{item.price}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-400" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

