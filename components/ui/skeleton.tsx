/** Kotak abu-abu berdenyut sebagai pengganti konten yang sedang dimuat. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-lg bg-garis/60 ${className}`} />;
}
