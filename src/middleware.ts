import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

const ERP_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "TEACHER", "ACCOUNTANT"];
const PORTAL_ROLES: Role[] = ["PARENT", "STUDENT"];

/** ERP paths that require admin-level roles (not TEACHER / ACCOUNTANT) */
const ADMIN_ONLY_ERP_PREFIXES = [
  "/erp/settings",
  "/erp/audit-logs",
  "/erp/teachers",
  "/erp/fees",
  "/erp/admissions",
  "/erp/reports",
  "/erp/events",
];

const TEACHER_ALLOWED_PREFIXES = [
  "/erp",
  "/erp/teacher",
  "/erp/attendance",
  "/erp/students",
  "/erp/announcements",
];

const ACCOUNTANT_ALLOWED_PREFIXES = [
  "/erp",
  "/erp/fees",
  "/erp/students",
  "/erp/reports",
];

function isAdminRole(role: Role) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

function pathAllowedForRole(path: string, role: Role): boolean {
  if (isAdminRole(role)) return true;

  if (role === "TEACHER") {
    if (ADMIN_ONLY_ERP_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) {
      return false;
    }
    if (path.includes("/students/new") || path.includes("/edit")) {
      return false;
    }
    return TEACHER_ALLOWED_PREFIXES.some(
      (p) => path === p || path.startsWith(`${p}/`)
    );
  }

  if (role === "ACCOUNTANT") {
    if (ADMIN_ONLY_ERP_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) {
      return false;
    }
    if (path.includes("/students/new") || path.includes("/edit")) {
      return false;
    }
    return ACCOUNTANT_ALLOWED_PREFIXES.some(
      (p) => path === p || path.startsWith(`${p}/`)
    );
  }

  return false;
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role as Role;

    if (path.startsWith("/erp")) {
      if (!ERP_ROLES.includes(role)) {
        if (PORTAL_ROLES.includes(role)) {
          return NextResponse.redirect(
            new URL(role === "PARENT" ? "/portal/parent" : "/portal/student", req.url)
          );
        }
        return NextResponse.redirect(new URL("/", req.url));
      }

      if (role === "TEACHER" && path === "/erp") {
        return NextResponse.redirect(new URL("/erp/teacher", req.url));
      }

      if (!pathAllowedForRole(path, role)) {
        return NextResponse.redirect(new URL(role === "TEACHER" ? "/erp/teacher" : "/erp", req.url));
      }
    }

    if (path.startsWith("/portal/parent") && role !== "PARENT") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (path.startsWith("/portal/student") && role !== "STUDENT") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path === "/login") return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/erp/:path*", "/portal/:path*"],
};
