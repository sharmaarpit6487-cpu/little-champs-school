import { PrismaClient, Role, Gender, FeeType, PaymentStatus, AnnouncementType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CLASS_SEED = [
  { name: "Nursery", grade: 0, section: "A" },
  { name: "Jr. KG", grade: -1, section: "A" },
  { name: "Sr. KG", grade: -2, section: "A" },
  { name: "Class 1", grade: 1, section: "A" },
  { name: "Class 2", grade: 2, section: "A" },
  { name: "Class 3", grade: 3, section: "A" },
  { name: "Class 4", grade: 4, section: "A" },
  { name: "Class 5", grade: 5, section: "A" },
  { name: "Class 6", grade: 6, section: "A" },
  { name: "Class 7", grade: 7, section: "A" },
  { name: "Class 8", grade: 8, section: "A" },
  { name: "Class 8", grade: 8, section: "B" },
];

async function main() {
  console.log("🌱 Seeding database...");

  const hashedAdmin = await bcrypt.hash("admin123", 12);
  const hashedParent = await bcrypt.hash("parent123", 12);
  const hashedStudent = await bcrypt.hash("student123", 12);
  const hashedTeacher = await bcrypt.hash("teacher123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@littlechamps.edu" },
    update: {},
    create: {
      email: "admin@littlechamps.edu",
      password: hashedAdmin,
      name: "Admin User",
      role: Role.SUPER_ADMIN,
    },
  });

  const parentUser = await prisma.user.upsert({
    where: { email: "parent@example.com" },
    update: {},
    create: {
      email: "parent@example.com",
      password: hashedParent,
      name: "Rajesh Sharma",
      role: Role.PARENT,
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      email: "student@example.com",
      password: hashedStudent,
      name: "Aarav Sharma",
      role: Role.STUDENT,
    },
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: "teacher@littlechamps.edu" },
    update: {},
    create: {
      email: "teacher@littlechamps.edu",
      password: hashedTeacher,
      name: "Priya Sharma",
      role: Role.TEACHER,
    },
  });

  const classes = await Promise.all(
    CLASS_SEED.map((c) =>
      prisma.class.upsert({
        where: { grade_section: { grade: c.grade, section: c.section } },
        update: { name: c.name, isActive: true },
        create: {
          name: c.name,
          grade: c.grade,
          section: c.section,
          capacity: 40,
          classTeacher: "Mrs. Khilna Shah",
        },
      })
    )
  );

  const subjects = await Promise.all(
    [
      { name: "Mathematics", code: "MATH" },
      { name: "Science", code: "SCI" },
      { name: "English", code: "ENG" },
      { name: "Hindi", code: "HIN" },
      { name: "Social Studies", code: "SST" },
      { name: "Computer Science", code: "CS" },
    ].map((s) =>
      prisma.subject.upsert({
        where: { code: s.code },
        update: {},
        create: s,
      })
    )
  );

  let parent = await prisma.parent.findFirst({
    where: { email: "rajesh.sharma@example.com" },
  });
  if (!parent) {
    parent = await prisma.parent.create({
      data: {
        userId: parentUser.id,
        firstName: "Rajesh",
        lastName: "Sharma",
        email: "rajesh.sharma@example.com",
        phone: "+91 9876543210",
        occupation: "Software Engineer",
        relationship: "Father",
      },
    });
  }

  const class8A = classes.find((c) => c.grade === 8 && c.section === "A")!;

  const student = await prisma.student.upsert({
    where: { studentId: "LCS20240001" },
    update: {},
    create: {
      studentId: "LCS20240001",
      userId: studentUser.id,
      firstName: "Aarav",
      lastName: "Sharma",
      dateOfBirth: new Date("2011-05-15"),
      gender: Gender.MALE,
      bloodGroup: "B+",
      classId: class8A.id,
      division: "A",
      rollNumber: "15",
      address: "456 Park Avenue, Bhiwandi",
      city: "Bhiwandi",
      state: "Maharashtra",
      pincode: "421305",
      phone: "+91 9876543211",
      email: "student@example.com",
      admissionDate: new Date("2018-04-01"),
      parents: {
        create: { parentId: parent.id, isPrimary: true },
      },
    },
  });

  const students = [student];
  for (let i = 2; i <= 10; i++) {
    const s = await prisma.student.upsert({
      where: { studentId: `LCS2024${String(i).padStart(4, "0")}` },
      update: {},
      create: {
        studentId: `LCS2024${String(i).padStart(4, "0")}`,
        firstName: ["Priya", "Rahul", "Sneha", "Vikram", "Ananya", "Karan", "Divya", "Arjun", "Meera"][i - 2],
        lastName: ["Patel", "Desai", "Mehta", "Singh", "Iyer", "Nair", "Gupta", "Reddy", "Joshi"][i - 2],
        dateOfBirth: new Date(2010 + (i % 3), i % 12, 15),
        gender: i % 2 === 0 ? Gender.FEMALE : Gender.MALE,
        classId: class8A.id,
        division: i % 2 === 0 ? "A" : "B",
        rollNumber: String(i),
        address: `${i} Sample Street, Bhiwandi`,
        city: "Bhiwandi",
        state: "Maharashtra",
        pincode: "421305",
        admissionDate: new Date("2020-04-01"),
      },
    });
    students.push(s);
  }

  for (const s of students) {
    const existingFee = await prisma.fee.findFirst({
      where: { studentId: s.id, title: "Tuition Fee - January 2025" },
    });
    if (!existingFee) {
      await prisma.fee.create({
        data: {
          studentId: s.id,
          feeType: FeeType.TUITION,
          title: "Tuition Fee - January 2025",
          amount: 5500,
          dueDate: new Date("2025-01-10"),
          status: PaymentStatus.PENDING,
          academicYear: "2024-25",
          month: "January",
        },
      });
    }
  }

  await prisma.announcement.createMany({
    data: [
      {
        title: "Admissions Open for 2025-26",
        content: "Online applications are now being accepted for all classes.",
        type: AnnouncementType.GENERAL,
        targetRoles: [Role.PARENT, Role.STUDENT],
      },
      {
        title: "Fee Payment Deadline - January",
        content: "January month fees must be paid by 10th January 2025 to avoid late fees.",
        type: AnnouncementType.FEE,
        targetRoles: [Role.PARENT],
      },
    ],
    skipDuplicates: true,
  });

  await prisma.teacher.upsert({
    where: { email: "principal@littlechamps.edu" },
    update: { userId: teacherUser.id },
    create: {
      userId: teacherUser.id,
      employeeId: "EMP001",
      firstName: "Priya",
      lastName: "Sharma",
      email: "principal@littlechamps.edu",
      phone: "+91 9876543200",
      department: "Administration",
      designation: "Principal",
      qualification: "Ph.D. in Education",
      experience: 25,
      dateOfJoining: new Date("1998-06-01"),
    },
  });

  console.log("✅ Seed completed!");
  if (process.env.NODE_ENV !== "production") {
    console.log("\n📋 Development test accounts (not shown on public login):");
    console.log("  Admin:   admin@littlechamps.edu");
    console.log("  Teacher: teacher@littlechamps.edu");
    console.log("  Parent:  parent@example.com");
    console.log("  Student: student@example.com");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
