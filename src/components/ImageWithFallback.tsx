import React, { useState } from 'react';
import { Layers } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  fallbackSubtitle?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackTitle,
  fallbackSubtitle,
}) => {
  const [hasError, setHasError] = useState(!src);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#F8FAFC] via-[#EEF2F6] to-[#E2E8F0] text-[#0A1628]"
      >
        <div className="w-11 h-11 rounded-lg bg-[#0A1628] text-[#10B981] flex items-center justify-center mb-3">
          <Layers className="w-5 h-5" aria-hidden="true" />
        </div>
        {fallbackTitle && (
          <p className="font-display font-semibold text-sm text-[#0A1628] text-center">
            {fallbackTitle}
          </p>
        )}
        {fallbackSubtitle && (
          <p className="text-xs text-[#475569] mt-1 text-center">{fallbackSubtitle}</p>
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
      loading="lazy"
    />
  );
};
