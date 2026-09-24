import { Skeleton } from "@/components/ui/skeleton";

export default function MemuatBeranda() {
  return (
    <main aria-busy className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:py-12">
      <span className="sr-only">Memuat…</span>
      <div className="space-y-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-72" />
        ))}
      </div>
    </main>
  );
}
