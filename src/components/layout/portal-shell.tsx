"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SchoolLogo } from "@/components/layout/school-logo";

interface PortalShellProps {
  children: React.ReactNode;
  badge: string;
}

export function PortalShell({ children, badge }: PortalShellProps) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="container-custom flex items-center justify-between h-16 px-4">
          <Link href="/" aria-label="Go to homepage">
            <SchoolLogo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="sky">{badge}</Badge>
            <span className="hidden sm:inline text-sm text-slate-600 dark:text-slate-400 font-medium truncate max-w-[140px]">
              {session?.user?.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 dark:text-slate-400"
              onClick={() => signOut({ callbackUrl: "/login" })}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="container-custom p-4 sm:p-6 space-y-6">{children}</main>
    </div>
  );
}
