import { PrismaClient, Role, Gender, FeeType, PaymentStatus, AnnouncementType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const hashedAdmin = await bcrypt.hash("admin123", 12);
  const hashedParent = await bcrypt.hash("parent123", 12);
  const hashedStudent = await bcrypt.hash("student123", 12);

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

  const classes = await Promise.all(
    [
      { name: "Class 8", grade: 8, section: "A" },
      { name: "Class 8", grade: 8, section: "B" },
      { name: "Class 9", grade: 9, section: "A" },
      { name: "Class 10", grade: 10, section: "A" },
      { name: "Class 5", grade: 5, section: "A" },
    ].map((c) =>
      prisma.class.upsert({
        where: { grade_section: { grade: c.grade, section: c.section } },
        update: {},
        create: {
          name: c.name,
          grade: c.grade,
          section: c.section,
          capacity: 40,
          classTeacher: "Mrs. Anjali Desai",
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
      address: "456 Park Avenue, Andheri",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400058",
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
        address: `${i} Sample Street, Mumbai`,
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        admissionDate: new Date("2020-04-01"),
      },
    });
    students.push(s);
  }

  for (const s of students) {
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

    const decFee = await prisma.fee.create({
      data: {
        studentId: s.id,
        feeType: FeeType.TUITION,
        title: "Tuition Fee - December 2024",
        amount: 5500,
        dueDate: new Date("2024-12-10"),
        status: PaymentStatus.PAID,
        academicYear: "2024-25",
        month: "December",
      },
    });

    await prisma.feePayment.create({
      data: {
        feeId: decFee.id,
        studentId: s.id,
        amount: 5500,
        paymentMethod: "UPI",
        receiptNumber: `RCP202412${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
        collectedBy: "Admin User",
      },
    });
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
      {
        title: "Parent-Teacher Meeting",
        content: "PTM scheduled for December 28, 2024. Please confirm your attendance.",
        type: AnnouncementType.ACADEMIC,
        targetRoles: [Role.PARENT],
      },
    ],
  });

  await prisma.event.createMany({
    data: [
      {
        title: "Annual Day Celebration 2025",
        description: "Grand Annual Day celebration with cultural performances and awards.",
        type: "CULTURAL",
        startDate: new Date("2025-03-15"),
        location: "School Auditorium",
      },
      {
        title: "Science Exhibition",
        description: "Students showcase innovative science projects.",
        type: "ACADEMIC",
        startDate: new Date("2025-02-20"),
        location: "Science Block",
      },
    ],
  });

  await prisma.admission.create({
    data: {
      applicationNo: "ADM202500001",
      studentName: "Ishaan Verma",
      dateOfBirth: new Date("2019-03-10"),
      gender: Gender.MALE,
      applyingClass: "Class 1",
      parentName: "Suresh Verma",
      parentEmail: "suresh.verma@example.com",
      parentPhone: "+91 9876543299",
      address: "789 Lake Road, Mumbai",
      status: "PENDING",
    },
  });

  await prisma.teacher.create({
    data: {
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
  console.log("\n📋 Demo Credentials:");
  console.log("  Admin:   admin@littlechamps.edu / admin123");
  console.log("  Parent:  parent@example.com / parent123");
  console.log("  Student: student@example.com / student123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
