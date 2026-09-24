import { Skeleton } from "@/components/ui/skeleton";

/** Kerangka umum halaman petugas saat data dimuat. */
export default function MemuatDashboard() {
  return (
    <div aria-busy className="space-y-6">
      <span className="sr-only">Memuat…</span>
      <Skeleton className="h-8 w-56" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
