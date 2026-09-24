import { Badge, type WarnaBadge } from "@/components/ui/badge";
import { CLAIM_STATUS_LABEL, type ClaimStatus } from "@/lib/domain";

const WARNA: Record<ClaimStatus, WarnaBadge> = {
  menunggu: "aksen",
  disetujui: "sukses",
  ditolak: "bahaya",
  selesai: "netral",
};

export function BadgeStatusKlaim({ status }: { status: ClaimStatus }) {
  return <Badge warna={WARNA[status]}>{CLAIM_STATUS_LABEL[status]}</Badge>;
}
