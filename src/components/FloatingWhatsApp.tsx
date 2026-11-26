import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { buildWhatsAppUrl } from '../config/studioConfig';
import { EASE_AGENCY, MagneticLink } from './MotionSystem';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = buildWhatsAppUrl(
    'Hello FSD Web Studio, I would like to inquire about a web project.'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: 0.5, ease: EASE_AGENCY }}
      className="fixed bottom-5 right-5 z-40"
    >
      <MagneticLink
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with FSD Web Studio on WhatsApp"
        className="group h-12 px-4 sm:px-5 rounded-full bg-[#B9F6CA] hover:bg-[#9ef0b5] text-[#101B16] font-display font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-[0_8px_24px_rgba(16,27,22,0.22)] hover:shadow-[0_12px_28px_rgba(185,246,202,0.5)] border border-[#101B16]/15 transition-all duration-200 whitespace-nowrap"
      >
        <MessageCircle
          className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6"
          aria-hidden="true"
        />
        <span>WhatsApp</span>
      </MagneticLink>
    </motion.div>
  );
};
