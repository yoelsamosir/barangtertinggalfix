// Hapus folder .next sebelum `next build`.
//
// Di drive FAT32/exFAT (Windows), folder yang baru dihapus Next.js tidak bisa
// langsung dibuat ulang dengan nama yang sama -> "EPERM: mkdir .next/types".
// Menghapusnya lebih awal, di proses terpisah, menghindari masalah tersebut.
import { rmSync } from "node:fs";

rmSync(".next", { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
