import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

const ERP_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "TEACHER", "ACCOUNTANT"];
const PORTAL_ROLES: Role[] = ["PARENT", "STUDENT"];

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
