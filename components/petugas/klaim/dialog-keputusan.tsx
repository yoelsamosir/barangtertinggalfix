import type { ReactNode } from "react";
import { Field, Textarea } from "@/components/form/field";
import { FormHasil } from "@/components/form/form-hasil";
import { PesanForm } from "@/components/form/pesan-form";
import { TombolKirim } from "@/components/form/tombol-kirim";
import { DialogKonfirmasi, TombolTutupDialog } from "@/components/ui/dialog-konfirmasi";
import type { VarianTombol } from "@/components/ui/tombol";
import { verifikasiKlaim } from "@/lib/actions/klaim";

/**
 * Dialog untuk satu keputusan verifikasi (setujui / tolak / batalkan persetujuan).
 * Field = verifikasiKlaimSchema: claim_id, keputusan, catatan.
 */

type Props = {
  claimId: string;
  keputusan: "setujui" | "tolak";
  labelPemicu: ReactNode;
  varianPemicu: VarianTombol;
  judul: string;
  pesan: ReactNode;
  labelCatatan: string;
  catatanWajib: boolean;
  labelKirim: string;
};

export function DialogKeputusan({ claimId, keputusan, labelCatatan, catatanWajib, labelKirim, ...dialog }: Props) {
  return (
    <DialogKonfirmasi {...dialog}>
      <FormHasil action={verifikasiKlaim} className="space-y-4">
        <PesanForm />
        <input type="hidden" name="claim_id" value={claimId} />
        <input type="hidden" name="keputusan" value={keputusan} />
        <Field name="catatan" label={labelCatatan} wajib={catatanWajib}>
          <Textarea rows={3} maxLength={1000} required={catatanWajib} />
        </Field>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <TombolTutupDialog />
          <TombolKirim varian={keputusan === "setujui" ? "utama" : "bahaya"} teksProses="Menyimpan…">
            {labelKirim}
          </TombolKirim>
        </div>
      </FormHasil>
    </DialogKonfirmasi>
  );
}
