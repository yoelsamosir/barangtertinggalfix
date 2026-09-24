"use client";

import { Camera, RefreshCw, SwitchCamera } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type ChangeEvent } from "react";
import { Tombol } from "@/components/ui/tombol";
import { isiInputFile } from "@/lib/browser/isi-input-file";
import { gambarKeJpeg, kecilkanFoto } from "@/lib/browser/kecilkan-foto";
import { Input } from "./field";

/**
 * Ambil foto langsung dari kamera (getUserMedia): pratinjau -> jepret -> ambil ulang.
 * Hasil jepretan (JPEG, maks 1600 px) dimasukkan ke <input type="file"> agar
 * terkirim bersama form. Letakkan di dalam <Field name="...">.
 *
 * - Kamera menyala saat komponen dipasang dan DIMATIKAN begitu foto diambil
 *   atau komponen dilepas (lampu kamera tidak terus menyala).
 * - Cadangan: bila browser tidak mendukung kamera, izin ditolak, atau bukan
 *   HTTPS, tampil tombol yang membuka aplikasi kamera HP (<input capture>).
 */

type Hadap = "environment" | "user";

const tanpaLangganan = () => () => {};
const kameraDidukung = () => Boolean(navigator.mediaDevices?.getUserMedia);

export function AmbilFotoKamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const didukung = useSyncExternalStore(tanpaLangganan, kameraDidukung, () => true);
  const [kamera, setKamera] = useState<"memulai" | "menyala" | "gagal">("memulai");
  const [hadap, setHadap] = useState<Hadap>("environment");
  const [pratinjau, setPratinjau] = useState<string | null>(null);

  const pakaiCadangan = !didukung || kamera === "gagal";

  // Nyalakan kamera selama belum ada foto; matikan saat foto diambil / komponen dilepas.
  useEffect(() => {
    if (pratinjau || !didukung) return;
    let batal = false;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: hadap }, width: { ideal: 1920 } }, audio: false })
      .then((stream) => {
        if (batal) return hentikan(stream);
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setKamera("menyala");
      })
      .catch(() => !batal && setKamera("gagal"));

    return () => {
      batal = true;
      hentikan(streamRef.current);
      streamRef.current = null;
    };
  }, [pratinjau, hadap, didukung]);

  // Bebaskan memori URL pratinjau sebelumnya.
  useEffect(() => {
    if (!pratinjau) return;
    return () => URL.revokeObjectURL(pratinjau);
  }, [pratinjau]);

  function pakaiFoto(file: File) {
    if (inputRef.current) isiInputFile(inputRef.current, file);
    setPratinjau(URL.createObjectURL(file));
  }

  async function jepret() {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    const file = await gambarKeJpeg(video, video.videoWidth, video.videoHeight, "bukti-serah-terima.jpg");
    if (file) pakaiFoto(file);
  }

  async function pilihDariCadangan(event: ChangeEvent<HTMLInputElement>) {
    const asli = event.target.files?.[0];
    if (asli) pakaiFoto(await kecilkanFoto(asli));
  }

  function ambilUlang() {
    if (inputRef.current) isiInputFile(inputRef.current, null);
    setKamera("memulai");
    setPratinjau(null);
  }

  function gantiKamera() {
    setKamera("memulai");
    setHadap((h) => (h === "environment" ? "user" : "environment"));
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-lg border border-garis bg-teks">
        {pratinjau ? (
          // eslint-disable-next-line @next/next/no-img-element -- pratinjau lokal (blob:)
          <img src={pratinjau} alt="Foto bukti yang diambil" className="size-full object-cover" />
        ) : pakaiCadangan ? (
          <div className="flex size-full flex-col items-center justify-center gap-2 bg-latar p-4 text-center text-sm text-muted">
            <Camera aria-hidden className="size-8" />
            Kamera tidak dapat dibuka di browser ini. Gunakan tombol di bawah untuk membuka kamera HP.
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              aria-label="Pratinjau kamera"
              className={`size-full object-cover ${hadap === "user" ? "-scale-x-100" : ""}`}
            />
            {kamera === "memulai" && (
              <p className="absolute inset-0 flex items-center justify-center text-sm text-white">Menyalakan kamera…</p>
            )}
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {pratinjau ? (
          <Tombol varian="kedua" onClick={ambilUlang}>
            <RefreshCw aria-hidden className="size-4" /> Ambil ulang
          </Tombol>
        ) : (
          !pakaiCadangan && (
            <>
              <Tombol onClick={jepret} disabled={kamera !== "menyala"}>
                <Camera aria-hidden className="size-4" /> Ambil foto
              </Tombol>
              <Tombol varian="kedua" onClick={gantiKamera} disabled={kamera !== "menyala"}>
                <SwitchCamera aria-hidden className="size-4" /> Ganti kamera
              </Tombol>
            </>
          )
        )}
      </div>

      {/* Satu-satunya input yang terkirim: tersembunyi saat memakai kamera, terlihat sebagai cadangan. */}
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={pilihDariCadangan}
        tabIndex={pakaiCadangan && !pratinjau ? undefined : -1}
        aria-hidden={pakaiCadangan && !pratinjau ? undefined : true}
        className={
          pakaiCadangan && !pratinjau
            ? "file:mr-3 file:rounded-md file:border-0 file:bg-brand-muda file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-tua"
            : "sr-only"
        }
      />
    </div>
  );
}

function hentikan(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}
