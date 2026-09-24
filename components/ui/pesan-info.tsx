import { Alert } from "./alert";

/**
 * Pesan sukses setelah redirect (?info=...). `daftar` memetakan kode info ke kalimat;
 * kode yang tidak dikenal diabaikan agar isi URL tidak bisa menyuntik teks.
 */
export function PesanInfo({ info, daftar }: { info: unknown; daftar: Record<string, string> }) {
  const pesan = typeof info === "string" && Object.hasOwn(daftar, info) ? daftar[info] : null;
  if (!pesan) return null;
  return (
    <Alert jenis="sukses" className="mb-6">
      {pesan}
    </Alert>
  );
}
