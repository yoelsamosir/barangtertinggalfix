import { z } from "zod";
import { captchaToken } from "./common";

export const loginSchema = z.object({
  email: z.email("Format email tidak valid.").trim().toLowerCase(),
  password: z.string().min(1, "Password wajib diisi.").max(72),
  captcha_token: captchaToken,
});

export type LoginInput = z.infer<typeof loginSchema>;
