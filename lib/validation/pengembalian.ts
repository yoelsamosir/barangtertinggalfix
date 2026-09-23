import { z } from "zod";
import { checkbox, filterOpsional, teksOpsional, uuid } from "./common";

/** Foto bukti dikirim sebagai File terpisah (field "foto"). */
export const pengembalianSchema = z.object({
  claim_id: uuid("Klaim"),
  persetujuan_foto: checkbox.refine(Boolean, "Pengunjung harus menyetujui pengambilan foto."),
  catatan: teksOpsional("Catatan", 1000),
});

export const filterPengembalianSchema = z.object({
  dari: filterOpsional(z.iso.date()),
  sampai: filterOpsional(z.iso.date()),
});

export type PengembalianInput = z.infer<typeof pengembalianSchema>;
export type FilterPengembalian = z.infer<typeof filterPengembalianSchema>;
