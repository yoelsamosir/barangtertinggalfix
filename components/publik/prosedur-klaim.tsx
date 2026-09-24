import { FileSearch, IdCard, PhoneCall, Send, type LucideIcon } from "lucide-react";
import { INSTANSI } from "@/lib/aplikasi";

const LANGKAH: { ikon: LucideIcon; judul: string; isi: string }[] = [
  {
    ikon: FileSearch,
    judul: "Cari barang Anda",
    isi: "Gunakan kolom pencarian atau pilih kategori, lalu buka detail barang yang mirip dengan milik Anda.",
  },
  {
    ikon: Send,
    judul: "Ajukan klaim",
    isi: "Tekan “Saya pemilik barang ini”, isi formulir dengan ciri-ciri barang, lalu simpan nomor klaim yang muncul.",
  },
  {
    ikon: PhoneCall,
    judul: "Tunggu dihubungi petugas",
    isi: "Petugas mencocokkan keterangan Anda dengan barang, lalu menghubungi nomor HP yang Anda isi.",
  },
  {
    ikon: IdCard,
    judul: "Ambil di meja layanan",
    isi: `Datang ke ${INSTANSI.gedung} pada jam layanan (${INSTANSI.jamLayanan}) dengan membawa nomor klaim dan kartu identitas (KTP, KTM, atau identitas lain).`,
  },
];

export function ProsedurKlaim() {
  return (
    <section aria-labelledby="judul-prosedur" className="rounded-2xl border border-garis bg-permukaan p-6 sm:p-8">
      <h2 id="judul-prosedur" className="text-xl font-semibold">
        Prosedur klaim barang
      </h2>
      <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {LANGKAH.map(({ ikon: Ikon, judul, isi }, i) => (
          <li key={judul} className="flex gap-3 lg:flex-col">
            <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-muda text-brand">
              <Ikon aria-hidden className="size-5" />
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-aksen text-xs font-semibold text-teks">
                {i + 1}
              </span>
            </span>
            <div>
              <h3 className="font-semibold">{judul}</h3>
              <p className="mt-1 text-sm text-muted">{isi}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-muted">
        Ada pertanyaan? Hubungi layanan informasi melalui{" "}
        <a
          href={INSTANSI.whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand hover:underline"
        >
          WhatsApp {INSTANSI.whatsapp.tampil}
        </a>
        .
      </p>
    </section>
  );
}
