// Uji end-to-end REST API (60 skenario) terhadap server LOKAL.
//
// Persiapan:  npm run db:reset && npm run build && npx next start -p 3100
// Jalankan :  npm run test:api
// Memerlukan internet (verifikasi token uji Cloudflare Turnstile).
// Data berubah selama tes — jalankan `npm run db:reset` sebelum mengulang.
import sharp from "sharp";

process.loadEnvFile(".env.local");
const BASE = process.env.UJI_API_URL ?? "http://127.0.0.1:3100";
const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const CAPTCHA_UJI = "XXXX.DUMMY.TOKEN.XXXX"; // token dummy resmi Cloudflare

let gagal = 0;
const cek = (label, cond, info) => {
  console.log(`${cond ? "OK  " : "FAIL"} ${label}${cond ? "" : " -> " + JSON.stringify(info).slice(0, 400)}`);
  if (!cond) gagal++;
};

const jar = new Map();
async function req(method, path, { json, form, headers = {}, ip = "10.0.0.1", pakaiCookie = true } = {}) {
  const h = { "x-forwarded-for": ip, ...headers };
  if (pakaiCookie && jar.size) h.cookie = [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
  let body;
  if (json) {
    h["content-type"] = "application/json";
    body = JSON.stringify(json);
  }
  if (form) body = form;
  const res = await fetch(BASE + path, { method, headers: h, body, redirect: "manual" });
  for (const c of res.headers.getSetCookie()) {
    const [pair] = c.split(";");
    const i = pair.indexOf("=");
    const k = pair.slice(0, i),
      v = pair.slice(i + 1);
    if (v === "" || /max-age=0/i.test(c)) jar.delete(k);
    else jar.set(k, v);
  }
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, data, headers: res.headers };
}

const jpg = Buffer.from(
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAAA//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AN//Z",
  "base64",
);
const fotoBlob = (buf, nama = "f.jpg", type = "image/jpeg") => new File([buf], nama, { type });

// ---------------------------------------------------------------- header
const beranda = await req("GET", "/");
const csp = beranda.headers.get("content-security-policy") ?? "";
cek("halaman punya CSP ber-nonce", /script-src 'self' 'nonce-[^']+' 'strict-dynamic'/.test(csp), csp);
cek("header X-Frame-Options DENY", beranda.headers.get("x-frame-options") === "DENY");
cek("header nosniff", beranda.headers.get("x-content-type-options") === "nosniff");
cek("header x-powered-by disembunyikan", !beranda.headers.get("x-powered-by"));
const dash = await req("GET", "/dashboard");
cek(
  "halaman /dashboard tanpa login -> redirect /login",
  dash.status === 307 && dash.headers.get("location")?.endsWith("/login"),
  dash.status,
);

// ---------------------------------------------------------------- publik
const daftar = await req("GET", "/api/barang?cari=dompet");
cek("GET /api/barang", daftar.status === 200 && daftar.data.data.barang.length === 1, daftar);
cek("  tanpa kolom deskripsi", !("deskripsi" in daftar.data.data.barang[0]));
cek("  header no-store", daftar.headers.get("cache-control")?.includes("no-store"));
const itemId = daftar.data.data.barang[0].id;

cek("GET /api/barang/:id", (await req("GET", `/api/barang/${itemId}`)).status === 200);
cek("GET /api/barang/bukan-uuid -> 404", (await req("GET", "/api/barang/abc")).status === 404);

const klaimBody = {
  item_id: itemId,
  nama_pengklaim: "Budi Santoso",
  no_hp: "+62 812-3456-7890",
  waktu_kehilangan: "2026-09-20",
  lokasi_kehilangan: "Ruang Baca",
  ciri_barang: "Kulit hitam, ada gantungan",
};
const tanpaCaptcha = await req("POST", "/api/klaim", { json: klaimBody, ip: "10.1.0.1" });
cek(
  "POST /api/klaim tanpa captcha -> 400",
  tanpaCaptcha.status === 400 && tanpaCaptcha.data.fieldErrors?.captcha_token,
  tanpaCaptcha,
);

const lintas = await req("POST", "/api/klaim", { json: klaimBody, headers: { origin: "https://situs-jahat.com" } });
cek("POST lintas situs (CSRF) -> 403", lintas.status === 403, lintas);

const klaim = await req("POST", "/api/klaim", { json: { ...klaimBody, captcha_token: CAPTCHA_UJI }, ip: "10.1.0.2" });
cek(
  "POST /api/klaim dengan captcha -> 201 + nomor",
  klaim.status === 201 && /^CLM-/.test(klaim.data.data?.nomor_klaim),
  klaim,
);

const ganda = await req("POST", "/api/klaim", { json: { ...klaimBody, captcha_token: CAPTCHA_UJI }, ip: "10.1.0.2" });
cek("klaim ganda (HP sama) -> 409", ganda.status === 409, ganda);

let status429 = 0;
for (let i = 0; i < 6; i++) {
  const r = await req("POST", "/api/klaim", {
    json: { ...klaimBody, captcha_token: CAPTCHA_UJI, no_hp: `08120000000${i}` },
    ip: "10.9.9.9",
  });
  status429 = r.status;
}
cek("rate limit klaim: percobaan ke-6 dari IP sama -> 429", status429 === 429, status429);

const langsung = await fetch(`${SUPA}/rest/v1/rpc/ajukan_klaim`, {
  method: "POST",
  headers: { apikey: ANON, "content-type": "application/json" },
  body: JSON.stringify({
    p_item_id: itemId,
    p_nama_pengklaim: "X",
    p_no_hp: "081299999999",
    p_waktu_kehilangan: "2026-09-20",
    p_lokasi_kehilangan: "x",
    p_ciri_barang: "x",
  }),
});
cek("bypass: panggil ajukan_klaim langsung ke Supabase -> ditolak", !langsung.ok, langsung.status);

const loginLangsung = await fetch(`${SUPA}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: ANON, "content-type": "application/json" },
  body: JSON.stringify({ email: "petugas@dpad.test", password: "petugas123" }),
});
cek("bypass: login langsung ke Supabase tanpa captcha -> ditolak", !loginLangsung.ok, loginLangsung.status);

// ---------------------------------------------------------------- auth
cek("GET /api/petugas/barang tanpa login -> 401", (await req("GET", "/api/petugas/barang")).status === 401);
cek("GET /api/auth/sesi tanpa login -> 401", (await req("GET", "/api/auth/sesi")).status === 401);

const loginTanpaCaptcha = await req("POST", "/api/auth/login", {
  json: { email: "petugas@dpad.test", password: "petugas123" },
  ip: "10.2.0.1",
});
cek("login tanpa captcha -> 400", loginTanpaCaptcha.status === 400, loginTanpaCaptcha);

const salah = await req("POST", "/api/auth/login", {
  json: { email: "petugas@dpad.test", password: "salah123", captcha_token: CAPTCHA_UJI },
  ip: "10.2.0.1",
});
cek(
  "login password salah -> pesan generik",
  salah.status === 400 && salah.data.error === "Email atau password salah.",
  salah,
);

let loginStatus = 0;
for (let i = 0; i < 6; i++) {
  loginStatus = (
    await req("POST", "/api/auth/login", {
      json: { email: "orang@lain.test", password: "x", captcha_token: CAPTCHA_UJI },
      ip: `10.3.0.${i}`,
    })
  ).status;
}
cek("rate limit login per email: ke-6 -> 429 (walau IP beda)", loginStatus === 429, loginStatus);

const login = await req("POST", "/api/auth/login", {
  json: { email: "petugas@dpad.test", password: "petugas123", captcha_token: CAPTCHA_UJI },
  ip: "10.2.0.2",
});
cek(
  "login benar -> 200 + cookie sesi",
  login.status === 200 && login.data.data.nama === "Siti Petugas" && jar.size > 0,
  login,
);
cek("GET /api/auth/sesi", (await req("GET", "/api/auth/sesi")).data.data?.email === "petugas@dpad.test");

// ---------------------------------------------------------------- barang
const fd = () => {
  const f = new FormData();
  f.set("nama_barang", "Botol minum");
  f.set("kategori", "lainnya");
  f.set("warna", "Biru");
  f.set("deskripsi", "Ada stiker nama");
  f.set("lokasi_ditemukan", "Lobi");
  f.set("tanggal_ditemukan", "2026-09-22");
  f.set("tampilkan_foto", "on");
  return f;
};
const fPalsu = fd();
fPalsu.set("foto", fotoBlob(Buffer.from("<?php echo 1; ?>"), "x.jpg"));
const palsu = await req("POST", "/api/petugas/barang", { form: fPalsu });
cek(
  "upload file palsu (bukan gambar) -> 400 fieldErrors.foto",
  palsu.status === 400 && palsu.data.fieldErrors?.foto,
  palsu,
);

const fBaru = fd();
fBaru.set("foto", fotoBlob(jpg));
const baru = await req("POST", "/api/petugas/barang", { form: fBaru });
cek(
  "POST /api/petugas/barang -> 201 + kode",
  baru.status === 201 && /^BLG-2026-\d{3}$/.test(baru.data.data?.kode_barang),
  baru,
);
const barangBaru = baru.data.data.id;

const detail = await req("GET", `/api/petugas/barang/${barangBaru}`);
cek(
  "GET /api/petugas/barang/:id (dengan deskripsi & foto_url)",
  detail.status === 200 && detail.data.data.deskripsi === "Ada stiker nama" && detail.data.data.foto_url,
  detail,
);

const ubah = await req("PATCH", `/api/petugas/barang/${barangBaru}`, {
  json: {
    nama_barang: "Botol minum stainless",
    kategori: "lainnya",
    lokasi_ditemukan: "Lobi",
    tanggal_ditemukan: "2026-09-22",
    tampilkan_foto: false,
  },
});
cek("PATCH /api/petugas/barang/:id (JSON)", ubah.status === 200, ubah);
cek(
  "  foto lama tetap (tidak dihapus)",
  (await req("GET", `/api/petugas/barang/${barangBaru}`)).data.data.foto_path === detail.data.data.foto_path,
);

// Foto HP berisi EXIF: harus dibuang & disimpan ulang sebagai WEBP kecil
const fotoExif = await sharp({ create: { width: 3000, height: 2000, channels: 3, background: "#c33" } })
  .jpeg()
  .withExif({ IFD0: { Copyright: "LOKASI-RAHASIA" } })
  .toBuffer();
const fExif = fd();
fExif.set("foto", fotoBlob(fotoExif));
const denganExif = await req("POST", "/api/petugas/barang", { form: fExif });
const urlExif = (await req("GET", `/api/petugas/barang/${denganExif.data.data.id}`)).data.data.foto_url;
const tersimpan = Buffer.from(await (await fetch(urlExif)).arrayBuffer());
const meta = await sharp(tersimpan).metadata();
cek(
  "foto disimpan ulang: WEBP, maks 1600 px, tanpa EXIF",
  meta.format === "webp" &&
    Math.max(meta.width, meta.height) <= 1600 &&
    !meta.exif &&
    !tersimpan.includes("LOKASI-RAHASIA"),
  meta,
);
await req("DELETE", `/api/petugas/barang/${denganExif.data.data.id}`);

const tanpaPanjang = await fetch(`${BASE}/api/petugas/akun/profil`, {
  method: "PATCH",
  headers: { cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; "), "content-type": "application/json" },
  body: new ReadableStream({
    start(c) {
      c.enqueue(new TextEncoder().encode('{"nama":"x"}'));
      c.close();
    },
  }),
  duplex: "half",
});
cek("body tanpa Content-Length (chunked) -> 400", tanpaPanjang.status === 400, tanpaPanjang.status);

const masaDepan = await req("PATCH", `/api/petugas/barang/${barangBaru}`, {
  json: { nama_barang: "x", kategori: "lainnya", lokasi_ditemukan: "x", tanggal_ditemukan: "2099-01-01" },
});
cek("tanggal ditemukan di masa depan -> 400", masaDepan.status === 400, masaDepan);

cek(
  "GET /api/petugas/barang?status=tersimpan",
  (await req("GET", "/api/petugas/barang?status=tersimpan&cari=botol")).data.data.total === 1,
);

// ---------------------------------------------------------------- klaim
const daftarKlaim = await req("GET", `/api/petugas/klaim?status=menunggu&cari=${klaim.data.data.nomor_klaim}`);
cek(
  "GET /api/petugas/klaim?cari=<nomor klaim>",
  daftarKlaim.status === 200 && daftarKlaim.data.data.klaim.length === 1,
  daftarKlaim,
);
const claimId = daftarKlaim.data.data.klaim[0].id;

cek(
  "GET /api/petugas/klaim/:id (barang lengkap)",
  (await req("GET", `/api/petugas/klaim/${claimId}`)).data.data.barang.deskripsi !== undefined,
);

const tolakKosong = await req("POST", `/api/petugas/klaim/${claimId}/verifikasi`, { json: { keputusan: "tolak" } });
cek("tolak tanpa alasan -> 400", tolakKosong.status === 400 && tolakKosong.data.fieldErrors?.catatan, tolakKosong);

const setuju = await req("POST", `/api/petugas/klaim/${claimId}/verifikasi`, {
  json: { keputusan: "setujui", catatan: "Ciri cocok" },
});
cek("setujui klaim -> 200", setuju.status === 200, setuju);
const setujuLagi = await req("POST", `/api/petugas/klaim/${claimId}/verifikasi`, { json: { keputusan: "setujui" } });
cek("setujui ulang -> 409", setujuLagi.status === 409, setujuLagi);
cek(
  "barang publik jadi 'dalam_proses_klaim'",
  (await req("GET", `/api/barang/${itemId}`)).data.data.status_publik === "dalam_proses_klaim",
);

// ---------------------------------------------------------------- serah terima
const tanpaFoto = new FormData();
tanpaFoto.set("persetujuan_foto", "on");
cek(
  "serah terima tanpa foto -> 400",
  (await req("POST", `/api/petugas/klaim/${claimId}/serah-terima`, { form: tanpaFoto })).status === 400,
);

const tanpaSetuju = new FormData();
tanpaSetuju.set("foto", fotoBlob(jpg));
cek(
  "serah terima tanpa persetujuan foto -> 400",
  (await req("POST", `/api/petugas/klaim/${claimId}/serah-terima`, { form: tanpaSetuju })).status === 400,
);

const st = new FormData();
st.set("foto", fotoBlob(jpg));
st.set("persetujuan_foto", "on");
st.set("catatan", "Diserahkan langsung");
const serah = await req("POST", `/api/petugas/klaim/${claimId}/serah-terima`, { form: st });
cek("serah terima -> 201", serah.status === 201 && serah.data.data.return_id, serah);

const retDetail = await req("GET", `/api/petugas/pengembalian/${serah.data.data.return_id}`);
cek(
  "GET /api/petugas/pengembalian/:id",
  retDetail.status === 200 && retDetail.data.data.petugas.nama === "Siti Petugas",
  retDetail,
);
cek("  foto bukti bisa dibuka lewat signed URL", (await fetch(retDetail.data.data.foto_url)).ok);
cek(
  "GET /api/petugas/pengembalian",
  (await req("GET", "/api/petugas/pengembalian?dari=2026-01-01")).data.data.total === 1,
);
cek("barang dikembalikan hilang dari publik", (await req("GET", `/api/barang/${itemId}`)).status === 404);

// ---------------------------------------------------------------- hapus
cek("DELETE barang yang punya klaim -> 409", (await req("DELETE", `/api/petugas/barang/${itemId}`)).status === 409);
cek("DELETE barang tanpa klaim -> 200", (await req("DELETE", `/api/petugas/barang/${barangBaru}`)).status === 200);
cek("GET barang terhapus -> 404", (await req("GET", `/api/petugas/barang/${barangBaru}`)).status === 404);

// ---------------------------------------------------------------- dashboard & laporan
const d = await req("GET", "/api/petugas/dashboard");
cek("GET /api/petugas/dashboard", d.status === 200 && d.data.data.statistik.barang_dikembalikan === 1, d);
const lap = await req("GET", "/api/petugas/laporan?dari=2026-12-31&sampai=2026-01-01");
cek(
  "GET /api/petugas/laporan (rentang terbalik ditukar)",
  lap.status === 200 && lap.data.data.klaim_selesai === 1,
  lap,
);
const pb = await req("GET", "/api/petugas/laporan/per-bulan?tahun=abc");
cek(
  "GET /api/petugas/laporan/per-bulan (tahun tidak valid -> tahun ini)",
  pb.status === 200 && pb.data.data.length === 12,
  pb,
);

// ---------------------------------------------------------------- akun
cek(
  "PATCH /api/petugas/akun/profil",
  (await req("PATCH", "/api/petugas/akun/profil", { json: { nama: "Siti Rahayu" } })).status === 200,
);
cek("  nama berubah", (await req("GET", "/api/auth/sesi")).data.data.nama === "Siti Rahayu");

const pwSalah = await req("POST", "/api/petugas/akun/password", {
  json: { password_lama: "keliru", password_baru: "BaruSekali99", konfirmasi_password: "BaruSekali99" },
});
cek(
  "ganti password dengan password lama salah -> 400",
  pwSalah.status === 400 && pwSalah.data.fieldErrors?.password_lama,
  pwSalah,
);
const pwLemah = await req("POST", "/api/petugas/akun/password", {
  json: { password_lama: "petugas123", password_baru: "pendek", konfirmasi_password: "pendek" },
});
cek("password baru lemah -> 400", pwLemah.status === 400, pwLemah);
const pw = await req("POST", "/api/petugas/akun/password", {
  json: { password_lama: "petugas123", password_baru: "BaruSekali99", konfirmasi_password: "BaruSekali99" },
});
cek("ganti password -> 200", pw.status === 200, pw);

// ---------------------------------------------------------------- logout
cek("POST /api/auth/logout", (await req("POST", "/api/auth/logout")).status === 200);
cek("setelah logout, API petugas -> 401", (await req("GET", "/api/petugas/barang")).status === 401);

const loginBaru = await req("POST", "/api/auth/login", {
  json: { email: "petugas@dpad.test", password: "BaruSekali99", captcha_token: CAPTCHA_UJI },
  ip: "10.4.0.1",
});
cek("login dengan password baru -> 200", loginBaru.status === 200, loginBaru);

console.log(gagal ? `\n${gagal} GAGAL` : "\nSEMUA LULUS");
process.exit(gagal ? 1 : 0);
