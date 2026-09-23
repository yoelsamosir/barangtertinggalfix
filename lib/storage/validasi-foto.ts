import { MAKS_UKURAN_FOTO } from "@/lib/config";
import { gagal, ok, type Hasil } from "@/lib/result";

const EKSTENSI = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type TipeGambar = keyof typeof EKSTENSI;

export type FotoValid = { contentType: TipeGambar; ekstensi: string };

/**
 * Cek ukuran & isi file (magic bytes). Tipe MIME dari browser bisa
 * dipalsukan, jadi yang dipercaya adalah header file itu sendiri.
 */
export async function validasiFoto(file: File): Promise<Hasil<FotoValid>> {
  if (file.size > MAKS_UKURAN_FOTO) {
    return gagal("validasi", "Ukuran foto maksimal 2 MB.");
  }

  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const tipe = deteksiTipeGambar(header);
  if (!tipe) {
    return gagal("validasi", "Foto harus berformat JPG, PNG, atau WEBP.");
  }

  return ok({ contentType: tipe, ekstensi: EKSTENSI[tipe] });
}

function deteksiTipeGambar(b: Uint8Array): TipeGambar | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";

  const riff = String.fromCharCode(...b.slice(0, 4));
  const webp = String.fromCharCode(...b.slice(8, 12));
  if (riff === "RIFF" && webp === "WEBP") return "image/webp";

  return null;
}
