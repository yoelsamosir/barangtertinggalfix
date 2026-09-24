import { getPetugas } from "@/lib/auth";

// Sementara — diganti ringkasan statistik (lib/queries/dashboard) pada Fase 5.
export default async function Dashboard() {
  const petugas = await getPetugas();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Selamat datang, {petugas?.nama}</h1>
      <p className="mt-1 text-muted">Ringkasan barang dan klaim akan tampil di sini.</p>
    </div>
  );
}
