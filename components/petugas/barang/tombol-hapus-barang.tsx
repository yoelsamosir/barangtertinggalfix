import { Trash2 } from "lucide-react";
import { FormHasil } from "@/components/form/form-hasil";
import { PesanForm } from "@/components/form/pesan-form";
import { TombolKirim } from "@/components/form/tombol-kirim";
import { DialogKonfirmasi, TombolTutupDialog } from "@/components/ui/dialog-konfirmasi";
import { hapusBarang } from "@/lib/actions/barang";

/** Hapus barang lewat dialog konfirmasi. Tampilkan hanya bila barang boleh dihapus. */
export function TombolHapusBarang({ id, kode }: { id: string; kode: string }) {
  return (
    <DialogKonfirmasi
      labelPemicu={
        <>
          <Trash2 aria-hidden className="size-4" /> Hapus
        </>
      }
      judul={`Hapus barang ${kode}?`}
      pesan="Data dan fotonya dihapus permanen dan tidak dapat dikembalikan."
    >
      <FormHasil action={hapusBarang} className="space-y-4">
        <PesanForm />
        <input type="hidden" name="id" value={id} />
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <TombolTutupDialog />
          <TombolKirim varian="bahaya" teksProses="Menghapus…">
            Ya, hapus
          </TombolKirim>
        </div>
      </FormHasil>
    </DialogKonfirmasi>
  );
}
