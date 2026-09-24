"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";
import { Input } from "./field";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

/** Kolom password dengan tombol tampilkan/sembunyikan (memudahkan mengetik di HP). */
export function InputPassword({ className = "", ...props }: Props) {
  const [terlihat, setTerlihat] = useState(false);

  return (
    <div className="relative">
      <Input type={terlihat ? "text" : "password"} className={`pr-11 ${className}`} {...props} />
      <button
        type="button"
        onClick={() => setTerlihat((v) => !v)}
        aria-label={terlihat ? "Sembunyikan password" : "Tampilkan password"}
        aria-pressed={terlihat}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted hover:text-teks focus-visible:outline-2 focus-visible:outline-brand"
      >
        {terlihat ? <EyeOff aria-hidden className="size-5" /> : <Eye aria-hidden className="size-5" />}
      </button>
    </div>
  );
}
