import type { ReactNode } from "react";

/** Kotak pesan (error, sukses, info, peringatan). */

export type JenisAlert = "bahaya" | "sukses" | "info" | "peringatan";

const GAYA: Record<JenisAlert, string> = {
  bahaya: "border-bahaya/30 bg-bahaya-muda text-bahaya",
  sukses: "border-sukses/30 bg-sukses-muda text-sukses",
  // Netral: merah brand dipakai untuk bahaya, jadi info tidak boleh merah.
  info: "border-garis bg-permukaan text-teks",
  peringatan: "border-peringatan/30 bg-peringatan-muda text-peringatan",
};

type Props = { jenis?: JenisAlert; judul?: string; children?: ReactNode; className?: string };

export function Alert({ jenis = "info", judul, children, className = "" }: Props) {
  return (
    <div
      role={jenis === "bahaya" ? "alert" : "status"}
      className={`rounded-lg border px-4 py-3 text-sm ${GAYA[jenis]} ${className}`}
    >
      {judul && <p className="font-semibold">{judul}</p>}
      {children && <div className={judul ? "mt-1" : ""}>{children}</div>}
    </div>
  );
}
