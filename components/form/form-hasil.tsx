"use client";

import {
  createContext,
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useRef,
  type FormEvent,
  type FormHTMLAttributes,
  type ReactNode,
} from "react";
import type { Hasil } from "@/lib/result";

/**
 * <form> yang menjalankan Server Action ber-`Hasil` (lib/actions/*) lewat
 * useActionState, lalu membagikan hasil & status kirim ke komponen di dalamnya
 * (Field, PesanForm, TombolKirim, Turnstile) melalui context.
 *
 * Form dikirim lewat onSubmit (bukan prop `action`) agar isian TIDAK
 * dikosongkan React saat server mengembalikan error validasi.
 */

export type AksiForm<T> = (prev: Hasil<T> | null, formData: FormData) => Promise<Hasil<T>>;

type NilaiForm = { state: Hasil<unknown> | null; pending: boolean };

const FormHasilContext = createContext<NilaiForm | null>(null);

/** Hasil & status kirim form terdekat; null bila dipakai di luar <FormHasil>. */
export function useFormHasil<T = unknown>(): { state: Hasil<T> | null; pending: boolean } | null {
  return useContext(FormHasilContext) as { state: Hasil<T> | null; pending: boolean } | null;
}

type Props<T> = Omit<FormHTMLAttributes<HTMLFormElement>, "action" | "onSubmit"> & {
  action: AksiForm<T>;
  children: ReactNode;
  /** Kosongkan isian setelah berhasil (mis. form tambah data). */
  resetSaatBerhasil?: boolean;
};

export function FormHasil<T>({ action, children, resetSaatBerhasil = false, ...props }: Props<T>) {
  const [state, formAction, pending] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok && resetSaatBerhasil) formRef.current?.reset();
  }, [state, resetSaatBerhasil]);

  function kirim(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  return (
    <FormHasilContext value={{ state, pending }}>
      <form ref={formRef} onSubmit={kirim} {...props}>
        {children}
      </form>
    </FormHasilContext>
  );
}
