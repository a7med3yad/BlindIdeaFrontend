import { useId } from 'react';

interface RedGlowBulbProps {
  className?: string;
  opacityClassName?: string;
}

export default function RedGlowBulb({
  className = '',
  opacityClassName = 'opacity-[0.15]',
}: RedGlowBulbProps) {
  const id = useId();
  const bulbGlowId = `bulbGlow-${id}`;
  const lightBeamId = `lightBeam-${id}`;

  return (
    <svg
      viewBox="0 0 400 500"
      className={`pointer-events-none ${opacityClassName} ${className}`}
    >
      <defs>
        <radialGradient id={bulbGlowId} cx="50%" cy="40%" r="50%" fx="50%" fy="40%">
          <stop offset="0%" stopColor="#E8003D" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#E8003D" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#E8003D" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={lightBeamId} cx="50%" cy="45%" r="60%" fx="50%" fy="45%">
          <stop offset="0%" stopColor="#E8003D" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#E8003D" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="200" rx="300" ry="280" fill={`url(#${lightBeamId})`} />
      <path
        d="M200 80 C140 80 100 120 100 170
               C100 210 120 240 150 260
               L150 300 L250 300 L250 260
               C280 240 300 210 300 170
               C300 120 260 80 200 80Z"
        fill="none"
        stroke="#E8003D"
        strokeWidth="2"
      />
      <rect x="155" y="300" width="90" height="15" rx="4" fill="#E8003D" opacity="0.6" />
      <rect x="160" y="315" width="80" height="15" rx="4" fill="#E8003D" opacity="0.4" />
      <rect x="165" y="330" width="70" height="12" rx="4" fill="#E8003D" opacity="0.3" />
      <path
        d="M185 260 L185 220 L200 200 L215 220 L215 260"
        fill="none"
        stroke="#E8003D"
        strokeWidth="1.5"
        opacity="0.8"
      />
      <ellipse cx="200" cy="185" rx="60" ry="65" fill={`url(#${bulbGlowId})`} />
      <line x1="200" y1="60" x2="200" y2="20" stroke="#E8003D" strokeWidth="1.5" opacity="0.5" />
      <line x1="320" y1="100" x2="350" y2="70" stroke="#E8003D" strokeWidth="1.5" opacity="0.4" />
      <line x1="80" y1="100" x2="50" y2="70" stroke="#E8003D" strokeWidth="1.5" opacity="0.4" />
      <line x1="340" y1="180" x2="380" y2="175" stroke="#E8003D" strokeWidth="1.5" opacity="0.3" />
      <line x1="60" y1="180" x2="20" y2="175" stroke="#E8003D" strokeWidth="1.5" opacity="0.3" />
      <line x1="310" y1="260" x2="340" y2="280" stroke="#E8003D" strokeWidth="1" opacity="0.25" />
      <line x1="90" y1="260" x2="60" y2="280" stroke="#E8003D" strokeWidth="1" opacity="0.25" />
    </svg>
  );
}

