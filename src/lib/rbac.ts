import { Role } from "@prisma/client";

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
    "settings:read",
    "settings:write",
    "audit:read",
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
  PARENT: ["student:own:read", "fees:own:read", "announcements:read"],
  STUDENT: ["profile:own:read", "fees:own:read", "announcements:read"],
};

export function hasPermission(role: Role, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
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
      return "/erp/teacher";
    case "PARENT":
      return "/portal/parent";
    case "STUDENT":
      return "/portal/student";
    default:
      return "/";
  }
}
