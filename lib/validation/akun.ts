import { z } from "zod";
import { teksWajib } from "./common";

export const ubahProfilSchema = z.object({
  nama: teksWajib("Nama", 100),
});

/** 72 = batas panjang bcrypt yang dipakai Supabase Auth. */
export const gantiPasswordSchema = z
  .object({
    password_lama: z.string().min(1, "Password lama wajib diisi.").max(72),
    password_baru: z
      .string()
      .min(8, "Password baru minimal 8 karakter.")
      .max(72, "Password baru maksimal 72 karakter.")
      .regex(/[A-Za-z]/, "Password baru harus mengandung huruf.")
      .regex(/[0-9]/, "Password baru harus mengandung angka."),
    konfirmasi_password: z.string(),
  })
  .refine((v) => v.password_baru === v.konfirmasi_password, {
    path: ["konfirmasi_password"],
    message: "Konfirmasi password tidak sama.",
  })
  .refine((v) => v.password_baru !== v.password_lama, {
    path: ["password_baru"],
    message: "Password baru harus berbeda dari password lama.",
  });

export type UbahProfilInput = z.infer<typeof ubahProfilSchema>;
export type GantiPasswordInput = z.infer<typeof gantiPasswordSchema>;
