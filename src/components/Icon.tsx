// Inline SVG icons, so glyphs never fall back to a platform emoji font
const PATHS = {
  external: <path d="M5 3h8v8M13 3 3 13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />,
  download: <path d="M8 2v11M3 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />,
  chevron: <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />,
  chevronDown: <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />,
  phone: <path d="M3 2h3.5l1 3.5L5.5 7a7 7 0 0 0 3.5 3.5l1.5-2 3.5 1V14H12C6.5 14 2 9.5 2 4V2z" fill="currentColor" />,
  eye: (
    <>
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="6" y="6" width="4" height="4" fill="currentColor" />
    </>
  ),
  pointer: <path d="M4 2l9 6-9 6z" fill="currentColor" />,
};

interface Props {
  name: keyof typeof PATHS;
  // Fixed size in px; otherwise it scales with the text (0.8em). Use a whole
  // number when the icon sits centered in a box, or it lands on half pixels and blurs
  size?: number;
  className?: string;
}

export default function Icon({ name, size, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`inline-block shrink-0 ${size ? "" : "w-[0.8em] h-[0.8em]"} ${className}`}
      width={size}
      height={size}
    >
      {PATHS[name]}
    </svg>
  );
}
