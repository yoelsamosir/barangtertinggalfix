import { Badge, type WarnaBadge } from "@/components/ui/badge";
import { STATUS_PUBLIK_LABEL, type StatusPublik } from "@/lib/domain";

const WARNA: Record<StatusPublik, WarnaBadge> = {
  tersedia: "sukses",
  dalam_proses_klaim: "aksen",
};

export function BadgeStatusPublik({ status }: { status: StatusPublik }) {
  return <Badge warna={WARNA[status]}>{STATUS_PUBLIK_LABEL[status]}</Badge>;
}
