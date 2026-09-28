import { KeyRound, ShieldCheck, ShieldOff, UserCheck, UserX } from "lucide-react";
import { Field } from "@/components/form/field";
import { FormHasil, type AksiForm } from "@/components/form/form-hasil";
import { InputPassword } from "@/components/form/input-password";
import { PesanForm } from "@/components/form/pesan-form";
import { TombolKirim } from "@/components/form/tombol-kirim";
import { DialogKonfirmasi, TombolTutupDialog } from "@/components/ui/dialog-konfirmasi";
import { aturPeranPetugas, resetPasswordPetugas, ubahStatusPetugas } from "@/lib/actions/petugas";
import type { BarisPetugas } from "@/lib/queries/petugas";
import type { ReactNode } from "react";

/**
 * Aksi admin untuk satu petugas: nonaktifkan/aktifkan, jadikan/cabut admin, reset password.
 * Tidak ditampilkan untuk akun admin itu sendiri (database juga menolaknya).
 */
export function AksiPetugas({ petugas }: { petugas: BarisPetugas }) {
  const aktif = petugas.status === "aktif";
  const admin = petugas.peran === "admin";

  return (
    <div className="relative z-10 flex flex-wrap gap-2">
      <DialogAksi
        labelPemicu={
          aktif ? (
            <>
              <UserX aria-hidden className="size-4" /> Nonaktifkan
            </>
          ) : (
            <>
              <UserCheck aria-hidden className="size-4" /> Aktifkan
            </>
          )
        }
        varianPemicu={aktif ? "bahaya" : "kedua"}
        judul={`${aktif ? "Nonaktifkan" : "Aktifkan kembali"} ${petugas.nama}?`}
        pesan={
          aktif
            ? "Petugas tidak bisa login lagi dan sesi yang sedang berjalan langsung tidak bisa membaca data. Riwayat pekerjaannya tetap tersimpan."
            : "Petugas dapat login kembali dengan password terakhirnya."
        }
        action={ubahStatusPetugas}
        field={{ id: petugas.id, status: aktif ? "nonaktif" : "aktif" }}
        labelKirim={aktif ? "Ya, nonaktifkan" : "Ya, aktifkan"}
        varianKirim={aktif ? "bahaya" : "utama"}
      />

      <DialogAksi
        labelPemicu={
          admin ? (
            <>
              <ShieldOff aria-hidden className="size-4" /> Cabut admin
            </>
          ) : (
            <>
              <ShieldCheck aria-hidden className="size-4" /> Jadikan admin
            </>
          )
        }
        varianPemicu="kedua"
        judul={admin ? `Cabut peran admin ${petugas.nama}?` : `Jadikan ${petugas.nama} admin?`}
        pesan={
          admin
            ? "Petugas tetap bisa memakai semua fitur barang dan klaim, tetapi tidak bisa lagi mengelola akun petugas."
            : "Admin dapat menambah petugas, menonaktifkan akun, mengubah peran, dan mereset password petugas lain."
        }
        action={aturPeranPetugas}
        field={{ id: petugas.id, peran: admin ? "petugas" : "admin" }}
        labelKirim={admin ? "Ya, cabut" : "Ya, jadikan admin"}
      />

      <DialogKonfirmasi
        varianPemicu="kedua"
        labelPemicu={
          <>
            <KeyRound aria-hidden className="size-4" /> Reset password
          </>
        }
        judul={`Reset password ${petugas.nama}`}
        pesan="Buat password sementara, lalu sampaikan kepada petugas. Petugas sebaiknya segera menggantinya di menu Profil."
      >
        <FormHasil action={resetPasswordPetugas} resetSaatBerhasil className="space-y-4">
          <PesanForm />
          <input type="hidden" name="id" value={petugas.id} />
          <Field
            name="password_baru"
            label="Password baru"
            wajib
            petunjuk="Minimal 8 karakter, mengandung huruf dan angka."
          >
            <InputPassword autoComplete="new-password" minLength={8} maxLength={72} required />
          </Field>
          <Field name="konfirmasi_password" label="Ulangi password baru" wajib>
            <InputPassword autoComplete="new-password" maxLength={72} required />
          </Field>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <TombolTutupDialog>Tutup</TombolTutupDialog>
            <TombolKirim teksProses="Menyimpan…">Reset password</TombolKirim>
          </div>
        </FormHasil>
      </DialogKonfirmasi>
    </div>
  );
}

/** Dialog konfirmasi berisi form tanpa isian (nilai dikirim lewat input tersembunyi). */
function DialogAksi({
  labelPemicu,
  varianPemicu,
  judul,
  pesan,
  action,
  field,
  labelKirim,
  varianKirim = "utama",
}: {
  labelPemicu: ReactNode;
  varianPemicu: "bahaya" | "kedua";
  judul: string;
  pesan: string;
  action: AksiForm<void>;
  field: Record<string, string>;
  labelKirim: string;
  varianKirim?: "utama" | "bahaya";
}) {
  return (
    <DialogKonfirmasi varianPemicu={varianPemicu} labelPemicu={labelPemicu} judul={judul} pesan={pesan}>
      <FormHasil action={action} className="space-y-4">
        <PesanForm />
        {Object.entries(field).map(([nama, nilai]) => (
          <input key={nama} type="hidden" name={nama} value={nilai} />
        ))}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <TombolTutupDialog>Tutup</TombolTutupDialog>
          <TombolKirim varian={varianKirim} teksProses="Menyimpan…">
            {labelKirim}
          </TombolKirim>
        </div>
      </FormHasil>
    </DialogKonfirmasi>
  );
}
