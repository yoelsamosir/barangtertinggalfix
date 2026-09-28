"use client";

import { BellRing, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { kelasTombol, Tombol } from "@/components/ui/tombol";
import { INTERVAL_CEK_KLAIM_DETIK } from "@/lib/config";
import type { RingkasanKlaimMenunggu } from "@/lib/queries/dashboard";
import { API, ROUTES } from "@/lib/routes";

/**
 * Notifikasi klaim baru untuk petugas yang sedang membuka dashboard.
 *
 * Memeriksa GET /api/petugas/klaim/menunggu secara berkala. Bila jumlah klaim
 * menunggu bertambah: tampil kotak pemberitahuan, halaman di-refresh (angka di
 * menu ikut berubah), dan — bila tab sedang tidak dilihat dan petugas sudah
 * mengizinkan — muncul notifikasi browser. Judul tab diberi awalan "(n)".
 *
 * `jumlahAwal` datang dari server; berubah setiap kali layout dirender ulang
 * (mis. setelah klaim diverifikasi), sehingga penurunan jumlah tidak dianggap klaim baru.
 */

type KlaimBaru = NonNullable<RingkasanKlaimMenunggu["terbaru"]>;

const AWALAN_JUDUL = /^\(\d+\+?\) /;

export function NotifKlaim({ jumlahAwal }: { jumlahAwal: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const jumlahTerakhir = useRef(jumlahAwal);
  const [klaimBaru, setKlaimBaru] = useState<KlaimBaru | null>(null);
  // Hanya untuk memicu render ulang setelah petugas menjawab permintaan izin notifikasi.
  const [, setIzinDijawab] = useState(0);

  useEffect(() => {
    jumlahTerakhir.current = jumlahAwal;
  }, [jumlahAwal]);

  // Judul tab: "(3) Klaim · Petugas · ..." agar terlihat walau tab lain sedang dibuka.
  useEffect(() => {
    const judul = document.title.replace(AWALAN_JUDUL, "");
    document.title = jumlahAwal > 0 ? `(${jumlahAwal > 99 ? "99+" : jumlahAwal}) ${judul}` : judul;
  }, [jumlahAwal, pathname]);

  useEffect(() => {
    let berhenti = false;

    async function periksa() {
      if (berhenti) return;
      try {
        const res = await fetch(API.klaimMenunggu, { cache: "no-store" });
        // Sesi habis / akun dinonaktifkan: berhenti memeriksa; halaman berikutnya akan diarahkan ke login.
        if (res.status === 401 || res.status === 403) {
          berhenti = true;
          return;
        }
        if (!res.ok) return;
        const { data } = (await res.json()) as { data: RingkasanKlaimMenunggu };

        const bertambah = data.jumlah > jumlahTerakhir.current;
        jumlahTerakhir.current = data.jumlah;
        if (!bertambah || !data.terbaru) return;

        setKlaimBaru(data.terbaru);
        router.refresh();
        if (document.hidden) tampilkanNotifikasiBrowser(data.terbaru);
      } catch {
        // Jaringan putus sesaat: coba lagi di putaran berikutnya.
      }
    }

    const timer = setInterval(periksa, INTERVAL_CEK_KLAIM_DETIK * 1000);
    const saatTerlihat = () => !document.hidden && periksa();
    document.addEventListener("visibilitychange", saatTerlihat);
    return () => {
      berhenti = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", saatTerlihat);
    };
  }, [router]);

  async function mintaIzin() {
    await Notification.requestPermission();
    setIzinDijawab((n) => n + 1);
  }

  // Kotak ini hanya muncul di browser (setelah pemeriksaan berkala), jadi `window` aman dibaca.
  if (!klaimBaru) return null;
  const bisaMintaIzin = "Notification" in window && Notification.permission === "default";

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-4 z-50 rounded-xl border border-garis bg-permukaan p-4 shadow-lg sm:left-auto sm:w-96 print:hidden"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-aksen-muda text-aksen-tua">
          <BellRing aria-hidden className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Klaim baru masuk</p>
          <p className="mt-0.5 text-sm">
            <span className="font-mono font-semibold">{klaimBaru.nomor_klaim}</span> · {klaimBaru.nama_pengklaim}
          </p>
          {klaimBaru.barang && <p className="truncate text-sm text-muted">{klaimBaru.barang.nama_barang}</p>}
        </div>
        <button
          type="button"
          onClick={() => setKlaimBaru(null)}
          aria-label="Tutup pemberitahuan"
          className="-mt-1 -mr-1 flex size-10 shrink-0 items-center justify-center rounded-lg hover:bg-latar"
        >
          <X aria-hidden className="size-5" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={ROUTES.klaimDetail(klaimBaru.id)} onClick={() => setKlaimBaru(null)} className={kelasTombol()}>
          Lihat klaim
        </Link>
        {bisaMintaIzin && (
          <Tombol varian="kedua" onClick={mintaIzin}>
            Aktifkan notifikasi browser
          </Tombol>
        )}
      </div>
    </div>
  );
}

function tampilkanNotifikasiBrowser(klaim: KlaimBaru) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const notif = new Notification("Klaim baru masuk", {
    body: `${klaim.nomor_klaim} · ${klaim.nama_pengklaim}${klaim.barang ? ` — ${klaim.barang.nama_barang}` : ""}`,
    icon: "/icon.png",
    tag: `klaim-${klaim.id}`,
  });
  notif.onclick = () => {
    window.focus();
    window.location.href = ROUTES.klaimDetail(klaim.id);
  };
}
