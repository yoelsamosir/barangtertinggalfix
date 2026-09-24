import { Alert } from "@/components/ui/alert";
import { INSTANSI } from "@/lib/aplikasi";

/** Pengganti tombol/form klaim untuk barang yang sedang dalam proses klaim orang lain. */
export function InfoSedangDiklaim() {
  return (
    <Alert jenis="peringatan" judul="Barang ini sedang diklaim orang lain">
      Jika Anda merasa pemiliknya, hubungi petugas melalui{" "}
      <a href={INSTANSI.whatsapp.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
        WhatsApp {INSTANSI.whatsapp.tampil}
      </a>{" "}
      atau datang ke meja layanan {INSTANSI.gedung}.
    </Alert>
  );
}
