import type { Lang } from "../i18n/language";

// Inline SVG flags: emoji flags don't render on Windows (they show "BR"/"US")
const FLAGS: Record<Lang, React.ReactNode> = {
  // United States, for en-US
  en: (
    <>
      <rect width="24" height="16" fill="#fff" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} y={(i * 2 * 16) / 13} width="24" height={16 / 13} fill="#b22234" />
      ))}
      <rect width="10.4" height={(7 * 16) / 13} fill="#3c3b6e" />
      {[1.6, 4, 6.4].map((y) =>
        [1.7, 4, 6.3, 8.6].map((x) => (
          <rect key={`${x}-${y}`} x={x - 0.45} y={y - 0.45} width="0.9" height="0.9" fill="#fff" />
        )),
      )}
    </>
  ),
  // Brazil, for pt-BR
  pt: (
    <>
      <rect width="24" height="16" fill="#009c3b" />
      <path d="M12 1.6 22 8 12 14.4 2 8z" fill="#ffdf00" />
      <circle cx="12" cy="8" r="4" fill="#002776" />
      <path d="M8.1 7.1c2.6-.6 5.3-.1 7.7 1.6" fill="none" stroke="#fff" strokeWidth="0.9" />
    </>
  ),
};

export default function Flag({ lang, className = "" }: { lang: Lang; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 16"
      width="24"
      height="16"
      aria-hidden="true"
      className={`block shrink-0 ${className}`}
    >
      {FLAGS[lang]}
    </svg>
  );
}
