// Generate lib/supabase/database.types.ts dari database lokal.
// File hanya ditimpa bila hasilnya valid — bila Supabase lokal mati,
// file lama tetap utuh (redirect `>` biasa akan mengosongkannya).
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const TUJUAN = "lib/supabase/database.types.ts";

let hasil;
try {
  hasil = execSync("npx supabase gen types typescript --local", {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  });
} catch {
  console.error("Gagal generate tipe. Pastikan Supabase lokal berjalan (npm run db:start).");
  process.exit(1);
}

if (!hasil.includes("export type Database")) {
  console.error("Output generate tidak valid; file tidak diubah.");
  process.exit(1);
}

writeFileSync(TUJUAN, hasil);
console.log(`Tipe database ditulis ke ${TUJUAN}`);
