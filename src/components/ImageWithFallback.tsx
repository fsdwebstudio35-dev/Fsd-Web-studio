import React, { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  loading?: 'lazy' | 'eager';
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle,
  fallbackSubtitle,
  loading = 'lazy',
}) => {
  const [hasError, setHasError] = useState(!src);

  useEffect(() => {
    setHasError(!src);
  }, [src]);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#F4F6F4] via-[#e9f0ea] to-[#dce6de] text-[#101B16]"
      >
        <div className="w-11 h-11 rounded-xl bg-[#101B16] text-[#B9F6CA] flex items-center justify-center mb-3 shadow-sm">
          <Layers className="w-5 h-5" aria-hidden="true" />
        </div>
        {fallbackTitle && (
          <p className="font-display font-bold text-sm text-[#101B16] text-center">
            {fallbackTitle}
          </p>
        )}
        {fallbackSubtitle && (
          <p className="text-xs text-[#101B16]/65 mt-1 text-center">
            {fallbackSubtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading={loading}
      decoding="async"
    />
  );
};
