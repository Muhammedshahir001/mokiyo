import React, { useState, useEffect } from 'react';
import {
  Search,
  Bookmark,
  ShoppingBag,
  User,
  X,
  MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenSearch,
  onOpenWishlist,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [menuOpen]);

  const currencies = [
    { code: 'INR', label: 'India (₹ INR)' },
    { code: 'USD', label: 'USA ($ USD)' },
    { code: 'EUR', label: 'Europe (€ EUR)' },
    { code: 'GBP', label: 'UK (£ GBP)' },
  ];

  const menuLinks = [
    { label: 'New Arrivals', href: '#new-arrivals' },
    { label: 'Collections', href: '#caps' },
    { label: 'Why Mokiyo', href: '#why-mokiyo' },
    { label: 'Products', href: '#showcase' },
    { label: 'Contact', href: '#footer' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_1px_12px_rgba(0,0,0,0.06)]' : ''
        }`}
      >
        <div className="max-w-[1720px] mx-auto px-3 sm:px-8 lg:px-12 h-[56px] sm:h-[62px] flex items-center justify-between relative">

          {/* ── Left Area: Desktop Nav Links OR Mobile Hamburger Menu ── */}
          <div className="flex items-center min-w-[70px] sm:min-w-[180px]">
            {/* Mobile Hamburger Button (On Left - Universal Mobile Luxury Pattern) */}
            <button
              onClick={() => setMenuOpen(true)}
              className="sm:hidden p-2 -ml-1 text-zinc-800 hover:text-black transition-colors focus:outline-none"
              aria-label="Open navigation menu"
            >
              <div className="flex flex-col gap-[5px] w-[18px] justify-center py-1">
                <span className="w-full h-[1.5px] bg-current" />
                <span className="w-full h-[1.5px] bg-current" />
              </div>
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden sm:flex items-center gap-8 text-[13px] font-medium tracking-[0.02em] text-zinc-800">
              <a href="#new-arrivals" className="relative py-1 group transition-colors hover:text-black">
                New in
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full" />
              </a>
              <a href="#caps" className="relative py-1 group transition-colors hover:text-black">
                Collections
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full" />
              </a>
            </nav>
          </div>

          {/* ── Center: Brand Wordmark (Always Centered with Safe Margins) ── */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
            <a href="#" className="hover:opacity-85 transition-opacity px-2 py-1">
              <span className="text-[18px] sm:text-[22px] font-black tracking-[0.09em] uppercase font-display text-black select-none whitespace-nowrap">
                MOKIYO
              </span>
            </a>
          </div>

          {/* ── Right Area: Action Icons (Mobile & Desktop Responsive) ── */}
          <div className="flex items-center gap-1.5 sm:gap-3.5 ml-auto">

            {/* Currency selector (Desktop only) */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="w-7 h-7 rounded-full bg-[#0A0A0C] text-white flex items-center justify-center hover:scale-105 transition-transform"
                aria-label="Region"
              >
                <span className="text-[9px] font-bold text-sky-400">IN</span>
              </button>
              <AnimatePresence>
                {currencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2.5 w-40 bg-white border border-zinc-150 shadow-xl rounded-lg py-1 z-50"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Region
                    </div>
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { setCurrency(c.code); setCurrencyOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-50 flex items-center justify-between transition-colors ${
                          currency === c.code ? 'font-semibold text-black' : 'text-zinc-600'
                        }`}
                      >
                        {c.label}
                        {currency === c.code && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Store locator (Desktop only) */}
            <a href="#stores" className="p-1.5 text-zinc-700 hover:text-black transition-colors hidden sm:flex" aria-label="Stores">
              <MapPin className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </a>

            {/* Search (All Devices) */}
            <button
              onClick={onOpenSearch}
              className="p-1.5 text-zinc-700 hover:text-black transition-colors"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={1.6} />
            </button>

            {/* Account (Desktop only) */}
            <button className="p-1.5 text-zinc-700 hover:text-black transition-colors hidden sm:flex" aria-label="Account">
              <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-1.5 text-zinc-700 hover:text-black transition-colors"
              aria-label="Wishlist"
            >
              <Bookmark className="w-[18px] h-[18px]" strokeWidth={1.6} />
              {wishlistCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 w-3.5 h-3.5 bg-[#FF4D00] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Bag (All Devices) */}
            <button
              onClick={onOpenCart}
              className="relative p-1.5 text-zinc-700 hover:text-black transition-colors"
              aria-label="Bag"
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.6} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Desktop Hamburger (Desktop only) */}
            <button
              onClick={() => setMenuOpen(true)}
              className="p-1.5 text-zinc-700 hover:text-black transition-colors hidden sm:flex ml-1"
              aria-label="Menu"
            >
              <div className="flex flex-col gap-[5px] w-[18px] justify-center py-1">
                <span className="w-full h-[1.5px] bg-current" />
                <span className="w-full h-[1.5px] bg-current" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ── Full-Screen Mobile Navigation Overlay (Clean & Non-Overlapping) ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            {/* Dedicated Top Bar inside Menu: Logo on Left, Clean [X] Close on Right */}
            <div className="h-[56px] sm:h-[62px] px-4 sm:px-8 border-b border-zinc-100 flex items-center justify-between">
              <span className="text-[18px] sm:text-[22px] font-black tracking-[0.09em] uppercase font-display text-black">
                MOKIYO
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-black hover:text-white flex items-center justify-center text-zinc-700 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            {/* Menu Links with Responsive Fluid Font Sizes – No Cutting Off */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-[1200px] mx-auto w-full overflow-y-auto py-6">
              <nav className="space-y-2 sm:space-y-4">
                {menuLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="block text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-black hover:text-[#FF4D00] transition-colors py-1.5 font-display break-words"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              {/* Mobile Quick Action Strip */}
              <div className="mt-8 pt-6 border-t border-zinc-150 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-zinc-700">
                <button
                  onClick={() => { setMenuOpen(false); onOpenWishlist && onOpenWishlist(); }}
                  className="flex items-center gap-1.5 hover:text-black"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Wishlist ({wishlistCount})</span>
                </button>
                <span className="text-zinc-300">|</span>
                <button
                  onClick={() => { setMenuOpen(false); onOpenCart && onOpenCart(); }}
                  className="flex items-center gap-1.5 hover:text-black"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Bag ({cartCount})</span>
                </button>
              </div>

              {/* Footer Stamp */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-6 flex flex-wrap gap-4 text-[11px] font-mono text-zinc-400 uppercase tracking-widest"
              >
                <span>Mumbai, India</span>
                <span>Worldwide Shipping</span>
                <span>© 2026 Mokiyo</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
