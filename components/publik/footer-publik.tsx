import { Clock, Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { APLIKASI, INSTANSI } from "@/lib/aplikasi";

export function FooterPublik() {
  return (
    <footer className="mt-auto border-t border-garis bg-permukaan">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-semibold">{INSTANSI.nama}</p>
          <p className="mt-1 text-sm text-muted">{INSTANSI.gedung}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <Kontak ikon={MapPin}>
              <TautanLuar href={INSTANSI.peta}>{INSTANSI.alamat}</TautanLuar>
            </Kontak>
            <Kontak ikon={Clock}>Jam layanan {INSTANSI.jamLayanan}</Kontak>
          </ul>
        </div>

        <div>
          <p className="font-semibold">Hubungi kami</p>
          <ul className="mt-4 space-y-2 text-sm">
            <Kontak ikon={MessageCircle}>
              <TautanLuar href={INSTANSI.whatsapp.url}>WhatsApp {INSTANSI.whatsapp.tampil}</TautanLuar>
            </Kontak>
            <Kontak ikon={Phone}>
              <a href={`tel:${INSTANSI.telepon.tel}`} className="hover:text-brand hover:underline">
                {INSTANSI.telepon.tampil}
              </a>
            </Kontak>
            <Kontak ikon={Mail}>
              <a href={`mailto:${INSTANSI.email}`} className="break-all hover:text-brand hover:underline">
                {INSTANSI.email}
              </a>
            </Kontak>
          </ul>
        </div>

        <div>
          <p className="font-semibold">Media sosial</p>
          <ul className="mt-4 space-y-2 text-sm">
            {INSTANSI.mediaSosial.map((m) => (
              <li key={m.nama}>
                <span className="text-muted">{m.nama}: </span>
                <TautanLuar href={m.url}>{m.akun}</TautanLuar>
              </li>
            ))}
            <li>
              <span className="text-muted">Situs: </span>
              <TautanLuar href={INSTANSI.situs}>balaiyanpus.jogjaprov.go.id</TautanLuar>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-garis px-4 py-4 text-center text-xs text-muted">
        {APLIKASI.nama} · {INSTANSI.nama}
      </p>
    </footer>
  );
}

function Kontak({ ikon: Ikon, children }: { ikon: LucideIcon; children: ReactNode }) {
  return (
    <li className="flex gap-2">
      <Ikon aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
      <span>{children}</span>
    </li>
  );
}

function TautanLuar({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-brand hover:underline">
      {children}
    </a>
  );
}
