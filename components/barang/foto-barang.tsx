import type { ItemKategori } from "@/lib/domain";
import { KATEGORI_LABEL } from "@/lib/domain";
import { IkonKategori } from "./ikon-kategori";

/**
 * Foto barang, atau ikon kategori bila foto tidak ada / tidak ditampilkan.
 * Memakai <img> biasa: foto sudah dikecilkan (WEBP ≤1600 px) saat diunggah,
 * sehingga optimasi gambar Next/Vercel (berkuota) tidak diperlukan.
 */

type Props = { url: string | null; nama: string; kategori: ItemKategori; className?: string };

export function FotoBarang({ url, nama, kategori, className = "" }: Props) {
  if (!url) {
    return (
      <div
        role="img"
        aria-label={`Foto tidak ditampilkan (${KATEGORI_LABEL[kategori]})`}
        className={`flex items-center justify-center bg-brand-muda text-brand/70 ${className}`}
      >
        <IkonKategori kategori={kategori} className="size-1/4 min-h-8 min-w-8" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- lihat komentar komponen
    <img src={url} alt={nama} loading="lazy" decoding="async" className={`object-cover ${className}`} />
  );
}
