import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { EASE_AGENCY, useIsFinePointer } from './MotionSystem';

type CursorVariant = 'default' | 'interactive' | 'view' | 'team';

export const CustomCursor: React.FC = () => {
  const isFine = useIsFinePointer();
  const prefersReduced = useReducedMotion();
  const enabled = isFine && !prefersReduced;

  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const ringX = useSpring(mouseX, { stiffness: 320, damping: 28, mass: 0.45 });
  const ringY = useSpring(mouseY, { stiffness: 320, damping: 28, mass: 0.45 });

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) {
        setVariant('default');
        return;
      }

      const cursorNode = target.closest('[data-cursor]') as HTMLElement | null;
      const customMode = cursorNode?.dataset.cursor;
      if (customMode === 'view') {
        setVariant('view');
        return;
      }
      if (customMode === 'team') {
        setVariant('team');
        return;
      }

      const interactive = target.closest(
        'a, button, [role="button"], [role="tab"], input, select, textarea, label'
      );
      setVariant(interactive ? 'interactive' : 'default');
    };

    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);
    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [enabled, mouseX, mouseY]);

  if (!enabled) return null;

  const ringSize =
    variant === 'view' ? 68 : variant === 'interactive' || variant === 'team' ? 42 : 28;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {/* Outer Smooth Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? 1 : 0,
          scale: pressed ? 0.84 : 1,
          backgroundColor:
            variant === 'view'
              ? 'rgba(16, 27, 22, 0.9)'
              : variant === 'interactive'
                ? 'rgba(185, 246, 202, 0.22)'
                : 'rgba(185, 246, 202, 0)',
          borderColor:
            variant === 'view'
              ? 'rgba(185, 246, 202, 0.9)'
              : variant === 'interactive' || variant === 'team'
                ? 'rgba(16, 27, 22, 0.45)'
                : 'rgba(16, 27, 22, 0.28)',
        }}
        transition={{ duration: 0.18, ease: EASE_AGENCY }}
        className="fixed top-0 left-0 rounded-full border flex items-center justify-center backdrop-blur-[1px]"
      >
        {variant === 'view' && (
          <span className="font-display font-bold text-[11px] tracking-wide text-[#B9F6CA]">
            View
          </span>
        )}
      </motion.div>

      {/* Inner Precision Dot */}
      {variant !== 'view' && (
        <motion.div
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{
            opacity: visible ? 1 : 0,
            scale: pressed ? 0.7 : variant === 'interactive' ? 0.6 : 1,
          }}
          transition={{ duration: 0.12 }}
          className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#101B16] ring-1 ring-[#B9F6CA]"
        />
      )}
    </div>
  );
};
