"use client";

import { Alert } from "@/components/ui/alert";
import { useFormHasil } from "./form-hasil";

/** Pesan umum hasil form: `error` bila gagal, `message` bila berhasil. */
export function PesanForm({ className = "" }: { className?: string }) {
  const state = useFormHasil()?.state;
  if (!state) return null;

  if (!state.ok)
    return (
      <Alert jenis="bahaya" className={className}>
        {state.error}
      </Alert>
    );
  if (state.message)
    return (
      <Alert jenis="sukses" className={className}>
        {state.message}
      </Alert>
    );
  return null;
}
