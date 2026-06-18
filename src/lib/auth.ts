import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import prisma from "./prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      avatar?: string | null;
    };
  }
  interface User {
    role: Role;
    avatar?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    avatar?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.isActive) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
};

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: ["*"],
  ADMIN: [
    "students:read",
    "students:write",
    "fees:read",
    "fees:write",
    "teachers:read",
    "teachers:write",
    "events:read",
    "events:write",
    "announcements:read",
    "announcements:write",
    "admissions:read",
    "admissions:write",
    "reports:read",
    "attendance:read",
    "attendance:write",
  ],
  TEACHER: [
    "students:read",
    "attendance:read",
    "attendance:write",
    "announcements:read",
  ],
  ACCOUNTANT: [
    "students:read",
    "fees:read",
    "fees:write",
    "reports:read",
  ],
  PARENT: [
    "student:own:read",
    "fees:own:read",
    "announcements:read",
  ],
  STUDENT: [
    "profile:own:read",
    "fees:own:read",
    "announcements:read",
  ],
};

export function hasPermission(role: Role, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (permissions.includes("*")) return true;
  return permissions.includes(permission);
}

export function getDashboardPath(role: Role): string {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
    case "ACCOUNTANT":
      return "/erp";
    case "TEACHER":
      return "/erp/attendance";
    case "PARENT":
      return "/portal/parent";
    case "STUDENT":
      return "/portal/student";
    default:
      return "/";
  }
}
