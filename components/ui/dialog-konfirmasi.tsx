"use client";

import { useId, useRef, type ReactNode } from "react";
import { Tombol, type VarianTombol } from "./tombol";

/**
 * Tombol pemicu + dialog konfirmasi (elemen <dialog> bawaan browser:
 * fokus terkunci di dalam dialog, tombol Escape menutup).
 * `children` = area aksi, biasanya <FormHasil> berisi PesanForm, <TombolTutupDialog>, dan tombol kirim.
 */

type Props = {
  labelPemicu: ReactNode;
  judul: string;
  pesan: ReactNode;
  children: ReactNode;
  varianPemicu?: VarianTombol;
};

export function DialogKonfirmasi({ labelPemicu, judul, pesan, children, varianPemicu = "bahaya" }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const idJudul = useId();

  return (
    <>
      <Tombol varian={varianPemicu} onClick={() => dialogRef.current?.showModal()}>
        {labelPemicu}
      </Tombol>
      <dialog
        ref={dialogRef}
        aria-labelledby={idJudul}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl bg-permukaan p-0 text-teks shadow-xl backdrop:bg-teks/50"
      >
        <div className="space-y-4 p-6">
          <h2 id={idJudul} className="text-lg font-semibold">
            {judul}
          </h2>
          <div className="text-sm text-muted">{pesan}</div>
          {children}
        </div>
      </dialog>
    </>
  );
}

/** Tombol "Batal" yang menutup dialog tempatnya berada. */
export function TombolTutupDialog({ children = "Batal" }: { children?: ReactNode }) {
  return (
    <Tombol varian="kedua" onClick={(e) => e.currentTarget.closest("dialog")?.close()}>
      {children}
    </Tombol>
  );
}
