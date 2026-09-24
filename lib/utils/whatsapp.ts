/**
 * Tautan wa.me yang membuka WhatsApp dengan pesan siap kirim.
 * Nomor disimpan sebagai "08..." (lihat no-hp.ts); wa.me butuh format "628...".
 */
export function tautanWhatsApp(noHp: string, pesan: string): string {
  const internasional = noHp.startsWith("0") ? `62${noHp.slice(1)}` : noHp;
  return `https://wa.me/${internasional}?text=${encodeURIComponent(pesan)}`;
}
