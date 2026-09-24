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

/** Foto yang sudah kecil dikembalikan apa adanya; bila gagal diproses, file asli dipakai. */
export async function kecilkanFoto(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  try {
    const gambar = await createImageBitmap(file, { imageOrientation: "from-image" });
    const skala = Math.min(1, SISI_MAKS / Math.max(gambar.width, gambar.height));
    if (skala === 1 && file.size <= 1024 * 1024) {
      gambar.close();
      return file;
    }

    const kanvas = document.createElement("canvas");
    kanvas.width = Math.round(gambar.width * skala);
    kanvas.height = Math.round(gambar.height * skala);
    kanvas.getContext("2d")?.drawImage(gambar, 0, 0, kanvas.width, kanvas.height);
    gambar.close();

    const blob = await new Promise<Blob | null>((selesai) => kanvas.toBlob(selesai, "image/jpeg", KUALITAS));
    if (!blob) return file;

    const nama = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], nama, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file;
  }
}
