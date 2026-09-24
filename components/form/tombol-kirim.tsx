"use client";

import type { ComponentProps } from "react";
import { Tombol } from "@/components/ui/tombol";
import { useFormHasil } from "./form-hasil";

type Props = Omit<ComponentProps<typeof Tombol>, "type"> & { teksProses?: string };

/** Tombol submit yang nonaktif & berganti teks selama form diproses. */
export function TombolKirim({ children, teksProses = "Memproses…", disabled, ...props }: Props) {
  const pending = useFormHasil()?.pending ?? false;
  return (
    <Tombol type="submit" disabled={pending || disabled} aria-busy={pending} {...props}>
      {pending ? teksProses : children}
    </Tombol>
  );
}
