import { respon, tangani } from "@/lib/api/respon";
import { logout } from "@/lib/services/auth";

/** POST /api/auth/logout -> hapus cookie & cabut sesi */
export async function POST() {
  return tangani(async () => respon(await logout()));
}
