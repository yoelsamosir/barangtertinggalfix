import Link from "next/link";

/**
 * Deretan chip pilihan filter (satu nilai aktif) yang berpindah lewat URL.
 * `href(nilai)` membentuk URL tujuan; `undefined` = pilihan "Semua".
 * Di layar sempit chip dapat digeser ke samping.
 */

type Opsi<T extends string> = { nilai: T; label: string };

type Props<T extends string> = {
  label: string;
  opsi: readonly Opsi<T>[];
  aktif: T | undefined;
  href: (nilai: T | undefined) => string;
  labelSemua?: string;
};

export function ChipFilter<T extends string>({ label, opsi, aktif, href, labelSemua = "Semua" }: Props<T>) {
  return (
    <nav aria-label={label} className="-mx-4 [scrollbar-width:none] overflow-x-auto px-4">
      <ul className="flex gap-2 sm:flex-wrap">
        <Chip aktif={aktif === undefined} href={href(undefined)}>
          {labelSemua}
        </Chip>
        {opsi.map((o) => (
          <Chip key={o.nilai} aktif={aktif === o.nilai} href={href(o.nilai)}>
            {o.label}
          </Chip>
        ))}
      </ul>
    </nav>
  );
}

function Chip({ aktif, href, children }: { aktif: boolean; href: string; children: string }) {
  return (
    <li className="shrink-0">
      <Link
        href={href}
        aria-current={aktif ? "page" : undefined}
        className={`inline-flex min-h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
          aktif ? "border-brand bg-brand text-white" : "border-garis bg-permukaan hover:border-brand hover:text-brand"
        }`}
      >
        {children}
      </Link>
    </li>
  );
}
