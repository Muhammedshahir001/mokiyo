import React, { useState, lazy, Suspense } from 'react';
import { MessageSquare, MessageCircle } from 'lucide-react';

// Lazy-load the Three.js 3D bag renderer
const BagRotation3D = lazy(() => import('./BagRotation3D'));

/* ─────────────────────────────────────────────────────────────────────────
   MOKIYO Footer  –  Exact BLUORNG reference layout with 3D rotating bag
   ─────────────────────────────────────────────────────────────────────────
   Balanced 5-column layout with optimal whitespace, zero unwanted gaps:
     - Column 1: Connect with us
     - Column 2: Order Support
     - Column 3: We are MOKIYO
     - Column 4: Elegant italic cursive "Mokiyo" wordmark
     - Column 5: 3D auto-rotating & interactive MOKIYO shopping bag
     - Bottom bar with legal links and copyright notice
     - Floating Concierge Chat widget
   ───────────────────────────────────────────────────────────────────────── */
export default function Footer({ onOpenCart }) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <footer id="footer" className="relative bg-[#ECECEE] pt-3 sm:pt-5 select-none overflow-x-hidden">
      {/* ── Main White Rounded Footer Container (Compact & Balanced) ── */}
      <div className="bg-white rounded-t-[24px] sm:rounded-t-[36px] lg:rounded-t-[40px] border-t border-zinc-200/80 px-5 sm:px-8 lg:px-12 pt-8 sm:pt-10 pb-6 sm:pb-8 shadow-sm relative overflow-hidden">
        
        {/* Evenly Balanced 5-Column Grid: Zero Wasted Gap */}
        <div className="max-w-[1360px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 items-center pb-8 sm:pb-10 border-b border-zinc-100">

          {/* ── Column 1 : Connect with us ──────────────────────────────── */}
          <div className="space-y-3 self-start">
            <h4 className="text-xs sm:text-sm font-bold text-black tracking-tight font-display">
              Connect with us
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 font-sans">
              <li><a href="tel:+919876543210" className="hover:text-black transition-colors">Call</a></li>
              <li><a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">Text (WhatsApp)</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">Instagram</a></li>
              <li><a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">YouTube</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          {/* ── Column 2 : Order Support ─────────────────────────────────── */}
          <div className="space-y-3 self-start">
            <h4 className="text-xs sm:text-sm font-bold text-black tracking-tight font-display">
              Order Support
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 font-sans">
              <li><a href="#return" className="hover:text-black transition-colors">Make a return/Exchange</a></li>
              <li><a href="#refund" className="hover:text-black transition-colors">Refund/Exchange policy</a></li>
              <li><a href="#track" className="hover:text-black transition-colors">Track your order</a></li>
              <li><a href="#shipping" className="hover:text-black transition-colors">Shipping policy</a></li>
              <li><a href="#international" className="hover:text-black transition-colors">International Order policy</a></li>
              <li><a href="#faqs" className="hover:text-black transition-colors">FAQ&apos;s</a></li>
              <li><a href="#terms" className="hover:text-black transition-colors">Terms</a></li>
            </ul>
          </div>

          {/* ── Column 3 : We are MOKIYO ─────────────────────────────────── */}
          <div className="space-y-3 self-start col-span-2 sm:col-span-1">
            <h4 className="text-xs sm:text-sm font-bold text-black tracking-tight font-display">
              We are MOKIYO
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600 font-sans">
              <li><a href="#story" className="hover:text-black transition-colors">Our story</a></li>
              <li><a href="#stores" className="hover:text-black transition-colors">Walk-in Stores</a></li>
              <li><a href="#collabs" className="hover:text-black transition-colors">Collaborations</a></li>
              <li><a href="#careers" className="hover:text-black transition-colors">Careers</a></li>
              <li><a href="#media" className="hover:text-black transition-colors">Media</a></li>
              <li><a href="#blogs" className="hover:text-black transition-colors">Blogs</a></li>
            </ul>
          </div>

          {/* ── Column 4 : Calligraphic Wordmark (Centered in its slot) ─── */}
          <div className="select-none flex items-center justify-center sm:justify-start lg:justify-center col-span-1 py-2 sm:py-0">
            <span
              style={{
                fontFamily: "'Playfair Display', 'Brush Script MT', Georgia, serif",
                fontStyle: 'italic',
              }}
              className="font-bold text-4xl sm:text-5xl lg:text-6xl text-zinc-800 tracking-normal block leading-none"
            >
              Mokiyo
            </span>
          </div>

          {/* ── Column 5 : 3D Rotating Bag (Compact & Auto-Rotating) ────── */}
          <div className="flex items-center justify-center col-span-1 cursor-pointer group" onClick={onOpenCart}>
            <Suspense
              fallback={
                <img
                  src="/assets/mokiyo-bag-isolated.png"
                  alt="MOKIYO Shopping Bag"
                  className="w-[120px] sm:w-[140px] lg:w-[150px] h-auto object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.12)]"
                />
              }
            >
              <BagRotation3D
                className="w-[125px] sm:w-[145px] lg:w-[160px] h-[160px] sm:h-[185px] lg:h-[210px]"
                onBagClick={onOpenCart}
              />
            </Suspense>
          </div>

        </div>

        {/* ── Bottom Bar : Legal & Copyright Notice ──────────────────────── */}
        <div className="max-w-[1360px] mx-auto pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-sans text-zinc-500">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
            <a href="#privacy" className="hover:text-black transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-black transition-colors">Terms &amp; Conditions</a>
            <a href="#sitemap" className="hover:text-black transition-colors">Sitemap</a>
          </div>
          <p className="text-center sm:text-right text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400">
            © 2026 MOKIYO RETAIL PRIVATE LIMITED, ALL RIGHTS RESERVED
          </p>
        </div>

      </div>

      {/* ── Floating Chat Widget (Exact Bluorng Match) ───────────────────── */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-11 sm:w-12 h-11 sm:h-12 rounded-full bg-black hover:bg-zinc-800 text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
          aria-label="Customer Care Chat"
          title="Chat with Mokiyo Support"
        >
          <MessageSquare className="w-4 sm:w-5 h-4 sm:h-5 fill-current" />
        </button>

        {chatOpen && (
          <div className="absolute bottom-16 right-0 w-[calc(100vw-32px)] sm:w-80 max-w-sm bg-white border border-zinc-200 shadow-2xl rounded-2xl p-5 text-black">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-xs uppercase tracking-wider font-display">Mokiyo Concierge</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-zinc-400 hover:text-black text-xs font-mono p-1">✕</button>
            </div>
            <p className="text-xs text-zinc-600 mt-3 leading-relaxed font-sans">
              Need assistance with sizing, limited drop reservations, or express delivery? We&apos;re active 24/7.
            </p>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat via WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
