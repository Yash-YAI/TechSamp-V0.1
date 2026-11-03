import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * BrandLogo Component
 * Renders the official "T & S" (Tech & Samp) logo.
 *
 * @param {Object} props
 * @param {'sm'|'md'|'lg'|'xl'|number} [props.size='md'] - Dimensions of the icon badge.
 * @param {boolean} [props.showText=false] - Whether to render brand typography beside/under the icon.
 * @param {'horizontal'|'vertical'} [props.layout='horizontal'] - Alignment of icon and text.
 * @param {string|null} [props.subtitle=null] - Subtext beneath the brand title.
 * @param {Function} [props.onClick] - Click handler.
 * @param {string} [props.className] - Container CSS classes.
 * @param {Object} [props.style] - Container inline styles.
 */
export default function BrandLogo({
  size = 'md',
  showText = false,
  layout = 'horizontal',
  subtitle = null,
  onClick,
  className = '',
  style = {},
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Resolve pixel size
  let pixelSize = 36;
  if (typeof size === 'number') {
    pixelSize = size;
  } else {
    switch (size) {
      case 'xs':
        pixelSize = 24;
        break;
      case 'sm':
        pixelSize = 30;
        break;
      case 'md':
        pixelSize = 38;
        break;
      case 'lg':
        pixelSize = 54;
        break;
      case 'xl':
        pixelSize = 72;
        break;
      default:
        pixelSize = 38;
    }
  }

  return (
    <div
      onClick={onClick}
      className={`brand-logo-container flex items-center select-none ${
        layout === 'vertical' ? 'flex-col text-center gap-2' : 'gap-3'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ ...style }}
    >
      {/* SVG Icon Emblem */}
      <div
        style={{
          width: pixelSize,
          height: pixelSize,
          position: 'relative',
          flexShrink: 0,
        }}
        className="transition-transform duration-200 hover:scale-105"
      >
        <svg
          viewBox="0 0 128 128"
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="blBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c1022" />
              <stop offset="50%" stopColor="#171b38" />
              <stop offset="100%" stopColor="#070914" />
            </linearGradient>

            <linearGradient id="blViolet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="45%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>

            <linearGradient id="blGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            <linearGradient id="blCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            <linearGradient id="blRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="85%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>

            <filter id="blDropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
            </filter>

            <filter id="blGoldGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Squircle Base with Gold/Violet Rim */}
          <rect
            x="6"
            y="6"
            width="116"
            height="116"
            rx="30"
            fill="url(#blBgGrad)"
            stroke="url(#blRim)"
            strokeWidth="2.5"
            filter="url(#blDropShadow)"
          />

          {/* Garment Stitch Seam Inset */}
          <rect
            x="12"
            y="12"
            width="104"
            height="104"
            rx="24"
            fill="none"
            stroke="url(#blGold)"
            strokeWidth="1.5"
            strokeDasharray="4 3.5"
            strokeOpacity="0.65"
          />

          {/* Corner Notch Markers (Garment Pattern Tech Marks) */}
          <path d="M 18 25 L 25 25 M 25 18 L 25 25" stroke="url(#blViolet)" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          <path d="M 110 25 L 103 25 M 103 18 L 103 25" stroke="url(#blViolet)" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          <path d="M 18 103 L 25 103 M 25 110 L 25 103" stroke="url(#blViolet)" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          <path d="M 110 103 L 103 103 M 103 110 L 103 103" stroke="url(#blViolet)" strokeWidth="2" strokeLinecap="round" opacity="0.85" />

          {/* Central T & S Monogram */}
          <g>
            {/* Letter T */}
            <path
              d="M 21 36 L 55 36 C 56.5 36 57.5 37 57.5 38.5 L 57.5 45.5 C 57.5 47 56.5 48 55 48 L 44.5 48 L 44.5 87 C 44.5 89 43.5 90 41.5 90 L 34.5 90 C 32.5 90 31.5 89 31.5 87 L 31.5 48 L 21 48 C 19.5 48 18.5 47 18.5 45.5 L 18.5 38.5 C 18.5 37 19.5 36 21 36 Z"
              fill="url(#blViolet)"
            />
            <path d="M 21 36 L 55 36 L 55 39.5 L 21 39.5 Z" fill="#ffffff" opacity="0.4" />

            {/* Intertwined Golden Thread & Ampersand */}
            <path
              d="M 64.5 59 C 62 55.5 59.5 52 63 47 C 65.5 43.5 70.5 44 70 48.5 C 69.5 52.5 64.5 57 59.5 62 C 54 67.5 51 73 54.5 78.5 C 58 84 66 83.5 70 78 C 72 75.5 74 72 78 70 L 80 72.5 C 75.5 76.5 73 81.5 68.5 84.5 C 62.5 88.5 51 88 47 80 C 43.5 72.5 48 64 54.5 58 C 58.5 54.5 62.5 50 62 46.5 C 61.5 43 58.5 43 56.5 45.5 C 54 48.5 55 53 58 56.5 Z"
              fill="url(#blGold)"
              filter="url(#blGoldGlow)"
            />

            {/* Letter S */}
            <path
              d="M 97 44.5 C 94 39 88.5 36 81.5 36 C 70.5 36 67 42.5 67 48 C 67 58.5 95 55 95 70.5 C 95 78.5 88 86 76 86 C 68 86 62 82.5 59 76 L 66.5 71.5 C 68.5 75.5 72 78.5 76.5 78.5 C 81 78.5 85 75.5 85 71 C 85 61 57 63.5 57 48 C 57 39 65 29.5 81.5 29.5 C 91.5 29.5 99 34.5 102.5 42 Z"
              fill="url(#blCyan)"
            />
            <path
              d="M 81.5 29.5 C 91.5 29.5 99 34.5 102.5 42 L 97 44.5 C 94 40.5 88.5 37.5 81.5 37.5 C 75 37.5 70 40 68 44 Z"
              fill="#ffffff"
              opacity="0.3"
            />

            {/* Sewing Needle & Seam Stitch */}
            <path
              d="M 24 98 Q 64 104 96 98"
              fill="none"
              stroke="url(#blGold)"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
            />
            <path d="M 96 98 L 105 96 L 98 97 Z" fill="url(#blGold)" />
            <polygon points="105,96 108,92 109,96 113,97 109,98 108,102 107,98 103,97" fill="#fef08a" />
          </g>
        </svg>
      </div>

      {/* Typography Label */}
      {showText && (
        <div className={`flex flex-col ${layout === 'vertical' ? 'items-center' : 'items-start'}`}>
          <div className="flex items-center gap-1.5 leading-none">
            <span
              style={{
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontSize: pixelSize >= 50 ? 28 : pixelSize >= 38 ? 22 : 18,
                fontWeight: 900,
                letterSpacing: '-0.5px',
                background: 'linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              T & S
            </span>
          </div>
          {subtitle && (
            <span
              style={{
                fontSize: pixelSize >= 50 ? 12 : 10,
                fontWeight: 700,
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                color: isDark ? '#94a3b8' : '#64748b',
                marginTop: layout === 'vertical' ? 4 : 2,
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

