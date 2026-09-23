/** "+62 812-3456-789" / "6281234..." -> "0812345..." */
export function normalisasiNoHp(input: string): string {
  const hp = input.replace(/[\s\-().]/g, "");
  if (hp.startsWith("+62")) return "0" + hp.slice(3);
  if (hp.startsWith("62")) return "0" + hp.slice(2);
  return hp;
}
