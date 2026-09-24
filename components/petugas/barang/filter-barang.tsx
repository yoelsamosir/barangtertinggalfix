import { ChipFilter } from "@/components/filter/chip-filter";
import { KolomCari } from "@/components/filter/kolom-cari";
import { SelectFilter } from "@/components/filter/select-filter";
import { OPSI_ITEM_STATUS, OPSI_KATEGORI } from "@/lib/domain";
import { denganQuery, ROUTES } from "@/lib/routes";
import type { FilterBarang } from "@/lib/validation/barang";

/** Cari + status + kategori untuk daftar barang petugas. Semua filter disimpan di URL. */
export function FilterBarangPetugas({ filter }: { filter: FilterBarang }) {
  const url = (ubah: Partial<FilterBarang>) => denganQuery(ROUTES.barang, { ...filter, ...ubah });

  return (
    <div className="mb-6 space-y-4">
      <KolomCari
        action={ROUTES.barang}
        nilai={filter.cari}
        label="Cari barang"
        placeholder="Kode, nama, warna, atau lokasi"
        pertahankan={{ status: filter.status, kategori: filter.kategori }}
      />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <ChipFilter
          label="Status barang"
          opsi={OPSI_ITEM_STATUS}
          aktif={filter.status}
          href={(status) => url({ status })}
        />
        <SelectFilter
          label="Kategori"
          labelSemua="Semua kategori"
          aktif={filter.kategori ?? ""}
          hrefSemua={url({ kategori: undefined })}
          opsi={OPSI_KATEGORI.map((o) => ({ ...o, href: url({ kategori: o.nilai }) }))}
        />
      </div>
    </div>
  );
}
