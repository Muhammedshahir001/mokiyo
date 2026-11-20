import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoModal({ videoData, isOpen, onClose }) {
  if (!videoData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-full max-w-4xl bg-black border border-white/20 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-zinc-950 flex items-center justify-between border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#FF4D00] uppercase font-bold block">
                  MOKIYO® CINEMA
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  {videoData.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-white bg-white/5 rounded-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player / Teaser */}
            <div className="relative aspect-video w-full bg-black">
              <video
                src={videoData.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-an-urban-setting-39878-large.mp4"}
                autoPlay
                controls
                className="w-full h-full object-cover"
              />
            </div>

            {/* Sub-banner */}
            <div className="p-4 bg-zinc-950 text-center border-t border-white/10">
              <p className="text-xs font-mono tracking-wider text-zinc-300 uppercase">
                {videoData.bannerText || 'WEAR THE STORY. LIVE THE WILD.'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

