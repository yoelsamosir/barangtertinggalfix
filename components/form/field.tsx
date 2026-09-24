"use client";

import { createContext, useContext, useId, type ComponentProps, type ReactNode } from "react";
import { useFormHasil } from "./form-hasil";

/**
 * Field form: label + kontrol + petunjuk + pesan error per field.
 * `name` cukup ditulis di <Field>; kontrol di dalamnya (Input/Textarea/Select)
 * mengambilnya dari context. Error diambil dari `fieldErrors` Hasil form
 * terdekat (nama field = kunci skema zod di lib/validation).
 */

/**
 * `id` unik per Field (useId), agar dua form dengan field bernama sama di satu
 * halaman (mis. dua dialog berisi "catatan") tidak bentrok id/label.
 */
const FieldContext = createContext<{ name: string; id: string; adaPetunjuk: boolean } | null>(null);

function useErrorField(name: string): string[] | undefined {
  const state = useFormHasil()?.state;
  return state && !state.ok ? state.fieldErrors?.[name] : undefined;
}

const idError = (id: string) => `${id}-error`;
const idPetunjuk = (id: string) => `${id}-petunjuk`;

type FieldProps = {
  name: string;
  label: string;
  wajib?: boolean;
  petunjuk?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Field({ name, label, wajib, petunjuk, children, className = "" }: FieldProps) {
  const errors = useErrorField(name);
  const id = `${name}${useId()}`;
  return (
    <FieldContext value={{ name, id, adaPetunjuk: Boolean(petunjuk) }}>
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label htmlFor={id} className="text-sm font-medium">
          {label}
          {wajib && <span className="text-bahaya"> *</span>}
        </label>
        {children}
        {petunjuk && (
          <p id={idPetunjuk(id)} className="text-xs text-muted">
            {petunjuk}
          </p>
        )}
        {errors?.length ? (
          <ul id={idError(id)} className="text-sm text-bahaya">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </FieldContext>
  );
}

const KELAS_KONTROL =
  "w-full rounded-lg border border-garis bg-permukaan px-3 py-2 text-base sm:text-sm " +
  "placeholder:text-muted/70 focus:border-brand focus:outline-2 focus:outline-brand/30 " +
  "disabled:bg-latar aria-invalid:border-bahaya";

/** name, id, dan atribut aksesibilitas yang menghubungkan kontrol dengan error & petunjuknya. */
function useAtributKontrol(nameProp: string | undefined, wajib: boolean | undefined) {
  const field = useContext(FieldContext);
  const name = nameProp ?? field?.name;
  if (!name) throw new Error("Kontrol form butuh `name` atau harus berada di dalam <Field>.");

  const invalid = Boolean(useErrorField(name)?.length);
  const id = field?.id ?? name;
  const keterangan = [invalid && idError(id), field?.adaPetunjuk && idPetunjuk(id)].filter(Boolean).join(" ");
  return {
    id,
    name,
    required: wajib,
    "aria-invalid": invalid || undefined,
    "aria-describedby": keterangan || undefined,
  };
}

export function Input({ className = "", name, required, ...props }: ComponentProps<"input">) {
  return <input {...useAtributKontrol(name, required)} className={`${KELAS_KONTROL} ${className}`} {...props} />;
}

export function Textarea({ className = "", name, required, rows = 4, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      {...useAtributKontrol(name, required)}
      rows={rows}
      className={`${KELAS_KONTROL} ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", name, required, ...props }: ComponentProps<"select">) {
  return <select {...useAtributKontrol(name, required)} className={`${KELAS_KONTROL} ${className}`} {...props} />;
}
