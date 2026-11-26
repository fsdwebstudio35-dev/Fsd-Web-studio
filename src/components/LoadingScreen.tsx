import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { STUDIO_CONFIG } from '../config/studioConfig';

export const LoadingScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 450);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-[#101B16] flex flex-col items-center justify-center pointer-events-none select-none"
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-3"
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="8" fill="#FFFFFF" />
              <path
                d="M8.5 9.5H23.5V13H12.5V15H20.5V18.5H12.5V23H8.5V9.5Z"
                fill="#101B16"
              />
              <rect x="19.5" y="18.5" width="4" height="4.5" rx="1" fill="#B9F6CA" />
            </svg>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              {STUDIO_CONFIG.brandName}
            </span>
            <div className="w-28 h-1 rounded-full bg-white/15 overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-[#B9F6CA] rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
