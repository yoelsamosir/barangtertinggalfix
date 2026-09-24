"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { useFormHasil } from "@/components/form/form-hasil";

/** API global dari script Turnstile (hanya yang dipakai). */
type TurnstileApi = {
  render: (el: HTMLElement, opsi: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * Widget dirender eksplisit (bukan otomatis) agar tetap muncul setelah
 * navigasi sisi klien. Token hanya berlaku sekali, jadi widget di-reset
 * setiap kali form mendapat hasil dari server.
 */
export function TurnstileWidget({ siteKey, nonce }: { siteKey: string; nonce?: string }) {
  const wadahRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [siap, setSiap] = useState(false);
  const [gagal, setGagal] = useState(false);
  const hasilForm = useFormHasil()?.state;

  useEffect(() => {
    const api = window.turnstile;
    if (!siap || !api || !wadahRef.current) return;

    const id = api.render(wadahRef.current, {
      sitekey: siteKey,
      language: "id",
      size: "flexible",
      "response-field-name": "cf-turnstile-response",
    });
    widgetIdRef.current = id;
    return () => {
      api.remove(id);
      widgetIdRef.current = null;
    };
  }, [siap, siteKey]);

  useEffect(() => {
    if (hasilForm && widgetIdRef.current) window.turnstile?.reset(widgetIdRef.current);
  }, [hasilForm]);

  return (
    <>
      <Script src={SCRIPT} nonce={nonce} onReady={() => setSiap(true)} onError={() => setGagal(true)} />
      <div ref={wadahRef} className="min-h-[65px]" />
      {gagal && (
        <p className="text-sm text-bahaya">
          Verifikasi keamanan tidak dapat dimuat. Periksa koneksi internet lalu muat ulang halaman.
        </p>
      )}
    </>
  );
}
