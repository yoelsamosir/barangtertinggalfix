import { Search } from "lucide-react";
import Form from "next/form";
import { Tombol } from "@/components/ui/tombol";

/**
 * Kolom cari yang menulis kata kunci ke URL (?cari=...).
 * Filter lain yang sedang aktif ikut dikirim lewat `pertahankan`,
 * sedangkan nomor halaman sengaja tidak (pencarian baru mulai dari halaman 1).
 */

type Props = {
  action: string;
  nilai?: string;
  placeholder?: string;
  label?: string;
  pertahankan?: Record<string, string | undefined>;
};

export function KolomCari({ action, nilai, placeholder, label = "Cari", pertahankan = {} }: Props) {
  return (
    <Form action={action} role="search" className="flex gap-2">
      {Object.entries(pertahankan).map(([nama, isi]) =>
        isi ? <input key={nama} type="hidden" name={nama} value={isi} /> : null,
      )}
      <label htmlFor="cari" className="sr-only">
        {label}
      </label>
      <div className="relative flex-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted"
        />
        <input
          id="cari"
          name="cari"
          type="search"
          defaultValue={nilai ?? ""}
          placeholder={placeholder}
          maxLength={100}
          className="h-12 w-full rounded-lg border border-garis bg-permukaan pr-3 pl-10 text-base focus:border-brand focus:outline-2 focus:outline-brand/30"
        />
      </div>
      <Tombol type="submit" className="h-12 px-5">
        Cari
      </Tombol>
    </Form>
  );
}
