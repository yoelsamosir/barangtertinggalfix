import { Field, Input } from "@/components/form/field";
import { FormHasil } from "@/components/form/form-hasil";
import { InputPassword } from "@/components/form/input-password";
import { PesanForm } from "@/components/form/pesan-form";
import { TombolKirim } from "@/components/form/tombol-kirim";
import { Turnstile } from "@/components/turnstile/turnstile";
import { login } from "@/lib/actions/auth";
import { PARAM_KEMBALI } from "@/lib/routes";

/** Form login petugas. `kembali` = halaman petugas yang dituju sebelum diminta login. */
export function FormLogin({ kembali }: { kembali?: string }) {
  return (
    <FormHasil action={login} className="space-y-5">
      <PesanForm />
      {kembali && <input type="hidden" name={PARAM_KEMBALI} value={kembali} />}

      <Field name="email" label="Email" wajib>
        <Input type="email" autoComplete="username" inputMode="email" maxLength={254} required />
      </Field>

      <Field name="password" label="Password" wajib>
        <InputPassword autoComplete="current-password" maxLength={72} required />
      </Field>

      <Turnstile />
      <TombolKirim teksProses="Memeriksa…" className="w-full py-3 text-base">
        Masuk
      </TombolKirim>
    </FormHasil>
  );
}
