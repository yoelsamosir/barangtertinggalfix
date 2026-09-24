import { FooterPublik } from "@/components/publik/footer-publik";
import { HeaderPublik } from "@/components/publik/header-publik";

/** Kerangka halaman pengunjung: header (logo + Masuk petugas) dan footer kontak instansi. */
export default function LayoutPublik({ children }: LayoutProps<"/">) {
  return (
    <>
      <HeaderPublik />
      <div className="flex flex-1 flex-col">{children}</div>
      <FooterPublik />
    </>
  );
}
