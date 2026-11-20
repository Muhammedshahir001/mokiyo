import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { RotateCcw, Eye, ArrowUp, ChevronRight } from 'lucide-react';

// ─────────────────────────────────────────────
//  Garment data
// ─────────────────────────────────────────────
const CAROUSEL_PIECES = [
  {
    id: 'piece-1',
    name: 'Mokiyo Obsidian 420 GSM Hoodie',
    category: 'Heavyweight Fleece',
    price: 'Rs.1799',
    color: '#18181B',
    accent: '#FF4D00',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    tag: 'LIMITED DROP',
    description:
      'Constructed from heavy 420 GSM pure French terry cotton. Features the signature Mokiyo wild insignia across the back with subtle distressed ribbing and dropped shoulder silhouette.',
  },
  {
    id: 'piece-2',
    name: 'Social Savage Editorial White Tee',
    category: '280 GSM Jersey',
    price: 'Rs.1500',
    color: '#F4F4F5',
    accent: '#051124',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    tag: 'NEW ARRIVAL',
    description:
      'Heavyweight white tee featuring the "Social Savage" brutalist front chest typography and iconic back graphics. Thick 1.25" rib collar that never sags.',
  },
  {
    id: 'piece-3',
    name: 'Mokiyo Wild Companion Heavy Hoodie',
    category: 'Autumn / Winter',
    price: 'Rs.1799',
    color: '#0A0A0C',
    accent: '#FF4D00',
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop',
    tag: 'CAMPAIGN PIECE',
    description:
      'Inspired by raw untamed wilderness. Hand-crafted with silicon-washed organic cotton, pre-shrunk for an enduring streetwear drape.',
  },
  {
    id: 'piece-4',
    name: 'Mokiyo Leather Patch Distressed Cap',
    category: 'Headwear Capsule',
    price: 'Rs.499',
    color: '#27272A',
    accent: '#F59E0B',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
    tag: 'BESTSELLER',
    description:
      'Distressed vintage washed cotton baseball cap with laser-embossed Mokiyo metallic emblem and structured curved brim.',
  },
  {
    id: 'piece-5',
    name: 'Desert Tan Portrait Embroidery Cap',
    category: 'Headwear Capsule',
    price: 'Rs.499',
    color: '#D4C3A3',
    accent: '#78350F',
    image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=800&auto=format&fit=crop',
    tag: 'NEW',
    description:
      'Desert sand tone with artisanal wild portrait motif woven onto the front crown. Unstructured dad-hat profile.',
  },
  {
    id: 'piece-6',
    name: 'Camp Collar Short Sleeve Shirt',
    category: 'Textured Linen',
    price: 'Rs.1100',
    color: '#71717A',
    accent: '#3B82F6',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
    tag: 'RESORT CUT',
    description:
      'Textured breathable linen-cotton blend short-sleeve camp collar shirt. Relaxed resort drape with custom matte Mokiyo horn buttons.',
  },
  {
    id: 'piece-7',
    name: 'Mokiyo Gen Z Acid Purple Hoodie',
    category: 'Mineral Acid Wash',
    price: 'Rs.1799',
    color: '#3B0764',
    accent: '#C084FC',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
    tag: 'VIRAL',
    description:
      'Washed mineral acid black base with vibrant neon purple Gen Z smiley and cyber graffiti prints. Reinforced seam stitching.',
  },
];

// ─────────────────────────────────────────────
//  Single draggable garment card
// ─────────────────────────────────────────────
function DraggableGarmentPiece({ piece, index, onDragStateChange, onDropSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Always-active motion values — never conditionally switched to plain numbers
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // 3D tilt driven by drag position
  const rawRotateX = useTransform(dragY, [-220, 220], [25, -25]);
  const rawRotateY = useTransform(dragX, [-220, 220], [-28, 28]);
  const rawRotateZ = useTransform(dragX, [-220, 220], [-15, 15]);

  // Spring-smooth the rotation
  const rotateX = useSpring(rawRotateX, { stiffness: 320, damping: 22 });
  const rotateY = useSpring(rawRotateY, { stiffness: 320, damping: 22 });
  const rotateZ = useSpring(rawRotateZ, { stiffness: 320, damping: 22 });

  // Shadow shrinks as piece lifts
  const shadowScale = useTransform(dragY, [-220, 0], [0.4, 1]);
  const shadowOpacity = useTransform(dragY, [-220, 0], [0.1, 0.5]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    onDragStateChange(piece, true);
  }, [piece, onDragStateChange]);

  const handleDrag = useCallback(
    (_, info) => {
      dragX.set(info.offset.x);
      dragY.set(info.offset.y);
    },
    [dragX, dragY]
  );

  const handleDragEnd = useCallback(
    (_, info) => {
      setIsDragging(false);
      onDragStateChange(piece, false);
      dragX.set(0);
      dragY.set(0);
      if (info.offset.y < -110) {
        onDropSuccess(piece);
      }
    },
    [piece, dragX, dragY, onDragStateChange, onDropSuccess]
  );

  return (
    <motion.div
      drag
      dragSnapToOrigin
      dragElastic={0.22}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 60, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.08,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        rotateX,
        rotateY,
        rotateZ,
        transformStyle: 'preserve-3d',
        touchAction: 'none',
        zIndex: isDragging ? 50 : 10,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      whileHover={{ y: -10, scale: 1.06, transition: { duration: 0.3 } }}
      whileTap={{ scale: 1.1 }}
      className="relative select-none shrink-0 w-28 sm:w-32 md:w-36 lg:w-40"
    >
      <div className="relative group flex flex-col items-center">
        {/* Dynamic shadow */}
        <motion.div
          style={{ scale: shadowScale, opacity: shadowOpacity }}
          className="absolute -bottom-1 left-[10%] right-[10%] h-3 bg-black rounded-full blur-[6px]"
        />

        {/* Card face */}
        <div
          className={`relative w-full aspect-[3/4] rounded-xl overflow-hidden border transition-all duration-300 shadow-lg bg-zinc-900 ${
            isDragging
              ? 'border-[#FF4D00] shadow-[0_0_30px_rgba(255,77,0,0.35)]'
              : isHovered
              ? 'border-zinc-500 shadow-xl'
              : 'border-zinc-700/50'
          }`}
        >
          <img
            src={piece.image}
            alt={piece.name}
            draggable={false}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

          {/* Tag */}
          <span
            className="absolute top-2 left-2 text-[8px] font-mono tracking-widest uppercase font-bold px-1.5 py-0.5 rounded-sm"
            style={{ background: piece.accent, color: '#fff' }}
          >
            {piece.tag}
          </span>

          {/* Name + price */}
          <div className="absolute bottom-2 left-2 right-2">
            <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider truncate">
              {piece.category}
            </p>
            <p className="text-[11px] font-bold text-white truncate leading-tight">
              {piece.name}
            </p>
            <p className="text-[10px] font-mono text-[#FF4D00] font-semibold mt-0.5">
              {piece.price}
            </p>
          </div>
        </div>

        {/* Hover tooltip */}
        <AnimatePresence>
          {isHovered && !isDragging && (
            <motion.div
              key="tip"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-[9px] font-mono px-2.5 py-1 rounded-full border border-white/15 shadow-xl pointer-events-none"
            >
              &#x2191; Drag up to view
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  Main carousel section
// ─────────────────────────────────────────────
export default function Interactive3DCarousel({ onQuickView }) {
  const [activePiece, setActivePiece] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const handleDragState = useCallback((piece, dragging) => {
    setActivePiece(dragging ? piece : null);
  }, []);

  const handleDropSuccess = useCallback(
    (piece) => {
      if (onQuickView) {
        onQuickView({
          name: piece.name,
          price: piece.price.replace('Rs.', ''),
          currency: 'Rs.',
          images: [piece.image],
          description: piece.description,
          details: {
            gsm: piece.category,
            fit: 'Signature Boxy Cut',
            fabric: '100% Combed Cotton',
            print: 'Archival Screenprint',
          },
          sizes: ['S', 'M', 'L', 'XL'],
        });
      }
    },
    [onQuickView]
  );

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActivePiece(null);
  };

  return (
    <section className="relative w-full min-h-[620px] sm:min-h-[680px] md:min-h-[740px] bg-[#D1D1D6] overflow-hidden select-none border-y border-zinc-300/80">

      {/* Oversized background typography */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden"
      >
        <span className="text-[16vw] sm:text-[14vw] font-black uppercase tracking-tighter text-[#18181B]/[0.07] leading-none font-display whitespace-nowrap">
          MOKIYO
        </span>
        <span className="text-[16vw] sm:text-[14vw] font-black uppercase tracking-tighter text-[#18181B]/[0.07] leading-none font-display whitespace-nowrap">
          APPAREL
        </span>
      </div>

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-5 sm:px-10 pt-8 pb-0">
        <div>
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-zinc-600 block">
            Interactive Lookbook
          </span>
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black font-display mt-0.5">
            THE COLLECTIVE
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase text-zinc-700 hover:text-black transition-colors bg-white/50 hover:bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-black/10 shadow-sm"
          title="Reset positions"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Drop-zone glass card */}
      <div className="relative z-20 flex justify-center mt-5">
        <motion.div
          animate={{
            scale: activePiece ? 1.07 : 1,
            borderColor: activePiece ? '#FF4D00' : 'rgba(255,255,255,0.55)',
            boxShadow: activePiece
              ? '0 16px 48px rgba(255,77,0,0.22), 0 0 0 1px rgba(255,77,0,0.3)'
              : '0 8px 24px rgba(0,0,0,0.07)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-md border shadow-md w-72 sm:w-96 cursor-pointer"
          onClick={() => activePiece && handleDropSuccess(activePiece)}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              activePiece ? 'bg-[#FF4D00]' : 'bg-zinc-200'
            }`}
          >
            {activePiece ? (
              <Eye className="w-4 h-4 text-white" />
            ) : (
              <ArrowUp className="w-4 h-4 text-zinc-500" />
            )}
          </div>

          <div className="overflow-hidden">
            <p className="text-[9px] font-mono tracking-widest uppercase text-zinc-500">
              {activePiece ? 'Release to Quick View' : 'Drag a piece upward'}
            </p>
            <p className="text-xs font-bold tracking-tight text-black truncate font-display mt-0.5">
              {activePiece ? activePiece.name : 'Mokiyo Collective'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Garment shelf */}
      <div key={resetKey} className="relative z-10 mt-8 pb-10 px-4 sm:px-8">
        {/* Shelf line */}
        <div className="absolute bottom-10 left-0 right-0 h-px bg-black/15 pointer-events-none" />

        {/* Scrollable garment row */}
        <div className="flex items-end justify-start md:justify-center gap-3 sm:gap-5 overflow-x-auto pb-6 pt-4 no-scrollbar">
          {CAROUSEL_PIECES.map((piece, i) => (
            <DraggableGarmentPiece
              key={`${resetKey}-${piece.id}`}
              piece={piece}
              index={i}
              onDragStateChange={handleDragState}
              onDropSuccess={handleDropSuccess}
            />
          ))}
        </div>

        {/* Mobile scroll hint */}
        <div className="flex md:hidden items-center justify-center gap-1.5 mt-1 text-[9px] font-mono uppercase tracking-widest text-zinc-500">
          <span>Swipe to explore</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </section>
  );
}
