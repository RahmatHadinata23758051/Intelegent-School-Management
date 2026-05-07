/**
 * Sparkline - Minimal SVG chart for trend visualization
 * Uses semantic colors to indicate direction
 * 
 * Design: 48px height, smooth curves, 3px stroke
 */
export const Sparkline = ({ tone = 'blue' }) => {
  const stroke = tone === 'green' 
    ? '#059669' 
    : tone === 'rose' 
    ? '#E11D48' 
    : tone === 'purple' 
    ? '#5B3DF5' 
    : '#2563EB';

  return (
    <svg 
      viewBox="0 0 120 48" 
      className="h-12 w-28" 
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="4,34 18,38 31,24 43,28 55,14 67,22 79,10 91,20 104,18 116,16"
      />
    </svg>
  );
};
