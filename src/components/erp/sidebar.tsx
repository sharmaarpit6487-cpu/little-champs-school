"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  IndianRupee,
  Calendar,
  Bell,
  UserPlus,
  ClipboardList,
  BarChart3,
  GraduationCap,
  LogOut,
  Menu,
  X,
  FileText,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SCHOOL_INFO } from "@/lib/school-data";

const NAV_ITEMS = [
  { href: "/erp", label: "Dashboard", icon: LayoutDashboard },
  { href: "/erp/students", label: "Students", icon: Users },
  { href: "/erp/fees", label: "Fee Management", icon: IndianRupee },
  { href: "/erp/attendance", label: "Attendance", icon: ClipboardList },
  { href: "/erp/teachers", label: "Teachers", icon: GraduationCap },
  { href: "/erp/admissions", label: "Admissions", icon: UserPlus },
  { href: "/erp/events", label: "Events", icon: Calendar },
  { href: "/erp/announcements", label: "Announcements", icon: Bell },
  { href: "/erp/reports", label: "Reports", icon: BarChart3 },
  { href: "/erp/audit-logs", label: "Audit Logs", icon: FileText },
  { href: "/erp/settings", label: "Settings", icon: Settings },
];

export function ERPSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-navy text-white transform transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <Link href="/erp" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold text-navy">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display font-bold text-sm">{SCHOOL_INFO.name}</p>
                <p className="text-xs text-white/60">School ERP</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/erp" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gold text-navy"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="h-9 w-9 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm font-bold">
                {session?.user?.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session?.user?.name}</p>
                <p className="text-xs text-white/60 capitalize">{session?.user?.role?.toLowerCase().replace("_", " ")}</p>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <Button variant="ghost" size="sm" className="w-full text-white/70 hover:text-white hover:bg-white/10">
                  Website
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
