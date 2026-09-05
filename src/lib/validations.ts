import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const portalAccountFields = {
  createPortalAccount: z.boolean().optional().default(false),
  portalEmail: z.string().email("Invalid portal email").optional().or(z.literal("")),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
};

function portalAccountRefine<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return schema.superRefine((data, ctx) => {
    const d = data as {
      createPortalAccount?: boolean;
      portalEmail?: string;
      password?: string;
      confirmPassword?: string;
    };
    if (!d.createPortalAccount) return;
    if (!d.portalEmail?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Portal email is required when creating login credentials",
        path: ["portalEmail"],
      });
    }
    if (!d.password || d.password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 8 characters with letters and numbers",
        path: ["password"],
      });
    }
    if (d.password !== d.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });
}

export const studentSchema = portalAccountRefine(
  z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    dateOfBirth: z.string(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    bloodGroup: z.string().optional(),
    classId: z.string().min(1, "Class is required"),
    division: z.string().min(1, "Division is required"),
    rollNumber: z.string().min(1, "Roll number is required"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    pincode: z.string().min(6, "Valid pincode is required"),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    admissionDate: z.string(),
    parentFirstName: z.string().min(2),
    parentLastName: z.string().min(2),
    parentEmail: z.string().email(),
    parentPhone: z.string().min(10),
    ...portalAccountFields,
  })
);

export const feeSchema = z.object({
  studentId: z.string().min(1),
  feeType: z.enum([
    "TUITION",
    "TRANSPORT",
    "EXAM",
    "LIBRARY",
    "LAB",
    "SPORTS",
    "UNIFORM",
    "OTHER",
  ]),
  title: z.string().min(2),
  amount: z.number().positive("Amount must be positive"),
  dueDate: z.string(),
  academicYear: z.string(),
  month: z.string().optional(),
  description: z.string().optional(),
});

export const paymentSchema = z.object({
  feeId: z.string().min(1),
  amount: z.number().positive(),
  paymentMethod: z.enum([
    "CASH",
    "CARD",
    "UPI",
    "BANK_TRANSFER",
    "CHEQUE",
    "ONLINE",
  ]),
  transactionId: z.string().optional(),
  remarks: z.string().optional(),
});

export const admissionSchema = z.object({
  studentName: z.string().min(2),
  dateOfBirth: z.string(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  applyingClass: z.string().min(1),
  parentName: z.string().min(2),
  parentEmail: z.string().email(),
  parentPhone: z.string().min(10),
  address: z.string().min(5),
  previousSchool: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export const teacherSchema = portalAccountRefine(
  z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    department: z.string().min(2),
    designation: z.string().min(2),
    qualification: z.string().min(2),
    experience: z.coerce.number().min(0),
    dateOfJoining: z.string(),
    bio: z.string().optional(),
    ...portalAccountFields,
  })
);

export const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum([
    "ACADEMIC",
    "SPORTS",
    "CULTURAL",
    "HOLIDAY",
    "MEETING",
    "OTHER",
  ]),
  startDate: z.string(),
  endDate: z.string().optional(),
  location: z.string().optional(),
});

export const announcementSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  type: z.enum(["GENERAL", "URGENT", "ACADEMIC", "FEE", "EVENT"]),
  targetRoles: z.array(z.string()).optional(),
  expiresAt: z.string().optional(),
});

export const attendanceBulkSchema = z.object({
  classId: z.string().min(1),
  date: z.string().min(1),
  records: z
    .array(
      z.object({
        studentId: z.string().min(1),
        status: z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY", "EXCUSED"]),
        remarks: z.string().optional(),
      })
    )
    .min(1),
});

export const admissionStatusSchema = z.object({
  status: z.enum(["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "ENROLLED"]),
});
