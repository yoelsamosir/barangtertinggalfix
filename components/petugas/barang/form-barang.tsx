import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { Field, Input, Select, Textarea } from "@/components/form/field";
import { FormHasil } from "@/components/form/form-hasil";
import { PesanForm } from "@/components/form/pesan-form";
import { TombolKirim } from "@/components/form/tombol-kirim";
import { kelasTombol } from "@/components/ui/tombol";
import { tambahBarang, ubahBarang } from "@/lib/actions/barang";
import { OPSI_KATEGORI, type ItemKategori } from "@/lib/domain";
import { hariIniWIB } from "@/lib/utils/tanggal";
import { BagianFotoBarang } from "./bagian-foto-barang";

/**
 * Form tambah & ubah barang. Tanpa `barang` = tambah; dengan `barang` = ubah.
 * Nama field = skema barangSchema / ubahBarangSchema. Tidak ada field status:
 * status hanya berubah lewat alur klaim & pengembalian.
 */

export type NilaiBarang = {
  id: string;
  nama_barang: string;
  kategori: ItemKategori;
  warna: string | null;
  deskripsi: string | null;
  lokasi_ditemukan: string;
  tanggal_ditemukan: string;
  tampilkan_foto: boolean;
  foto_url: string | null;
};

export function FormBarang({ barang, batalHref }: { barang?: NilaiBarang; batalHref: string }) {
  const isi = <IsiFormBarang barang={barang} batalHref={batalHref} />;

  // Dua cabang karena tipe hasil aksi tambah & ubah berbeda; isi form sama persis.
  return barang ? (
    <FormHasil action={ubahBarang} className="space-y-6">
      {isi}
    </FormHasil>
  ) : (
    <FormHasil action={tambahBarang} className="space-y-6">
      {isi}
    </FormHasil>
  );
}

function IsiFormBarang({ barang, batalHref }: { barang?: NilaiBarang; batalHref: string }) {
  const hariIni = hariIniWIB();

  return (
    <>
      <PesanForm />
      {barang && <input type="hidden" name="id" value={barang.id} />}

      <section className="space-y-5 rounded-xl border border-garis bg-permukaan p-5 sm:p-6">
        <h2 className="font-semibold">Informasi barang</h2>
        <p className="-mt-3 text-xs text-muted">Bagian ini tampil di halaman publik.</p>

        <Field
          name="nama_barang"
          label="Nama barang"
          wajib
          petunjuk="Singkat dan umum, mis. “Dompet kulit”, “Payung lipat”."
        >
          <Input defaultValue={barang?.nama_barang} maxLength={100} required />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="kategori" label="Kategori" wajib>
            <Select defaultValue={barang?.kategori ?? ""} required>
              <option value="" disabled>
                Pilih kategori
              </option>
              {OPSI_KATEGORI.map((o) => (
                <option key={o.nilai} value={o.nilai}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field name="warna" label="Warna">
            <Input defaultValue={barang?.warna ?? ""} maxLength={50} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="lokasi_ditemukan" label="Lokasi ditemukan" wajib>
            <Input defaultValue={barang?.lokasi_ditemukan} maxLength={150} required />
          </Field>
          <Field name="tanggal_ditemukan" label="Tanggal ditemukan" wajib>
            <Input type="date" defaultValue={barang?.tanggal_ditemukan ?? hariIni} max={hariIni} required />
          </Field>
        </div>

        <BagianFotoBarang fotoAwal={barang?.foto_url} tampilkanFoto={barang?.tampilkan_foto} />
      </section>

      <section className="space-y-4 rounded-xl border border-aksen bg-aksen-muda/40 p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <LockKeyhole aria-hidden className="size-4 text-aksen-tua" />
          Deskripsi internal
        </h2>
        <Field
          name="deskripsi"
          label="Ciri khusus untuk verifikasi"
          petunjuk="TIDAK PERNAH tampil ke publik. Catat detail yang hanya diketahui pemilik (isi, merek, tanda khusus) untuk dicocokkan dengan keterangan pengklaim."
        >
          <Textarea defaultValue={barang?.deskripsi ?? ""} maxLength={2000} rows={5} />
        </Field>
      </section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link href={batalHref} className={kelasTombol("kedua")}>
          Batal
        </Link>
        <TombolKirim teksProses="Menyimpan…">{barang ? "Simpan perubahan" : "Simpan barang"}</TombolKirim>
      </div>
    </>
  );
}
