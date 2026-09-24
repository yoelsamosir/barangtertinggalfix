/**
 * Mengecilkan foto DI BROWSER sebelum diunggah (hanya dipakai komponen klien).
 *
 * Foto kamera HP sering 4–8 MB, melebihi batas unggah server (4 MB), dan
 * boros kuota data. Di sini sisi terpanjang dikecilkan ke 1600 px (sama dengan
 * yang disimpan server) lalu disimpan sebagai JPEG. Bonus: metadata EXIF
 * (lokasi GPS) ikut hilang sebelum foto meninggalkan HP.
 *
 * Server tetap memeriksa & memproses ulang foto (lib/storage/olah-foto.ts);
 * ini hanya penghematan, bukan pengaman.
 */

const SISI_MAKS = 1600;
const KUALITAS = 0.85;

/**
 * Gambar (foto, bitmap, atau frame video kamera) -> File JPEG dengan sisi
 * terpanjang maks 1600 px. null bila browser gagal membuat gambar.
 */
export async function gambarKeJpeg(
  sumber: CanvasImageSource,
  lebar: number,
  tinggi: number,
  nama: string,
): Promise<File | null> {
  const skala = Math.min(1, SISI_MAKS / Math.max(lebar, tinggi));
  const kanvas = document.createElement("canvas");
  kanvas.width = Math.round(lebar * skala);
  kanvas.height = Math.round(tinggi * skala);
  kanvas.getContext("2d")?.drawImage(sumber, 0, 0, kanvas.width, kanvas.height);

  const blob = await new Promise<Blob | null>((selesai) => kanvas.toBlob(selesai, "image/jpeg", KUALITAS));
  return blob ? new File([blob], nama, { type: "image/jpeg", lastModified: Date.now() }) : null;
}

/** Foto yang sudah kecil dikembalikan apa adanya; bila gagal diproses, file asli dipakai. */
export async function kecilkanFoto(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  try {
    const gambar = await createImageBitmap(file, { imageOrientation: "from-image" });
    const sudahKecil = Math.max(gambar.width, gambar.height) <= SISI_MAKS && file.size <= 1024 * 1024;
    if (sudahKecil) {
      gambar.close();
      return file;
    }

    const nama = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    const hasil = await gambarKeJpeg(gambar, gambar.width, gambar.height, nama);
    gambar.close();
    return hasil ?? file;
  } catch {
    return file;
  }
}
