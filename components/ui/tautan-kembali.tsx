import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function TautanKembali({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand">
      <ArrowLeft aria-hidden className="size-4" />
      {children}
    </Link>
  );
}
