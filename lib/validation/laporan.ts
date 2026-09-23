import { z } from "zod";
import { KATEGORI } from "@/lib/domain";
import { tahunIniWIB } from "@/lib/utils/tanggal";
import { filterOpsional } from "./common";

/** Rentang tanggal yang terbalik ditukar otomatis. */
export const filterLaporanSchema = z
  .object({
    dari: filterOpsional(z.iso.date()),
    sampai: filterOpsional(z.iso.date()),
    kategori: filterOpsional(z.enum(KATEGORI)),
    lokasi: filterOpsional(z.string().trim().max(150)),
  })
  .transform((v) => (v.dari && v.sampai && v.dari > v.sampai ? { ...v, dari: v.sampai, sampai: v.dari } : v));

/** Grafik per bulan; tahun tidak valid -> tahun ini. */
export const filterPerBulanSchema = z.object({
  tahun: z.coerce.number().int().min(2000).max(2100).catch(tahunIniWIB),
  kategori: filterOpsional(z.enum(KATEGORI)),
});

export type FilterLaporan = z.infer<typeof filterLaporanSchema>;
export type FilterPerBulan = z.infer<typeof filterPerBulanSchema>;
