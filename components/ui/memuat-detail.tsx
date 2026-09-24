import { Skeleton } from "@/components/ui/skeleton";

/** Kerangka halaman detail barang / form klaim saat data dimuat. */
export function MemuatDetail() {
  return (
    <main aria-busy className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
      <span className="sr-only">Memuat…</span>
      <Skeleton className="h-5 w-40" />
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </main>
  );
}
