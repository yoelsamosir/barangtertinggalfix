/**
 * Nomor HP Indonesia: "08" + 8–11 digit (total 10–13 digit).
 * Harus sama dengan CHECK claims_no_hp_check di database (migrasi 10).
 */
export const POLA_NO_HP = /^08[0-9]{8,11}$/;

/** "+62 812-3456-789" / "6281234..." -> "0812345..." */
export function normalisasiNoHp(input: string): string {
  const hp = input.replace(/[\s\-().]/g, "");
  if (hp.startsWith("+62")) return "0" + hp.slice(3);
  if (hp.startsWith("62")) return "0" + hp.slice(2);
  return hp;
}
