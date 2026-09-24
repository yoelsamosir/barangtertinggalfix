/**
 * Mengganti isi <input type="file"> dengan file lain (mis. foto yang sudah
 * dikecilkan atau hasil jepretan kamera), agar ikut terkirim bersama form.
 * `null` mengosongkan input.
 */
export function isiInputFile(input: HTMLInputElement, file: File | null): void {
  const isi = new DataTransfer();
  if (file) isi.items.add(file);
  input.files = isi.files;
}
