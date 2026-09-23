import { z } from "zod";
import { CLAIM_STATUS } from "@/lib/domain";
import { normalisasiNoHp } from "@/lib/utils/no-hp";
import { captchaToken, filterOpsional, kataKunci, tanggalLampau, teksOpsional, teksWajib, uuid } from "./common";

export const ajukanKlaimSchema = z.object({
  captcha_token: captchaToken,
  item_id: uuid("Barang"),
  nama_pengklaim: teksWajib("Nama lengkap", 100),
  no_hp: z
    .string({ error: "Nomor HP wajib diisi." })
    .transform(normalisasiNoHp)
    .pipe(z.string().regex(/^08[0-9]{8,12}$/, "Nomor HP tidak valid. Contoh: 081234567890.")),
  waktu_kehilangan: tanggalLampau("Perkiraan waktu kehilangan"),
  lokasi_kehilangan: teksWajib("Lokasi terakhir barang digunakan", 150),
  ciri_barang: teksWajib("Ciri-ciri barang", 1000),
  keterangan: teksOpsional("Keterangan tambahan", 1000),
});

/** 'tolak' juga dipakai untuk membatalkan klaim yang sudah disetujui. */
export const verifikasiKlaimSchema = z
  .object({
    claim_id: uuid("Klaim"),
    keputusan: z.enum(["setujui", "tolak"], { error: "Keputusan tidak valid." }),
    catatan: teksOpsional("Catatan petugas", 1000),
  })
  .refine((v) => v.keputusan === "setujui" || v.catatan, {
    path: ["catatan"],
    message: "Alasan penolakan wajib diisi.",
  });

export const filterKlaimSchema = z.object({
  cari: kataKunci,
  status: filterOpsional(z.enum(CLAIM_STATUS)),
});

export type AjukanKlaimInput = z.infer<typeof ajukanKlaimSchema>;
export type VerifikasiKlaimInput = z.infer<typeof verifikasiKlaimSchema>;
export type FilterKlaim = z.infer<typeof filterKlaimSchema>;
