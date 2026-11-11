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
  mail: <path d="M2 4h12v9H2zM2 4l6 5 6-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" />,
  copy: <path d="M5 5h8v9H5zM3 11V2h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />,
  // Pixel sun and crescent for the theme toggle
  sun: (
    <>
      <rect x="5" y="5" width="6" height="6" fill="currentColor" />
      <path d="M8 0v3M8 13v3M0 8h3M13 8h3M2.5 2.5l2 2M11.5 11.5l2 2M13.5 2.5l-2 2M4.5 11.5l-2 2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
  moon: <path d="M10 1.5A6.5 6.5 0 1 0 14.5 11 5.5 5.5 0 0 1 10 1.5z" fill="currentColor" />,
  check: <path d="M3 8l3.5 3.5L13 4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />,
  // GitHub's mark (Octicons mark-github, 16 px)
  github: (
    <path
      fill="currentColor"
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
    />
  ),
  // LinkedIn's "in" cut out of a square
  linkedin: (
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M1 1h14v14H1zM3.5 3.5h2v2h-2zM3.5 6.5h2v6h-2zM7 6.5h2v.8c.5-.6 1.2-1 2-1 1.4 0 2 .9 2 2.4v3.8h-2V9c0-.7-.3-1-.9-1-.6 0-1.1.4-1.1 1.1v3.4H7z"
    />
  ),
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
