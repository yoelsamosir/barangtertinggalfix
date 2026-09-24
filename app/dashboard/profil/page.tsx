import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FormGantiPassword } from "@/components/petugas/profil/form-ganti-password";
import { FormProfil } from "@/components/petugas/profil/form-profil";
import { KepalaHalaman } from "@/components/ui/kepala-halaman";
import { requirePetugas } from "@/lib/auth";

export const metadata: Metadata = { title: "Profil" };

export default async function Profil() {
  const petugas = await requirePetugas();

  return (
    <div className="mx-auto max-w-2xl">
      <KepalaHalaman judul="Profil">Kelola nama dan password akun Anda.</KepalaHalaman>
      <div className="space-y-6">
        <Kartu judul="Data akun">
          <FormProfil petugas={petugas} />
        </Kartu>
        <Kartu judul="Ganti password">
          <FormGantiPassword />
        </Kartu>
      </div>
    </div>
  );
}

function Kartu({ judul, children }: { judul: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-garis bg-permukaan p-5 sm:p-6">
      <h2 className="mb-4 font-semibold">{judul}</h2>
      {children}
    </section>
  );
}
