import { Badge, type WarnaBadge } from "@/components/ui/badge";
import { ITEM_STATUS_LABEL, type ItemStatus } from "@/lib/domain";

const WARNA: Record<ItemStatus, WarnaBadge> = {
  tersimpan: "sukses",
  diklaim: "aksen",
  dikembalikan: "netral",
};

export function BadgeStatusBarang({ status }: { status: ItemStatus }) {
  return <Badge warna={WARNA[status]}>{ITEM_STATUS_LABEL[status]}</Badge>;
}
