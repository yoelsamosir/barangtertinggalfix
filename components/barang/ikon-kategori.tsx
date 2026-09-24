import { Backpack, FileText, KeyRound, Package, Shirt, Smartphone, Wallet, Watch, type LucideIcon } from "lucide-react";
import type { ItemKategori } from "@/lib/domain";

/** Ikon per kategori barang (pengganti foto & penanda kategori). */
const IKON: Record<ItemKategori, LucideIcon> = {
  dompet: Wallet,
  tas: Backpack,
  elektronik: Smartphone,
  kunci: KeyRound,
  dokumen: FileText,
  pakaian: Shirt,
  aksesoris: Watch,
  lainnya: Package,
};

export function IkonKategori({ kategori, className = "size-5" }: { kategori: ItemKategori; className?: string }) {
  const Ikon = IKON[kategori];
  return <Ikon aria-hidden className={className} />;
}
