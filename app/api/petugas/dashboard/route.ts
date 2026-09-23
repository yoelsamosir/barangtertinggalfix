import { responData, tangani } from "@/lib/api/respon";
import { klaimMenungguTerbaru, statistikDashboard } from "@/lib/queries/dashboard";

/** PETUGAS — GET /api/petugas/dashboard -> statistik + klaim menunggu terbaru */
export async function GET() {
  return tangani(async () => {
    const [statistik, klaimMenunggu] = await Promise.all([statistikDashboard(), klaimMenungguTerbaru()]);
    return responData({ statistik, klaimMenunggu });
  });
}
