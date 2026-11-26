import React, { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';

export const EASE_AGENCY = [0.22, 1, 0.36, 1] as const;

export const VIEWPORT_ONCE = {
  once: true,
  amount: 0.16,
} as const;

export function useIsFinePointer(): boolean {
  const [isFine, setIsFine] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setIsFine(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isFine;
}

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.55,
  distance = 22,
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  const offset = (() => {
    if (prefersReduced || direction === 'none') return { x: 0, y: 0 };
    switch (direction) {
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{
        duration: prefersReduced ? 0.01 : duration,
        delay: prefersReduced ? 0 : delay,
        ease: EASE_AGENCY,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface RevealStaggerProps {
  children: React.ReactNode;
  stagger?: number;
  delayChildren?: number;
  className?: string;
}

export const RevealStagger: React.FC<RevealStaggerProps> = ({
  children,
  stagger = 0.06,
  delayChildren = 0.04,
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: prefersReduced ? 0 : stagger,
            delayChildren: prefersReduced ? 0 : delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface RevealItemProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  distance?: number;
  duration?: number;
  className?: string;
}

export const RevealItem: React.FC<RevealItemProps> = ({
  children,
  direction = 'up',
  distance = 20,
  duration = 0.5,
  className = '',
}) => {
  const prefersReduced = useReducedMotion();

  const offset = (() => {
    if (prefersReduced || direction === 'none') return { x: 0, y: 0 };
    switch (direction) {
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
    }
  })();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: offset.x, y: offset.y },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: prefersReduced ? 0.01 : duration,
            ease: EASE_AGENCY,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface LineRevealProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  baseDelay?: number;
}

export const LineReveal: React.FC<LineRevealProps> = ({
  lines,
  className = '',
  lineClassName = '',
  baseDelay = 0.06,
}) => {
  const prefersReduced = useReducedMotion();

  return (
    <span className={`block ${className}`}>
      {lines.map((line, index) => (
        <span key={line} className={`block overflow-hidden ${lineClassName}`}>
          <motion.span
            className="block"
            initial={{ y: prefersReduced ? '0%' : '108%', opacity: prefersReduced ? 1 : 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: prefersReduced ? 0.01 : 0.65,
              delay: prefersReduced ? 0 : baseDelay + index * 0.1,
              ease: EASE_AGENCY,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

interface LetterRevealProps {
  text: string;
  className?: string;
  letterClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  yOffset?: number;
  trigger?: 'view' | 'mount';
  hoverLetter?: boolean;
}

export const LetterReveal: React.FC<LetterRevealProps> = ({
  text,
  className = '',
  letterClassName = '',
  delay = 0,
  stagger,
  duration = 0.38,
  yOffset = 14,
  trigger = 'view',
  hoverLetter = true,
}) => {
  const prefersReduced = useReducedMotion();
  const isFine = useIsFinePointer();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });

  const nonSpaceCount = text.replace(/\s+/g, '').length;
  const effectiveStagger =
    stagger ?? Math.min(0.022, Math.max(0.0035, 0.42 / Math.max(nonSpaceCount, 1)));

  const tokens = text.split(/(\s+)/);
  const shouldAnimate = trigger === 'mount' ? true : inView;
  const enableHover = hoverLetter && isFine && !prefersReduced;

  if (prefersReduced) {
    return <span className={className}>{text}</span>;
  }

  let charIndex = 0;

  return (
    <span ref={ref} aria-label={text} className={`inline ${className}`}>
      {tokens.map((token, tokenIdx) => {
        if (!token) return null;
        if (/^\s+$/.test(token)) {
          return (
            <span key={`sp-${tokenIdx}`} aria-hidden="true">
              {token}
            </span>
          );
        }

        const chars = Array.from(token);
        return (
          <span
            key={`wd-${tokenIdx}`}
            aria-hidden="true"
            className="inline-block whitespace-nowrap"
          >
            {chars.map((char, cIdx) => {
              const currentIdx = charIndex++;
              return (
                <motion.span
                  key={`ch-${tokenIdx}-${cIdx}`}
                  initial={{ opacity: 0, y: yOffset, rotateX: 28 }}
                  animate={
                    shouldAnimate
                      ? { opacity: 1, y: 0, rotateX: 0 }
                      : { opacity: 0, y: yOffset, rotateX: 28 }
                  }
                  whileHover={
                    enableHover
                      ? {
                          y: -3,
                          scale: 1.12,
                          transition: { type: 'spring', stiffness: 460, damping: 18 },
                        }
                      : undefined
                  }
                  transition={{
                    duration,
                    delay: delay + currentIdx * effectiveStagger,
                    ease: EASE_AGENCY,
                  }}
                  className={`inline-block will-change-transform ${letterClassName}`}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
};

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  strength?: number;
  'aria-label'?: string;
  'data-cursor'?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  strength = 0.24,
  'aria-label': ariaLabel,
  'data-cursor': dataCursor = 'interactive',
}) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const isFine = useIsFinePointer();
  const prefersReduced = useReducedMotion();
  const enabled = isFine && !prefersReduced && !disabled;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 300, damping: 22, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 300, damping: 22, mass: 0.4 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    rawX.set(Math.max(-10, Math.min(10, dx * strength)));
    rawY.set(Math.max(-8, Math.min(8, dy * strength)));
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={enabled ? { x, y } : undefined}
      whileHover={enabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      transition={{ duration: 0.2, ease: EASE_AGENCY }}
      aria-label={ariaLabel}
      data-cursor={dataCursor}
      className={className}
    >
      {children}
    </motion.button>
  );
};

interface MagneticLinkProps {
  children: React.ReactNode;
  href: string;
  target?: string;
  rel?: string;
  className?: string;
  strength?: number;
  'aria-label'?: string;
  'data-cursor'?: string;
}

export const MagneticLink: React.FC<MagneticLinkProps> = ({
  children,
  href,
  target,
  rel,
  className = '',
  strength = 0.22,
  'aria-label': ariaLabel,
  'data-cursor': dataCursor = 'interactive',
}) => {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const isFine = useIsFinePointer();
  const prefersReduced = useReducedMotion();
  const enabled = isFine && !prefersReduced;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 300, damping: 22, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 300, damping: 22, mass: 0.4 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    rawX.set(Math.max(-10, Math.min(10, dx * strength)));
    rawY.set(Math.max(-8, Math.min(8, dy * strength)));
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={enabled ? { x, y } : undefined}
      whileHover={enabled ? { scale: 1.02 } : undefined}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2, ease: EASE_AGENCY }}
      aria-label={ariaLabel}
      data-cursor={dataCursor}
      className={className}
    >
      {children}
    </motion.a>
  );
};

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  liftY?: number;
  spotlight?: boolean;
  spotlightColor?: string;
  'data-cursor'?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 6,
  liftY = -5,
  spotlight = true,
  spotlightColor = 'rgba(185, 246, 202, 0.26)',
  'data-cursor': dataCursor,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isFine = useIsFinePointer();
  const prefersReduced = useReducedMotion();
  const enabled = isFine && !prefersReduced;

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);
  const spotOpacity = useMotionValue(0);

  const rotateX = useSpring(rawRotateX, { stiffness: 260, damping: 24 });
  const rotateY = useSpring(rawRotateY, { stiffness: 260, damping: 24 });

  const spotlightBg = useMotionTemplate`radial-gradient(360px circle at ${spotX}% ${spotY}%, ${spotlightColor}, transparent 72%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    rawRotateY.set((px - 0.5) * maxTilt * 2);
    rawRotateX.set((0.5 - py) * maxTilt * 2);
    spotX.set(px * 100);
    spotY.set(py * 100);
    spotOpacity.set(1);
  };

  const handleMouseLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    spotOpacity.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={enabled ? { y: liftY } : undefined}
      transition={{ duration: 0.24, ease: EASE_AGENCY }}
      style={
        enabled
          ? {
              transformPerspective: 950,
              rotateX,
              rotateY,
            }
          : undefined
      }
      data-cursor={dataCursor}
      className={`relative will-change-transform ${className}`}
    >
      {spotlight && enabled && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-0 transition-opacity duration-200"
          style={{
            background: spotlightBg,
            opacity: spotOpacity,
          }}
        />
      )}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
};

interface AnimatedCounterProps {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  to,
  suffix = '',
  duration = 0.85,
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(prefersReduced ? to : 0);

  useEffect(() => {
    if (prefersReduced) {
      setDisplay(to);
      return;
    }
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE_AGENCY,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, to, duration, prefersReduced]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
      {suffix}
    </span>
  );
};
