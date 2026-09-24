import { ChipFilter } from "@/components/filter/chip-filter";
import { KolomCari } from "@/components/filter/kolom-cari";
import { OPSI_CLAIM_STATUS } from "@/lib/domain";
import { denganQuery, ROUTES } from "@/lib/routes";
import type { FilterKlaim } from "@/lib/validation/klaim";

/** Cari + status untuk daftar klaim. Semua filter disimpan di URL. */
export function FilterKlaimPetugas({ filter }: { filter: FilterKlaim }) {
  return (
    <div className="mb-6 space-y-4">
      <KolomCari
        action={ROUTES.klaim}
        nilai={filter.cari}
        label="Cari klaim"
        placeholder="Nomor klaim atau nama pengklaim"
        pertahankan={{ status: filter.status }}
      />
      <ChipFilter
        label="Status klaim"
        opsi={OPSI_CLAIM_STATUS}
        aktif={filter.status}
        href={(status) => denganQuery(ROUTES.klaim, { cari: filter.cari, status })}
      />
    </div>
  );
}
