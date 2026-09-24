import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FormLogin } from "@/components/auth/form-login";
import { Alert } from "@/components/ui/alert";
import { TautanKembali } from "@/components/ui/tautan-kembali";
import { APLIKASI } from "@/lib/aplikasi";
import { getPetugas } from "@/lib/auth";
import { PARAM_KEMBALI, ROUTES, tujuanSetelahLogin } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Masuk petugas",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const kembali = (await searchParams)[PARAM_KEMBALI];
  const tujuan = tujuanSetelahLogin(kembali);

  // Petugas aktif yang sudah login tidak perlu melihat form ini.
  if (await getPetugas()) redirect(tujuan);

  const dimintaLogin = tujuan !== ROUTES.dashboard;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG kecil, tidak perlu dioptimasi */}
          <img
            src="/logo-balai-yanpus.svg"
            alt="Balai Yanpus"
            width={224}
            height={42}
            className="mx-auto h-10 w-auto"
          />
          <h1 className="mt-6 text-2xl font-semibold">Masuk petugas</h1>
          <p className="mt-1 text-sm text-muted">{APLIKASI.nama}</p>
        </div>

        <div className="rounded-2xl border-t-4 border-aksen bg-permukaan p-6 shadow-sm">
          {dimintaLogin && (
            <Alert jenis="info" className="mb-5">
              Silakan masuk untuk melanjutkan.
            </Alert>
          )}
          <FormLogin kembali={dimintaLogin ? tujuan : undefined} />
        </div>

        <p className="text-center text-sm text-muted">Lupa password? Hubungi pengelola akun.</p>
        <div className="text-center">
          <TautanKembali href={ROUTES.beranda}>Kembali ke halaman pengunjung</TautanKembali>
        </div>
      </div>
    </main>
  );
}
