import { MessageCircle, Phone } from "lucide-react";
import { kelasTombol } from "@/components/ui/tombol";
import { formatWaktu } from "@/lib/utils/tanggal";
import { tautanWhatsApp } from "@/lib/utils/whatsapp";
import type { DetailKlaim } from "./perbandingan-klaim";
import { pesanWhatsApp } from "./pesan-whatsapp";

/** Identitas & kontak pengklaim, plus tombol WhatsApp dengan pesan sesuai status klaim. */
export function DataPengklaim({ klaim }: { klaim: DetailKlaim }) {
  const pesan = pesanWhatsApp({
    nama: klaim.nama_pengklaim,
    nomorKlaim: klaim.nomor_klaim,
    namaBarang: klaim.barang.nama_barang,
    status: klaim.status,
  });

  return (
    <section aria-labelledby="judul-pengklaim" className="space-y-4 rounded-xl border border-garis bg-permukaan p-5">
      <h2 id="judul-pengklaim" className="font-semibold">
        Pengklaim
      </h2>
      <dl className="space-y-2 text-sm">
        <div>
          <dt className="text-xs text-muted">Nama</dt>
          <dd className="font-medium">{klaim.nama_pengklaim}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Nomor HP</dt>
          <dd className="font-mono">{klaim.no_hp}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Diajukan</dt>
          <dd>{formatWaktu(klaim.created_at)}</dd>
        </div>
        {klaim.keterangan && (
          <div>
            <dt className="text-xs text-muted">Keterangan tambahan</dt>
            <dd className="whitespace-pre-line">{klaim.keterangan}</dd>
          </div>
        )}
      </dl>
      <div className="flex flex-wrap gap-2">
        <a
          href={tautanWhatsApp(klaim.no_hp, pesan)}
          target="_blank"
          rel="noopener noreferrer"
          className={kelasTombol("kedua")}
        >
          <MessageCircle aria-hidden className="size-4 text-sukses" /> Hubungi via WhatsApp
        </a>
        <a href={`tel:${klaim.no_hp}`} className={kelasTombol("polos")}>
          <Phone aria-hidden className="size-4" /> Telepon
        </a>
      </div>
    </section>
  );
}
