import { LogOut } from "lucide-react";
import { logout } from "@/lib/actions/auth";

/** Keluar dari akun petugas (perangkat ini saja). */
export function TombolLogout() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-bahaya-muda hover:text-bahaya"
      >
        <LogOut aria-hidden className="size-5 shrink-0" />
        Keluar
      </button>
    </form>
  );
}
