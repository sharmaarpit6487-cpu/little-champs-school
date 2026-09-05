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
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Home,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { hasPermission } from "@/lib/rbac";
import { Role } from "@prisma/client";

const NAV_ITEMS: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  color: string;
  permission?: string;
}[] = [
  { href: "/erp", label: "Dashboard", icon: LayoutDashboard, color: "text-brand-blue" },
  { href: "/erp/students", label: "Students", icon: Users, color: "text-brand-green", permission: "students:read" },
  { href: "/erp/fees", label: "Fee Management", icon: IndianRupee, color: "text-brand-orange", permission: "fees:read" },
  { href: "/erp/attendance", label: "Attendance", icon: ClipboardList, color: "text-purple-500", permission: "attendance:read" },
  { href: "/erp/teachers", label: "Teachers", icon: GraduationCap, color: "text-cyan-500", permission: "teachers:read" },
  { href: "/erp/admissions", label: "Admissions", icon: UserPlus, color: "text-pink-500", permission: "admissions:read" },
  { href: "/erp/events", label: "Events", icon: Calendar, color: "text-indigo-500", permission: "events:read" },
  { href: "/erp/announcements", label: "Announcements", icon: Bell, color: "text-amber-500", permission: "announcements:read" },
  { href: "/erp/reports", label: "Reports", icon: BarChart3, color: "text-emerald-500", permission: "reports:read" },
  { href: "/erp/audit-logs", label: "Audit Logs", icon: FileText, color: "text-slate-500", permission: "audit:read" },
  { href: "/erp/settings", label: "Settings", icon: Settings, color: "text-slate-500", permission: "settings:read" },
];

export function ERPSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const role = session?.user?.role as Role | undefined;
  const dashboardHref = role === "TEACHER" ? "/erp/teacher" : "/erp";
  const visibleNav = NAV_ITEMS.filter(
    (item) => !item.permission || (role && hasPermission(role, item.permission))
  ).map((item) =>
    item.href === "/erp" ? { ...item, href: dashboardHref } : item
  );

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-all duration-300 flex flex-col shadow-lg",
          collapsed ? "w-[4.5rem]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className={cn("p-4 border-b border-slate-100 dark:border-gray-800 flex items-center", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <Link href={dashboardHref} onClick={() => setMobileOpen(false)}>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-blue to-brand-sky flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-slate-800 dark:text-white">School ERP</p>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    {role === "TEACHER" ? "Teacher Panel" : "Admin Panel"}
                  </p>
                </div>
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex h-8 w-8 text-slate-400"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== dashboardHref && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-brand-blue text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-brand-blue"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : item.color)} />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100 dark:border-gray-800">
          {!collapsed && (
            <div className="flex items-center gap-3 mb-3 px-2 py-2 rounded-xl bg-slate-50 dark:bg-gray-800">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-blue to-brand-sky flex items-center justify-center text-white text-sm font-bold shrink-0">
                {session?.user?.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-slate-800 dark:text-white">{session?.user?.name}</p>
                <p className="text-xs text-slate-400 capitalize">{session?.user?.role?.toLowerCase().replace("_", " ")}</p>
              </div>
              <ThemeToggle />
            </div>
          )}
          <div className={cn("flex gap-2", collapsed && "flex-col")}>
            <Link href="/" className="flex-1">
              <Button variant="outline" size="sm" className={cn("w-full gap-1.5 text-slate-600", collapsed && "px-0")}>
                {collapsed ? <Home className="h-4 w-4" /> : <><ExternalLink className="h-3.5 w-3.5" /> Website</>}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}

export function useSidebarWidth(collapsed = false) {
  return collapsed ? "lg:pl-[4.5rem]" : "lg:pl-64";
}
