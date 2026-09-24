/**
 * Grafik batang berkelompok (mis. per bulan) tanpa library & tanpa JavaScript:
 * batang = elemen HTML dengan tinggi persentase, jadi teks tetap terbaca di HP
 * dan tajam saat dicetak.
 *
 * Aturan (panduan dataviz): satu sumbu, seri memakai warna tetap sesuai urutan
 * (kelas `warna`, dari token --color-seri-*), batang maks 24px dengan ujung
 * membulat 4px & dasar lurus, jarak 2px antar-batang, garis bantu tipis,
 * legenda untuk >= 2 seri, teks memakai warna teks (bukan warna seri).
 * Tooltip = atribut title per kelompok. Selalu sertakan tabel angka di dekatnya
 * (grafik disembunyikan dari pembaca layar).
 */

export type SeriGrafik = { nama: string; warna: string; nilai: number[] };

type Props = { label: string[]; labelPanjang?: string[]; seri: SeriGrafik[] };

export function GrafikBatang({ label, labelPanjang = label, seri }: Props) {
  const { maks, garis } = skalaRapi(Math.max(0, ...seri.flatMap((s) => s.nilai)));

  return (
    <figure aria-hidden className="space-y-3">
      {seri.length > 1 && (
        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
          {seri.map((s) => (
            <li key={s.nama} className="flex items-center gap-2">
              <span className={`size-3 rounded-sm ${s.warna}`} />
              {s.nama}
            </li>
          ))}
        </ul>
      )}

      {/* pt-3: ruang untuk angka sumbu teratas agar tidak menumpuk legenda. */}
      <div className="flex pt-3">
        {/* Sumbu Y. Posisi dihitung dari bawah, jadi translate-y-1/2 (ke bawah) memusatkan angka pada garisnya. */}
        <div className="relative h-56 w-8 shrink-0 text-right text-xs text-muted tabular-nums">
          {garis.map((g) => (
            <span key={g} className="absolute right-2 translate-y-1/2" style={{ bottom: `${(g / maks) * 100}%` }}>
              {g.toLocaleString("id-ID")}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-56 border-b border-garis">
            {garis.map((g) => (
              <div
                key={g}
                className="absolute inset-x-0 border-t border-garis/70"
                style={{ bottom: `${(g / maks) * 100}%` }}
              />
            ))}

            <div className="relative flex h-full">
              {label.map((l, i) => (
                <div
                  key={l}
                  title={`${labelPanjang[i]}: ${seri.map((s) => `${s.nilai[i]} ${s.nama.toLowerCase()}`).join(", ")}`}
                  className="flex h-full flex-1 items-end justify-center gap-[2px] px-[2px] hover:bg-latar/80"
                >
                  {seri.map((s) => (
                    <div
                      key={s.nama}
                      className={`w-full max-w-6 rounded-t-[4px] ${s.warna}`}
                      style={{ height: `${(s.nilai[i] / maks) * 100}%` }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex pt-1.5 text-xs text-muted">
            {label.map((l) => (
              <span key={l} className="flex-1 truncate text-center">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

/** Batas atas & garis bantu dengan angka bulat (0, 1, 2 … atau 0, 5, 10 …), maksimal ±5 garis. */
function skalaRapi(nilaiMaks: number): { maks: number; garis: number[] } {
  const target = Math.max(nilaiMaks, 4);
  const kasar = target / 4;
  const pangkat = 10 ** Math.floor(Math.log10(kasar));
  const langkah = [1, 2, 5, 10].map((k) => k * pangkat).find((l) => l >= kasar) ?? 10 * pangkat;
  const maks = Math.ceil(target / langkah) * langkah;
  return { maks, garis: Array.from({ length: maks / langkah + 1 }, (_, i) => i * langkah) };
}
