import { Bell } from "lucide-react";
import Link from "next/link";
import { denganQuery, ROUTES } from "@/lib/routes";

/** Ikon lonceng di bilah atas HP: jumlah klaim menunggu tetap terlihat tanpa membuka laci menu. */
export function LoncengKlaim({ jumlah }: { jumlah: number }) {
  const label = jumlah > 0 ? `${jumlah} klaim menunggu verifikasi` : "Tidak ada klaim menunggu";

  return (
    <Link
      href={denganQuery(ROUTES.klaim, { status: "menunggu" })}
      aria-label={label}
      title={label}
      className="relative -mr-2 ml-auto flex size-11 items-center justify-center rounded-lg hover:bg-latar"
    >
      <Bell aria-hidden className="size-6" />
      {jumlah > 0 && (
        <span
          aria-hidden
          className="absolute top-1 right-0.5 min-w-5 rounded-full bg-aksen px-1 text-center text-[11px] leading-5 font-semibold text-teks"
        >
          {jumlah > 99 ? "99+" : jumlah}
        </span>
      )}
    </Link>
  );
}
