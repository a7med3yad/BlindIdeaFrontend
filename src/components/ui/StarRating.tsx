import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface StarRatingProps {
  /** The current rating value (controlled) */
  value: number;
  /** Callback fired when the user clicks a star */
  onChange?: (value: number) => void;
  /** If true, the component is display-only */
  readonly?: boolean;
  /** Size of each star icon in pixels */
  size?: number;
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = 20,
}: StarRatingProps) {
  // Optimistic local rating — mirrors the controlled `value` but updates
  // instantly on click so the user sees immediate feedback before the API
  // round-trip completes.
  const [localRating, setLocalRating] = useState(value);
  const [hovered, setHovered] = useState(0);

  // Sync local state when the authoritative value changes (e.g. after
  // the query cache is invalidated by applyQueryInvalidation).
  useEffect(() => {
    setLocalRating(value);
  }, [value]);

  const handleClick = (star: number) => {
    if (readonly) return;
    setLocalRating(star);   // optimistic update
    onChange?.(star);        // trigger mutation
  };

  return (
    <div
      className="flex items-center gap-0.5"
      role="radiogroup"
      aria-label="Star rating"
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const displayValue = readonly ? value : (hovered || localRating);
        const filled = star <= displayValue;

        return (
          <motion.button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === localRating}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            disabled={readonly}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            whileTap={!readonly ? { scale: 0.8 } : undefined}
            className={`
              transition-colors duration-150
              ${readonly ? 'cursor-default' : 'cursor-pointer'}
              ${filled ? 'text-[#F59E0B]' : 'text-[#2A2A2A] hover:text-[#3A3A3A]'}
            `}
          >
            <motion.div
              animate={filled ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Star
                size={size}
                fill={filled ? 'currentColor' : 'none'}
                strokeWidth={filled ? 0 : 1.5}
              />
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
}
