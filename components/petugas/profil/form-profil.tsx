import { Field, Input } from "@/components/form/field";
import { FormHasil } from "@/components/form/form-hasil";
import { PesanForm } from "@/components/form/pesan-form";
import { TombolKirim } from "@/components/form/tombol-kirim";
import { ubahProfil } from "@/lib/actions/akun";
import type { Petugas } from "@/lib/auth";

/** Ubah nama petugas. Email hanya ditampilkan (diubah oleh pengelola akun). */
export function FormProfil({ petugas }: { petugas: Petugas }) {
  return (
    <FormHasil action={ubahProfil} className="space-y-5">
      <PesanForm />
      <Field name="nama" label="Nama" wajib petunjuk="Tampil di sidebar dan tercatat pada data yang Anda proses.">
        <Input defaultValue={petugas.nama} autoComplete="name" maxLength={100} required />
      </Field>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Email</span>
        <p className="rounded-lg border border-garis bg-latar px-3 py-2 text-sm text-muted">{petugas.email ?? "—"}</p>
        <p className="text-xs text-muted">Email hanya dapat diubah oleh pengelola akun.</p>
      </div>
      <div className="flex justify-end">
        <TombolKirim teksProses="Menyimpan…">Simpan nama</TombolKirim>
      </div>
    </FormHasil>
  );
}
