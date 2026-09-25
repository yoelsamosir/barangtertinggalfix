import Link from "next/link";

/**
 * Tautan aksi kecil yang berdiri sendiri (mis. "Lihat semua", "Hapus filter").
 * Tampil sebagai teks, tetapi area sentuhnya setinggi 40px agar mudah diketuk di HP.
 * Untuk tautan di DALAM kalimat, cukup <a> biasa.
 */
export function TautanAksi({ href, children, className = "" }: { href: string; children: string; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-10 items-center text-sm font-medium whitespace-nowrap text-brand hover:underline ${className}`}
    >
      {children}
    </Link>
  );
}
