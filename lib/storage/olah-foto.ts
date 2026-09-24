import "server-only";
import sharp from "sharp";
import { MAKS_PIKSEL_FOTO, MAKS_UKURAN_FOTO, SISI_MAKS_FOTO } from "@/lib/config";
import { gagal, ok, type Hasil } from "@/lib/result";

/**
 * Periksa lalu buat ulang foto sebelum disimpan:
 *  - hanya JPG/PNG/WEBP asli (dicek dari isi file, bukan ekstensi/MIME browser)
 *  - metadata EXIF (lokasi GPS, tipe HP) dibuang — foto barang tampil ke publik
 *  - rotasi HP diterapkan, sisi terpanjang maks 1600 px, disimpan sebagai WEBP
 *  - gambar rusak / terlalu besar (decompression bomb) ditolak
 */

export type FotoSiapSimpan = { isi: Buffer; contentType: "image/webp"; ekstensi: "webp" };

export async function olahFoto(file: File): Promise<Hasil<FotoSiapSimpan>> {
  if (file.size > MAKS_UKURAN_FOTO) {
    return gagal("validasi", "Ukuran foto maksimal 4 MB.");
  }

  const asli = Buffer.from(await file.arrayBuffer());
  if (!isGambarDidukung(asli)) {
    return gagal("validasi", "Foto harus berformat JPG, PNG, atau WEBP.");
  }

  try {
    const isi = await sharp(asli, { limitInputPixels: MAKS_PIKSEL_FOTO })
      .rotate()
      .resize({ width: SISI_MAKS_FOTO, height: SISI_MAKS_FOTO, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    return ok({ isi, contentType: "image/webp", ekstensi: "webp" });
  } catch (error) {
    console.warn("[foto] tidak dapat diproses", error);
    return gagal("validasi", "Foto rusak atau tidak dapat dibaca.");
  }
}

/** Tanda tangan file (magic bytes) JPG, PNG, WEBP. */
function isGambarDidukung(b: Buffer): boolean {
  const jpg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const png = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
  const webp = b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP";
  return jpg || png || webp;
}
