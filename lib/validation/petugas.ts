import { z } from "zod";
import { PERAN, STATUS_AKUN } from "@/lib/domain";
import { passwordKuat } from "./akun";
import { teksWajib, uuid } from "./common";

/** Pengelolaan akun petugas oleh admin. */

export const tambahPetugasSchema = z.object({
  nama: teksWajib("Nama", 100),
  email: z
    .string({ error: "Email wajib diisi." })
    .trim()
    .toLowerCase()
    .pipe(z.email("Format email tidak valid.").max(254, "Email terlalu panjang.")),
  password: passwordKuat("Password"),
  peran: z.enum(PERAN, { error: "Peran tidak valid." }).default("petugas"),
});

export const ubahStatusPetugasSchema = z.object({
  id: uuid("Petugas"),
  status: z.enum(STATUS_AKUN, { error: "Status tidak valid." }),
});

export const aturPeranPetugasSchema = z.object({
  id: uuid("Petugas"),
  peran: z.enum(PERAN, { error: "Peran tidak valid." }),
});

export const resetPasswordPetugasSchema = z
  .object({
    id: uuid("Petugas"),
    password_baru: passwordKuat(),
    konfirmasi_password: z.string(),
  })
  .refine((v) => v.password_baru === v.konfirmasi_password, {
    path: ["konfirmasi_password"],
    message: "Konfirmasi password tidak sama.",
  });

export type TambahPetugasInput = z.infer<typeof tambahPetugasSchema>;
